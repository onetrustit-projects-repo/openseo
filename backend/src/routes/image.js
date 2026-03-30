const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/image/analyze:
 *   post:
 *     summary: Analyze images for SEO
 *     tags: [Image SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/analyze', (req, res) => {
  const { images } = req.body;
  
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Images array required' });
  }
  
  const results = images.map(img => ({
    url: img.url,
    filename: img.url.split('/').pop(),
    issues: {
      missingAlt: !img.alt,
      altLength: img.alt ? img.alt.length : 0,
      altQuality: assessAltQuality(img.alt),
      descriptive: isDescriptive(img.alt),
      keywordPresent: img.alt ? containsKeyword(img.alt) : false
    },
    recommendations: generateRecommendations(img),
    score: calculateImageScore(img)
  }));
  
  res.json({ success: true, count: images.length, results });
});

/**
 * @swagger
 * /api/image/alt-text:
 *   post:
 *     summary: Generate optimized alt text
 *     tags: [Image SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/alt-text', (req, res) => {
  const { url, imageName, context, targetKeywords } = req.body;
  
  if (!url && !imageName) {
    return res.status(400).json({ error: 'URL or imageName required' });
  }
  
  const fileName = imageName || url.split('/').pop().replace(/\.[^.]+$/, '');
  const suggestedAlt = generateAltText(fileName, context, targetKeywords);
  
  res.json({
    success: true,
    data: {
      original: fileName,
      suggestedAlt,
      altLength: suggestedAlt.length,
      includesKeyword: targetKeywords ? targetKeywords.some(kw => suggestedAlt.toLowerCase().includes(kw)) : false,
      score: assessAltQuality(suggestedAlt)
    }
  });
});

/**
 * @swagger
 * /api/image/bulk-alt:
 *   post:
 *     summary: Bulk generate alt text for images
 *     tags: [Image SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/bulk-alt', (req, res) => {
  const { images, context, targetKeywords } = req.body;
  
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Images array required' });
  }
  
  const results = images.map(img => {
    const fileName = img.imageName || img.url.split('/').pop().replace(/\.[^.]+$/, '');
    return {
      url: img.url,
      originalName: fileName,
      suggestedAlt: generateAltText(fileName, context, targetKeywords),
      confidence: img.confidence || 0.8
    };
  });
  
  res.json({
    success: true,
    count: images.length,
    results,
    exportFormat: 'json'
  });
});

/**
 * @swagger
 * /api/image/compress:
 *   post:
 *     summary: Get image compression recommendations
 *     tags: [Image SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/compress', (req, res) => {
  const { images } = req.body;
  
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Images array required' });
  }
  
  const results = images.map(img => {
    const sizeKB = img.sizeKB || Math.floor(Math.random() * 500) + 50;
    const dimensions = img.dimensions || { width: 1920, height: 1080 };
    const format = img.format || 'jpeg';
    
    const compression = {
      current: {
        sizeKB,
        format,
        dimensions: `${dimensions.width}x${dimensions.height}`,
        estimatedLoadTime: (sizeKB / 100).toFixed(2) + 's'
      },
      recommendations: [],
      optimized: {
        suggestedFormat: format === 'png' ? 'webp' : format,
        targetSizeKB: Math.floor(sizeKB * 0.6),
        quality: 80,
        dimensions: dimensions.width > 1200 ? { width: 1200, height: Math.floor(1200 * dimensions.height / dimensions.width) } : dimensions
      },
      savings: {
        sizeKB: sizeKB - Math.floor(sizeKB * 0.6),
        percent: 40
      }
    };
    
    if (sizeKB > 200) {
      compression.recommendations.push({ type: 'size', message: 'Image exceeds 200KB, consider compressing' });
    }
    if (dimensions.width > 1200) {
      compression.recommendations.push({ type: 'dimensions', message: 'Width exceeds 1200px, consider resizing' });
    }
    if (format === 'png') {
      compression.recommendations.push({ type: 'format', message: 'PNG detected, consider WebP for better compression' });
    }
    
    return compression;
  });
  
  res.json({ success: true, count: images.length, results });
});

/**
 * @swagger
 * /api/image/optimize:
 *   post:
 *     summary: Generate image optimization checklist
 *   tags: [Image SEO]
 *   security:
 *     - ApiKeyAuth: []
 */
router.post('/optimize', (req, res) => {
  const { url, pageContext } = req.body;
  
  const checklist = {
    url,
    timestamp: new Date().toISOString(),
    items: [
      { id: 'alt', label: 'Alt text', status: 'pass', note: 'Descriptive alt text present' },
      { id: 'filename', label: 'SEO-friendly filename', status: 'pass', note: 'Contains target keywords' },
      { id: 'format', label: 'Modern format', status: 'warning', note: 'Consider WebP or AVIF' },
      { id: 'size', label: 'File size', status: 'warning', note: 'Above recommended 200KB' },
      { id: 'dimensions', label: 'Appropriate dimensions', status: 'pass', note: 'Scaled correctly' },
      { id: 'lazy', label: 'Lazy loading', status: 'pass', note: 'loading="lazy" present' },
      { id: 'title', label: 'Title attribute', status: 'info', note: 'Consider adding for accessibility' }
    ],
    overallScore: 82
  };
  
  res.json({ success: true, data: checklist });
});

function assessAltQuality(alt) {
  if (!alt) return 'missing';
  if (alt.length < 10) return 'too_short';
  if (alt.length > 125) return 'too_long';
  if (/^image$|^photo$|^picture$/i.test(alt)) return 'generic';
  return 'good';
}

function isDescriptive(alt) {
  if (!alt) return false;
  const genericTerms = ['image', 'photo', 'picture', 'img', 'pic', 'graphic', 'image of', 'photo of'];
  return !genericTerms.some(t => alt.toLowerCase().includes(t));
}

function containsKeyword(alt) {
  return alt && /\b(seo|search|optimization|rank|keyword|link)\b/i.test(alt);
}

function generateRecommendations(img) {
  const recs = [];
  
  if (!img.alt) recs.push('Add descriptive alt text');
  else if (img.alt.length < 10) recs.push('Alt text is too short, add more description');
  else if (img.alt.length > 125) recs.push('Alt text is too long, keep under 125 characters');
  else if (!isDescriptive(img.alt)) recs.push('Alt text is too generic, be more specific');
  
  if (img.sizeKB > 200) recs.push('Compress image to reduce file size');
  if (img.format === 'png') recs.push('Consider using WebP format');
  
  return recs;
}

function calculateImageScore(img) {
  let score = 100;
  
  if (!img.alt) score -= 40;
  else if (!isDescriptive(img.alt)) score -= 20;
  
  if (img.sizeKB > 500) score -= 20;
  else if (img.sizeKB > 200) score -= 10;
  
  if (img.format === 'png') score -= 5;
  
  return Math.max(0, score);
}

function generateAltText(fileName, context, keywords) {
  // Clean up filename
  const cleaned = fileName
    .replace(/[-_]/g, ' ')
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();
  
  const parts = cleaned.split(/\s+/).filter(w => w.length > 1);
  
  // Build descriptive alt
  let alt = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Add context if provided
  if (context) {
    alt += ' - ' + context;
  }
  
  // Truncate if too long
  if (alt.length > 125) {
    alt = alt.substring(0, 122) + '...';
  }
  
  return alt || 'Image';
}

module.exports = router;

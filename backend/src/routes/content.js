const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory content store
const contentStore = new Map();

/**
 * POST /api/content/export
 * Export content with SEO meta tags
 */
router.post('/export', (req, res) => {
  const { title, content, seoMeta, format = 'html' } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  
  const exportData = {
    title,
    content,
    meta: seoMeta || {},
    format,
    exportedAt: new Date().toISOString()
  };
  
  // Generate HTML with meta tags
  if (format === 'html') {
    exportData.html = generateHtmlExport(title, content, seoMeta);
  }
  
  res.json({ success: true, export: exportData });
});

/**
 * POST /api/content/render-blocks
 * Render Notion blocks to HTML
 */
router.post('/render-blocks', (req, res) => {
  const { blocks } = req.body;
  
  if (!blocks || !Array.isArray(blocks)) {
    return res.status(400).json({ error: 'Blocks array required' });
  }
  
  const html = blocks.map(block => renderBlock(block)).join('\n');
  
  res.json({ success: true, html });
});

/**
 * POST /api/content/analyze
 * Analyze content for SEO
 */
router.post('/analyze', (req, res) => {
  const { content, title, focusKeyword } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  const analysis = {
    wordCount: content.split(/\s+/).length,
    characterCount: content.length,
    sentenceCount: (content.match(/[.!?]+/g) || []).length,
    paragraphCount: (content.match(/\n\n/g) || []).length + 1,
    headings: {
      h1: (content.match(/^#\s/gm) || []).length,
      h2: (content.match(/^##\s/gm) || []).length,
      h3: (content.match(/^###\s/gm) || []).length
    },
    readability: calculateReadability(content),
    keywordAnalysis: analyzeKeyword(content, focusKeyword),
    recommendations: generateRecommendations(content, focusKeyword)
  };
  
  res.json({ success: true, analysis });
});

/**
 * GET /api/content/templates
 * Get content templates
 */
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'blog_post',
      name: 'Blog Post',
      structure: ['title', 'meta_description', 'h1', 'intro', 'headings', 'conclusion'],
      recommended: { wordCount: '1000-2000', readingTime: '5-10 min' }
    },
    {
      id: 'landing_page',
      name: 'Landing Page',
      structure: ['title', 'meta_description', 'hero', 'features', 'testimonials', 'cta'],
      recommended: { wordCount: '500-1000', readingTime: '2-5 min' }
    },
    {
      id: 'product_page',
      name: 'Product Page',
      structure: ['title', 'meta_description', 'overview', 'features', 'specs', 'pricing'],
      recommended: { wordCount: '800-1500', readingTime: '4-7 min' }
    }
  ];
  
  res.json({ success: true, templates });
});

function renderBlock(block) {
  switch (block.type) {
    case 'heading_1':
      return `<h1>${block.content}</h1>`;
    case 'heading_2':
      return `<h2>${block.content}</h2>`;
    case 'heading_3':
      return `<h3>${block.content}</h3>`;
    case 'paragraph':
      return `<p>${block.content}</p>`;
    case 'bulleted_list_item':
      return `<li>${block.content}</li>`;
    case 'numbered_list_item':
      return `<li>${block.content}</li>`;
    case 'image':
      return `<img src="${block.url}" alt="${block.caption || ''}" />`;
    case 'code':
      return `<pre><code>${block.content}</code></pre>`;
    default:
      return `<p>${block.content || ''}</p>`;
  }
}

function calculateReadability(content) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const words = content.split(/\s+/);
  const syllables = countSyllables(content);
  
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Simplified Flesch Reading Ease
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    gradeLevel: Math.round(0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59),
    avgSentenceLength: avgSentenceLength.toFixed(1),
    avgSyllablesPerWord: avgSyllablesPerWord.toFixed(2)
  };
}

function countSyllables(text) {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  return words.reduce((count, word) => {
    const vowelGroups = word.match(/[aeiouy]+/g);
    return count + (vowelGroups ? vowelGroups.length : 1);
  }, 0);
}

function analyzeKeyword(content, focusKeyword) {
  if (!focusKeyword) {
    return { found: false };
  }
  
  const lowerContent = content.toLowerCase();
  const keyword = focusKeyword.toLowerCase();
  const wordCount = lowerContent.split(/\s+/).length;
  const keywordCount = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
  const density = ((keywordCount * keyword.split(/\s+/).length) / wordCount * 100).toFixed(2);
  
  return {
    found: true,
    keyword: focusKeyword,
    count: keywordCount,
    density: density + '%',
    inTitle: content.includes(focusKeyword),
    inFirstParagraph: lowerContent.indexOf(keyword) < 500,
    inHeadings: lowerContent.includes('#' + keyword)
  };
}

function generateRecommendations(content, focusKeyword) {
  const recommendations = [];
  
  if (content.length < 500) {
    recommendations.push({ type: 'length', priority: 'high', message: 'Content is too short. Aim for at least 1000 words.' });
  }
  
  if (!focusKeyword) {
    recommendations.push({ type: 'keyword', priority: 'high', message: 'No focus keyword specified.' });
  }
  
  if (!content.includes('\n\n')) {
    recommendations.push({ type: 'structure', priority: 'medium', message: 'Add paragraph breaks to improve readability.' });
  }
  
  const headings = content.match(/^#+\s/gm) || [];
  if (headings.length === 0) {
    recommendations.push({ type: 'structure', priority: 'medium', message: 'Add headings to structure your content.' });
  }
  
  return recommendations;
}

function generateHtmlExport(title, content, seoMeta) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seoMeta.title || title}</title>
  <meta name="description" content="${seoMeta.metaDescription || ''}">
  ${seoMeta.ogTitle ? `<meta property="og:title" content="${seoMeta.ogTitle}">` : ''}
  ${seoMeta.ogDescription ? `<meta property="og:description" content="${seoMeta.ogDescription}">` : ''}
  ${seoMeta.canonicalUrl ? `<link rel="canonical" href="${seoMeta.canonicalUrl}">` : ''}
</head>
<body>
  <article>
    <h1>${title}</h1>
    ${content}
  </article>
</body>
</html>`;
}

module.exports = router;

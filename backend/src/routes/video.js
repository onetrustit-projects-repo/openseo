const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/video/analyze:
 *   post:
 *     summary: Analyze video for SEO
 *     tags: [Video SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/analyze', (req, res) => {
  const { url, transcript, title, description } = req.body;
  
  if (!url && !transcript) {
    return res.status(400).json({ error: 'URL or transcript required' });
  }
  
  // Simulated video analysis
  const analysis = {
    id: uuidv4(),
    url,
    timestamp: new Date().toISOString(),
    transcript: {
      wordCount: transcript ? transcript.split(/\s+/).length : 1240,
      duration: '10:30',
      language: 'en',
      searchable: true,
      keywords: ['seo', 'optimization', 'ranking', 'search', 'video'],
      mentionedTopics: ['content marketing', 'search engine', 'video seo', 'metadata']
    },
    schema: {
      hasVideoObject: true,
      hasVideoClip: false,
      hasClip: false
    },
    recommendations: [
      'Add timestamps to improve navigation',
      'Include video description with target keywords',
      'Add chapters for longer segments'
    ],
    score: 78
  };
  
  res.json({ success: true, data: analysis });
});

/**
 * @swagger
 * /api/video/transcript:
 *   post:
 *     summary: Extract and analyze video transcript
 *     tags: [Video SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/transcript', (req, res) => {
  const { transcript } = req.body;
  
  if (!transcript) {
    return res.status(400).json({ error: 'Transcript text required' });
  }
  
  const words = transcript.split(/\s+/);
  const sentences = transcript.split(/[.!?]+/);
  
  const analysis = {
    wordCount: words.length,
    sentenceCount: sentences.filter(s => s.trim()).length,
    avgWordsPerSentence: (words.length / sentences.filter(s => s.trim()).length).toFixed(1),
    language: 'en',
    detectedKeywords: extractKeywords(transcript),
    speakerSegments: Math.ceil(sentences.filter(s => s.trim()).length / 3),
    searchableTerms: findSearchableTerms(transcript),
    quality: {
      score: 85,
      clarity: 'high',
      completeness: 'good'
    }
  };
  
  res.json({ success: true, data: analysis });
});

/**
 * @swagger
 * /api/video/schema:
 *   post:
 *     summary: Generate video schema markup
 *     tags: [Video SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/schema', (req, res) => {
  const { url, title, description, duration, thumbnailUrl, uploadDate } = req.body;
  
  if (!url || !title) {
    return res.status(400).json({ error: 'URL and title required' });
  }
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description || '',
    contentUrl: url,
    duration: duration || 'PT10M30S',
    thumbnailUrl: thumbnailUrl || `${url}/thumbnail.jpg`,
    uploadDate: uploadDate || new Date().toISOString().split('T')[0],
    embedUrl: url.replace('/watch', '/embed'),
    hasPart: {
      '@type': 'Clip',
      name: 'Introduction',
      startOffset: 0,
      endOffset: 30
    }
  };
  
  res.json({ success: true, schema, format: 'json-ld' });
});

/**
 * @swagger
 * /api/video/batch:
 *   post:
 *     summary: Batch analyze multiple videos
 *     tags: [Video SEO]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/batch', (req, res) => {
  const { videos } = req.body;
  
  if (!videos || !Array.isArray(videos)) {
    return res.status(400).json({ error: 'Videos array required' });
  }
  
  const results = videos.map((video, i) => ({
    url: video.url,
    index: i,
    score: 75 + Math.floor(Math.random() * 20),
    issues: {
      missingTranscript: !video.transcript,
      missingSchema: !video.schema,
      lowKeywordDensity: Math.random() > 0.5
    },
    recommendations: [
      'Add video schema markup',
      'Include closed captions',
      'Optimize video title'
    ]
  }));
  
  res.json({ success: true, count: videos.length, results });
});

function extractKeywords(text) {
  const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither', 'not', 'only', 'own', 'same', 'than', 'too', 'very'];
  
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const filtered = words.filter(w => w.length > 4 && !commonWords.includes(w));
  
  const freq = {};
  filtered.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function findSearchableTerms(text) {
  const terms = [
    'how to', 'what is', 'tutorial', 'guide', 'tips', 'best', 'top',
    'review', 'comparison', 'vs', 'alternatives', 'free', 'paid',
    'beginner', 'advanced', 'complete', 'ultimate', 'guide'
  ];
  
  return terms.filter(t => text.toLowerCase().includes(t));
}

module.exports = router;

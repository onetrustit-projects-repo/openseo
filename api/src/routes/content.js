const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

/**
 * @swagger
 * /api/content/score:
 *   post:
 *     summary: Score content for SEO
 *     tags: [Content]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/score', authenticateApiKey, (req, res) => {
  const { url, content, title, keywords } = req.body;
  
  if (!url && !content) {
    return res.status(400).json({ error: 'URL or content required' });
  }
  
  const scoring = {
    overall: 87,
    readability: {
      score: 82,
      grade: '8th Grade',
      sentences: 45,
      words: 890,
      avgWordsPerSentence: 19.8
    },
    seo: {
      score: 91,
      keywordDensity: 2.4,
      keywordPlacement: ['title', 'firstParagraph', 'headings'],
      missingKeywords: []
    },
    quality: {
      score: 88,
      wordCount: 890,
      recommended: 1000,
      contentDepth: 'good',
      uniqueness: 94
    },
    meta: {
      title: { score: 95, length: 58, present: !!title },
      description: { score: 88, length: 156, present: true },
      h1: { score: 100, count: 1, present: true }
    },
    suggestions: [
      'Consider adding more related keywords',
      'Content length is good, maintain quality',
      'Add internal links to related content'
    ]
  };
  
  res.json({ success: true, url, scoring });
});

/**
 * @swagger
 * /api/content/analyze:
 *   post:
 *     summary: Deep content analysis
 *     tags: [Content]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/analyze', authenticateApiKey, (req, res) => {
  const { content, targetKeywords } = req.body;
  
  const analysis = {
    wordCount: content ? content.split(/\s+/).length : 0,
    characterCount: content ? content.length : 0,
    sentenceCount: content ? (content.match(/[.!?]+/g) || []).length : 0,
    paragraphCount: content ? (content.match(/\n\n/g) || []).length + 1 : 0,
    headings: {
      h1: (content ? content.match(/<h1[^>]*>/gi) : []) || [],
      h2: (content ? content.match(/<h2[^>]*>/gi) : []) || [],
      h3: (content ? content.match(/<h3[^>]*>/gi) : []) || []
    },
    links: {
      internal: 0,
      external: 0,
      broken: 0
    },
    images: {
      total: 0,
      withAlt: 0,
      withoutAlt: 0
    }
  };
  
  res.json({ success: true, analysis });
});

/**
 * @swagger
 * /api/content/compare:
 *   post:
 *     summary: Compare content with competitors
 *   tags: [Content]
 *   security:
 *     - ApiKeyAuth: []
 */
router.post('/compare', authenticateApiKey, (req, res) => {
  const { urls, targetKeyword } = req.body;
  
  const competitors = (urls || []).map((url, i) => ({
    url,
    position: i + 1,
    wordCount: 800 + Math.floor(Math.random() * 500),
    score: 70 + Math.floor(Math.random() * 30),
    commonKeywords: ['seo', 'tools', 'platform', 'tracking'],
    uniqueStrengths: ['More detailed examples', 'Better structure', 'Fresher content']
  }));
  
  res.json({ success: true, targetKeyword, competitors });
});

module.exports = router;

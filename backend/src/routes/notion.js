const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store
const connectionsStore = new Map();
const pagesStore = new Map();

/**
 * POST /api/notion/connect
 * Connect Notion workspace
 */
router.post('/connect', (req, res) => {
  const { apiKey, workspaceId, databaseId } = req.body;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' });
  }
  
  const connection = {
    id: uuidv4(),
    apiKey,
    workspaceId: workspaceId || 'workspace_' + uuidv4().slice(0, 8),
    databaseId: databaseId || null,
    status: 'connected',
    createdAt: new Date().toISOString()
  };
  
  connectionsStore.set(connection.id, connection);
  
  res.json({ success: true, connection });
});

/**
 * GET /api/notion/connections
 * List connections
 */
router.get('/connections', (req, res) => {
  const connections = Array.from(connectionsStore.values()).map(c => ({
    id: c.id,
    workspaceId: c.workspaceId,
    status: c.status,
    createdAt: c.createdAt
  }));
  
  res.json({ success: true, connections });
});

/**
 * DELETE /api/notion/connections/:id
 * Disconnect Notion
 */
router.delete('/connections/:id', (req, res) => {
  if (!connectionsStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Connection not found' });
  }
  
  connectionsStore.delete(req.params.id);
  res.json({ success: true, message: 'Disconnected' });
});

/**
 * POST /api/notion/analyze-page
 * Analyze Notion page for SEO
 */
router.post('/analyze-page', (req, res) => {
  const { pageId, content } = req.body;
  
  if (!pageId && !content) {
    return res.status(400).json({ error: 'Page ID or content required' });
  }
  
  const analysis = {
    pageId,
    score: Math.floor(Math.random() * 30) + 70,
    metrics: {
      wordCount: content ? content.split(/\s+/).length : 0,
      headingCount: content ? (content.match(/^#+\s/gm) || []).length : 0,
      imageCount: content ? (content.match(/!/g) || []).length : 0,
      linkCount: content ? (content.match(/\[/g) || []).length : 0
    },
    recommendations: [
      'Add more internal links',
      'Include target keywords in headings',
      'Add alt text to images',
      'Consider splitting into multiple pages'
    ],
    keywords: extractKeywords(content),
    readability: {
      score: 78,
      grade: '8th Grade',
      avgSentenceLength: 15
    },
    analyzedAt: new Date().toISOString()
  };
  
  res.json({ success: true, analysis });
});

/**
 * POST /api/notion/generate-meta
 * Generate meta tags from content
 */
router.post('/generate-meta', (req, res) => {
  const { title, content, focusKeyword } = req.body;
  
  if (!title && !content) {
    return res.status(400).json({ error: 'Title or content required' });
  }
  
  const meta = {
    title: generateTitle(title, focusKeyword),
    metaDescription: generateDescription(content, focusKeyword),
    ogTitle: generateTitle(title, focusKeyword),
    ogDescription: generateDescription(content, focusKeyword),
    slug: generateSlug(title),
    canonicalUrl: '',
    focusKeyword: focusKeyword || '',
    recommendations: []
  };
  
  // Check title length
  if (meta.title.length > 60) {
    meta.recommendations.push({ type: 'title', message: 'Title exceeds 60 characters' });
  }
  if (meta.title.length < 30) {
    meta.recommendations.push({ type: 'title', message: 'Title is too short (aim for 50-60 characters)' });
  }
  
  // Check description length
  if (meta.metaDescription.length > 160) {
    meta.recommendations.push({ type: 'description', message: 'Meta description exceeds 160 characters' });
  }
  if (meta.metaDescription.length < 120) {
    meta.recommendations.push({ type: 'description', message: 'Meta description is too short (aim for 150-160 characters)' });
  }
  
  res.json({ success: true, meta });
});

/**
 * POST /api/notion/database
 * Get Notion database
 */
router.post('/database', (req, res) => {
  const { databaseId } = req.body;
  
  if (!databaseId) {
    return res.status(400).json({ error: 'Database ID required' });
  }
  
  // Mock database entries with SEO data
  const entries = [
    {
      id: 'page_1',
      title: 'Getting Started with SEO',
      url: 'https://example.com/getting-started-seo',
      seoScore: 85,
      keyword: 'seo basics',
      status: 'published',
      lastEdited: new Date().toISOString()
    },
    {
      id: 'page_2',
      title: 'Advanced Keyword Research',
      url: 'https://example.com/keyword-research',
      seoScore: 72,
      keyword: 'keyword research',
      status: 'draft',
      lastEdited: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'page_3',
      title: 'Link Building Strategies',
      url: 'https://example.com/link-building',
      seoScore: 91,
      keyword: 'link building',
      status: 'published',
      lastEdited: new Date(Date.now() - 172800000).toISOString()
    }
  ];
  
  res.json({ success: true, database: { id: databaseId, entries } });
});

/**
 * POST /api/notion/sidebar
 * Generate Notion sidebar component data
 */
router.post('/sidebar', (req, res) => {
  const { pageId } = req.body;
  
  if (!pageId) {
    return res.status(400).json({ error: 'Page ID required' });
  }
  
  const sidebar = {
    pageId,
    seoScore: Math.floor(Math.random() * 30) + 70,
    quickWins: [
      { type: 'keyword', message: 'Add focus keyword to first paragraph', priority: 'high' },
      { type: 'links', message: 'Include 2 more internal links', priority: 'medium' }
    ],
    metrics: {
      wordCount: 1250,
      readingTime: '6 min',
      keywordDensity: '2.4%'
    },
    contentQuality: {
      score: 82,
      issues: ['Missing meta description', 'No alt text on images']
    }
  };
  
  res.json({ success: true, sidebar });
});

function extractKeywords(content) {
  if (!content) return [];
  
  const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'be', 'to', 'of', 'and', 'in', 'for', 'on', 'with', 'as', 'at', 'by'];
  const words = content.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const filtered = words.filter(w => w.length > 4 && !commonWords.includes(w));
  
  const freq = {};
  filtered.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}

function generateTitle(title, keyword) {
  if (!title) return 'Untitled Page';
  
  let result = title;
  if (keyword && !result.toLowerCase().includes(keyword.toLowerCase())) {
    result += ' | ' + keyword;
  }
  
  return result.substring(0, 60);
}

function generateDescription(content, keyword) {
  if (!content) return 'No description available';
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  let desc = sentences[0] || '';
  
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '...';
  }
  
  return desc.trim();
}

function generateSlug(title) {
  if (!title) return 'untitled';
  
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

module.exports = router;

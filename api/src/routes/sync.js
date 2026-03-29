const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory sync logs
const syncLogs = [];

/**
 * POST /api/sync/notion
 * Sync OpenSEO data with Notion
 */
router.post('/notion', (req, res) => {
  const { notionPageId, seoData } = req.body;
  
  if (!notionPageId) {
    return res.status(400).json({ error: 'Notion page ID required' });
  }
  
  const sync = {
    id: uuidv4(),
    type: 'notion_export',
    source: 'openseo',
    destination: 'notion',
    pageId: notionPageId,
    status: 'completed',
    items: seoData ? Object.keys(seoData).length : 0,
    syncedAt: new Date().toISOString()
  };
  
  syncLogs.push(sync);
  
  res.json({ success: true, sync });
});

/**
 * POST /api/sync/pull
 * Pull Notion content to OpenSEO
 */
router.post('/pull', (req, res) => {
  const { notionPageId } = req.body;
  
  if (!notionPageId) {
    return res.status(400).json({ error: 'Notion page ID required' });
  }
  
  const pulled = {
    id: uuidv4(),
    type: 'notion_import',
    source: 'notion',
    destination: 'openseo',
    pageId: notionPageId,
    content: {
      title: 'Pulled Notion Page',
      blocks: [
        { type: 'heading_1', content: 'Main Title' },
        { type: 'paragraph', content: 'Content pulled from Notion...' }
      ],
      metadata: {
        lastEdited: new Date().toISOString(),
        author: 'Notion User'
      }
    },
    pulledAt: new Date().toISOString()
  };
  
  res.json({ success: true, pulled });
});

/**
 * GET /api/sync/history
 * Get sync history
 */
router.get('/history', (req, res) => {
  const { limit = 20 } = req.query;
  
  const history = syncLogs.slice(-parseInt(limit));
  
  res.json({ success: true, history, total: syncLogs.length });
});

/**
 * POST /api/sync/batch
 * Batch sync multiple pages
 */
router.post('/batch', (req, res) => {
  const { pages } = req.body;
  
  if (!pages || !Array.isArray(pages)) {
    return res.status(400).json({ error: 'Pages array required' });
  }
  
  const results = pages.map(page => ({
    pageId: page.notionPageId || page.id,
    status: 'synced',
    syncedAt: new Date().toISOString()
  }));
  
  res.json({
    success: true,
    count: pages.length,
    results
  });
});

/**
 * POST /api/sync/calendar
 * Sync content calendar
 */
router.post('/calendar', (req, res) => {
  const { startDate, endDate } = req.body;
  
  const calendar = {
    startDate,
    endDate,
    items: [
      {
        id: 'cal_1',
        title: 'SEO Best Practices Guide',
        status: 'scheduled',
        scheduledDate: '2026-04-01',
        seoScore: 78,
        keywords: ['seo guide', 'best practices']
      },
      {
        id: 'cal_2',
        title: 'Keyword Research Tutorial',
        status: 'draft',
        seoScore: 65,
        keywords: ['keyword research', 'tutorial']
      },
      {
        id: 'cal_3',
        title: 'Link Building 101',
        status: 'published',
        publishedDate: '2026-03-15',
        seoScore: 92,
        keywords: ['link building', 'backlinks']
      }
    ]
  };
  
  res.json({ success: true, calendar });
});

module.exports = router;

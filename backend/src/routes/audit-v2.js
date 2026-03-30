const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { SEOCrawler } = require('../crawler/crawler');

const auditStore = new Map();

// POST /api/audit-v2/run - Start new audit
router.post('/run', async (req, res) => {
  const { url, maxPages = 100, maxDepth = 3 } = req.body;
  
  if (!url) return res.status(400).json({ success: false, error: 'URL required' });
  
  const auditId = uuidv4();
  const audit = {
    id: auditId,
    url,
    status: 'running',
    progress: 0,
    createdAt: new Date().toISOString(),
    completedAt: null,
    results: null,
    summary: null
  };
  
  auditStore.set(auditId, audit);
  
  // Run crawl in background
  setTimeout(async () => {
    try {
      const crawler = new SEOCrawler({ maxPages, maxDepth });
      const results = await crawler.crawl(url);
      
      const completedAudit = auditStore.get(auditId);
      completedAudit.status = 'completed';
      completedAudit.progress = 100;
      completedAudit.completedAt = new Date().toISOString();
      completedAudit.results = results;
      completedAudit.summary = {
        healthScore: calculateHealthScore(results),
        pagesCrawled: results.crawlStats?.pages || 0,
        issuesFound: results.issues?.length || 0
      };
    } catch (error) {
      const failedAudit = auditStore.get(auditId);
      if (failedAudit) {
        failedAudit.status = 'failed';
        failedAudit.error = error.message;
      }
    }
  }, 100);
  
  res.json({ success: true, auditId });
});

// GET /api/audit-v2 - List all audits
router.get('/', (req, res) => {
  const audits = Array.from(auditStore.values()).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 50);
  res.json({ success: true, audits });
});

// GET /api/audit-v2/:id - Get audit status
router.get('/:id', (req, res) => {
  const audit = auditStore.get(req.params.id);
  if (!audit) return res.status(404).json({ success: false, error: 'Audit not found' });
  res.json({ success: true, audit });
});

// GET /api/audit-v2/:id/results - Get audit results
router.get('/:id/results', (req, res) => {
  const audit = auditStore.get(req.params.id);
  if (!audit) return res.status(404).json({ success: false, error: 'Audit not found' });
  if (audit.status !== 'completed') return res.status(400).json({ success: false, error: 'Audit not completed' });
  res.json({ success: true, results: audit.results });
});

function calculateHealthScore(results) {
  if (!results) return 0;
  const issues = results.issues || [];
  const pages = results.crawlStats?.pages || 1;
  const issueCount = issues.length;
  const score = Math.max(0, 100 - (issueCount * 5) - ((pages - 1) * 2));
  return Math.min(100, score);
}

module.exports = router;

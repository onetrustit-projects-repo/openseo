const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { SEOCrawler } = require('../crawler/crawler');

const auditStore = new Map();

router.post('/run', async (req, res) => {
  const { url, maxPages = 100, maxDepth = 3 } = req.body;
  
  if (!url) return res.status(400).json({ error: 'URL required' });
  
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
      
      audit.status = 'completed';
      audit.progress = 100;
      audit.completedAt = new Date().toISOString();
      audit.results = results;
      audit.summary = generateSummary(results);
    } catch (error) {
      audit.status = 'failed';
      audit.error = error.message;
    }
  }, 100);
  
  res.json({ success: true, auditId, status: audit.status });
});

router.get('/:id', (req, res) => {
  const audit = auditStore.get(req.params.id);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  res.json({ success: true, audit });
});

router.get('/', (req, res) => {
  const audits = Array.from(auditStore.values()).map(a => ({
    id: a.id,
    url: a.url,
    status: a.status,
    progress: a.progress,
    createdAt: a.createdAt,
    completedAt: a.completedAt,
    summary: a.summary
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ success: true, audits });
});

router.get('/:id/results', (req, res) => {
  const audit = auditStore.get(req.params.id);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  if (!audit.results) return res.json({ success: true, results: null, status: audit.status });
  res.json({ success: true, results: audit.results, status: audit.status });
});

function generateSummary(results) {
  const pages = results.pages || [];
  const brokenLinks = results.brokenLinks || [];
  const redirects = results.redirects || [];
  const schemaErrors = results.schemaErrors || [];
  const metaIssues = results.metaIssues || [];
  
  const critical = brokenLinks.length + schemaErrors.filter(e => e.type === 'invalid-json-ld').length;
  const warnings = metaIssues.length + redirects.length;
  
  return {
    totalPages: pages.length,
    brokenLinks: brokenLinks.length,
    redirects: redirects.length,
    schemaErrors: schemaErrors.length,
    metaIssues: metaIssues.length,
    critical,
    warnings,
    healthScore: Math.round(Math.max(0, 100 - (critical * 5) - (warnings * 2))),
    crawlDuration: results.crawlStats?.pages ? 'Fast' : 'Unknown'
  };
}

module.exports = router;

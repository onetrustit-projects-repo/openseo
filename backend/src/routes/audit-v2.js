const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Initialize DB if needed
const initDb = () => {
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      progress INTEGER DEFAULT 0,
      results TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )`);
  } catch (e) {}
};
initDb();

// POST /api/audit-v2/run - Start new audit
router.post('/run', async (req, res) => {
  const { url, maxPages = 100, maxDepth = 3 } = req.body;
  
  if (!url) return res.status(400).json({ success: false, error: 'URL required' });
  
  const auditId = uuidv4();
  const now = new Date().toISOString();
  
  try {
    const stmt = db.prepare(`INSERT INTO audits (id, url, status, progress, created_at) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(auditId, url, 'running', 0, now);
  } catch (e) {
    // Table might not exist, create and retry
    db.exec(`CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      progress INTEGER DEFAULT 0,
      results TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )`);
    const stmt = db.prepare(`INSERT INTO audits (id, url, status, progress, created_at) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(auditId, url, 'running', 0, now);
  }
  
  // Run crawl in background
  setTimeout(async () => {
    try {
      const { SEOCrawler } = require('../crawler/crawler');
      const crawler = new SEOCrawler({ maxPages, maxDepth });
      const results = await crawler.crawl(url);
      
      const healthScore = calculateHealthScore(results);
      const summary = {
        healthScore,
        pagesCrawled: results.crawlStats?.pages || 0,
        issuesFound: results.issues?.length || 0,
        brokenLinks: results.brokenLinks?.length || 0,
        redirects: results.redirects?.length || 0,
        schemaErrors: results.schemaErrors?.length || 0
      };
      
      const updateStmt = db.prepare(`UPDATE audits SET status = ?, progress = ?, results = ?, summary = ?, completed_at = ? WHERE id = ?`);
      updateStmt.run('completed', 100, JSON.stringify(results), JSON.stringify(summary), new Date().toISOString(), auditId);
    } catch (error) {
      const updateStmt = db.prepare(`UPDATE audits SET status = ? WHERE id = ?`);
      updateStmt.run('failed', auditId);
    }
  }, 100);
  
  res.json({ success: true, auditId });
});

// GET /api/audit-v2 - List all audits
router.get('/', (req, res) => {
  try {
    const audits = db.prepare(`SELECT * FROM audits ORDER BY created_at DESC LIMIT 50`).all();
    const parsedAudits = audits.map(a => ({
      ...a,
      results: a.results ? JSON.parse(a.results) : null,
      summary: a.summary ? JSON.parse(a.summary) : null
    }));
    res.json({ success: true, audits: parsedAudits });
  } catch (e) {
    res.json({ success: true, audits: [] });
  }
});

// GET /api/audit-v2/:id - Get audit status
router.get('/:id', (req, res) => {
  try {
    const audit = db.prepare(`SELECT * FROM audits WHERE id = ?`).get(req.params.id);
    if (!audit) return res.status(404).json({ success: false, error: 'Audit not found' });
    
    res.json({ 
      success: true, 
      audit: {
        ...audit,
        results: audit.results ? JSON.parse(audit.results) : null,
        summary: audit.summary ? JSON.parse(audit.summary) : null
      }
    });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Audit not found' });
  }
});

// GET /api/audit-v2/:id/results - Get audit results
router.get('/:id/results', (req, res) => {
  try {
    const audit = db.prepare(`SELECT * FROM audits WHERE id = ?`).get(req.params.id);
    if (!audit) return res.status(404).json({ success: false, error: 'Audit not found' });
    if (audit.status !== 'completed') return res.status(400).json({ success: false, error: 'Audit not completed' });
    res.json({ success: true, results: audit.results ? JSON.parse(audit.results) : null });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Audit not found' });
  }
});

// GET /api/audit-v2/report/:domain - Consolidated report for domain
router.get('/report/:domain', (req, res) => {
  try {
    // Get all audits for this domain
    const audits = db.prepare(`SELECT * FROM audits WHERE url LIKE ? ORDER BY created_at DESC LIMIT 10`).all(`%${req.params.domain}%`);
    
    // Calculate overall health
    let totalHealth = 0;
    let auditCount = 0;
    const allBrokenLinks = [];
    const allRedirects = [];
    const allSchemaErrors = [];
    
    audits.forEach(a => {
      if (a.summary) {
        const summary = JSON.parse(a.summary);
        totalHealth += summary.healthScore || 0;
        auditCount++;
        if (summary.brokenLinks) allBrokenLinks.push(...[].concat(summary.brokenLinks));
        if (summary.redirects) allRedirects.push(...[].concat(summary.redirects));
        if (summary.schemaErrors) allSchemaErrors.push(...[].concat(summary.schemaErrors));
      }
    });
    
    const overallScore = auditCount > 0 ? Math.round(totalHealth / auditCount) : 0;
    
    res.json({
      success: true,
      report: {
        domain: req.params.domain,
        overallScore,
        totalAudits: auditCount,
        audits: audits.map(a => ({
          ...a,
          summary: a.summary ? JSON.parse(a.summary) : null
        })),
        aggregatedIssues: {
          brokenLinks: allBrokenLinks.slice(0, 20),
          redirects: allRedirects.slice(0, 20),
          schemaErrors: allSchemaErrors.slice(0, 20)
        }
      }
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

function calculateHealthScore(results) {
  if (!results) return 0;
  const pages = results.crawlStats?.pages || 1;
  const brokenLinks = results.brokenLinks?.length || 0;
  const redirects = results.redirects?.length || 0;
  const schemaErrors = results.schemaErrors?.length || 0;
  const metaIssues = results.metaIssues?.length || 0;
  
  let score = 100;
  score -= brokenLinks * 3;
  score -= redirects * 1;
  score -= schemaErrors * 2;
  score -= metaIssues * 1;
  score -= Math.max(0, (pages - 10) * 0.5);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = router;

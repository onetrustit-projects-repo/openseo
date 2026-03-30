const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
  const stats = {
    totalCrawled: 1247,
    avgCrawlTime: '2.3s',
    largestSite: '15,000 pages',
    supportedFormats: ['HTML', 'JavaScript (SPA)', 'React', 'Vue', 'Angular'],
    features: ['Link extraction', 'Meta analysis', 'Schema validation', 'Content duplication', 'Redirect tracking']
  };
  res.json({ success: true, stats });
});

router.get('/limits', (req, res) => {
  const limits = {
    maxPagesPerAudit: 10000,
    maxConcurrentAudits: 3,
    maxAuditsPerDay: 50,
    supportedProtocols: ['http', 'https'],
    rateLimit: '10 requests/second'
  };
  res.json({ success: true, limits });
});

module.exports = router;

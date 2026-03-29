const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

/**
 * @swagger
 * /api/analytics/usage:
 *   get:
 *     summary: Get API usage analytics
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/usage', authenticateApiKey, (req, res) => {
  const usage = {
    period: 'current_month',
    requests: {
      total: 15420,
      successful: 15200,
      failed: 220,
      remaining: 98580,
      limit: 100000
    },
    byEndpoint: [
      { endpoint: '/url-audit/analyze', count: 5230 },
      { endpoint: '/keywords/research', count: 4120 },
      { endpoint: '/ranks/track', count: 3450 },
      { endpoint: '/crawl/start', count: 1620 },
      { endpoint: '/content/score', count: 1000 }
    ],
    byDay: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 2000) + 500
    }))
  };
  
  res.json({ success: true, usage });
});

/**
 * @swagger
 * /api/analytics/limits:
 *   get:
 *     summary: Get rate limits
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/limits', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    limits: {
      requests: { limit: 100000, remaining: 98580, resetsAt: new Date(Date.now() + 86400000).toISOString() },
      rateLimit: { limit: 100, remaining: 94, window: '1 minute' },
      crawl: { limit: 5, remaining: 4, active: 1 },
      audit: { limit: 1000, remaining: 850, active: 0 }
    }
  });
});

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get account summary
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/summary', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    account: {
      plan: 'pro',
      domains: 3,
      keywords: 245,
      credits: { used: 15420, total: 100000, resetsAt: new Date(Date.now() + 15 * 86400000).toISOString() }
    }
  });
});

module.exports = router;

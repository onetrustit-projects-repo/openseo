const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// In-memory webhook store (use Redis/database in production)
const webhookStore = new Map();

/**
 * @swagger
 * /api/webhooks:
 *   post:
 *     summary: Register a webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/', authenticateApiKey, (req, res) => {
  const { url, events, secret } = req.body;
  
  if (!url || !events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'URL and events array required' });
  }
  
  const webhookId = uuidv4();
  const webhook = {
    id: webhookId,
    url,
    events,
    secret: secret || uuidv4(),
    active: true,
    createdAt: new Date().toISOString(),
    deliveries: 0,
    lastDelivery: null
  };
  
  webhookStore.set(webhookId, webhook);
  
  res.status(201).json({ success: true, webhook });
});

/**
 * @swagger
 * /api/webhooks:
 *   get:
 *     summary: List webhooks
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/', authenticateApiKey, (req, res) => {
  const webhooks = Array.from(webhookStore.values()).map(w => ({
    id: w.id,
    url: w.url,
    events: w.events,
    active: w.active,
    createdAt: w.createdAt,
    deliveries: w.deliveries,
    lastDelivery: w.lastDelivery
  }));
  
  res.json({ success: true, webhooks });
});

/**
 * @swagger
 * /api/webhooks/{id}:
 *   delete:
 *     summary: Delete webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 */
router.delete('/:id', authenticateApiKey, (req, res) => {
  const { id } = req.params;
  
  if (!webhookStore.has(id)) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  webhookStore.delete(id);
  res.json({ success: true, message: 'Webhook deleted' });
});

/**
 * @swagger
 * /api/webhooks/events:
 *   get:
 *     summary: List available webhook events
 *     tags: [Webhooks]
 */
router.get('/events', (req, res) => {
  const events = [
    { name: 'audit.complete', description: 'URL audit completed' },
    { name: 'crawl.complete', description: 'Site crawl completed' },
    { name: 'rank.change', description: 'Keyword ranking changed' },
    { name: 'issue.detected', description: 'New SEO issue detected' },
    { name: 'report.ready', description: 'Scheduled report ready' }
  ];
  
  res.json({ success: true, events });
});

/**
 * @swagger
 * /api/webhooks/deliveries/{id}:
 *   get:
 *     summary: Get webhook delivery history
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 */
router.get('/deliveries/:id', authenticateApiKey, (req, res) => {
  const { id } = req.params;
  
  const deliveries = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    webhookId: id,
    event: 'audit.complete',
    payload: { url: 'https://example.com', score: 87 },
    responseCode: 200,
    deliveredAt: new Date(Date.now() - i * 3600000).toISOString()
  }));
  
  res.json({ success: true, deliveries });
});

module.exports = router;

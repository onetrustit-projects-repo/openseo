const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory webhook store
const webhooksStore = new Map();

/**
 * POST /api/webhooks/inbound
 * Receive webhook from external service
 */
router.post('/inbound', (req, res) => {
  const { service, event, data } = req.body;
  
  if (!service || !event) {
    return res.status(400).json({ error: 'Service and event required' });
  }
  
  const webhookEvent = {
    id: uuidv4(),
    service,
    event,
    data: data || {},
    receivedAt: new Date().toISOString(),
    processed: false
  };
  
  // Process webhook asynchronously
  setTimeout(() => {
    webhookEvent.processed = true;
  }, 100);
  
  res.json({ success: true, event: webhookEvent });
});

/**
 * GET /api/webhooks
 * List configured outgoing webhooks
 */
router.get('/', (req, res) => {
  const webhooks = Array.from(webhooksStore.values()).map(w => ({
    id: w.id,
    name: w.name,
    url: w.url,
    events: w.events,
    active: w.active
  }));
  
  res.json({ success: true, webhooks, total: webhooks.length });
});

/**
 * POST /api/webhooks
 * Create outgoing webhook
 */
router.post('/', (req, res) => {
  const { name, url, events, secret } = req.body;
  
  if (!name || !url || !events) {
    return res.status(400).json({ error: 'Name, URL, and events required' });
  }
  
  const webhook = {
    id: uuidv4(),
    name,
    url,
    events: Array.isArray(events) ? events : [events],
    secret: secret || uuidv4(),
    active: true,
    createdAt: new Date().toISOString()
  };
  
  webhooksStore.set(webhook.id, webhook);
  
  res.status(201).json({ success: true, webhook });
});

/**
 * DELETE /api/webhooks/:id
 * Delete webhook
 */
router.delete('/:id', (req, res) => {
  if (!webhooksStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  webhooksStore.delete(req.params.id);
  res.json({ success: true, message: 'Webhook deleted' });
});

/**
 * POST /api/webhooks/:id/test
 * Test webhook
 */
router.post('/:id/test', (req, res) => {
  const webhook = webhooksStore.get(req.params.id);
  
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  const testPayload = {
    event: 'test',
    message: 'This is a test webhook',
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Webhook test payload prepared',
    webhookId: webhook.id,
    payload: testPayload
  });
});

/**
 * POST /api/webhooks/send
 * Send webhook to configured endpoint
 */
router.post('/send', (req, res) => {
  const { webhookId, event, data } = req.body;
  
  const webhook = webhooksStore.get(webhookId);
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  const payload = {
    event,
    data: data || {},
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Webhook payload prepared',
    webhookId,
    payload
  });
});

module.exports = router;

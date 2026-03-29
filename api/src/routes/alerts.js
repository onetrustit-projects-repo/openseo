const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory alert store
const alertsStore = new Map();

/**
 * GET /api/alerts
 * List all configured alerts
 */
router.get('/', (req, res) => {
  const alerts = Array.from(alertsStore.values()).map(a => ({
    id: a.id,
    name: a.name,
    type: a.type,
    severity: a.severity,
    channelId: a.channelId,
    active: a.active
  }));
  
  res.json({ success: true, alerts, total: alerts.length });
});

/**
 * POST /api/alerts
 * Create new alert configuration
 */
router.post('/', (req, res) => {
  const { name, type, severity, threshold, channelId, conditions } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type required' });
  }
  
  const alert = {
    id: uuidv4(),
    name,
    type,
    severity: severity || 'medium',
    threshold: threshold || null,
    channelId: channelId || null,
    conditions: conditions || {},
    active: true,
    quietHours: { enabled: false, start: null, end: null },
    createdAt: new Date().toISOString()
  };
  
  alertsStore.set(alert.id, alert);
  
  res.status(201).json({ success: true, alert });
});

/**
 * PUT /api/alerts/:id
 * Update alert configuration
 */
router.put('/:id', (req, res) => {
  const alert = alertsStore.get(req.params.id);
  
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  const { name, type, severity, threshold, channelId, active, quietHours } = req.body;
  
  if (name) alert.name = name;
  if (type) alert.type = type;
  if (severity) alert.severity = severity;
  if (threshold !== undefined) alert.threshold = threshold;
  if (channelId !== undefined) alert.channelId = channelId;
  if (active !== undefined) alert.active = active;
  if (quietHours) alert.quietHours = quietHours;
  
  alertsStore.set(alert.id, alert);
  
  res.json({ success: true, alert });
});

/**
 * DELETE /api/alerts/:id
 * Delete alert
 */
router.delete('/:id', (req, res) => {
  if (!alertsStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  alertsStore.delete(req.params.id);
  res.json({ success: true, message: 'Alert deleted' });
});

/**
 * POST /api/alerts/:id/test
 * Test alert configuration
 */
router.post('/:id/test', (req, res) => {
  const alert = alertsStore.get(req.params.id);
  
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  const testAlert = {
    id: uuidv4(),
    alertId: alert.id,
    type: alert.type,
    severity: alert.severity,
    message: `Test alert: ${alert.name}`,
    triggeredAt: new Date().toISOString(),
    test: true
  };
  
  res.json({
    success: true,
    message: 'Test alert sent',
    alert: testAlert
  });
});

/**
 * POST /api/alerts/trigger
 * Trigger an alert (internal API)
 */
router.post('/trigger', (req, res) => {
  const { type, severity, message, data, channels } = req.body;
  
  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message required' });
  }
  
  const triggeredAlert = {
    id: uuidv4(),
    type,
    severity: severity || 'medium',
    message,
    data: data || {},
    channels: channels || [],
    triggeredAt: new Date().toISOString()
  };
  
  res.json({ success: true, alert: triggeredAlert });
});

/**
 * GET /api/alerts/types
 * List available alert types
 */
router.get('/types', (req, res) => {
  const types = [
    { id: 'ranking_drop', name: 'Ranking Drop', description: 'Keyword position dropped' },
    { id: 'new_backlink', name: 'New Backlink', description: 'New backlink acquired' },
    { id: 'cwv_degradation', name: 'Core Web Vitals', description: 'Core Web Vitals score dropped' },
    { id: 'crawl_error', name: 'Crawl Error', description: 'New crawl error detected' },
    { id: 'schema_failure', name: 'Schema Failure', description: 'Schema validation failed' },
    { id: 'audit_complete', name: 'Audit Complete', description: 'Scheduled audit finished' },
    { id: 'issue_detected', name: 'Issue Detected', description: 'SEO issue found' }
  ];
  
  res.json({ success: true, types });
});

module.exports = router;

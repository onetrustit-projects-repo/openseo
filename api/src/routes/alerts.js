const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const alertsStore = new Map();

// Seed sample alerts
[
  { metric: 'LCP', page: '/pricing', value: 4.2, threshold: 2.5, severity: 'warning' },
  { metric: 'CLS', page: '/blog', value: 0.25, threshold: 0.1, severity: 'critical' },
].forEach(a => {
  const id = uuidv4();
  alertsStore.set(id, { id, ...a, triggeredAt: new Date().toISOString(), acknowledged: false });
});

router.get('/', (req, res) => {
  const { severity, acknowledged } = req.query;
  let alerts = Array.from(alertsStore.values());
  if (severity) alerts = alerts.filter(a => a.severity === severity);
  if (acknowledged !== undefined) alerts = alerts.filter(a => a.acknowledged === acknowledged === 'true');
  res.json({ success: true, alerts, total: alerts.length });
});

router.post('/', (req, res) => {
  const { metric, page, threshold, severity = 'warning' } = req.body;
  if (!metric || !page) return res.status(400).json({ error: 'Metric and page required' });
  const id = uuidv4();
  const alert = { id, metric, page, threshold, severity, triggeredAt: new Date().toISOString(), acknowledged: false };
  alertsStore.set(id, alert);
  res.json({ success: true, alert });
});

router.patch('/:id/acknowledge', (req, res) => {
  const alert = alertsStore.get(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.acknowledged = true;
  alert.acknowledgedAt = new Date().toISOString();
  res.json({ success: true, alert });
});

router.delete('/:id', (req, res) => {
  if (!alertsStore.has(req.params.id)) return res.status(404).json({ error: 'Alert not found' });
  alertsStore.delete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

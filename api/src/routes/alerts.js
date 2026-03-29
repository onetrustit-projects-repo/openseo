const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const alertStore = new Map();

router.get('/', (req, res) => {
  const { acknowledged, type } = req.query;
  let alerts = Array.from(alertStore.values());
  if (acknowledged === 'true') alerts = alerts.filter(a => a.acknowledged);
  if (type) alerts = alerts.filter(a => a.type === type);
  res.json({ success: true, alerts, total: alerts.length });
});

router.get('/anomalies', (req, res) => {
  const anomalies = [
    { id: uuidv4(), type: 'traffic_drop', severity: 'high', message: 'Clicks dropped 35% compared to previous period', metric: 'clicks', value: -35, affectedPages: ['/pricing', '/features'], detectedAt: new Date().toISOString() },
    { id: uuidv4(), type: 'ranking_drop', severity: 'medium', message: 'Average position dropped from 4.2 to 7.8 for "seo software"', metric: 'position', value: -3.6, affectedPages: ['/'], detectedAt: new Date().toISOString() },
    { id: uuidv4(), type: 'ctr_drop', severity: 'low', message: 'CTR dropped from 8.5% to 5.2% on mobile', metric: 'ctr', value: -3.3, affectedPages: ['/blog'], detectedAt: new Date().toISOString() }
  ];
  res.json({ success: true, anomalies });
});

router.post('/', (req, res) => {
  const { type, metric, threshold, comparison } = req.body;
  const id = uuidv4();
  const alert = { id, type, metric, threshold, comparison, acknowledged: false, createdAt: new Date().toISOString() };
  alertStore.set(id, alert);
  res.json({ success: true, alert });
});

router.patch('/:id/acknowledge', (req, res) => {
  const alert = alertStore.get(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.acknowledged = true;
  alert.acknowledgedAt = new Date().toISOString();
  res.json({ success: true, alert });
});

module.exports = router;

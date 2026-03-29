const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory digest store
const digestsStore = new Map();

/**
 * GET /api/digests
 * List all digest configurations
 */
router.get('/', (req, res) => {
  const digests = Array.from(digestsStore.values()).map(d => ({
    id: d.id,
    name: d.name,
    frequency: d.frequency,
    channelId: d.channelId,
    active: d.active,
    nextRun: d.nextRun
  }));
  
  res.json({ success: true, digests, total: digests.length });
});

/**
 * POST /api/digests
 * Create digest configuration
 */
router.post('/', (req, res) => {
  const { name, frequency, time, channelId, includeMetrics } = req.body;
  
  if (!name || !frequency || !channelId) {
    return res.status(400).json({ error: 'Name, frequency, and channelId required' });
  }
  
  const digest = {
    id: uuidv4(),
    name,
    frequency,
    time: time || '09:00',
    channelId,
    includeMetrics: includeMetrics || {
      rankings: true,
      traffic: true,
      backlinks: true,
      issues: true
    },
    active: true,
    nextRun: calculateNextRun(frequency, time),
    lastRun: null,
    createdAt: new Date().toISOString()
  };
  
  digestsStore.set(digest.id, digest);
  
  res.status(201).json({ success: true, digest });
});

/**
 * PUT /api/digests/:id
 * Update digest
 */
router.put('/:id', (req, res) => {
  const digest = digestsStore.get(req.params.id);
  
  if (!digest) {
    return res.status(404).json({ error: 'Digest not found' });
  }
  
  const { name, frequency, time, channelId, includeMetrics, active } = req.body;
  
  if (name) digest.name = name;
  if (frequency) {
    digest.frequency = frequency;
    digest.nextRun = calculateNextRun(frequency, time || digest.time);
  }
  if (time) {
    digest.time = time;
    digest.nextRun = calculateNextRun(frequency || digest.frequency, time);
  }
  if (channelId) digest.channelId = channelId;
  if (includeMetrics) digest.includeMetrics = includeMetrics;
  if (active !== undefined) digest.active = active;
  
  digestsStore.set(digest.id, digest);
  
  res.json({ success: true, digest });
});

/**
 * DELETE /api/digests/:id
 * Delete digest
 */
router.delete('/:id', (req, res) => {
  if (!digestsStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Digest not found' });
  }
  
  digestsStore.delete(req.params.id);
  res.json({ success: true, message: 'Digest deleted' });
});

/**
 * POST /api/digests/:id/trigger
 * Trigger digest manually
 */
router.post('/:id/trigger', (req, res) => {
  const digest = digestsStore.get(req.params.id);
  
  if (!digest) {
    return res.status(404).json({ error: 'Digest not found' });
  }
  
  const digestData = generateDigestData(digest);
  
  res.json({
    success: true,
    message: 'Digest generated',
    digestId: digest.id,
    data: digestData
  });
});

/**
 * GET /api/digests/frequencies
 * List available frequencies
 */
router.get('/frequencies', (req, res) => {
  const frequencies = [
    { id: 'daily', label: 'Daily', description: 'Send digest every day' },
    { id: 'weekly', label: 'Weekly', description: 'Send digest every week (Monday)' },
    { id: 'monthly', label: 'Monthly', description: 'Send digest every month' }
  ];
  
  res.json({ success: true, frequencies });
});

function calculateNextRun(frequency, time) {
  const now = new Date();
  const [hours, minutes] = (time || '09:00').split(':');
  
  const next = new Date(now);
  next.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  if (frequency === 'daily') {
    if (next <= now) next.setDate(next.getDate() + 1);
  } else if (frequency === 'weekly') {
    const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
    next.setDate(next.getDate() + daysUntilMonday);
  } else if (frequency === 'monthly') {
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
  }
  
  return next.toISOString();
}

function generateDigestData(digest) {
  return {
    period: digest.frequency === 'daily' ? 'Today' :
            digest.frequency === 'weekly' ? 'This Week' : 'This Month',
    summary: {
      totalAlerts: Math.floor(Math.random() * 20) + 5,
      criticalIssues: Math.floor(Math.random() * 5),
      rankingsChanged: Math.floor(Math.random() * 50) + 10,
      newBacklinks: Math.floor(Math.random() * 30) + 5
    },
    topIssues: [
      { type: 'crawl_error', count: 3, severity: 'high' },
      { type: 'schema_failure', count: 2, severity: 'medium' },
      { type: 'cwv_degradation', count: 1, severity: 'low' }
    ],
    rankingChanges: [
      { keyword: 'seo tools', change: 2, direction: 'up' },
      { keyword: 'keyword research', change: -1, direction: 'down' },
      { keyword: 'backlink checker', change: 5, direction: 'up' }
    ],
    topBacklinks: [
      { domain: 'example.com', da: 78, new: true },
      { domain: 'blogsite.io', da: 65, new: true }
    ],
    generatedAt: new Date().toISOString()
  };
}

module.exports = router;

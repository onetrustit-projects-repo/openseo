const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory schedule store
const schedulesStore = new Map();

/**
 * GET /api/schedules
 * List all scheduled reports
 */
router.get('/', (req, res) => {
  const schedules = Array.from(schedulesStore.values()).map(s => ({
    id: s.id,
    name: s.name,
    templateId: s.templateId,
    frequency: s.frequency,
    nextRun: s.nextRun,
    active: s.active,
    recipients: s.recipients
  }));
  
  res.json({ success: true, schedules, total: schedules.length });
});

/**
 * POST /api/schedules
 * Create scheduled report
 */
router.post('/', (req, res) => {
  const { name, templateId, frequency, time, recipients, brandingId } = req.body;
  
  if (!name || !templateId || !frequency) {
    return res.status(400).json({ error: 'Name, templateId, and frequency required' });
  }
  
  const frequencyMap = {
    daily: 86400000,
    weekly: 604800000,
    monthly: 2592000000
  };
  
  const schedule = {
    id: uuidv4(),
    name,
    templateId,
    frequency,
    time: time || '09:00',
    recipients: recipients || [],
    brandingId: brandingId || null,
    active: true,
    nextRun: calculateNextRun(frequency, time),
    lastRun: null,
    createdAt: new Date().toISOString()
  };
  
  schedulesStore.set(schedule.id, schedule);
  
  res.status(201).json({ success: true, schedule });
});

/**
 * PUT /api/schedules/:id
 * Update schedule
 */
router.put('/:id', (req, res) => {
  const schedule = schedulesStore.get(req.params.id);
  
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  const { name, frequency, time, recipients, active, brandingId } = req.body;
  
  if (name) schedule.name = name;
  if (frequency) {
    schedule.frequency = frequency;
    schedule.nextRun = calculateNextRun(frequency, time || schedule.time);
  }
  if (time) schedule.time = time;
  if (recipients) schedule.recipients = recipients;
  if (active !== undefined) schedule.active = active;
  if (brandingId !== undefined) schedule.brandingId = brandingId;
  
  schedulesStore.set(schedule.id, schedule);
  
  res.json({ success: true, schedule });
});

/**
 * DELETE /api/schedules/:id
 * Delete schedule
 */
router.delete('/:id', (req, res) => {
  if (!schedulesStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  schedulesStore.delete(req.params.id);
  res.json({ success: true, message: 'Schedule deleted' });
});

/**
 * POST /api/schedules/:id/trigger
 * Manually trigger scheduled report
 */
router.post('/:id/trigger', (req, res) => {
  const schedule = schedulesStore.get(req.params.id);
  
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  const reportId = uuidv4();
  
  res.json({
    success: true,
    message: 'Report generation triggered',
    reportId,
    scheduleId: schedule.id
  });
});

/**
 * GET /api/schedules/frequencies
 * List available frequencies
 */
router.get('/frequencies', (req, res) => {
  const frequencies = [
    { id: 'daily', label: 'Daily', description: 'Run every day at specified time' },
    { id: 'weekly', label: 'Weekly', description: 'Run once a week on specified day and time' },
    { id: 'monthly', label: 'Monthly', description: 'Run once a month on specified date and time' }
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
    next.setDate(next.getDate() + (7 - next.getDay()) % 7 + 1);
  } else if (frequency === 'monthly') {
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
  }
  
  return next.toISOString();
}

module.exports = router;

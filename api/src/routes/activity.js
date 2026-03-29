const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory activity log
const activityLog = [];

/**
 * GET /api/activity
 * Get activity log
 */
router.get('/', (req, res) => {
  const { workspaceId, userId, limit = 50 } = req.query;
  
  let activities = [...activityLog];
  
  if (workspaceId) {
    activities = activities.filter(a => a.workspaceId === workspaceId);
  }
  
  if (userId) {
    activities = activities.filter(a => a.userId === userId);
  }
  
  activities = activities.slice(-parseInt(limit));
  
  res.json({ success: true, activities, total: activities.length });
});

/**
 * POST /api/activity
 * Log activity
 */
router.post('/', (req, res) => {
  const { userId, userName, action, resourceType, resourceId, details } = req.body;
  
  if (!action || !resourceType) {
    return res.status(400).json({ error: 'Action and resourceType required' });
  }
  
  const activity = {
    id: uuidv4(),
    userId: userId || 'anonymous',
    userName: userName || 'System',
    action,
    resourceType,
    resourceId,
    details: details || {},
    timestamp: new Date().toISOString()
  };
  
  activityLog.push(activity);
  
  // Keep only last 1000 activities
  if (activityLog.length > 1000) {
    activityLog.shift();
  }
  
  res.status(201).json({ success: true, activity });
});

/**
 * GET /api/activity/export
 * Export activity log
 */
router.get('/export', (req, res) => {
  const { format = 'json', workspaceId } = req.query;
  
  let activities = [...activityLog];
  
  if (workspaceId) {
    activities = activities.filter(a => a.workspaceId === workspaceId);
  }
  
  if (format === 'csv') {
    const csv = [
      'ID,User,Action,ResourceType,ResourceID,Timestamp',
      ...activities.map(a => 
        `${a.id},${a.userName},${a.action},${a.resourceType},${a.resourceId || ''},${a.timestamp}`
      )
    ].join('\n');
    
    res.json({ success: true, data: csv, format: 'csv' });
  } else {
    res.json({ success: true, data: activities, format: 'json' });
  }
});

/**
 * GET /api/activity/stats
 * Get activity statistics
 */
router.get('/stats', (req, res) => {
  const stats = {
    total: activityLog.length,
    byAction: {},
    byUser: {},
    byResource: {},
    recent24h: 0
  };
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  activityLog.forEach(a => {
    stats.byAction[a.action] = (stats.byAction[a.action] || 0) + 1;
    stats.byUser[a.userName] = (stats.byUser[a.userName] || 0) + 1;
    stats.byResource[a.resourceType] = (stats.byResource[a.resourceType] || 0) + 1;
    
    if (new Date(a.timestamp) > oneDayAgo) {
      stats.recent24h++;
    }
  });
  
  res.json({ success: true, stats });
});

module.exports = router;

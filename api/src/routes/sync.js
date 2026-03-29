const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const syncStore = new Map();

router.get('/status', (req, res) => {
  const syncs = Array.from(syncStore.values());
  const lastSync = syncs.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];
  res.json({ success: true, lastSync, totalSyncs: syncs.length });
});

router.post('/trigger', (req, res) => {
  const { siteUrl } = req.body;
  const syncId = uuidv4();
  const sync = {
    id: syncId,
    siteUrl: siteUrl || 'https://example.com',
    status: 'running',
    progress: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
    recordsImported: 0
  };
  syncStore.set(syncId, sync);
  
  setTimeout(() => {
    sync.status = 'completed';
    sync.progress = 100;
    sync.completedAt = new Date().toISOString();
    sync.recordsImported = Math.round(1000 + Math.random() * 5000);
  }, 3000);
  
  res.json({ success: true, syncId, status: sync.status });
});

router.get('/history', (req, res) => {
  const syncs = Array.from(syncStore.values()).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  res.json({ success: true, syncs });
});

router.get('/:id', (req, res) => {
  const sync = syncStore.get(req.params.id);
  if (!sync) return res.status(404).json({ error: 'Sync not found' });
  res.json({ success: true, sync });
});

module.exports = router;

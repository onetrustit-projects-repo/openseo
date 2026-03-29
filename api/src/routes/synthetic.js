const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const testsStore = new Map();

router.get('/tests', (req, res) => {
  const tests = Array.from(testsStore.values());
  res.json({ success: true, tests });
});

router.post('/run', (req, res) => {
  const { url, device = 'desktop', location = 'us-east' } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  const test = {
    id: uuidv4(),
    url,
    device,
    location,
    status: 'running',
    startedAt: new Date().toISOString(),
    results: null,
  };
  testsStore.set(test.id, test);
  
  // Simulate test completion
  setTimeout(() => {
    test.status = 'completed';
    test.completedAt = new Date().toISOString();
    test.results = {
      lighthouse: { performance: Math.round(70 + Math.random() * 25), accessibility: 85, bestPractices: 90, seo: 88 },
      metrics: { lcp: (1.5 + Math.random() * 2).toFixed(2), fid: Math.round(50 + Math.random() * 100), cls: (Math.random() * 0.15).toFixed(3), inp: Math.round(100 + Math.random() * 150) },
      opportunities: ['Serve images in next-gen formats', 'Reduce unused JavaScript', 'Properly size images'],
      passed: Math.round(5 + Math.random() * 4),
      failed: Math.round(Math.random() * 3),
    };
  }, 2000);
  
  res.json({ success: true, test });
});

router.get('/results/:id', (req, res) => {
  const test = testsStore.get(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json({ success: true, test });
});

router.delete('/:id', (req, res) => {
  if (!testsStore.has(req.params.id)) return res.status(404).json({ error: 'Test not found' });
  testsStore.delete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

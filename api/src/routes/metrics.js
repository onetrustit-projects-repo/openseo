const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const metricsStore = new Map();

// Seed sample data
function seedMetrics() {
  const pages = ['/', '/blog', '/pricing', '/features', '/about'];
  pages.forEach(page => {
    const metrics = {
      id: uuidv4(),
      page,
      timestamps: Array(30).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      }),
      lcp: { values: Array(30).fill(0).map(() => 1.5 + Math.random() * 2), p75: 2.8, p95: 4.2 },
      fid: { values: Array(30).fill(0).map(() => 50 + Math.random() * 100), p75: 120, p95: 250 },
      cls: { values: Array(30).fill(0).map(() => Math.random() * 0.2), p75: 0.08, p95: 0.15 },
      inp: { values: Array(30).fill(0).map(() => 100 + Math.random() * 150), p75: 200, p95: 350 },
    };
    metricsStore.set(page, metrics);
  });
}
seedMetrics();

router.get('/', (req, res) => {
  const { page, period = '30d' } = req.query;
  let result = Array.from(metricsStore.values());
  if (page) result = result.filter(m => m.page === page);
  res.json({ success: true, metrics: result });
});

router.get('/summary', (req, res) => {
  const pages = Array.from(metricsStore.values());
  const summary = {
    totalPages: pages.length,
    overallScore: Math.round(75 + Math.random() * 20),
    passing: Math.round(pages.length * 0.7),
    needsImprovement: Math.round(pages.length * 0.2),
    poor: Math.round(pages.length * 0.1),
    avgLcp: (2.0 + Math.random()).toFixed(2),
    avgFid: Math.round(80 + Math.random() * 40),
    avgCls: (0.05 + Math.random() * 0.05).toFixed(3),
    avgInp: Math.round(150 + Math.random() * 50),
  };
  res.json({ success: true, summary });
});

router.get('/history/:page', (req, res) => {
  const metrics = metricsStore.get(req.params.page);
  if (!metrics) return res.status(404).json({ error: 'Page not found' });
  res.json({ success: true, metrics });
});

router.get('/devices', (req, res) => {
  const breakdown = {
    desktop: { lcp: 1.8, fid: 60, cls: 0.05, inp: 120, percentage: 45 },
    mobile: { lcp: 2.8, fid: 100, cls: 0.12, inp: 200, percentage: 48 },
    tablet: { lcp: 2.2, fid: 80, cls: 0.08, inp: 160, percentage: 7 },
  };
  res.json({ success: true, breakdown });
});

router.get('/geo', (req, res) => {
  const geoData = [
    { region: 'US', lcp: 1.8, fid: 70, cls: 0.06, sessions: 45000 },
    { region: 'EU', lcp: 2.1, fid: 85, cls: 0.08, sessions: 32000 },
    { region: 'Asia', lcp: 2.5, fid: 110, cls: 0.10, sessions: 28000 },
    { region: 'Other', lcp: 2.2, fid: 95, cls: 0.09, sessions: 12000 },
  ];
  res.json({ success: true, geoData });
});

router.post('/collect', (req, res) => {
  const { page, metrics } = req.body;
  if (!page || !metrics) return res.status(400).json({ error: 'Page and metrics required' });
  const id = uuidv4();
  metricsStore.set(page, { id, page, ...metrics, collectedAt: new Date().toISOString() });
  res.json({ success: true, id });
});

module.exports = router;

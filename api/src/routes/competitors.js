const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory competitor store
const competitorStore = new Map();

// Sample competitors
const sampleCompetitors = [
  { id: uuidv4(), domain: 'semrush.com', name: 'SEMrush', authority: 92, keywords: 145200, backlinks: 8200000, topKeywords: 5200, avgPosition: 8.5, overlap: 78 },
  { id: uuidv4(), domain: 'ahrefs.com', name: 'Ahrefs', authority: 90, keywords: 128000, backlinks: 7600000, topKeywords: 4800, avgPosition: 9.2, overlap: 72 },
  { id: uuidv4(), domain: 'moz.com', name: 'Moz', authority: 89, keywords: 98000, backlinks: 5400000, topKeywords: 3500, avgPosition: 12.3, overlap: 65 },
  { id: uuidv4(), domain: ' Screaming Frog', name: 'Screaming Frog', authority: 85, keywords: 45000, backlinks: 2100000, topKeywords: 1800, avgPosition: 15.8, overlap: 42 },
];

sampleCompetitors.forEach(c => competitorStore.set(c.id, c));

/**
 * GET /api/competitors
 * List competitors
 */
router.get('/', (req, res) => {
  const competitors = Array.from(competitorStore.values());
  res.json({ success: true, competitors });
});

/**
 * GET /api/competitors/analysis
 * Get competitive analysis
 */
router.get('/analysis', (req, res) => {
  const { domain } = req.query;
  
  // Simulated analysis
  const analysis = {
    domain: domain || 'openseo.io',
    date: new Date().toISOString().split('T')[0],
    authorityScore: Math.round(45 + Math.random() * 40),
    totalKeywords: Math.round(Math.random() * 50000),
    totalBacklinks: Math.round(Math.random() * 5000000),
    topCompetitors: [
      { name: 'SEMrush', overlap: 78, sharedKeywords: 3200 },
      { name: 'Ahrefs', overlap: 72, sharedKeywords: 2800 },
      { name: 'Moz', overlap: 65, sharedKeywords: 2100 },
    ],
    gapAnalysis: {
      opportunities: Math.round(Math.random() * 500),
      easyWins: Math.round(Math.random() * 150),
      quickWins: Math.round(Math.random() * 80),
    },
    trends: {
      authority: Math.round(Math.random() * 20) - 5,
      keywords: Math.round(Math.random() * 500) - 100,
      backlinks: Math.round(Math.random() * 50000) - 10000,
    }
  };
  
  res.json({ success: true, analysis });
});

/**
 * GET /api/competitors/gap
 * Keyword gap analysis
 */
router.get('/gap', (req, res) => {
  const { domain, competitor } = req.query;
  
  const gap = {
    domain: domain || 'openseo.io',
    competitor: competitor || 'semrush.com',
    keywordsYouHave: [
      { keyword: 'seo software', position: 12, volume: 12000 },
      { keyword: 'rank tracking', position: 5, volume: 4800 },
    ],
    keywordsTheyHave: [
      { keyword: 'seo software', position: 2, volume: 12000 },
      { keyword: 'competitor analysis', position: 3, volume: 3200 },
      { keyword: 'sERP tracker', position: 4, volume: 2100 },
    ],
    gapKeywords: [
      { keyword: 'competitor analysis', volume: 3200, difficulty: 48, priority: 'high' },
      { keyword: 'sERP tracker', volume: 2100, difficulty: 42, priority: 'medium' },
      { keyword: 'domain authority checker', volume: 1800, difficulty: 55, priority: 'high' },
      { keyword: 'keyword difficulty tool', volume: 1500, difficulty: 45, priority: 'medium' },
    ],
    quickWins: [
      { keyword: 'easy keyword 1', volume: 800, difficulty: 25, yourPosition: 15 },
      { keyword: 'easy keyword 2', volume: 600, difficulty: 30, yourPosition: 18 },
    ]
  };
  
  res.json({ success: true, gap });
});

/**
 * POST /api/competitors
 * Add competitor
 */
router.post('/', (req, res) => {
  const { domain, name } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain required' });
  }
  
  const competitor = {
    id: uuidv4(),
    domain,
    name: name || domain,
    authority: Math.round(40 + Math.random() * 50),
    keywords: Math.round(Math.random() * 100000),
    backlinks: Math.round(Math.random() * 5000000),
    topKeywords: Math.round(Math.random() * 5000),
    avgPosition: Math.round((5 + Math.random() * 20) * 10) / 10,
    overlap: Math.round(Math.random() * 80),
    addedAt: new Date().toISOString()
  };
  
  competitorStore.set(competitor.id, competitor);
  res.json({ success: true, competitor });
});

/**
 * DELETE /api/competitors/:id
 * Remove competitor
 */
router.delete('/:id', (req, res) => {
  if (!competitorStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Competitor not found' });
  }
  
  competitorStore.delete(req.params.id);
  res.json({ success: true, remaining: competitorStore.size });
});

module.exports = router;

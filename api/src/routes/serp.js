const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory SERP features store
const serpStore = new Map();

// Sample SERP features
const sampleFeatures = [
  { id: uuidv4(), keyword: 'seo software', features: ['featuredSnippet', 'peopleAlsoAsk', 'videoResult', 'localPack'], position: 12, date: new Date().toISOString().split('T')[0] },
  { id: uuidv4(), keyword: 'keyword research tool', features: ['featuredSnippet', 'imagePack'], position: 8, date: new Date().toISOString().split('T')[0] },
  { id: uuidv4(), keyword: 'backlink checker', features: ['peopleAlsoAsk', 'topStories', 'videoResult'], position: 15, date: new Date().toISOString().split('T')[0] },
  { id: uuidv4(), keyword: 'site audit tool', features: ['featuredSnippet'], position: 22, date: new Date().toISOString().split('T')[0] },
  { id: uuidv4(), keyword: 'rank tracking', features: ['peopleAlsoAsk', 'imagePack', 'localPack'], position: 5, date: new Date().toISOString().split('T')[0] },
];

sampleFeatures.forEach(f => serpStore.set(f.id, f));

/**
 * GET /api/serp/features
 * Get SERP features for keywords
 */
router.get('/features', (req, res) => {
  const { keyword } = req.query;
  
  let features = Array.from(serpStore.values());
  
  if (keyword) {
    features = features.filter(f => f.keyword.includes(keyword.toLowerCase()));
  }
  
  res.json({ success: true, features });
});

/**
 * GET /api/serp/analysis
 * Analyze SERP features for a keyword
 */
router.get('/analysis', (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }
  
  // Simulated SERP analysis
  const analysis = {
    keyword,
    date: new Date().toISOString().split('T')[0],
    features: {
      featuredSnippet: { present: Math.random() > 0.3, position: Math.floor(Math.random() * 3) + 1 },
      peopleAlsoAsk: { present: Math.random() > 0.4, count: Math.floor(Math.random() * 8) + 3 },
      videoResult: { present: Math.random() > 0.5, position: Math.floor(Math.random() * 5) + 4 },
      imagePack: { present: Math.random() > 0.4, position: Math.floor(Math.random() * 5) + 3 },
      localPack: { present: Math.random() > 0.6, count: Math.floor(Math.random() * 3) + 1 },
      topStories: { present: Math.random() > 0.7, count: Math.floor(Math.random() * 5) },
      shoppingResults: { present: Math.random() > 0.7, count: Math.floor(Math.random() * 6) },
    },
    opportunity: Math.round(40 + Math.random() * 50),
    difficulty: Math.round(30 + Math.random() * 60),
    recommendation: Math.random() > 0.5 ? 'Target featured snippet opportunity' : 'Optimize for People Also Ask'
  };
  
  res.json({ success: true, analysis });
});

/**
 * POST /api/serp/track
 * Track SERP features for a keyword
 */
router.post('/track', (req, res) => {
  const { keyword, features, position } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }
  
  const serpData = {
    id: uuidv4(),
    keyword,
    features: features || [],
    position: position || null,
    date: new Date().toISOString().split('T')[0]
  };
  
  serpStore.set(serpData.id, serpData);
  res.json({ success: true, serp: serpData });
});

/**
 * GET /api/serp/history/:keyword
 * Get SERP history for a keyword
 */
router.get('/history/:keyword', (req, res) => {
  const { keyword } = req.params;
  const history = Array.from(serpStore.values())
    .filter(s => s.keyword === keyword)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json({ success: true, history });
});

/**
 * GET /api/serp/opportunities
 * Get SERP opportunities
 */
router.get('/opportunities', (req, res) => {
  const opportunities = [
    { type: 'featuredSnippet', keyword: 'seo software', difficulty: 65, opportunity: 'high' },
    { type: 'peopleAlsoAsk', keyword: 'keyword research tool', difficulty: 58, opportunity: 'medium' },
    { type: 'videoResult', keyword: 'backlink checker', difficulty: 52, opportunity: 'high' },
    { type: 'imagePack', keyword: 'site audit tool', difficulty: 48, opportunity: 'medium' },
    { type: 'localPack', keyword: 'rank tracking', difficulty: 45, opportunity: 'low' },
  ];
  
  res.json({ success: true, opportunities });
});

module.exports = router;

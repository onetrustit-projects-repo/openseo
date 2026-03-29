const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory trends store
const trendsStore = new Map();

/**
 * GET /api/trends/keywords
 * Get keyword ranking trends
 */
router.get('/keywords', (req, res) => {
  const { keyword, period = '30d' } = req.query;
  
  // Generate sample trend data
  const generateTrend = (base, volatility) => {
    const data = [];
    let value = base;
    for (let i = 0; i < 30; i++) {
      value = Math.max(0, value + (Math.random() - 0.5) * volatility);
      data.push({ date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], value: Math.round(value) });
    }
    return data;
  };
  
  const trends = {
    keyword: keyword || 'seo software',
    period,
    position: generateTrend(15, 2),
    searchVolume: generateTrend(12000, 500),
    difficulty: generateTrend(65, 3),
    cpc: generateTrend(7.50, 0.5),
  };
  
  res.json({ success: true, trends });
});

/**
 * GET /api/trends/volume
 * Search volume trends
 */
router.get('/volume', (req, res) => {
  const { keyword } = req.query;
  
  const volumeTrend = [];
  const baseVolume = 10000 + Math.floor(Math.random() * 5000);
  
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    volumeTrend.push({
      month: date.toISOString().split('T')[0].substring(0, 7),
      volume: baseVolume + Math.floor((Math.random() - 0.4) * 3000),
      index: 100 + Math.round((Math.random() - 0.5) * 20)
    });
  }
  
  res.json({ success: true, trend: volumeTrend });
});

/**
 * GET /api/trends/ranking
 * Ranking distribution over time
 */
router.get('/ranking', (req, res) => {
  const distribution = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    distribution.push({
      month: date.toISOString().split('T')[0].substring(0, 7),
      top3: Math.round(15 + Math.random() * 10),
      top10: Math.round(25 + Math.random() * 15),
      top20: Math.round(35 + Math.random() * 20),
      top50: Math.round(50 + Math.random() * 25),
      top100: Math.round(70 + Math.random() * 30),
    });
  }
  
  res.json({ success: true, distribution });
});

/**
 * GET /api/trends/competitors
 * Competitor position trends
 */
router.get('/competitors', (req, res) => {
  const { keyword } = req.query;
  
  const trends = [
    { domain: 'openseo.io', color: '#8b5cf6', positions: [12, 11, 13, 10, 12, 11, 10, 9, 11, 10, 12, 10] },
    { domain: 'semrush.com', color: '#3b82f6', positions: [2, 3, 2, 4, 3, 2, 3, 2, 1, 2, 3, 2] },
    { domain: 'ahrefs.com', color: '#22c55e', positions: [4, 3, 5, 4, 5, 4, 6, 5, 4, 5, 4, 3] },
    { domain: 'moz.com', color: '#f59e0b', positions: [8, 7, 9, 8, 10, 9, 8, 7, 9, 8, 7, 6] },
  ];
  
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    months.push(date.toISOString().split('T')[0].substring(0, 7));
  }
  
  res.json({ success: true, keyword: keyword || 'seo software', months, trends });
});

/**
 * GET /api/trends/forecast
 * Keyword position forecast
 */
router.get('/forecast', (req, res) => {
  const { keyword } = req.query;
  
  const forecast = {
    keyword: keyword || 'seo software',
    current: { position: 12, date: new Date().toISOString().split('T')[0] },
    predictions: [],
    confidence: 0.75,
    trend: 'improving'
  };
  
  let position = 12;
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i * 7);
    position = Math.max(1, position + Math.round((Math.random() - 0.6) * 2));
    forecast.predictions.push({
      week: date.toISOString().split('T')[0].substring(0, 10),
      position,
      range: [Math.max(1, position - 2), position + 2]
    });
  }
  
  res.json({ success: true, forecast });
});

/**
 * POST /api/trends/track
 * Track a new trend
 */
router.post('/track', (req, res) => {
  const { keyword, type } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }
  
  const trendId = uuidv4();
  const trend = {
    id: trendId,
    keyword,
    type: type || 'position',
    data: [],
    createdAt: new Date().toISOString()
  };
  
  trendsStore.set(trendId, trend);
  res.json({ success: true, trend });
});

module.exports = router;

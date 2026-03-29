const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory keyword store
const keywordStore = new Map();

// Seed sample keywords
function seedKeywords() {
  const keywords = [
    { id: uuidv4(), keyword: 'seo software', searchVolume: 12000, difficulty: 72, cpc: 8.50, competition: 0.85, trends: [65, 68, 72, 70, 75, 78, 80, 82], position: 12, change: 3 },
    { id: uuidv4(), keyword: 'keyword research tool', searchVolume: 8500, difficulty: 65, cpc: 6.20, competition: 0.72, trends: [55, 58, 62, 65, 68, 70, 72, 74], position: 8, change: -1 },
    { id: uuidv4(), keyword: 'backlink checker', searchVolume: 6200, difficulty: 58, cpc: 5.80, competition: 0.68, trends: [45, 48, 52, 55, 58, 60, 62, 65], position: 15, change: 5 },
    { id: uuidv4(), keyword: 'site audit tool', searchVolume: 5400, difficulty: 55, cpc: 7.20, competition: 0.62, trends: [40, 42, 45, 48, 50, 52, 55, 58], position: 22, change: -2 },
    { id: uuidv4(), keyword: 'rank tracking', searchVolume: 4800, difficulty: 52, cpc: 4.90, competition: 0.58, trends: [35, 38, 40, 42, 45, 48, 50, 52], position: 5, change: 0 },
    { id: uuidv4(), keyword: 'competitor analysis', searchVolume: 3200, difficulty: 48, cpc: 9.30, competition: 0.45, trends: [25, 28, 30, 32, 35, 38, 40, 42], position: 18, change: 8 },
    { id: uuidv4(), keyword: 'organic traffic', searchVolume: 2800, difficulty: 42, cpc: 3.80, competition: 0.38, trends: [20, 22, 25, 28, 30, 32, 35, 38], position: 3, change: 1 },
    { id: uuidv4(), keyword: 'serp tracking', searchVolume: 1900, difficulty: 38, cpc: 5.40, competition: 0.32, trends: [15, 18, 20, 22, 25, 28, 30, 32], position: 7, change: -3 },
  ];
  
  keywords.forEach(kw => keywordStore.set(kw.id, kw));
  return keywords;
}

seedKeywords();

/**
 * GET /api/keywords
 * List keywords with filtering
 */
router.get('/', (req, res) => {
  const { q, minVolume, maxDifficulty, sort, order = 'desc', page = 1, limit = 50 } = req.query;
  
  let keywords = Array.from(keywordStore.values());
  
  if (q) {
    keywords = keywords.filter(kw => kw.keyword.toLowerCase().includes(q.toLowerCase()));
  }
  if (minVolume) {
    keywords = keywords.filter(kw => kw.searchVolume >= parseInt(minVolume));
  }
  if (maxDifficulty) {
    keywords = keywords.filter(kw => kw.difficulty <= parseInt(maxDifficulty));
  }
  if (sort) {
    keywords.sort((a, b) => {
      const aVal = a[sort];
      const bVal = b[sort];
      return order === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }
  
  const total = keywords.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = keywords.slice(start, start + parseInt(limit));
  
  res.json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    keywords: paginated
  });
});

/**
 * GET /api/keywords/summary
 * Get keyword portfolio summary
 */
router.get('/summary', (req, res) => {
  const keywords = Array.from(keywordStore.values());
  
  const totalKeywords = keywords.length;
  const avgDifficulty = keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / totalKeywords;
  const totalVolume = keywords.reduce((sum, kw) => sum + kw.searchVolume, 0);
  const totalCpc = keywords.reduce((sum, kw) => sum + kw.cpc, 0) / totalKeywords;
  
  const positionDistribution = {
    top3: keywords.filter(kw => kw.position <= 3).length,
    top10: keywords.filter(kw => kw.position <= 10 && kw.position > 3).length,
    top20: keywords.filter(kw => kw.position <= 20 && kw.position > 10).length,
    top100: keywords.filter(kw => kw.position > 20).length,
  };
  
  res.json({
    success: true,
    summary: {
      totalKeywords,
      averageDifficulty: Math.round(avgDifficulty),
      totalSearchVolume: totalVolume,
      averageCpc: Math.round(totalCpc * 100) / 100,
      positionDistribution
    }
  });
});

/**
 * GET /api/keywords/difficulty
 * Get keyword difficulty breakdown
 */
router.get('/difficulty', (req, res) => {
  const keywords = Array.from(keywordStore.values());
  
  const breakdown = {
    easy: keywords.filter(kw => kw.difficulty < 40).length,
    medium: keywords.filter(kw => kw.difficulty >= 40 && kw.difficulty < 60).length,
    hard: keywords.filter(kw => kw.difficulty >= 60 && kw.difficulty < 80).length,
    veryHard: keywords.filter(kw => kw.difficulty >= 80).length,
  };
  
  res.json({ success: true, breakdown });
});

/**
 * POST /api/keywords
 * Add new keyword
 */
router.post('/', (req, res) => {
  const { keyword, searchVolume, difficulty, cpc, competition } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }
  
  const newKeyword = {
    id: uuidv4(),
    keyword,
    searchVolume: searchVolume || 0,
    difficulty: difficulty || 50,
    cpc: cpc || 0,
    competition: competition || 0,
    trends: Array(8).fill(0).map(() => Math.floor(Math.random() * 100)),
    position: Math.floor(Math.random() * 100) + 1,
    change: Math.floor(Math.random() * 20) - 10,
    createdAt: new Date().toISOString()
  };
  
  keywordStore.set(newKeyword.id, newKeyword);
  res.json({ success: true, keyword: newKeyword });
});

/**
 * GET /api/keywords/:id
 * Get keyword details
 */
router.get('/:id', (req, res) => {
  const keyword = keywordStore.get(req.params.id);
  
  if (!keyword) {
    return res.status(404).json({ error: 'Keyword not found' });
  }
  
  res.json({ success: true, keyword });
});

/**
 * DELETE /api/keywords/:id
 * Delete keyword
 */
router.delete('/:id', (req, res) => {
  if (!keywordStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Keyword not found' });
  }
  
  keywordStore.delete(req.params.id);
  res.json({ success: true, remaining: keywordStore.size });
});

module.exports = router;

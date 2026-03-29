const express = require('express');
const router = express.Router();

// GET /api/ranks - Get rankings
router.get('/', (req, res) => {
  try {
    const { keyword, domain } = req.query;
    if (!keyword || !domain) {
      return res.status(400).json({ success: false, error: 'keyword and domain parameters required' });
    }

    // Generate mock ranking data
    const rankings = generateMockRankings(keyword, domain);

    res.json({
      success: true,
      data: {
        keyword,
        domain,
        currentRank: rankings.currentRank,
        change: rankings.change,
        history: rankings.history
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ranks/history - Ranking history
router.get('/history', (req, res) => {
  const { keyword, domain, days = 30 } = req.query;
  
  const history = Array.from({ length: parseInt(days) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (parseInt(days) - i));
    return {
      date: date.toISOString().split('T')[0],
      rank: Math.round(Math.random() * 50 + 1),
      searchVolume: Math.round(Math.random() * 10000 + 500)
    };
  });

  res.json({ success: true, data: history });
});

function generateMockRankings(keyword, domain) {
  const currentRank = Math.round(Math.random() * 50 + 1);
  const previousRank = currentRank + Math.round(Math.random() * 10 - 5);
  
  const history = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      date: date.toISOString().split('T')[0],
      rank: Math.round(currentRank + (Math.random() * 10 - 5))
    };
  });

  return {
    currentRank,
    change: previousRank - currentRank,
    history
  };
}

module.exports = router;

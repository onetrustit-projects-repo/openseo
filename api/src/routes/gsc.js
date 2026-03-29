const express = require('express');
const router = express.Router();

router.get('/auth-url', (req, res) => {
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://www.googleapis.com/auth/webmasters.readonly&access_type=offline';
  res.json({ success: true, authUrl });
});

router.post('/connect', (req, res) => {
  const { code } = req.body;
  res.json({ success: true, connected: true, site: 'https://example.com', tokenExpiry: new Date(Date.now() + 3600000).toISOString() });
});

router.get('/sites', (req, res) => {
  const sites = [
    { url: 'https://example.com', permissionLevel: 'siteOwner', verified: true },
    { url: 'https://blog.example.com', permissionLevel: 'siteOwner', verified: true }
  ];
  res.json({ success: true, sites });
});

router.get('/performance', (req, res) => {
  const { siteUrl, startDate, endDate, dimensions = 'query' } = req.query;
  const data = generatePerformanceData(startDate, endDate, dimensions);
  res.json({ success: true, data, rows: data.length });
});

router.get('/analytics', (req, res) => {
  const { siteUrl, period = '28d' } = req.query;
  const analytics = {
    totalClicks: Math.round(45000 + Math.random() * 10000),
    totalImpressions: Math.round(500000 + Math.random() * 100000),
    averageCTR: (3.5 + Math.random() * 2).toFixed(2),
    averagePosition: (5 + Math.random() * 10).toFixed(1),
    clicksTrend: generateTrendData(28, 'clicks'),
    impressionsTrend: generateTrendData(28, 'impressions'),
    deviceBreakdown: [
      { device: 'desktop', clicks: 28000, impressions: 320000, ctr: 8.75, position: 4.2 },
      { device: 'mobile', clicks: 14000, impressions: 150000, ctr: 9.33, position: 5.1 },
      { device: 'tablet', clicks: 3000, impressions: 30000, ctr: 10.0, position: 4.8 }
    ],
    countryBreakdown: [
      { country: 'US', clicks: 25000, impressions: 280000, ctr: 8.93, position: 3.2 },
      { country: 'UK', clicks: 8000, impressions: 90000, ctr: 8.89, position: 4.5 },
      { country: 'CA', clicks: 5000, impressions: 60000, ctr: 8.33, position: 5.1 }
    ]
  };
  res.json({ success: true, analytics });
});

router.get('/top-pages', (req, res) => {
  const pages = [
    { page: '/', clicks: 8500, impressions: 120000, ctr: 7.08, position: 1.2, change: 2.3 },
    { page: '/features', clicks: 5200, impressions: 65000, ctr: 8.0, position: 2.5, change: -1.2 },
    { page: '/pricing', clicks: 4100, impressions: 48000, ctr: 8.54, position: 3.1, change: 0.8 },
    { page: '/blog/seo-guide', clicks: 3800, impressions: 42000, ctr: 9.05, position: 4.2, change: 5.1 },
    { page: '/about', clicks: 2900, impressions: 35000, ctr: 8.29, position: 5.8, change: -0.5 }
  ];
  res.json({ success: true, pages });
});

router.get('/top-queries', (req, res) => {
  const queries = [
    { query: 'seo software', clicks: 3200, impressions: 45000, ctr: 7.11, position: 3.2, change: 1.5 },
    { query: 'keyword research tool', clicks: 2800, impressions: 38000, ctr: 7.37, position: 4.1, change: -2.3 },
    { query: 'backlink checker', clicks: 2100, impressions: 28000, ctr: 7.5, position: 5.3, change: 0.9 },
    { query: 'site audit', clicks: 1900, impressions: 25000, ctr: 7.6, position: 6.2, change: 3.1 },
    { query: 'rank tracking', clicks: 1500, impressions: 18000, ctr: 8.33, position: 7.1, change: -1.8 }
  ];
  res.json({ success: true, queries });
});

function generatePerformanceData(startDate, endDate, dimensions) {
  const data = [];
  const days = 28;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    data.push({
      date: date.toISOString().split('T')[0],
      clicks: Math.round(1200 + Math.random() * 800),
      impressions: Math.round(18000 + Math.random() * 8000),
      ctr: (5 + Math.random() * 5).toFixed(2),
      position: (3 + Math.random() * 8).toFixed(1)
    });
  }
  return data;
}

function generateTrendData(days, type) {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    data.push({
      date: date.toISOString().split('T')[0],
      value: type === 'clicks' ? Math.round(1200 + Math.random() * 800) : Math.round(18000 + Math.random() * 8000)
    });
  }
  return data;
}

module.exports = router;

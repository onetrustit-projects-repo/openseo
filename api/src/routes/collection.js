const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store for collected metrics (use InfluxDB/TimescaleDB in production)
const collectedMetrics = [];
const COLLECTION_WINDOW = 30 * 24 * 60 * 60 * 1000; // 30 days

// Clean old metrics periodically
function cleanOldMetrics() {
  const cutoff = Date.now() - COLLECTION_WINDOW;
  while (collectedMetrics.length > 0 && new Date(collectedMetrics[0].timestamp).getTime() < cutoff) {
    collectedMetrics.shift();
  }
}

// Clean every hour
setInterval(cleanOldMetrics, 60 * 60 * 1000);

// POST /api/collect - Receive RUM metrics from web-vitals library
router.post('/', (req, res) => {
  const { page, url, metrics, userAgent, timestamp } = req.body;
  
  if (!page || !metrics) {
    return res.status(400).json({ error: 'page and metrics required' });
  }
  
  const entry = {
    id: uuidv4(),
    page,
    url: url || page,
    timestamp: timestamp || new Date().toISOString(),
    userAgent: userAgent || 'unknown',
    device: parseDevice(userAgent),
    metrics: {
      LCP: metrics.LCP || metrics.largestContentfulPaint,
      FID: metrics.FID || metrics.firstInputDelay,
      CLS: metrics.CLS || metrics.cumulativeLayoutShift,
      INP: metrics.INP || metrics.interactionToNextPaint,
    },
  };
  
  collectedMetrics.push(entry);
  
  // Check thresholds and generate alerts
  checkThresholds(entry);
  
  res.json({ success: true, id: entry.id });
});

// Parse device type from user agent
function parseDevice(userAgent) {
  if (!userAgent) return 'desktop';
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

// Check metric thresholds and log violations
function checkThresholds(entry) {
  const thresholds = {
    LCP: { good: 2.5, poor: 4.0 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },
  };
  
  for (const [metric, value] of Object.entries(entry.metrics)) {
    if (!value || typeof value !== 'number') continue;
    const threshold = thresholds[metric];
    if (!threshold) continue;
    
    if (value >= threshold.poor) {
      console.log(`[ALERT] ${metric} POOR on ${entry.page}: ${value} (threshold: ${threshold.poor})`);
    } else if (value >= threshold.good) {
      console.log(`[WARN] ${metric} NEEDS IMPROVEMENT on ${entry.page}: ${value} (threshold: ${threshold.good})`);
    }
  }
}

// GET /api/collect/history - Get collected metrics with filtering
router.get('/history', (req, res) => {
  const { page, device, from, to, metric, limit = 1000 } = req.query;
  
  let results = [...collectedMetrics];
  
  if (page) {
    results = results.filter(m => m.page === page);
  }
  
  if (device) {
    results = results.filter(m => m.device === device);
  }
  
  if (from) {
    const fromDate = new Date(from);
    results = results.filter(m => new Date(m.timestamp) >= fromDate);
  }
  
  if (to) {
    const toDate = new Date(to);
    results = results.filter(m => new Date(m.timestamp) <= toDate);
  }
  
  if (metric) {
    results = results.map(m => ({
      ...m,
      [metric]: m.metrics[metric],
    }));
  }
  
  // Sort by timestamp descending and limit
  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  results = results.slice(0, parseInt(limit));
  
  res.json({ success: true, metrics: results, total: collectedMetrics.length });
});

// GET /api/collect/aggregate - Get aggregated metrics over time
router.get('/aggregate', (req, res) => {
  const { page, device, interval = '1h' } = req.query;
  
  let results = [...collectedMetrics];
  
  if (page) {
    results = results.filter(m => m.page === page);
  }
  
  if (device) {
    results = results.filter(m => m.device === device);
  }
  
  // Group by interval
  const groups = new Map();
  const intervalMs = interval === '1h' ? 60 * 60 * 1000 : 
                     interval === '1d' ? 24 * 60 * 60 * 1000 : 
                     5 * 60 * 1000;
  
  results.forEach(m => {
    const ts = new Date(m.timestamp).getTime();
    const bucket = Math.floor(ts / intervalMs) * intervalMs;
    if (!groups.has(bucket)) {
      groups.set(bucket, { timestamp: new Date(bucket).toISOString(), samples: [], metrics: { LCP: [], FID: [], CLS: [], INP: [] } });
    }
    const group = groups.get(bucket);
    group.samples.push(m);
    if (m.metrics.LCP) group.metrics.LCP.push(m.metrics.LCP);
    if (m.metrics.FID) group.metrics.FID.push(m.metrics.FID);
    if (m.metrics.CLS) group.metrics.CLS.push(m.metrics.CLS);
    if (m.metrics.INP) group.metrics.INP.push(m.metrics.INP);
  });
  
  // Calculate aggregates
  const aggregates = Array.from(groups.values()).map(g => ({
    timestamp: g.timestamp,
    sampleCount: g.samples.length,
    LCP: percentile(g.metrics.LCP, 75),
    FID: percentile(g.metrics.FID, 75),
    CLS: percentile(g.metrics.CLS, 75),
    INP: percentile(g.metrics.INP, 75),
  }));
  
  aggregates.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  res.json({ success: true, aggregates });
});

// Calculate percentile
function percentile(arr, p) {
  if (!arr || arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

module.exports = router;

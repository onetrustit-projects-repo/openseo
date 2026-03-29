const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory report store
const reportsStore = new Map();

/**
 * GET /api/reports
 * List all reports
 */
router.get('/', (req, res) => {
  const reports = Array.from(reportsStore.values()).map(r => ({
    id: r.id,
    name: r.name,
    templateId: r.templateId,
    status: r.status,
    createdAt: r.createdAt,
    generatedAt: r.generatedAt
  }));
  
  res.json({ success: true, reports, total: reports.length });
});

/**
 * GET /api/reports/:id
 * Get report by ID
 */
router.get('/:id', (req, res) => {
  const report = reportsStore.get(req.params.id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  res.json({ success: true, report });
});

/**
 * POST /api/reports/generate
 * Generate a new report
 */
router.post('/generate', (req, res) => {
  const { name, templateId, data, branding, format = 'pdf' } = req.body;
  
  if (!name || !templateId) {
    return res.status(400).json({ error: 'Name and templateId required' });
  }
  
  const report = {
    id: uuidv4(),
    name,
    templateId,
    data: data || generateMockData(),
    branding,
    format,
    status: 'generating',
    createdAt: new Date().toISOString(),
    generatedAt: null,
    downloadUrl: null
  };
  
  reportsStore.set(report.id, report);
  
  // Simulate generation
  setTimeout(() => {
    report.status = 'completed';
    report.generatedAt = new Date().toISOString();
    report.downloadUrl = `/api/reports/${report.id}/download`;
    reportsStore.set(report.id, report);
  }, 1000);
  
  res.status(202).json({ success: true, report });
});

/**
 * POST /api/reports/:id/export
 * Export report in different formats
 */
router.post('/:id/export', (req, res) => {
  const { format } = req.body;
  const report = reportsStore.get(req.params.id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  const exports = {
    pdf: { contentType: 'application/pdf', extension: 'pdf' },
    csv: { contentType: 'text/csv', extension: 'csv' },
    pptx: { contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extension: 'pptx' },
    html: { contentType: 'text/html', extension: 'html' }
  };
  
  const exp = exports[format] || exports.pdf;
  
  res.json({
    success: true,
    data: {
      reportId: report.id,
      format,
      contentType: exp.contentType,
      downloadUrl: `/api/reports/${report.id}/export/${format}`
    }
  });
});

/**
 * DELETE /api/reports/:id
 * Delete a report
 */
router.delete('/:id', (req, res) => {
  if (!reportsStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  reportsStore.delete(req.params.id);
  res.json({ success: true, message: 'Report deleted' });
});

/**
 * POST /api/reports/executive-summary
 * Generate executive summary
 */
router.post('/executive-summary', (req, res) => {
  const { data, branding } = req.body;
  
  const summary = {
    overview: {
      totalKeywords: data?.totalKeywords || 1247,
      organicTraffic: data?.organicTraffic || '24.5K',
      domainRating: data?.domainRating || 67,
      backlinks: data?.backlinks || 8432
    },
    performance: {
      topKeywords: data?.topKeywords || [
        { keyword: 'seo tools', position: 3, change: 2 },
        { keyword: 'keyword research', position: 7, change: 1 },
        { keyword: 'backlink checker', position: 12, change: 5 }
      ],
      trafficTrend: '+12%',
      rankingDistribution: {
        top3: 24,
        top10: 87,
        top100: 342
      }
    },
    recommendations: [
      'Focus on improving page speed for better rankings',
      'Add more internal links to product pages',
      'Create content for 3 new keyword clusters'
    ],
    generatedAt: new Date().toISOString()
  };
  
  res.json({ success: true, data: summary });
});

/**
 * POST /api/reports/benchmark
 * Generate benchmark comparison
 */
router.post('/benchmark', (req, res) => {
  const { domain, competitors } = req.body;
  
  const benchmark = {
    domain,
    comparedTo: competitors || [],
    metrics: {
      domainRating: { value: 67, percentile: 72 },
      backlinks: { value: 8432, percentile: 85 },
      organicKeywords: { value: 1247, percentile: 68 },
      traffic: { value: '24.5K', percentile: 75 }
    },
    insights: [
      { metric: 'Domain Rating', insight: 'Above average', positive: true },
      { metric: 'Backlinks', insight: 'Strong backlink profile', positive: true },
      { metric: 'Organic Keywords', insight: 'Room for growth', positive: false }
    ],
    generatedAt: new Date().toISOString()
  };
  
  res.json({ success: true, data: benchmark });
});

function generateMockData() {
  return {
    totalKeywords: 1247,
    organicTraffic: '24.5K',
    domainRating: 67,
    backlinks: 8432,
    topKeywords: [
      { keyword: 'seo tools', position: 3, volume: 18100, change: 2 },
      { keyword: 'keyword research', position: 7, volume: 14800, change: 1 },
      { keyword: 'backlink checker', position: 12, volume: 9800, change: 5 }
    ],
    issues: [
      { type: 'warning', message: '3 pages with missing meta descriptions', count: 3 },
      { type: 'error', message: '2 broken internal links detected', count: 2 }
    ]
  };
}

module.exports = router;

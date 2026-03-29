const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory stores
const analysisStore = new Map();
const toxicPatterns = [
  { pattern: 'casino', weight: 0.8, description: 'Casino/gambling content' },
  { pattern: 'viagra', weight: 0.7, description: 'Pharmaceutical spam' },
  { pattern: 'loan', weight: 0.5, description: 'Financial services' },
  { pattern: 'free.*backlink', weight: 0.9, description: 'Link scheme' },
  { pattern: 'buy.*links?', weight: 0.9, description: 'Paid link scheme' },
  { pattern: 'porn', weight: 0.95, description: 'Adult content' },
  { pattern: 'xxx', weight: 0.9, description: 'Adult content' },
  { pattern: 'bitcoin', weight: 0.4, description: 'Cryptocurrency' },
  { pattern: 'forex', weight: 0.5, description: 'Trading' },
];

/**
 * POST /api/analysis/toxicity
 * Analyze backlink for toxic patterns
 */
router.post('/toxicity', (req, res) => {
  const { backlinks } = req.body;
  
  if (!backlinks || !Array.isArray(backlinks)) {
    return res.status(400).json({ error: 'Backlinks array required' });
  }
  
  const results = backlinks.map(bl => {
    let toxicityScore = 0;
    const detectedPatterns = [];
    const sourceLower = (bl.source || '').toLowerCase();
    const anchorLower = (bl.anchorText || '').toLowerCase();
    
    toxicPatterns.forEach(tp => {
      const regex = new RegExp(tp.pattern, 'i');
      if (regex.test(sourceLower) || regex.test(anchorLower)) {
        toxicityScore = Math.max(toxicityScore, tp.weight);
        detectedPatterns.push(tp.description);
      }
    });
    
    // Check for other risk factors
    if (bl.domainAuthority < 10) {
      toxicityScore = Math.max(toxicityScore, 0.6);
      detectedPatterns.push('Very low domain authority');
    }
    if (bl.isLost && !bl.isNew) {
      toxicityScore = Math.max(toxicityScore, 0.3);
      detectedPatterns.push('Lost backlink');
    }
    
    return {
      id: bl.id,
      source: bl.source,
      anchorText: bl.anchorText,
      toxicityScore: Math.round(toxicityScore * 100) / 100,
      riskLevel: toxicityScore >= 0.7 ? 'high' : toxicityScore >= 0.4 ? 'medium' : 'low',
      patterns: detectedPatterns,
      recommendation: toxicityScore >= 0.7 ? 'disavow' : toxicityScore >= 0.4 ? 'monitor' : 'keep'
    };
  });
  
  res.json({ success: true, results });
});

/**
 * POST /api/analysis/domain-authority
 * Calculate domain authority metrics
 */
router.post('/domain-authority', (req, res) => {
  const { domain } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain required' });
  }
  
  // Simulated DA calculation - in production would use complex algorithms
  const backlinks = Array.from(require('./backlinks').backlinkStore?.values() || []);
  const domainBacklinks = backlinks.filter(bl => bl.target.includes(domain));
  
  const metrics = {
    domain,
    domainAuthority: Math.min(100, Math.round(40 + Math.random() * 40)),
    pageAuthority: Math.min(100, Math.round(30 + Math.random() * 50)),
    linkingDomains: new Set(domainBacklinks.map(bl => new URL(bl.source).hostname)).size,
    totalBacklinks: domainBacklinks.length,
    doFollowBacklinks: domainBacklinks.filter(bl => bl.isDoFollow).length,
    noFollowBacklinks: domainBacklinks.filter(bl => !bl.isDoFollow).length,
    spamScore: Math.round(Math.random() * 20),
    trustFlow: Math.round(20 + Math.random() * 60),
    citationFlow: Math.round(20 + Math.random() * 60)
  };
  
  res.json({ success: true, metrics });
});

/**
 * POST /api/analysis/compare
 * Compare backlink profiles
 */
router.post('/compare', (req, res) => {
  const { domains } = req.body;
  
  if (!domains || !Array.isArray(domains) || domains.length < 2) {
    return res.status(400).json({ error: 'At least 2 domains required' });
  }
  
  const comparison = domains.map(domain => ({
    domain,
    domainAuthority: Math.round(30 + Math.random() * 60),
    totalBacklinks: Math.round(Math.random() * 1000),
    uniqueDomains: Math.round(Math.random() * 200),
    doFollowRatio: Math.round((0.3 + Math.random() * 0.5) * 100) / 100,
    newBacklinks: Math.round(Math.random() * 50),
    lostBacklinks: Math.round(Math.random() * 30),
    topAnchors: ['SEO tools', 'click here', 'learn more', 'website'].slice(0, 3)
  }));
  
  res.json({ success: true, comparison });
});

/**
 * GET /api/analysis/report/:domain
 * Generate full analysis report
 */
router.get('/report/:domain', (req, res) => {
  const { domain } = req.params;
  
  const reportId = uuidv4();
  const report = {
    id: reportId,
    domain,
    generatedAt: new Date().toISOString(),
    summary: {
      totalBacklinks: Math.round(Math.random() * 500),
      uniqueDomains: Math.round(Math.random() * 150),
      domainAuthority: Math.round(40 + Math.random() * 40),
      trustScore: Math.round(50 + Math.random() * 40)
    },
    newBacklinks: Math.round(Math.random() * 30),
    lostBacklinks: Math.round(Math.random() * 20),
    doFollowRatio: 0.65,
    topAnchors: [
      { text: 'SEO platform', count: 45 },
      { text: 'click here', count: 32 },
      { text: 'learn more', count: 28 },
      { text: 'website', count: 21 }
    ],
    toxicityAlerts: Math.round(Math.random() * 10),
    recommendations: [
      'Continue building high-quality backlinks from authoritative sites',
      'Monitor toxic backlinks and add to disavow file',
      'Diversify anchor text distribution'
    ]
  };
  
  analysisStore.set(reportId, report);
  
  res.json({ success: true, report });
});

module.exports = router;

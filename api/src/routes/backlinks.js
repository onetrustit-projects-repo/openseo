const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory stores
const backlinkStore = new Map();
const domainCache = new Map();

// Seed sample data
function seedData() {
  const sampleBacklinks = [
    { id: uuidv4(), source: 'https://blog.example.com/seo-tips', target: 'https://openseo.io', anchorText: 'SEO platform', domainAuthority: 65, pageAuthority: 42, isDoFollow: true, isNew: false, isLost: false, firstSeen: '2026-01-15', lastSeen: '2026-03-28', type: 'article' },
    { id: uuidv4(), source: 'https://news.site.com/tech', target: 'https://openseo.io', anchorText: 'click here', domainAuthority: 72, pageAuthority: 55, isDoFollow: false, isNew: false, isLost: false, firstSeen: '2026-02-01', lastSeen: '2026-03-27', type: 'news' },
    { id: uuidv4(), source: 'https://forum.seo.com/discussion', target: 'https://openseo.io', anchorText: 'OpenSEO tool', domainAuthority: 58, pageAuthority: 35, isDoFollow: true, isNew: true, isLost: false, firstSeen: '2026-03-25', lastSeen: '2026-03-29', type: 'forum' },
    { id: uuidv4(), source: 'https://edu.university.edu/resource', target: 'https://openseo.io', anchorText: 'learn more', domainAuthority: 88, pageAuthority: 62, isDoFollow: true, isNew: false, isLost: false, firstSeen: '2025-11-20', lastSeen: '2026-03-28', type: 'edu' },
    { id: uuidv4(), source: 'https://gov agency.gov/report', target: 'https://openseo.io', anchorText: 'official website', domainAuthority: 92, pageAuthority: 78, isDoFollow: false, isNew: false, isLost: true, firstSeen: '2025-06-10', lastSeen: '2026-03-20', type: 'government' },
  ];
  
  sampleBacklinks.forEach(bl => backlinkStore.set(bl.id, bl));
  return sampleBacklinks;
}

seedData();

/**
 * GET /api/backlinks
 * List all backlinks with filtering
 */
router.get('/', (req, res) => {
  const { domain, type, status, minDA, maxDA, page = 1, limit = 50 } = req.query;
  
  let backlinks = Array.from(backlinkStore.values());
  
  if (domain) {
    backlinks = backlinks.filter(bl => bl.target.includes(domain) || bl.source.includes(domain));
  }
  if (type) {
    backlinks = backlinks.filter(bl => bl.type === type);
  }
  if (status === 'new') {
    backlinks = backlinks.filter(bl => bl.isNew);
  }
  if (status === 'lost') {
    backlinks = backlinks.filter(bl => bl.isLost);
  }
  if (minDA) {
    backlinks = backlinks.filter(bl => bl.domainAuthority >= parseInt(minDA));
  }
  if (maxDA) {
    backlinks = backlinks.filter(bl => bl.domainAuthority <= parseInt(maxDA));
  }
  
  const total = backlinks.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = backlinks.slice(start, start + parseInt(limit));
  
  res.json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    backlinks: paginated
  });
});

/**
 * GET /api/backlinks/summary
 * Get backlink summary for a domain
 */
router.get('/summary', (req, res) => {
  const { domain } = req.query;
  const backlinks = Array.from(backlinkStore.values());
  
  const totalBacklinks = backlinks.length;
  const newBacklinks = backlinks.filter(bl => bl.isNew).length;
  const lostBacklinks = backlinks.filter(bl => bl.isLost).length;
  const doFollowBacklinks = backlinks.filter(bl => bl.isDoFollow).length;
  const noFollowBacklinks = backlinks.filter(bl => !bl.isDoFollow).length;
  
  const totalDA = backlinks.reduce((sum, bl) => sum + bl.domainAuthority, 0);
  const avgDA = totalBacklinks > 0 ? Math.round(totalDA / totalBacklinks) : 0;
  
  const typeBreakdown = {};
  backlinks.forEach(bl => {
    typeBreakdown[bl.type] = (typeBreakdown[bl.type] || 0) + 1;
  });
  
  res.json({
    success: true,
    summary: {
      domain: domain || 'openseo.io',
      totalBacklinks,
      newBacklinks,
      lostBacklinks,
      doFollowBacklinks,
      noFollowBacklinks,
      averageDomainAuthority: avgDA,
      typeBreakdown
    }
  });
});

/**
 * GET /api/backlinks/anchors
 * Get anchor text distribution
 */
router.get('/anchors', (req, res) => {
  const backlinks = Array.from(backlinkStore.values());
  
  const anchorMap = {};
  backlinks.forEach(bl => {
    const anchor = bl.anchorText.toLowerCase();
    anchorMap[anchor] = (anchorMap[anchor] || 0) + 1;
  });
  
  const anchors = Object.entries(anchorMap)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({ success: true, anchors });
});

/**
 * POST /api/backlinks/discover
 * Discover new backlinks (crawler simulation)
 */
router.post('/discover', (req, res) => {
  const { target } = req.body;
  
  if (!target) {
    return res.status(400).json({ error: 'Target domain required' });
  }
  
  // Simulated discovery - in production would crawl web
  const discovered = [
    { id: uuidv4(), source: `https://newsite${Date.now()}.com/page`, target, anchorText: 'SEO tools', domainAuthority: 45, pageAuthority: 28, isDoFollow: true, isNew: true, isLost: false, firstSeen: new Date().toISOString().split('T')[0], lastSeen: new Date().toISOString().split('T')[0], type: 'blog' }
  ];
  
  discovered.forEach(bl => backlinkStore.set(bl.id, bl));
  
  res.json({ success: true, discovered, count: discovered.length });
});

/**
 * GET /api/backlinks/:id
 * Get single backlink details
 */
router.get('/:id', (req, res) => {
  const backlink = backlinkStore.get(req.params.id);
  
  if (!backlink) {
    return res.status(404).json({ error: 'Backlink not found' });
  }
  
  res.json({ success: true, backlink });
});

module.exports = router;

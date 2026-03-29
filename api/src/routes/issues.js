const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const issueStore = new Map();

router.get('/', (req, res) => {
  const { severity, type, page, limit = 50 } = req.query;
  let issues = Array.from(issueStore.values());
  
  if (severity) issues = issues.filter(i => i.severity === severity);
  if (type) issues = issues.filter(i => i.type === type);
  if (page) issues = issues.filter(i => i.page?.includes(page));
  
  issues = issues.sort((a, b) => {
    const severityOrder = { critical: 0, error: 1, warning: 2, info: 3 };
    return (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99);
  }).slice(0, parseInt(limit));
  
  res.json({ success: true, issues, total: issueStore.size });
});

router.get('/summary', (req, res) => {
  const issues = Array.from(issueStore.values());
  
  const summary = {
    total: issues.length,
    bySeverity: {
      critical: issues.filter(i => i.severity === 'critical').length,
      error: issues.filter(i => i.severity === 'error').length,
      warning: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length
    },
    byType: {
      brokenLink: issues.filter(i => i.type === 'broken-link').length,
      redirectChain: issues.filter(i => i.type === 'redirect-chain').length,
      missingMeta: issues.filter(i => i.type === 'missing-meta').length,
      schemaError: issues.filter(i => i.type === 'schema-error').length,
      duplicateContent: issues.filter(i => i.type === 'duplicate-content').length
    },
    topPages: getTopPages(issues, 5)
  };
  
  res.json({ success: true, summary });
});

router.get('/remediation', (req, res) => {
  const remediations = [
    {
      id: uuidv4(),
      type: 'broken-link',
      priority: 'high',
      description: 'Fix or remove broken internal links',
      estimatedEffort: '30 min',
      impact: 'User experience and SEO'
    },
    {
      id: uuidv4(),
      type: 'redirect-chain',
      priority: 'medium',
      description: 'Reduce redirect chains to single hop',
      estimatedEffort: '1 hour',
      impact: 'Page speed and crawl efficiency'
    },
    {
      id: uuidv4(),
      type: 'schema-error',
      priority: 'medium',
      description: 'Fix JSON-LD syntax errors in structured data',
      estimatedEffort: '15 min per page',
      impact: 'Rich snippets in search results'
    },
    {
      id: uuidv4(),
      type: 'missing-meta',
      priority: 'low',
      description: 'Add meta descriptions to pages missing them',
      estimatedEffort: '5 min per page',
      impact: 'Click-through rate in search results'
    }
  ];
  
  res.json({ success: true, remediations });
});

router.post('/', (req, res) => {
  const { issues } = req.body;
  if (!issues || !Array.isArray(issues)) return res.status(400).json({ error: 'Issues array required' });
  
  issues.forEach(issue => {
    const id = uuidv4();
    issueStore.set(id, { id, ...issue, createdAt: new Date().toISOString() });
  });
  
  res.json({ success: true, added: issues.length, total: issueStore.size });
});

function getTopPages(issues, limit) {
  const pageCounts = {};
  issues.forEach(i => {
    if (i.page) {
      pageCounts[i.page] = (pageCounts[i.page] || 0) + 1;
    }
  });
  
  return Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([page, count]) => ({ page, issues: count }));
}

module.exports = router;

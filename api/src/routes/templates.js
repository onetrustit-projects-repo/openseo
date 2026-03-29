const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory template store
const templatesStore = new Map([
  ['tpl_seo_summary', {
    id: 'tpl_seo_summary',
    name: 'SEO Summary Report',
    description: 'Overview of key SEO metrics and recommendations',
    sections: ['executive_summary', 'keyword_performance', 'technical_issues', 'backlinks', 'recommendations'],
    createdAt: new Date().toISOString()
  }],
  ['tpl_technical_audit', {
    id: 'tpl_technical_audit',
    name: 'Technical Audit Report',
    description: 'Deep dive into technical SEO issues',
    sections: ['site_speed', 'crawlability', 'indexability', 'schema_markup', 'mobile_usability'],
    createdAt: new Date().toISOString()
  }],
  ['tpl_keyword_tracker', {
    id: 'tpl_keyword_tracker',
    name: 'Keyword Tracking Report',
    description: 'Keyword ranking changes and trends',
    sections: ['keyword_overview', 'ranking_changes', 'serp_features', 'competitor_analysis'],
    createdAt: new Date().toISOString()
  }]
]);

/**
 * GET /api/templates
 * List all report templates
 */
router.get('/', (req, res) => {
  const templates = Array.from(templatesStore.values());
  res.json({ success: true, templates, total: templates.length });
});

/**
 * GET /api/templates/:id
 * Get template by ID
 */
router.get('/:id', (req, res) => {
  const template = templatesStore.get(req.params.id);
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  res.json({ success: true, template });
});

/**
 * POST /api/templates
 * Create custom template
 */
router.post('/', (req, res) => {
  const { name, description, sections } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  
  const template = {
    id: 'tpl_' + uuidv4().slice(0, 8),
    name,
    description: description || '',
    sections: sections || [],
    createdAt: new Date().toISOString()
  };
  
  templatesStore.set(template.id, template);
  
  res.status(201).json({ success: true, template });
});

/**
 * PUT /api/templates/:id
 * Update template
 */
router.put('/:id', (req, res) => {
  const template = templatesStore.get(req.params.id);
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  const { name, description, sections } = req.body;
  
  if (name) template.name = name;
  if (description) template.description = description;
  if (sections) template.sections = sections;
  
  templatesStore.set(template.id, template);
  
  res.json({ success: true, template });
});

/**
 * DELETE /api/templates/:id
 * Delete template
 */
router.delete('/:id', (req, res) => {
  if (!templatesStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Don't allow deleting built-in templates
  if (req.params.id.startsWith('tpl_seo') || req.params.id.startsWith('tpl_technical') || req.params.id.startsWith('tpl_keyword')) {
    return res.status(400).json({ error: 'Cannot delete built-in templates' });
  }
  
  templatesStore.delete(req.params.id);
  res.json({ success: true, message: 'Template deleted' });
});

/**
 * GET /api/templates/:id/preview
 * Preview template structure
 */
router.get('/:id/preview', (req, res) => {
  const template = templatesStore.get(req.params.id);
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  const preview = {
    id: template.id,
    name: template.name,
    description: template.description,
    sections: template.sections.map(section => ({
      id: section,
      label: formatSectionLabel(section),
      preview: getSectionPreview(section)
    })),
    estimatedPages: template.sections.length
  };
  
  res.json({ success: true, preview });
});

function formatSectionLabel(section) {
  return section.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getSectionPreview(section) {
  const previews = {
    executive_summary: 'High-level metrics overview with KPIs',
    keyword_performance: 'Top keywords and ranking changes',
    technical_issues: 'Site crawl findings and errors',
    backlinks: 'Backlink profile analysis',
    recommendations: 'Prioritized action items',
    site_speed: 'Page load time metrics',
    crawlability: ' robots.txt and sitemap analysis',
    indexability: 'Index coverage report',
    schema_markup: 'Structured data validation',
    mobile_usability: 'Mobile-friendly test results',
    ranking_changes: 'Position movements over time',
    serp_features: 'SERP feature tracking',
    competitor_analysis: 'Competitor comparison data'
  };
  return previews[section] || 'Report section';
}

module.exports = router;

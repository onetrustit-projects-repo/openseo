const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory sitemap store
const sitemapStore = new Map();

/**
 * GET /api/sitemap/:domain
 * Get sitemap configuration for domain
 */
router.get('/:domain', (req, res) => {
  const { domain } = req.params;
  
  let config = sitemapStore.get(domain);
  if (!config) {
    config = {
      domain,
      pages: [],
      settings: {
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
      }
    };
  }
  
  res.json({ success: true, data: config });
});

/**
 * POST /api/sitemap/generate
 * Generate sitemap XML
 */
router.post('/generate', (req, res) => {
  const { domain, pages, settings } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain required' });
  }
  
  const config = sitemapStore.get(domain) || { domain, pages: [], settings: {} };
  config.pages = pages || config.pages || [];
  config.settings = { ...config.settings, ...settings };
  sitemapStore.set(domain, config);
  
  // Generate XML
  const xml = generateSitemapXml(domain, config.pages, config.settings);
  
  res.json({
    success: true,
    data: {
      domain,
      pageCount: config.pages.length,
      xml,
      generatedAt: new Date().toISOString()
    }
  });
});

/**
 * POST /api/sitemap/pages
 * Add pages to sitemap
 */
router.post('/pages', (req, res) => {
  const { domain, pages } = req.body;
  
  if (!domain || !pages || !Array.isArray(pages)) {
    return res.status(400).json({ error: 'Domain and pages array required' });
  }
  
  const config = sitemapStore.get(domain) || { domain, pages: [], settings: {} };
  
  const newPages = pages.map(page => ({
    id: uuidv4(),
    url: page.url,
    priority: page.priority || '0.7',
    changefreq: page.changefreq || 'weekly',
    lastmod: page.lastmod || new Date().toISOString().split('T')[0],
    section: page.section || 'general'
  }));
  
  config.pages.push(...newPages);
  sitemapStore.set(domain, config);
  
  res.json({
    success: true,
    added: newPages.length,
    total: config.pages.length
  });
});

/**
 * PUT /api/sitemap/pages/:pageId
 * Update a page in sitemap
 */
router.put('/pages/:pageId', (req, res) => {
  const { domain } = req.body;
  const { pageId } = req.params;
  const { priority, changefreq, lastmod, section } = req.body;
  
  const config = sitemapStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Domain sitemap not found' });
  }
  
  const page = config.pages.find(p => p.id === pageId);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  if (priority !== undefined) page.priority = priority;
  if (changefreq !== undefined) page.changefreq = changefreq;
  if (lastmod !== undefined) page.lastmod = lastmod;
  if (section !== undefined) page.section = section;
  
  sitemapStore.set(domain, config);
  
  res.json({ success: true, page });
});

/**
 * DELETE /api/sitemap/pages/:pageId
 * Remove page from sitemap
 */
router.delete('/pages/:pageId', (req, res) => {
  const { domain } = req.query;
  const { pageId } = req.params;
  
  const config = sitemapStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Domain sitemap not found' });
  }
  
  const index = config.pages.findIndex(p => p.id === pageId);
  if (index === -1) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  config.pages.splice(index, 1);
  sitemapStore.set(domain, config);
  
  res.json({ success: true, remaining: config.pages.length });
});

/**
 * POST /api/sitemap/sections
 * Add sitemap section with prioritization
 */
router.post('/sections', (req, res) => {
  const { domain, section, pages } = req.body;
  
  if (!domain || !section) {
    return res.status(400).json({ error: 'Domain and section required' });
  }
  
  const config = sitemapStore.get(domain) || { domain, pages: [], settings: {} };
  
  const sectionPages = (pages || []).map(page => ({
    id: uuidv4(),
    url: page.url,
    priority: page.priority || '0.8',
    changefreq: page.changefreq || 'daily',
    lastmod: page.lastmod || new Date().toISOString().split('T')[0],
    section
  }));
  
  config.pages.push(...sectionPages);
  sitemapStore.set(domain, config);
  
  res.json({
    success: true,
    section,
    added: sectionPages.length
  });
});

/**
 * GET /api/sitemap/preview/:domain
 * Preview sitemap XML before generation
 */
router.get('/preview/:domain', (req, res) => {
  const { domain } = req.params;
  
  const config = sitemapStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Sitemap not found' });
  }
  
  const xml = generateSitemapXml(domain, config.pages, config.settings);
  
  res.json({
    success: true,
    data: {
      domain,
      pageCount: config.pages.length,
      xml,
      preview: xml.substring(0, 2000)
    }
  });
});

/**
 * POST /api/sitemap/validate
 * Validate sitemap URLs
 */
router.post('/validate', (req, res) => {
  const { pages } = req.body;
  
  if (!pages || !Array.isArray(pages)) {
    return res.status(400).json({ error: 'Pages array required' });
  }
  
  const results = pages.map(page => {
    const issues = [];
    
    // Check URL format
    if (!page.url) {
      issues.push('Missing URL');
    } else {
      try {
        const url = new URL(page.url);
        if (!['http:', 'https:'].includes(url.protocol)) {
          issues.push('Invalid protocol - must be http or https');
        }
      } catch (e) {
        issues.push('Invalid URL format');
      }
    }
    
    // Check priority
    if (page.priority !== undefined) {
      const p = parseFloat(page.priority);
      if (isNaN(p) || p < 0 || p > 1) {
        issues.push('Priority must be between 0 and 1');
      }
    }
    
    // Check changefreq
    const validChangefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (page.changefreq && !validChangefreq.includes(page.changefreq)) {
      issues.push(`Invalid changefreq. Must be one of: ${validChangefreq.join(', ')}`);
    }
    
    return {
      url: page.url,
      valid: issues.length === 0,
      issues
    };
  });
  
  const validCount = results.filter(r => r.valid).length;
  
  res.json({
    success: true,
    data: {
      total: pages.length,
      valid: validCount,
      invalid: pages.length - validCount,
      results
    }
  });
});

function generateSitemapXml(domain, pages, settings) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const page of pages) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(page.url)}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq || settings?.changefreq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${page.priority || settings?.priority || '0.7'}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  return xml;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = router;

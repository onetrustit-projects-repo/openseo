const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory robots store
const robotsStore = new Map();

/**
 * GET /api/robots/:domain
 * Get robots.txt configuration
 */
router.get('/:domain', (req, res) => {
  const { domain } = req.params;
  
  let config = robotsStore.get(domain);
  if (!config) {
    config = {
      domain,
      rules: [
        { userAgent: '*', allow: ['/'], disallow: [] }
      ],
      crawlDelay: null,
      sitemap: `https://${domain}/sitemap.xml`
    };
  }
  
  res.json({ success: true, data: config });
});

/**
 * POST /api/robots/generate
 * Generate robots.txt content
 */
router.post('/generate', (req, res) => {
  const { domain, rules, crawlDelay, sitemap } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain required' });
  }
  
  const config = {
    domain,
    rules: rules || [{ userAgent: '*', allow: ['/'], disallow: [] }],
    crawlDelay: crawlDelay || null,
    sitemap: sitemap || `https://${domain}/sitemap.xml`
  };
  
  robotsStore.set(domain, config);
  
  const txt = generateRobotsTxt(config);
  
  res.json({
    success: true,
    data: {
      domain,
      txt,
      ruleCount: config.rules.length,
      generatedAt: new Date().toISOString()
    }
  });
});

/**
 * POST /api/robots/rules
 * Add rule to robots.txt
 */
router.post('/rules', (req, res) => {
  const { domain, userAgent, allow, disallow, crawlDelay } = req.body;
  
  if (!domain || !userAgent) {
    return res.status(400).json({ error: 'Domain and userAgent required' });
  }
  
  let config = robotsStore.get(domain);
  if (!config) {
    config = {
      domain,
      rules: [],
      crawlDelay: null,
      sitemap: `https://${domain}/sitemap.xml`
    };
  }
  
  const rule = {
    id: uuidv4(),
    userAgent,
    allow: allow || [],
    disallow: disallow || []
  };
  
  config.rules.push(rule);
  if (crawlDelay !== undefined) config.crawlDelay = crawlDelay;
  
  robotsStore.set(domain, config);
  
  res.json({ success: true, rule });
});

/**
 * DELETE /api/robots/rules/:ruleId
 * Remove rule from robots.txt
 */
router.delete('/rules/:ruleId', (req, res) => {
  const { domain } = req.query;
  const { ruleId } = req.params;
  
  const config = robotsStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Robots config not found' });
  }
  
  const index = config.rules.findIndex(r => r.id === ruleId);
  if (index === -1) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  config.rules.splice(index, 1);
  robotsStore.set(domain, config);
  
  res.json({ success: true, remaining: config.rules.length });
});

/**
 * PUT /api/robots/rules/:ruleId
 * Update rule
 */
router.put('/rules/:ruleId', (req, res) => {
  const { domain } = req.body;
  const { ruleId } = req.params;
  const { userAgent, allow, disallow, crawlDelay } = req.body;
  
  const config = robotsStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Robots config not found' });
  }
  
  const rule = config.rules.find(r => r.id === ruleId);
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  if (userAgent !== undefined) rule.userAgent = userAgent;
  if (allow !== undefined) rule.allow = allow;
  if (disallow !== undefined) rule.disallow = disallow;
  
  robotsStore.set(domain, config);
  
  res.json({ success: true, rule });
});

/**
 * POST /api/robots/validate
 * Validate robots.txt syntax
 */
router.post('/validate', (req, res) => {
  const { rules, crawlDelay } = req.body;
  
  if (!rules || !Array.isArray(rules)) {
    return res.status(400).json({ error: 'Rules array required' });
  }
  
  const issues = [];
  
  rules.forEach((rule, i) => {
    if (!rule.userAgent) {
      issues.push({ rule: i, issue: 'Missing user-agent' });
    }
    
    if (rule.allow && !Array.isArray(rule.allow)) {
      issues.push({ rule: i, issue: 'Allow must be an array' });
    }
    
    if (rule.disallow && !Array.isArray(rule.disallow)) {
      issues.push({ rule: i, issue: 'Disallow must be an array' });
    }
    
    // Validate paths
    (rule.allow || []).forEach(path => {
      if (!path.startsWith('/')) {
        issues.push({ rule: i, issue: `Allow path must start with /: ${path}` });
      }
    });
    
    (rule.disallow || []).forEach(path => {
      if (!path.startsWith('/')) {
        issues.push({ rule: i, issue: `Disallow path must start with /: ${path}` });
      }
    });
  });
  
  if (crawlDelay !== undefined && crawlDelay !== null) {
    if (typeof crawlDelay !== 'number' || crawlDelay < 0) {
      issues.push({ issue: 'Crawl-delay must be a non-negative number' });
    }
  }
  
  res.json({
    success: true,
    data: {
      valid: issues.length === 0,
      issues,
      validRules: rules.length - issues.filter(i => i.rule !== undefined).length
    }
  });
});

/**
 * POST /api/robots/preview
 * Preview how search engines interpret rules
 */
router.post('/preview', (req, res) => {
  const { domain, userAgent } = req.body;
  
  const config = robotsStore.get(domain);
  if (!config) {
    return res.status(404).json({ error: 'Robots config not found' });
  }
  
  const ua = userAgent || '*';
  const matchingRule = config.rules.find(r => 
    r.userAgent === ua || r.userAgent === '*'
  );
  
  const testPaths = [
    '/',
    '/about',
    '/admin',
    '/api',
    '/sitemap.xml',
    '/wp-admin',
    '/login',
    '/private-page'
  ];
  
  const interpretations = testPaths.map(path => {
    const allowed = checkPathAllowed(path, matchingRule);
    return {
      path,
      allowed,
      reason: allowed ? 'Allowed by rule' : 'Disallowed by rule',
      matchedRule: matchingRule ? matchingRule.userAgent : 'None'
    };
  });
  
  res.json({
    success: true,
    data: {
      domain,
      userAgent: ua,
      matchingRule: matchingRule?.userAgent || 'None',
      crawlDelay: config.crawlDelay,
      interpretations
    }
  });
});

/**
 * GET /api/robots/templates
 * Get common robots.txt templates
 */
router.get('/templates/list', (req, res) => {
  const templates = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Allow all crawlers access to everything',
      rules: [{ userAgent: '*', allow: ['/'], disallow: [] }]
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Block wp-admin, wp-login, and common WordPress paths',
      rules: [
        { userAgent: '*', allow: ['/'], disallow: ['/wp-admin/', '/wp-login.php', '/wp-content/plugins/', '/wp-content/cache/'] }
      ]
    },
    {
      id: 'strict',
      name: 'Strict',
      description: 'Block common admin and API paths',
      rules: [
        { userAgent: '*', allow: ['/'], disallow: ['/admin/', '/api/', '/private/', '/wp-admin/'] }
      ]
    },
    {
      id: 'googlebot',
      name: 'Googlebot Only',
      description: 'Allow only Googlebot, block others',
      rules: [
        { userAgent: 'Googlebot', allow: ['/'], disallow: [] },
        { userAgent: '*', allow: [], disallow: ['/'] }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Block checkout, cart, and account pages',
      rules: [
        { userAgent: '*', allow: ['/'], disallow: ['/cart/', '/checkout/', '/account/', '/orders/'] }
      ]
    }
  ];
  
  res.json({ success: true, templates });
});

function generateRobotsTxt(config) {
  let txt = '';
  
  // Add rules
  config.rules.forEach(rule => {
    txt += `User-agent: ${rule.userAgent}\n`;
    
    rule.allow.forEach(path => {
      txt += `Allow: ${path}\n`;
    });
    
    rule.disallow.forEach(path => {
      txt += `Disallow: ${path}\n`;
    });
    
    txt += '\n';
  });
  
  // Add crawl delay if set
  if (config.crawlDelay) {
    txt += `Crawl-delay: ${config.crawlDelay}\n\n`;
  }
  
  // Add sitemap
  if (config.sitemap) {
    txt += `Sitemap: ${config.sitemap}\n`;
  }
  
  return txt;
}

function checkPathAllowed(path, rule) {
  if (!rule) return true;
  
  // Check disallow first
  for (const pattern of (rule.disallow || [])) {
    if (matchPattern(path, pattern)) {
      return false;
    }
  }
  
  // Then check allow
  for (const pattern of (rule.allow || [])) {
    if (matchPattern(path, pattern)) {
      return true;
    }
  }
  
  // Default allow if no explicit allow
  return true;
}

function matchPattern(path, pattern) {
  // Simple wildcard matching
  if (pattern === '*') return true;
  
  const regex = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  
  return new RegExp('^' + regex).test(path);
}

module.exports = router;

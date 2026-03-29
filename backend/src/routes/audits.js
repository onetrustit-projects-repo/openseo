const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// GET /api/audits - Site audit
router.get('/', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, error: 'Query parameter "url" required' });
    }

    // Perform basic site audit
    const audit = await performSiteAudit(url);
    
    res.json({
      success: true,
      data: {
        url,
        timestamp: new Date().toISOString(),
        score: audit.score,
        issues: audit.issues,
        metrics: audit.metrics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function performSiteAudit(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenSEO/1.0)',
        'Accept': 'text/html'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const html = response.data;
    
    // Basic SEO checks
    const issues = [];
    const metrics = {};

    // Title check
    const title = $('title').text();
    metrics.title = title;
    metrics.titleLength = title.length;
    if (title.length < 30 || title.length > 60) {
      issues.push({ type: 'warning', message: `Title length is ${title.length} characters (optimal: 50-60)` });
    }

    // Meta description
    const description = $('meta[name="description"]').attr('content') || '';
    metrics.description = description;
    metrics.descriptionLength = description.length;
    if (description.length < 120 || description.length > 160) {
      issues.push({ type: 'warning', message: 'Meta description length not optimal (120-160 chars recommended)' });
    }

    // Heading structure
    const h1s = $('h1').length;
    metrics.h1Count = h1s;
    if (h1s === 0) {
      issues.push({ type: 'error', message: 'No H1 heading found' });
    } else if (h1s > 1) {
      issues.push({ type: 'warning', message: `Multiple H1 headings found (${h1s})` });
    }

    // Image alt attributes
    const imagesWithoutAlt = $('img:not([alt])').length;
    metrics.imagesWithoutAlt = imagesWithoutAlt;
    if (imagesWithoutAlt > 0) {
      issues.push({ type: 'warning', message: `${imagesWithoutAlt} images missing alt attributes` });
    }

    // Links
    const internalLinks = $('a[href^="/"], a[href^="${url}"]').length;
    const externalLinks = $('a[href^="http"]').length;
    metrics.internalLinks = internalLinks;
    metrics.externalLinks = externalLinks;

    // Page size
    metrics.pageSize = Math.round(html.length / 1024);

    // Calculate score
    let score = 100;
    score -= issues.filter(i => i.type === 'error').length * 20;
    score -= issues.filter(i => i.type === 'warning').length * 5;
    score = Math.max(0, Math.min(100, score));

    return { score, issues, metrics };
  } catch (err) {
    return {
      score: 0,
      issues: [{ type: 'error', message: `Failed to fetch URL: ${err.message}` }],
      metrics: {}
    };
  }
}

// GET /api/audits/history - Audit history
router.get('/history', (req, res) => {
  // Generate mock audit history
  const history = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    return {
      date: date.toISOString(),
      score: Math.round(Math.random() * 30 + 70),
      issues: Math.round(Math.random() * 10)
    };
  });

  res.json({ success: true, data: history });
});

module.exports = router;

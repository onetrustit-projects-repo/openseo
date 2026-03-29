const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory batch store
const batchStore = new Map();

/**
 * POST /api/batch/generate
 * Batch generate schemas
 */
router.post('/generate', (req, res) => {
  const { type, items } = req.body;
  
  if (!type || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Type and items array required' });
  }
  
  const results = items.map((item, index) => {
    try {
      let schema;
      
      switch (type) {
        case 'Product':
          schema = generateProductSchema(item);
          break;
        case 'FAQ':
          schema = generateFAQSchema(item);
          break;
        case 'Article':
          schema = generateArticleSchema(item);
          break;
        default:
          return { index, success: false, error: 'Unsupported type' };
      }
      
      return { index, success: true, schema };
    } catch (e) {
      return { index, success: false, error: e.message };
    }
  });
  
  const batchId = uuidv4();
  batchStore.set(batchId, {
    id: batchId,
    type,
    itemCount: items.length,
    successCount: results.filter(r => r.success).length,
    results,
    createdAt: new Date().toISOString()
  });
  
  res.json({
    success: true,
    batchId,
    total: items.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  });
});

/**
 * POST /api/batch/validate
 * Batch validate schemas
 */
router.post('/validate', (req, res) => {
  const { schemas } = req.body;
  
  if (!schemas || !Array.isArray(schemas)) {
    return res.status(400).json({ error: 'Schemas array required' });
  }
  
  const results = schemas.map((schema, index) => {
    const validation = validateSchema(schema);
    return { index, ...validation };
  });
  
  res.json({
    success: true,
    total: schemas.length,
    valid: results.filter(r => r.valid).length,
    invalid: results.filter(r => !r.valid).length,
    results
  });
});

/**
 * GET /api/batch/:id
 * Get batch result
 */
router.get('/:id', (req, res) => {
  const batch = batchStore.get(req.params.id);
  
  if (!batch) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  
  res.json({ success: true, batch });
});

/**
 * POST /api/batch/export
 * Export batch results
 */
router.post('/export', (req, res) => {
  const { batchId, format = 'json' } = req.body;
  
  if (!batchId) {
    return res.status(400).json({ error: 'batchId required' });
  }
  
  const batch = batchStore.get(batchId);
  if (!batch) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  
  if (format === 'html') {
    const html = generateHtmlExport(batch);
    res.json({ success: true, format: 'html', content: html });
  } else {
    res.json({ success: true, format: 'json', content: batch.results });
  }
});

function generateProductSchema(item) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name || item.title || '',
    description: item.description || '',
    sku: item.sku || item.id || '',
    brand: item.brand ? { '@type': 'Brand', name: item.brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: item.price || '0',
      priceCurrency: item.currency || item.priceCurrency || 'USD',
      availability: item.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };
}

function generateFAQSchema(item) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (item.questions || []).map(q => ({
      '@type': 'Question',
      name: q.question || q.title || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer || q.response || ''
      }
    }))
  };
}

function generateArticleSchema(item) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.headline || item.title || '',
    description: item.description || '',
    datePublished: item.datePublished || item.date || new Date().toISOString().split('T')[0],
    author: item.author ? { '@type': 'Person', name: item.author } : undefined
  };
}

function validateSchema(schema) {
  const errors = [];
  
  if (!schema['@context']) {
    errors.push('Missing @context');
  }
  if (!schema['@type']) {
    errors.push('Missing @type');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function generateHtmlExport(batch) {
  let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Schema Export</title>\n';
  html += '<style>body{font-family:system-ui;padding:20px;}pre{background:#f4f4f4;padding:10px;}</style>\n';
  html += '</head>\n<body>\n<h1>Schema Export</h1>\n';
  html += `<p>Type: ${batch.type} | Total: ${batch.itemCount} | Successful: ${batch.successCount}</p>\n`;
  
  batch.results.forEach((result, i) => {
    if (result.success) {
      html += `<h2>Item ${i + 1}</h2>\n<pre>${JSON.stringify(result.schema, null, 2)}</pre>\n`;
    } else {
      html += `<h2>Item ${i + 1}</h2><p style="color:red;">Error: ${result.error}</p>\n`;
    }
  });
  
  html += '</body>\n</html>';
  return html;
}

module.exports = router;

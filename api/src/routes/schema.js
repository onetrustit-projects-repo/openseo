const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

/**
 * @swagger
 * /api/schema/validate:
 *   post:
 *     summary: Validate structured data/schema markup
 *     tags: [Schema]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/validate', authenticateApiKey, (req, res) => {
  const { url, schema, content } = req.body;
  
  if (!url && !schema && !content) {
    return res.status(400).json({ error: 'URL, schema, or content required' });
  }
  
  const validation = {
    isValid: true,
    format: schema ? 'json-ld' : 'url',
    schemas: [],
    errors: [],
    warnings: []
  };
  
  if (url) {
    validation.schemas.push({
      type: 'Article',
      detected: true,
      properties: {
        headline: 'Detected',
        datePublished: 'Detected',
        author: 'Detected'
      }
    });
  }
  
  if (schema) {
    try {
      JSON.parse(schema);
      validation.schemas.push({
        type: 'Custom',
        detected: true,
        raw: schema
      });
    } catch (e) {
      validation.isValid = false;
      validation.errors.push({ message: 'Invalid JSON-LD format', line: 1 });
    }
  }
  
  res.json({ success: true, validation });
});

/**
 * @swagger
 * /api/schema/generate:
 *   post:
 *     summary: Generate schema markup
 *     tags: [Schema]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/generate', authenticateApiKey, (req, res) => {
  const { type, data } = req.body;
  
  if (!type || !data) {
    return res.status(400).json({ error: 'Type and data required' });
  }
  
  const schemaTemplates = {
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title || 'Article Title',
      datePublished: data.date || new Date().toISOString(),
      author: { '@type': 'Person', name: data.author || 'Author' },
      publisher: { '@type': 'Organization', name: data.publisher || 'Publisher' }
    },
    Product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name || 'Product Name',
      description: data.description || '',
      offers: {
        '@type': 'Offer',
        price: data.price || '0.00',
        priceCurrency: data.currency || 'USD'
      }
    },
    LocalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address || '',
        addressLocality: data.city || '',
        addressRegion: data.state || '',
        postalCode: data.zip || ''
      },
      telephone: data.phone || ''
    }
  };
  
  const schema = schemaTemplates[type] || schemaTemplates.Article;
  res.json({ success: true, schema, format: 'json-ld' });
});

/**
 * @swagger
 * /api/schema/test:
 *   post:
 *     summary: Test schema markup
 *     tags: [Schema]
 *     security:
 *       - ApiKeyAuth: []
 */
router.post('/test', authenticateApiKey, (req, res) => {
  const { schema } = req.body;
  
  const testResult = {
    valid: true,
    parsed: null,
    errors: [],
    warnings: []
  };
  
  try {
    testResult.parsed = JSON.parse(schema);
  } catch (e) {
    testResult.valid = false;
    testResult.errors.push({ message: e.message, line: 1 });
  }
  
  res.json({ success: true, test: testResult });
});

module.exports = router;

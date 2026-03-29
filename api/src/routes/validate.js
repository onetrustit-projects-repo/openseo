const express = require('express');
const router = express.Router();

/**
 * POST /api/validate/schema
 * Validate schema markup
 */
router.post('/schema', (req, res) => {
  const { schema, url } = req.body;
  
  if (!schema) {
    return res.status(400).json({ error: 'Schema required' });
  }
  
  const errors = [];
  const warnings = [];
  const suggestions = [];
  
  // Parse schema if string
  let parsedSchema;
  if (typeof schema === 'string') {
    try {
      parsedSchema = JSON.parse(schema);
    } catch (e) {
      return res.status(400).json({
        success: false,
        valid: false,
        errors: [{ message: 'Invalid JSON: ' + e.message, line: 1 }]
      });
    }
  } else {
    parsedSchema = schema;
  }
  
  // Validate @context
  if (!parsedSchema['@context']) {
    errors.push({ path: '@context', message: 'Missing @context. Should be https://schema.org' });
  } else if (parsedSchema['@context'] !== 'https://schema.org') {
    errors.push({ path: '@context', message: '@context should be https://schema.org' });
  }
  
  // Validate @type
  if (!parsedSchema['@type']) {
    errors.push({ path: '@type', message: 'Missing @type' });
  }
  
  // Validate based on schema type
  const type = parsedSchema['@type'];
  
  if (type === 'Article' || type === 'NewsArticle' || type === 'BlogPosting') {
    validateArticle(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'Product') {
    validateProduct(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'FAQPage') {
    validateFAQ(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'HowTo') {
    validateHowTo(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'LocalBusiness') {
    validateLocalBusiness(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'Event') {
    validateEvent(parsedSchema, errors, warnings, suggestions);
  } else if (type === 'Organization') {
    validateOrganization(parsedSchema, errors, warnings, suggestions);
  }
  
  // Check for deprecated properties
  checkDeprecations(parsedSchema, warnings);
  
  const valid = errors.length === 0;
  
  res.json({
    success: true,
    valid,
    errors,
    warnings,
    suggestions,
    parsed: parsedSchema
  });
});

/**
 * POST /api/validate/url
 * Validate schema from URL
 */
router.post('/url', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  // In production, fetch and parse the URL
  // For demo, return mock validation result
  res.json({
    success: true,
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [
      { message: 'Consider adding image for better rich results', priority: 'medium' }
    ],
    foundSchemas: ['Article', 'Organization']
  });
});

/**
 * POST /api/validate/microdata
 * Validate microdata
 */
router.post('/microdata', (req, res) => {
  const { html } = req.body;
  
  if (!html) {
    return res.status(400).json({ error: 'HTML content required' });
  }
  
  res.json({
    success: true,
    valid: true,
    foundSchemas: ['Article'],
    errors: [],
    warnings: []
  });
});

function validateArticle(schema, errors, warnings, suggestions) {
  if (!schema.headline) {
    errors.push({ path: 'headline', message: 'Article needs headline' });
  }
  if (!schema.datePublished) {
    warnings.push({ path: 'datePublished', message: 'Consider adding datePublished for better ranking' });
  }
  if (!schema.author) {
    warnings.push({ path: 'author', message: 'Author is recommended for articles' });
  }
  if (!schema.image) {
    suggestions.push({ path: 'image', message: 'Add image for better rich results' });
  }
}

function validateProduct(schema, errors, warnings, suggestions) {
  if (!schema.name) {
    errors.push({ path: 'name', message: 'Product needs name' });
  }
  if (!schema.offers) {
    errors.push({ path: 'offers', message: 'Product needs offers with price' });
  }
  if (schema.offers && !schema.offers.price) {
    errors.push({ path: 'offers.price', message: 'Offer must have price' });
  }
  if (!schema.image) {
    suggestions.push({ path: 'image', message: 'Products with images have higher conversion' });
  }
}

function validateFAQ(schema, errors, warnings, suggestions) {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push({ path: 'mainEntity', message: 'FAQ needs mainEntity array' });
  } else if (schema.mainEntity.length === 0) {
    errors.push({ path: 'mainEntity', message: 'FAQ needs at least one question' });
  }
  
  schema.mainEntity?.forEach((q, i) => {
    if (!q.name) {
      errors.push({ path: `mainEntity[${i}].name`, message: 'Question needs name/question text' });
    }
    if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
      errors.push({ path: `mainEntity[${i}].acceptedAnswer`, message: 'Question needs acceptedAnswer with text' });
    }
  });
}

function validateHowTo(schema, errors, warnings, suggestions) {
  if (!schema.name) {
    errors.push({ path: 'name', message: 'HowTo needs name' });
  }
  if (!schema.step || !Array.isArray(schema.step)) {
    errors.push({ path: 'step', message: 'HowTo needs step array' });
  } else if (schema.step.length < 2) {
    warnings.push({ path: 'step', message: 'HowTo with more steps performs better' });
  }
}

function validateLocalBusiness(schema, errors, warnings, suggestions) {
  if (!schema.name) {
    errors.push({ path: 'name', message: 'LocalBusiness needs name' });
  }
  if (!schema.address) {
    errors.push({ path: 'address', message: 'LocalBusiness needs address' });
  }
  if (schema.address && !schema.address.streetAddress && !schema.address.addressLocality) {
    errors.push({ path: 'address', message: 'Address needs street or city' });
  }
  if (!schema.telephone) {
    suggestions.push({ path: 'telephone', message: 'Add phone number for local SEO' });
  }
}

function validateEvent(schema, errors, warnings, suggestions) {
  if (!schema.name) {
    errors.push({ path: 'name', message: 'Event needs name' });
  }
  if (!schema.startDate) {
    errors.push({ path: 'startDate', message: 'Event needs startDate' });
  }
  if (!schema.location) {
    warnings.push({ path: 'location', message: 'Event location recommended' });
  }
}

function validateOrganization(schema, errors, warnings, suggestions) {
  if (!schema.name) {
    errors.push({ path: 'name', message: 'Organization needs name' });
  }
  if (!schema.url) {
    suggestions.push({ path: 'url', message: 'Add URL for better recognition' });
  }
}

function checkDeprecations(schema, warnings) {
  // Check for deprecated properties
  if (schema.producer) {
    warnings.push({ path: 'producer', message: 'producer is deprecated, use publisher instead' });
  }
  if (schema.datePublished === schema.dateCreated) {
    warnings.push({ path: 'dateCreated', message: 'dateCreated may be confused with datePublished' });
  }
}

module.exports = router;

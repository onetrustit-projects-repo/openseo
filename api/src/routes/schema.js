const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory schema store
const schemaStore = new Map();

/**
 * GET /api/schema/types
 * List available schema types
 */
router.get('/types', (req, res) => {
  const types = [
    { id: 'Article', name: 'Article', description: 'News articles, blog posts' },
    { id: 'Product', name: 'Product', description: 'E-commerce products' },
    { id: 'FAQPage', name: 'FAQ', description: 'Frequently asked questions' },
    { id: 'HowTo', name: 'How-To', description: 'Step-by-step guides' },
    { id: 'LocalBusiness', name: 'Local Business', description: 'Local business information' },
    { id: 'Event', name: 'Event', description: 'Events and gatherings' },
    { id: 'Organization', name: 'Organization', description: 'Companies and organizations' }
  ];
  
  res.json({ success: true, types });
});

/**
 * POST /api/schema/generate
 * Generate schema markup
 */
router.post('/generate', (req, res) => {
  const { type, data } = req.body;
  
  if (!type || !data) {
    return res.status(400).json({ error: 'Type and data required' });
  }
  
  let schema;
  
  switch (type) {
    case 'Article':
      schema = generateArticle(data);
      break;
    case 'Product':
      schema = generateProduct(data);
      break;
    case 'FAQPage':
      schema = generateFAQ(data);
      break;
    case 'HowTo':
      schema = generateHowTo(data);
      break;
    case 'LocalBusiness':
      schema = generateLocalBusiness(data);
      break;
    case 'Event':
      schema = generateEvent(data);
      break;
    case 'Organization':
      schema = generateOrganization(data);
      break;
    default:
      return res.status(400).json({ error: 'Unknown schema type' });
  }
  
  // Store in history
  const schemaId = uuidv4();
  schemaStore.set(schemaId, { id: schemaId, type, data, schema, createdAt: new Date().toISOString() });
  
  res.json({ success: true, schema, id: schemaId });
});

/**
 * GET /api/schema/saved
 * List saved schemas
 */
router.get('/saved', (req, res) => {
  const schemas = Array.from(schemaStore.values()).map(s => ({
    id: s.id,
    type: s.type,
    name: s.data?.name || s.data?.headline || 'Untitled',
    createdAt: s.createdAt
  }));
  
  res.json({ success: true, schemas, total: schemas.length });
});

/**
 * GET /api/schema/:id
 * Get saved schema
 */
router.get('/:id', (req, res) => {
  const schema = schemaStore.get(req.params.id);
  
  if (!schema) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  
  res.json({ success: true, schema });
});

/**
 * DELETE /api/schema/:id
 * Delete saved schema
 */
router.delete('/:id', (req, res) => {
  if (!schemaStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  
  schemaStore.delete(req.params.id);
  res.json({ success: true, message: 'Schema deleted' });
});

function generateArticle(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline || data.title || '',
    description: data.description || '',
    author: data.author ? { '@type': 'Person', name: data.author } : undefined,
    datePublished: data.datePublished || data.date || new Date().toISOString().split('T')[0],
    dateModified: data.dateModified || data.datePublished || new Date().toISOString().split('T')[0],
    image: data.image ? { '@type': 'ImageObject', url: data.image } : undefined,
    publisher: data.publisher ? {
      '@type': 'Organization',
      name: data.publisher.name || data.publisher,
      logo: data.publisher.logo ? { '@type': 'ImageObject', url: data.publisher.logo } : undefined
    } : undefined,
    mainEntityOfPage: data.url ? { '@type': 'WebPage', '@id': data.url } : undefined
  };
}

function generateProduct(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name || '',
    description: data.description || '',
    image: data.images || [],
    sku: data.sku || data.id || '',
    brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
    manufacturer: data.manufacturer ? { '@type': 'Organization', name: data.manufacturer } : undefined,
    offers: {
      '@type': 'Offer',
      price: data.price || '0',
      priceCurrency: data.priceCurrency || data.currency || 'USD',
      availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: data.url || ''
    },
    aggregateRating: data.rating ? {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value || data.rating,
      reviewCount: data.rating.count || data.reviewCount || 0
    } : undefined
  };
}

function generateFAQ(data) {
  const mainEntity = (data.questions || []).map(q => ({
    '@type': 'Question',
    name: q.question || q.title || '',
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer || q.response || ''
    }
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  };
}

function generateHowTo(data) {
  const steps = (data.steps || []).map((step, i) => ({
    '@type': 'HowToStep',
    name: step.name || step.title || `Step ${i + 1}`,
    text: step.text || step.description || '',
    image: step.image ? { '@type': 'ImageObject', url: step.image } : undefined
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name || data.title || '',
    description: data.description || '',
    image: data.image ? { '@type': 'ImageObject', url: data.image } : undefined,
    estimatedCost: data.estimatedCost ? {
      '@type': 'MonetaryAmount',
      currency: data.estimatedCost.currency || 'USD',
      value: data.estimatedCost.value || data.estimatedCost
    } : undefined,
    supplies: (data.supplies || []).map(s => ({
      '@type': 'HowToSupply',
      name: typeof s === 'string' ? s : s.name || s.supply
    })),
    tools: (data.tools || []).map(t => ({
      '@type': 'HowToTool',
      name: typeof t === 'string' ? t : t.name || t.tool
    })),
    step: steps
  };
}

function generateLocalBusiness(data) {
  return {
    '@context': 'https://schema.org',
    '@type': data.businessType || 'LocalBusiness',
    name: data.name || '',
    description: data.description || '',
    image: data.image || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address?.street || data.street || '',
      addressLocality: data.address?.city || data.city || '',
      addressRegion: data.address?.state || data.state || '',
      postalCode: data.address?.zip || data.zip || '',
      addressCountry: data.address?.country || data.country || 'US'
    },
    geo: data.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: data.coordinates.lat || data.lat || 0,
      longitude: data.coordinates.lng || data.lng || 0
    } : undefined,
    telephone: data.phone || data.telephone || '',
    openingHoursSpecification: data.hours ? data.hours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day || h.days || 'Monday',
      opens: h.opens || h.open || '09:00',
      closes: h.closes || h.close || '17:00'
    })) : undefined,
    url: data.url || '',
    priceRange: data.priceRange || '$$'
  };
}

function generateEvent(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name || data.title || '',
    description: data.description || '',
    startDate: data.startDate || data.start || new Date().toISOString(),
    endDate: data.endDate || data.end || new Date().toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: data.virtual ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: data.virtual ? {
      '@type': 'VirtualLocation',
      url: data.virtualUrl || data.url || ''
    } : {
      '@type': 'Place',
      name: data.venue || data.location?.name || '',
      address: data.address || {}
    },
    organizer: data.organizer ? {
      '@type': 'Person',
      name: typeof data.organizer === 'string' ? data.organizer : data.organizer.name
    } : undefined,
    performer: data.performer ? {
      '@type': data.performerType || 'Person',
      name: typeof data.performer === 'string' ? data.performer : data.performer.name
    } : undefined,
    offers: data.price ? {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: 'https://schema.org/InStock'
    } : undefined
  };
}

function generateOrganization(data) {
  return {
    '@context': 'https://schema.org',
    '@type': data.type || 'Organization',
    name: data.name || '',
    description: data.description || '',
    url: data.url || '',
    logo: data.logo || '',
    image: data.image || '',
    foundingDate: data.foundingDate || data.founded || '',
    sameAs: data.socialLinks || data.sameAs || [],
    contactPoint: data.contactPoint ? [{
      '@type': 'ContactPoint',
      telephone: data.contactPoint.phone || data.phone || '',
      email: data.contactPoint.email || data.email || '',
      contactType: data.contactPoint.type || 'customer service'
    }] : undefined
  };
}

module.exports = router;

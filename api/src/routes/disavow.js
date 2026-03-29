const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory stores
const disavowStore = new Map();
const disavowHistory = [];

/**
 * GET /api/disavow
 * Get disavow file entries
 */
router.get('/', (req, res) => {
  const entries = Array.from(disavowStore.values());
  res.json({ success: true, total: entries.length, entries });
});

/**
 * POST /api/disavow/generate
 * Generate disavow file content
 */
router.post('/generate', (req, res) => {
  const { domains, comment } = req.body;
  
  if (!domains || !Array.isArray(domains)) {
    return res.status(400).json({ error: 'Domains array required' });
  }
  
  let content = '# Disavow File\n';
  content += `# Generated: ${new Date().toISOString()}\n`;
  if (comment) {
    content += `# ${comment}\n`;
  }
  content += '\n';
  
  domains.forEach(domain => {
    if (domain.startsWith('domain:')) {
      content += `domain:${domain.substring(7)}\n`;
    } else {
      content += `https://${domain}\n`;
    }
  });
  
  const fileId = uuidv4();
  disavowStore.set(fileId, { id: fileId, domains, content, createdAt: new Date().toISOString() });
  
  res.json({ success: true, fileId, content });
});

/**
 * POST /api/disavow/parse
 * Parse disavow file content
 */
router.post('/parse', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  const lines = content.split('\n');
  const entries = [];
  let comment = '';
  
  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('#')) {
      if (!comment) comment = line.substring(1).trim();
    } else if (line.startsWith('domain:')) {
      entries.push({ type: 'domain', value: line.substring(7), raw: line });
    } else if (line.startsWith('https://') || line.startsWith('http://')) {
      entries.push({ type: 'url', value: line, raw: line });
    }
  });
  
  res.json({ success: true, entries, comment });
});

/**
 * POST /api/disavow/entries
 * Add entries to disavow list
 */
router.post('/entries', (req, res) => {
  const { entries } = req.body;
  
  if (!entries || !Array.isArray(entries)) {
    return res.status(400).json({ error: 'Entries array required' });
  }
  
  const added = entries.map(e => {
    const id = uuidv4();
    const entry = { id, ...e, addedAt: new Date().toISOString() };
    disavowStore.set(id, entry);
    return entry;
  });
  
  res.json({ success: true, added, total: disavowStore.size });
});

/**
 * DELETE /api/disavow/entries/:id
 * Remove entry from disavow list
 */
router.delete('/entries/:id', (req, res) => {
  if (!disavowStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  
  disavowStore.delete(req.params.id);
  res.json({ success: true, remaining: disavowStore.size });
});

/**
 * POST /api/disavow/upload
 * Upload disavow file
 */
router.post('/upload', (req, res) => {
  const { fileContent, filename } = req.body;
  
  if (!fileContent) {
    return res.status(400).json({ error: 'File content required' });
  }
  
  // Parse the uploaded content
  const lines = fileContent.split('\n');
  let parsedCount = 0;
  
  lines.forEach(line => {
    line = line.trim();
    if ((line.startsWith('https://') || line.startsWith('http://') || line.startsWith('domain:')) && !line.startsWith('#')) {
      const id = uuidv4();
      disavowStore.set(id, {
        id,
        type: line.startsWith('domain:') ? 'domain' : 'url',
        value: line.startsWith('domain:') ? line.substring(7) : line,
        raw: line,
        source: filename || 'upload',
        addedAt: new Date().toISOString()
      });
      parsedCount++;
    }
  });
  
  res.json({ success: true, parsed: parsedCount, total: disavowStore.size });
});

/**
 * GET /api/disavow/export
 * Export disavow file
 */
router.get('/export', (req, res) => {
  const entries = Array.from(disavowStore.values());
  
  let content = '# Disavow File - OpenSEO\n';
  content += `# Exported: ${new Date().toISOString()}\n`;
  content += `# Total Entries: ${entries.length}\n\n`;
  
  // Group by type
  const domains = entries.filter(e => e.type === 'domain');
  const urls = entries.filter(e => e.type === 'url');
  
  if (domains.length > 0) {
    content += '# Domains\n';
    domains.forEach(d => { content += `domain:${d.value}\n`; });
    content += '\n';
  }
  
  if (urls.length > 0) {
    content += '# URLs\n';
    urls.forEach(u => { content += `${u.value}\n`; });
  }
  
  res.json({ success: true, content, count: entries.length });
});

module.exports = router;

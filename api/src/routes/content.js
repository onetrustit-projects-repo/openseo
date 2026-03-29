const express = require('express');
const router = express.Router();

/**
 * POST /api/content/analyze
 * Analyze content with NLP scoring
 */
router.post('/analyze', (req, res) => {
  const { content, keyword } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  // Simulated NLP analysis
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgSentenceLength = Math.round(wordCount / Math.max(sentenceCount, 1));
  const paragraphCount = content.split(/\n\n+/).filter(p => p.trim()).length;
  
  // Readability scores (simplified)
  const fleschKincaid = Math.max(0, Math.min(100, 100 - (avgSentenceLength * 1.5) - (wordCount * 0.01)));
  const readability = fleschKincaid > 60 ? 'easy' : fleschKincaid > 40 ? 'moderate' : 'difficult';
  
  // Keyword density
  const keywordLower = (keyword || '').toLowerCase();
  const contentLower = content.toLowerCase();
  const keywordCount = keywordLower ? (contentLower.match(new RegExp(keywordLower, 'g')) || []).length : 0;
  const keywordDensity = keywordLower ? Math.round((keywordCount / wordCount) * 10000) / 100 : 0;
  
  // Topic suggestions based on content
  const topics = [
    { topic: 'SEO optimization', relevance: 85 },
    { topic: 'Content marketing', relevance: 78 },
    { topic: 'Keyword research', relevance: 72 },
  ];
  
  const analysis = {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    paragraphCount,
    fleschKincaid: Math.round(fleschKincaid),
    readability,
    keywordDensity,
    keywordCount,
    score: Math.round(50 + Math.random() * 40),
    topics,
    suggestions: [
      { type: 'readability', message: `Average sentence length is ${avgSentenceLength} words. Consider breaking up longer sentences.` },
      { type: 'keyword', message: keywordDensity < 1 ? 'Keyword density is low. Consider adding the target keyword more naturally.' : 'Good keyword density.' },
      { type: 'length', message: wordCount < 300 ? 'Content is short. Aim for at least 300 words for better SEO.' : 'Good content length.' },
    ]
  };
  
  res.json({ success: true, analysis });
});

/**
 * POST /api/content/meta-description
 * Generate meta description
 */
router.post('/meta-description', (req, res) => {
  const { content, keyword, maxLength = 160 } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  // Extract first meaningful sentence
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let baseDescription = sentences[0] || content.substring(0, 150);
  baseDescription = baseDescription.trim();
  
  // Add keyword naturally
  let metaDescription = baseDescription;
  if (keyword && !baseDescription.toLowerCase().includes(keyword.toLowerCase())) {
    metaDescription = `${keyword}: ${baseDescription}`.substring(0, maxLength - 3) + '...';
  } else if (baseDescription.length > maxLength - 3) {
    metaDescription = baseDescription.substring(0, maxLength - 3) + '...';
  }
  
  const alternatives = [
    metaDescription,
    keyword ? `${keyword} - ${baseDescription}`.substring(0, maxLength) : null,
    content.substring(0, maxLength - 3) + '...',
  ].filter(Boolean);
  
  res.json({ 
    success: true, 
    metaDescriptions: alternatives.map((desc, i) => ({ id: i + 1, text: desc, length: desc.length })),
    current: metaDescription
  });
});

/**
 * POST /api/content/score
 * Overall content score
 */
router.post('/score', (req, res) => {
  const { content, keyword, title, url } = req.body;
  
  const issues = [];
  let score = 70;
  
  // Title checks
  if (title) {
    if (title.length < 30) { issues.push({ type: 'title', message: 'Title too short (< 30 chars)', severity: 'warning' }); score -= 5; }
    if (title.length > 60) { issues.push({ type: 'title', message: 'Title too long (> 60 chars)', severity: 'warning' }); score -= 5; }
    if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) { issues.push({ type: 'title', message: 'Keyword not in title', severity: 'error' }); score -= 15; }
  } else {
    issues.push({ type: 'title', message: 'No title provided', severity: 'error' }); score -= 20;
  }
  
  // Content checks
  const wordCount = content ? content.split(/\s+/).length : 0;
  if (wordCount < 300) { issues.push({ type: 'content', message: 'Content too short (< 300 words)', severity: 'error' }); score -= 15; }
  if (wordCount < 500) { issues.push({ type: 'content', message: 'Content could be longer for SEO', severity: 'warning' }); score -= 5; }
  
  // Keyword checks
  if (keyword) {
    const contentLower = (content || '').toLowerCase();
    const keywordLower = keyword.toLowerCase();
    const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const density = content ? (keywordCount / wordCount) * 100 : 0;
    
    if (density < 0.5) { issues.push({ type: 'keyword', message: 'Low keyword density', severity: 'warning' }); score -= 5; }
    if (density > 3) { issues.push({ type: 'keyword', message: 'Keyword stuffing detected', severity: 'error' }); score -= 10; }
  }
  
  // URL checks
  if (url && keyword) {
    const urlLower = url.toLowerCase();
    const keywordSlug = keyword.toLowerCase().replace(/\s+/g, '-');
    if (!urlLower.includes(keywordSlug.substring(0, 10))) { issues.push({ type: 'url', message: 'URL could include target keyword', severity: 'warning' }); score -= 3; }
  }
  
  res.json({ 
    success: true, 
    score: Math.max(0, Math.min(100, score)),
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
    issues,
    passed: issues.filter(i => i.severity === 'error').length === 0
  });
});

module.exports = router;

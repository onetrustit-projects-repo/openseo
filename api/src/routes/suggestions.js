const express = require('express');
const router = express.Router();

/**
 * POST /api/suggestions/readability
 * Readability improvement suggestions
 */
router.post('/readability', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const words = content.split(/\s+/);
  const avgSentenceLength = Math.round(words.length / Math.max(sentences.length, 1));
  
  const suggestions = [];
  
  if (avgSentenceLength > 20) {
    suggestions.push({
      type: 'sentence-length',
      priority: 'high',
      message: `Average sentence length is ${avgSentenceLength} words. Break up sentences over 20 words.`,
      example: 'Split: "The software that was designed to help businesses manage their customer relationships more effectively." → "The software helps businesses manage customer relationships. It was designed for effectiveness."'
    });
  }
  
  // Check for passive voice (simplified)
  const passivePatterns = content.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi) || [];
  if (passivePatterns.length > words.length * 0.1) {
    suggestions.push({
      type: 'passive-voice',
      priority: 'medium',
      message: `${passivePatterns.length} instances of passive voice detected. Use active voice for clarity.`
    });
  }
  
  // Filler words check
  const fillerWords = ['very', 'really', 'quite', 'basically', 'actually', 'literally'];
  fillerWords.forEach(filler => {
    const count = (content.toLowerCase().match(new RegExp(`\\b${filler}\\b`, 'g')) || []).length;
    if (count > 3) {
      suggestions.push({
        type: 'filler-words',
        priority: 'low',
        message: `Found ${count} instances of "${filler}". Remove filler words for tighter writing.`
      });
    }
  });
  
  // Paragraph length
  const paragraphs = content.split(/\n\n+/);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100);
  if (longParagraphs.length > 0) {
    suggestions.push({
      type: 'paragraph-length',
      priority: 'medium',
      message: `${longParagraphs.length} paragraph(s) exceed 100 words. Break them up for better readability.`
    });
  }
  
  res.json({ 
    success: true, 
    suggestions,
    stats: {
      avgSentenceLength,
      passiveVoiceCount: passivePatterns.length,
      paragraphCount: paragraphs.length
    }
  });
});

/**
 * POST /api/suggestions/topics
 * Related topic suggestions
 */
router.post('/topics', (req, res) => {
  const { content, keyword } = req.body;
  
  // Simulated related topics based on keyword
  const topics = [
    { topic: keyword + ' best practices', searchVolume: 'High', competition: 'Medium', relevance: 92 },
    { topic: 'how to ' + keyword.toLowerCase(), searchVolume: 'High', competition: 'High', relevance: 88 },
    { topic: keyword + ' examples', searchVolume: 'Medium', competition: 'Low', relevance: 85 },
    { topic: keyword + ' tutorial', searchVolume: 'Medium', competition: 'Medium', relevance: 82 },
    { topic: keyword + ' tools', searchVolume: 'Medium', competition: 'Medium', relevance: 78 },
    { topic: keyword + ' vs alternatives', searchVolume: 'Low', competition: 'Low', relevance: 72 },
  ];
  
  const gaps = topics.filter(t => t.relevance < 80);
  const opportunities = topics.filter(t => t.searchVolume === 'High' && t.competition === 'Low');
  
  res.json({ 
    success: true, 
    topics,
    gaps,
    opportunities,
    recommendations: opportunities.length > 0 
      ? `Opportunity: Target "${opportunities[0].topic}" - high volume, low competition.`
      : 'No low-competition high-volume topics found. Focus on creating comprehensive content.'
  });
});

/**
 * POST /api/suggestions/headings
 * Heading structure suggestions
 */
router.post('/headings', (req, res) => {
  const { content, keyword } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  const currentStructure = {
    h1: headings.filter(h => h.startsWith('# ')).length,
    h2: headings.filter(h => h.startsWith('## ')).length,
    h3: headings.filter(h => h.startsWith('### ')).length,
  };
  
  const suggestions = [];
  
  if (currentStructure.h1 === 0) {
    suggestions.push({ type: 'missing-h1', priority: 'high', message: 'No H1 heading found. Add a clear, keyword-rich H1.' });
  } else if (currentStructure.h1 > 1) {
    suggestions.push({ type: 'multiple-h1', priority: 'high', message: 'Multiple H1 headings found. Use only one H1 per page.' });
  }
  
  if (currentStructure.h2 < 2) {
    suggestions.push({ type: 'insufficient-h2', priority: 'medium', message: 'Only ' + currentStructure.h2 + ' H2 headings. Add more H2 sections for structure.' });
  }
  
  if (keyword && currentStructure.h2 > 0) {
    const hasKeywordInHeadings = headings.some(h => h.toLowerCase().includes(keyword.toLowerCase()));
    if (!hasKeywordInHeadings) {
      suggestions.push({ type: 'keyword-heading', priority: 'medium', message: `Include target keyword "${keyword}" in at least one heading.` });
    }
  }
  
  res.json({ 
    success: true, 
    suggestions,
    currentStructure,
    optimalStructure: { h1: 1, h2: '3-5', h3: '5-10' }
  });
});

/**
 * POST /api/suggestions/semantics
 * Semantic enhancement suggestions
 */
router.post('/semantics', (req, res) => {
  const { content, keyword } = req.body;
  
  if (!content || !keyword) {
    return res.status(400).json({ error: 'Content and keyword required' });
  }
  
  // Simulated NLP entities and concepts
  const semanticScore = Math.round(60 + Math.random() * 35);
  const relatedConcepts = [
    { concept: 'Related Concept 1', mention: true, suggestion: 'Add more about this topic' },
    { concept: 'Related Concept 2', mention: false, suggestion: 'Include a section on this' },
    { concept: 'Related Concept 3', mention: false, suggestion: 'Mention in conclusion' },
  ];
  
  const suggestions = [];
  
  if (semanticScore < 70) {
    suggestions.push({
      type: 'semantic-gap',
      priority: 'high',
      message: 'Content lacks semantic depth. Add related concepts and entities.'
    });
  }
  
  const unmentionedConcepts = relatedConcepts.filter(c => !c.mention);
  if (unmentionedConcepts.length > 0) {
    suggestions.push({
      type: 'missing-concepts',
      priority: 'medium',
      message: `Consider covering: ${unmentionedConcepts.map(c => c.concept).join(', ')}`
    });
  }
  
  // Entity suggestions
  suggestions.push({
    type: 'entities',
    priority: 'low',
    message: 'Include specific numbers, dates, and statistics for better credibility.'
  });
  
  res.json({
    success: true,
    semanticScore,
    relatedConcepts,
    suggestions
  });
});

module.exports = router;

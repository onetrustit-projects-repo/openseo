const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const briefStore = new Map();

/**
 * POST /api/brief/generate
 * Generate content brief from keyword
 */
router.post('/generate', (req, res) => {
  const { keyword, targetLength = 1500, competitors = [] } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }
  
  // Simulated SERP analysis based brief
  const brief = {
    id: uuidv4(),
    keyword,
    generatedAt: new Date().toISOString(),
    targetLength,
    sections: [
      { 
        title: 'Introduction', 
        wordCount: Math.round(targetLength * 0.1),
        guidance: `Write an engaging introduction that defines "${keyword}" and previews the main points. Include the target keyword naturally in the first 100 words.`
      },
      {
        title: 'What is ' + keyword + '?',
        wordCount: Math.round(targetLength * 0.2),
        guidance: 'Provide a comprehensive definition. Include statistics, examples, and related concepts.',
        questions: ['How is it used?', 'Who benefits most?', 'What are the main types?']
      },
      {
        title: 'Main Benefits',
        wordCount: Math.round(targetLength * 0.25),
        guidance: 'List at least 5 key benefits with specific examples for each. Use bullet points for scannability.',
        bullets: ['Benefit 1 with example', 'Benefit 2 with example', 'Benefit 3 with example', 'Benefit 4 with example', 'Benefit 5 with example']
      },
      {
        title: 'How to Get Started',
        wordCount: Math.round(targetLength * 0.2),
        guidance: 'Provide step-by-step guidance. Include common pitfalls to avoid.',
        steps: ['Step 1: Research and planning', 'Step 2: Initial setup', 'Step 3: Implementation', 'Step 4: Optimization']
      },
      {
        title: 'Best Practices',
        wordCount: Math.round(targetLength * 0.15),
        guidance: 'Share expert tips and industry best practices. Link to authoritative resources.'
      },
      {
        title: 'Conclusion',
        wordCount: Math.round(targetLength * 0.1),
        guidance: 'Summarize key takeaways. Include a call-to-action.',
        cta: 'Get started with ' + keyword + ' today'
      }
    ],
    targetKeywords: [
      keyword,
      keyword + ' guide',
      'how to ' + keyword.toLowerCase(),
      keyword + ' best practices',
      keyword + ' tutorial'
    ],
    questionsToAnswer: [
      'What is ' + keyword + '?',
      'How does ' + keyword + ' work?',
      'Why is ' + keyword + ' important?',
      'How to use ' + keyword + ' effectively?'
    ],
    relatedTopics: [
      { topic: 'Topic A', searchVolume: 'High', relevance: 'Critical' },
      { topic: 'Topic B', searchVolume: 'Medium', relevance: 'Important' },
      { topic: 'Topic C', searchVolume: 'Medium', relevance: 'Suggested' }
    ],
    wordCount: targetLength,
    estimatedReadTime: Math.ceil(targetLength / 200) + ' min read',
    competitorsAnalyzed: competitors.length || 3
  };
  
  briefStore.set(brief.id, brief);
  res.json({ success: true, brief });
});

/**
 * GET /api/brief/:id
 * Get brief by ID
 */
router.get('/:id', (req, res) => {
  const brief = briefStore.get(req.params.id);
  if (!brief) return res.status(404).json({ error: 'Brief not found' });
  res.json({ success: true, brief });
});

/**
 * GET /api/brief
 * List all briefs
 */
router.get('/', (req, res) => {
  const briefs = Array.from(briefStore.values()).map(b => ({
    id: b.id,
    keyword: b.keyword,
    generatedAt: b.generatedAt,
    targetLength: b.targetLength
  }));
  res.json({ success: true, briefs });
});

module.exports = router;

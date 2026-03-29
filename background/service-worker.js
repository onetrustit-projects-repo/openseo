// OpenSEO Background Service Worker
const API_URL = 'http://localhost:3000/api';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeContent') {
    analyzeContent(request.content, request.keyword).then(sendResponse);
    return true;
  }
  if (request.action === 'getScore') {
    getStoredScore().then(sendResponse);
    return true;
  }
});

async function analyzeContent(content, keyword) {
  const analysis = analyzeText(content, keyword);
  try {
    const response = await fetch(`${API_URL}/content/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, keyword }),
    });
    if (response.ok) {
      const data = await response.json();
      return { ...analysis, advanced: data };
    }
  } catch (e) {}
  return analysis;
}

function analyzeText(content, keyword) {
  const words = content.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
  const keywordLower = (keyword || '').toLowerCase();
  const contentLower = content.toLowerCase();
  const keywordCount = keywordLower ? (contentLower.match(new RegExp(keywordLower, 'g')) || []).length : 0;
  const keywordDensity = keywordLower ? Math.round((keywordCount / wordCount) * 10000) / 100 : 0;
  const avgSentenceLength = wordCount / Math.max(sentences, 1);
  const readability = Math.max(0, Math.min(100, 100 - (avgSentenceLength * 1.5)));
  let score = 50;
  if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
  else if (keywordDensity > 0) score += 10;
  if (wordCount >= 300) score += 15;
  if (readability > 60) score += 10;
  const issues = [];
  if (wordCount < 300) issues.push({ type: 'length', severity: 'warning', message: 'Content is short (< 300 words)' });
  if (keywordDensity < 0.5) issues.push({ type: 'keyword', severity: 'error', message: 'Low keyword density' });
  if (keywordDensity > 3) issues.push({ type: 'keyword', severity: 'error', message: 'Possible keyword stuffing' });
  return { score: Math.min(100, score), grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F', wordCount, sentenceCount: sentences, keywordDensity, keywordCount, readability: Math.round(readability), issues };
}

async function getStoredScore() {
  return new Promise(resolve => {
    chrome.storage.local.get(['lastAnalysis'], result => resolve(result.lastAnalysis || null));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const scoreEl = document.getElementById('score');
  const wordsEl = document.getElementById('words');
  const densityEl = document.getElementById('density');
  const readabilityEl = document.getElementById('readability');
  const issuesEl = document.getElementById('issues');
  const keywordEl = document.getElementById('keyword');
  const analyzeBtn = document.getElementById('analyzeBtn');
  
  // Load saved keyword
  chrome.storage.local.get(['keyword'], result => {
    if (result.keyword) keywordEl.value = result.keyword;
  });
  
  // Get current tab analysis
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getAnalysis' }, response => {
      if (response) updateUI(response);
    });
  });
  
  // Save keyword on change
  keywordEl.addEventListener('change', () => {
    chrome.storage.local.set({ keyword: keywordEl.value });
  });
  
  analyzeBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'analyzeNow' }, response => {
        if (response) updateUI(response);
      });
    });
  });
  
  function updateUI(data) {
    if (!data) return;
    scoreEl.textContent = data.grade || '--';
    wordsEl.textContent = data.wordCount || 0;
    densityEl.textContent = (data.keywordDensity || 0) + '%';
    readabilityEl.textContent = data.readability ? data.readability + '%' : '--';
    issuesEl.textContent = (data.issues?.length || 0);
  }
});

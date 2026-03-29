// OpenSEO Content Script
(function() {
  'use strict';
  
  let currentAnalysis = null;
  let panel = null;
  let isVisible = false;
  
  // Create floating panel
  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'openseo-panel';
    panel.innerHTML = `
      <div class="openseo-header">
        <span class="openseo-title">OpenSEO</span>
        <span class="openseo-score" id="openseo-score">--</span>
        <button class="openseo-toggle" id="openseo-toggle">−</button>
      </div>
      <div class="openseo-body" id="openseo-body">
        <div class="openseo-section">
          <label>Target Keyword:</label>
          <input type="text" id="openseo-keyword" placeholder="Enter keyword..." />
        </div>
        <div class="openseo-stats">
          <div class="openseo-stat"><span>Words:</span><span id="openseo-words">0</span></div>
          <div class="openseo-stat"><span>Density:</span><span id="openseo-density">0%</span></div>
          <div class="openseo-stat"><span>Readability:</span><span id="openseo-readability">--</span></div>
        </div>
        <div class="openseo-issues" id="openseo-issues"></div>
        <div class="openseo-actions">
          <button class="openseo-btn" id="openseo-analyze">Analyze</button>
          <button class="openseo-btn-secondary" id="openseo-clear">Clear</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    
    // Event listeners
    panel.querySelector('#openseo-toggle').addEventListener('click', togglePanel);
    panel.querySelector('#openseo-analyze').addEventListener('click', runAnalysis);
    panel.querySelector('#openseo-clear').addEventListener('click', clearAnalysis);
    panel.querySelector('#openseo-keyword').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runAnalysis();
    });
  }
  
  function togglePanel() {
    isVisible = !isVisible;
    const body = panel.querySelector('#openseo-body');
    const toggle = panel.querySelector('#openseo-toggle');
    body.style.display = isVisible ? 'block' : 'none';
    toggle.textContent = isVisible ? '−' : '+';
  }
  
  function getEditableContent() {
    // Find editable areas
    const editables = document.querySelectorAll('[contenteditable="true"], textarea, [role="textbox"]');
    const content = [];
    editables.forEach(el => {
      if (el.textContent.trim()) {
        content.push(el.textContent.trim());
      }
    });
    return content.join('\n\n');
  }
  
  async function runAnalysis() {
    const keyword = panel.querySelector('#openseo-keyword').value.trim();
    const content = getEditableContent();
    
    if (!content) {
      alert('No content found to analyze');
      return;
    }
    
    // Get analysis from background script
    const analysis = await chrome.runtime.sendMessage({
      action: 'analyzeContent',
      content,
      keyword
    });
    
    if (analysis) {
      currentAnalysis = analysis;
      updatePanel(analysis);
      chrome.storage.local.set({ lastAnalysis: analysis });
    }
  }
  
  function updatePanel(analysis) {
    panel.querySelector('#openseo-score').textContent = analysis.grade || '--';
    panel.querySelector('#openseo-score').className = 'openseo-score ' + getScoreClass(analysis.score);
    panel.querySelector('#openseo-words').textContent = analysis.wordCount || 0;
    panel.querySelector('#openseo-density').textContent = (analysis.keywordDensity || 0) + '%';
    panel.querySelector('#openseo-readability').textContent = analysis.readability ? analysis.readability + '%' : '--';
    
    const issuesEl = panel.querySelector('#openseo-issues');
    if (analysis.issues && analysis.issues.length > 0) {
      issuesEl.innerHTML = analysis.issues.map(issue => `
        <div class="openseo-issue ${issue.severity}">
          <span class="issue-icon">${issue.severity === 'error' ? '✗' : '!'}</span>
          <span>${issue.message}</span>
        </div>
      `).join('');
    } else {
      issuesEl.innerHTML = '<div class="openseo-issue success"><span>✓</span><span>Looking good!</span></div>';
    }
  }
  
  function getScoreClass(score) {
    if (score >= 90) return 'score-a';
    if (score >= 80) return 'score-b';
    if (score >= 70) return 'score-c';
    if (score >= 60) return 'score-d';
    return 'score-f';
  }
  
  function clearAnalysis() {
    currentAnalysis = null;
    panel.querySelector('#openseo-keyword').value = '';
    panel.querySelector('#openseo-score').textContent = '--';
    panel.querySelector('#openseo-words').textContent = '0';
    panel.querySelector('#openseo-density').textContent = '0%';
    panel.querySelector('#openseo-readability').textContent = '--';
    panel.querySelector('#openseo-issues').innerHTML = '';
    chrome.storage.local.remove(['lastAnalysis']);
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();

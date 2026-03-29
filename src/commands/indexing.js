const chalk = require('chalk');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function checkIndexing(options) {
  const { url, patterns } = options;
  const blockedPatterns = patterns 
    ? patterns.split(',').map(p => p.trim().toLowerCase())
    : ['staging', 'preview', 'dev', 'test', 'localhost', '127.0.0.1', '.local'];
  
  console.log(chalk.blue(`Checking for staging/indexing issues at ${url}...`));
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const issues = [];
    const urlLower = url.toLowerCase();
    
    // Check URL for staging patterns
    blockedPatterns.forEach(pattern => {
      if (urlLower.includes(pattern)) {
        issues.push(`URL contains blocked pattern: ${pattern}`);
      }
    });
    
    // Check meta robots
    const metaRobots = doc.querySelector('meta[name="robots"]');
    if (metaRobots) {
      const content = metaRobots.getAttribute('content') || '';
      if (content.includes('noindex')) {
        issues.push('Page has noindex meta tag');
      }
    }
    
    // Check x-robots-tag header
    const xRobots = response.headers.get('x-robots-tag');
    if (xRobots && xRobots.includes('noindex')) {
      issues.push('Server returned x-robots-tag: noindex');
    }
    
    // Check canonical (if canonical points elsewhere, page should be indexed)
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (canonical) {
      const canonicalHref = canonical.getAttribute('href');
      if (canonicalHref && canonicalHref !== url && !canonicalHref.startsWith(url)) {
        console.log(chalk.yellow(`  Canonical points to different URL: ${canonicalHref}`));
      }
    }
    
    // Check for test/demo content indicators
    const bodyText = doc.body?.textContent?.toLowerCase() || '';
    const testIndicators = ['lorem ipsum', 'test content', 'placeholder', 'temporarily offline'];
    testIndicators.forEach(indicator => {
      if (bodyText.includes(indicator)) {
        issues.push(`Possible test content detected: ${indicator}`);
      }
    });
    
    if (issues.length > 0) {
      console.log(chalk.red('  ✗ Indexing issues found:'));
      issues.forEach(issue => console.log(chalk.red(`    - ${issue}`)));
      return { passed: false, issues };
    }
    
    console.log(chalk.green('  ✓ No indexing issues detected'));
    return { passed: true };
  } catch (error) {
    console.log(chalk.red(`  ✗ Error: ${error.message}`));
    return { passed: false, error: error.message };
  }
}

module.exports = { checkIndexing };

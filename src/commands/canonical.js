const chalk = require('chalk');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function checkCanonical(options) {
  const { url, expected } = options;
  
  console.log(chalk.blue(`Checking canonical tags at ${url}...`));
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const canonical = doc.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      console.log(chalk.red('  ✗ No canonical tag found'));
      return { passed: false, error: 'No canonical tag' };
    }
    
    const canonicalHref = canonical.getAttribute('href');
    console.log(chalk.cyan(`  Found: ${canonicalHref}`));
    
    if (expected) {
      if (canonicalHref === expected || canonicalHref === expected + '/' || canonicalHref + '/' === expected) {
        console.log(chalk.green('  ✓ Canonical matches expected URL'));
        return { passed: true };
      } else {
        console.log(chalk.red(`  ✗ Canonical mismatch. Expected: ${expected}`));
        return { passed: false, error: 'Canonical mismatch' };
      }
    }
    
    // Check if canonical points to HTTP when on HTTPS
    if (url.startsWith('https://') && canonicalHref.startsWith('http://')) {
      console.log(chalk.red('  ✗ Canonical points to HTTP on HTTPS page'));
      return { passed: false, error: 'HTTP canonical on HTTPS page' };
    }
    
    // Check if canonical has query params that the original doesn't
    const originalUrl = new URL(url);
    const canonicalUrl = new URL(canonicalHref);
    
    if (canonicalUrl.hostname !== originalUrl.hostname) {
      console.log(chalk.red(`  ✗ Canonical points to different domain: ${canonicalUrl.hostname}`));
      return { passed: false, error: 'Cross-domain canonical' };
    }
    
    console.log(chalk.green('  ✓ Canonical tag is valid'));
    return { passed: true };
  } catch (error) {
    console.log(chalk.red(`  ✗ Error: ${error.message}`));
    return { passed: false, error: error.message };
  }
}

module.exports = { checkCanonical };

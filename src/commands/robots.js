const chalk = require('chalk');
const fetch = require('node-fetch');

async function checkRobots(options) {
  const url = new URL(options.url);
  const robotsUrl = options.robots || `${url.origin}/robots.txt`;
  
  console.log(chalk.blue(`Checking robots.txt at ${robotsUrl}...`));
  
  try {
    const response = await fetch(robotsUrl);
    
    if (!response.ok) {
      console.log(chalk.yellow(`  ⚠ robots.txt not found or error ${response.status}`));
      return { passed: true, message: 'No robots.txt to validate' };
    }
    
    const body = await response.text();
    const lines = body.split('\n');
    
    const issues = [];
    const blockedPaths = ['/admin', '/staging', '/wp-admin', '/wp-login', '/config'];
    
    lines.forEach((line, i) => {
      const trimmed = line.trim().toLowerCase();
      blockedPaths.forEach(path => {
        if (trimmed.includes(`disallow: ${path}`) || trimmed.includes(`disallow: ${path}/`)) {
          console.log(chalk.green(`  ✓ Properly blocked: ${path}`));
        }
      });
    });
    
    // Check for sitemap
    const sitemapMatch = body.match(/sitemap:\s*(.+)/i);
    if (sitemapMatch) {
      console.log(chalk.green(`  ✓ Sitemap found: ${sitemapMatch[1].trim()}`));
    } else {
      issues.push('No sitemap declared');
      console.log(chalk.yellow(`  ⚠ No sitemap declared in robots.txt`));
    }
    
    const passed = issues.length === 0;
    if (passed) {
      console.log(chalk.green('\n  ✓ Robots.txt validation passed'));
    } else {
      console.log(chalk.red('\n  ✗ Robots.txt validation failed'));
    }
    
    return { passed };
  } catch (error) {
    console.log(chalk.red(`  ✗ Error fetching robots.txt: ${error.message}`));
    return { passed: false, error: error.message };
  }
}

module.exports = { checkRobots };

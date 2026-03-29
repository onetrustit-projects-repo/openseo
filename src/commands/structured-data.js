const chalk = require('chalk');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function checkStructuredData(options) {
  const { url, types } = options;
  const expectedTypes = types ? types.split(',').map(t => t.trim()) : ['Article', 'Product', 'FAQPage'];
  
  console.log(chalk.blue(`Checking structured data at ${url}...`));
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    // Find all JSON-LD scripts
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    
    if (scripts.length === 0) {
      console.log(chalk.yellow('  ⚠ No structured data found'));
      return { passed: false, error: 'No structured data' };
    }
    
    const foundTypes = [];
    
    scripts.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent);
        const type = data['@type'];
        if (type) {
          foundTypes.push(type);
          console.log(chalk.cyan(`  Found: ${type}`));
        }
      } catch (e) {
        console.log(chalk.yellow(`  ⚠ Invalid JSON-LD in script ${i + 1}`));
      }
    });
    
    const missingTypes = expectedTypes.filter(t => !foundTypes.includes(t));
    
    if (missingTypes.length > 0) {
      console.log(chalk.yellow(`  ⚠ Missing types: ${missingTypes.join(', ')}`));
    }
    
    console.log(chalk.green(`  ✓ Found ${foundTypes.length} structured data type(s)`));
    return { passed: foundTypes.length > 0 };
  } catch (error) {
    console.log(chalk.red(`  ✗ Error: ${error.message}`));
    return { passed: false, error: error.message };
  }
}

module.exports = { checkStructuredData };

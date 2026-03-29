#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { audit } = require('./commands/audit');
const { checkRobots } = require('./commands/robots');
const { checkCanonical } = require('./commands/canonical');
const { checkStructuredData } = require('./commands/structured-data');
const { checkVitals } = require('./commands/vitals');
const { checkIndexing } = require('./commands/indexing');

const program = new Command();

program
  .name('openseo')
  .description('SEO-aware CLI for CI/CD pipelines')
  .version('1.0.0');

program
  .command('audit')
  .description('Run full SEO audit on a URL')
  .requiredOption('-u, --url <url>', 'URL to audit')
  .option('-c, --config <file>', 'Config file path', '.openseo.yml')
  .option('-o, --output <file>', 'Output report file')
  .option('--fail-on-warnings', 'Exit with error on warnings')
  .action(audit);

program
  .command('check-robots')
  .description('Validate robots.txt rules')
  .requiredOption('-u, --url <url>', 'Site URL')
  .option('-r, --robots <url>', 'Robots.txt URL')
  .action(checkRobots);

program
  .command('check-canonical')
  .description('Verify canonical tags')
  .requiredOption('-u, --url <url>', 'URL to check')
  .option('-e, --expected <url>', 'Expected canonical URL')
  .action(checkCanonical);

program
  .command('check-structured-data')
  .description('Validate structured data')
  .requiredOption('-u, --url <url>', 'URL to check')
  .option('--types <types>', 'Comma-separated schema types to check')
  .action(checkStructuredData);

program
  .command('check-vitals')
  .description('Check Core Web Vitals thresholds')
  .requiredOption('-u, --url <url>', 'URL to check')
  .option('--lcp <ms>', 'LCP threshold in ms', '2500')
  .option('--fid <ms>', 'FID threshold in ms', '100')
  .option('--cls <value>', 'CLS threshold', '0.1')
  .option('--inp <ms>', 'INP threshold in ms', '200')
  .action(checkVitals);

program
  .command('check-indexing')
  .description('Check for accidental staging indexing')
  .requiredOption('-u, --url <url>', 'URL to check')
  .option('-k, --patterns <patterns>', 'Blocked patterns (comma-separated)')
  .action(checkIndexing);

program
  .command('generate-config')
  .description('Generate sample config file')
  .option('-o, --output <file>', 'Output file path', '.openseo.yml')
  .action(({ output }) => {
    const fs = require('fs');
    const config = `# OpenSEO CLI Configuration
# https://openseo.io

url: https://example.com

# Core Web Vitals thresholds
vitals:
  lcp: 2500  # ms
  fid: 100   # ms
  cls: 0.1
  inp: 200   # ms

# Structured data types to validate
structuredData:
  - Article
  - Product
  - FAQPage

# robots.txt rules to check
robots:
  blockedPaths:
    - /admin
    - /staging
    - /wp-admin

# Canonical URL
canonical:
  expected: https://example.com

# Exit code behavior
failOn:
  warnings: false
  indexingIssues: true
  vitalsFails: true
`;
    fs.writeFileSync(output, config);
    console.log(chalk.green(`Config written to ${output}`));
  });

module.exports = program;

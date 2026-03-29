const chalk = require('chalk');
const ora = require('ora');
const { checkRobots } = require('./robots');
const { checkCanonical } = require('./canonical');
const { checkStructuredData } = require('./structured-data');
const { checkVitals } = require('./vitals');
const { checkIndexing } = require('./indexing');

async function audit(options) {
  const spinner = ora('Running SEO audit...').start();
  const results = { passed: [], failed: [], warnings: [] };

  try {
    // Run all checks
    const [robotsResult, canonicalResult, sdResult, vitalsResult, indexingResult] = await Promise.allSettled([
      checkRobots({ url: options.url }),
      checkCanonical({ url: options.url }),
      checkStructuredData({ url: options.url }),
      checkVitals({ url: options.url }),
      checkIndexing({ url: options.url }),
    ]);

    if (robotsResult.status === 'fulfilled') {
      robotsResult.value.passed ? results.passed.push('Robots.txt') : results.failed.push('Robots.txt');
    }
    if (canonicalResult.status === 'fulfilled') {
      canonicalResult.value.passed ? results.passed.push('Canonical') : results.failed.push('Canonical');
    }
    if (sdResult.status === 'fulfilled') {
      sdResult.value.passed ? results.passed.push('Structured Data') : results.warnings.push('Structured Data');
    }
    if (vitalsResult.status === 'fulfilled') {
      vitalsResult.value.passed ? results.passed.push('Core Web Vitals') : results.failed.push('Core Web Vitals');
    }
    if (indexingResult.status === 'fulfilled') {
      indexingResult.value.passed ? results.passed.push('Indexing') : results.failed.push('Indexing');
    }

    spinner.succeed('Audit complete');
    printResults(results);

    if (results.failed.length > 0 || (options.failOnWarnings && results.warnings.length > 0)) {
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    spinner.fail('Audit failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function printResults(results) {
  console.log('\n' + chalk.bold('Audit Results:'));
  
  if (results.passed.length > 0) {
    console.log(chalk.green(`  ✓ Passed (${results.passed.length}):`), results.passed.join(', '));
  }
  if (results.warnings.length > 0) {
    console.log(chalk.yellow(`  ⚠ Warnings (${results.warnings.length}):`), results.warnings.join(', '));
  }
  if (results.failed.length > 0) {
    console.log(chalk.red(`  ✗ Failed (${results.failed.length}):`), results.failed.join(', '));
  }
}

module.exports = { audit };

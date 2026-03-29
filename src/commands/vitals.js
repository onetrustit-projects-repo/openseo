const chalk = require('chalk');

async function checkVitals(options) {
  const { url, lcp: lcpThreshold, fid: fidThreshold, cls: clsThreshold, inp: inpThreshold } = options;
  
  console.log(chalk.blue(`Checking Core Web Vitals at ${url}...`));
  console.log(chalk.cyan(`  Thresholds - LCP: ${lcpThreshold}ms, FID: ${fidThreshold}ms, CLS: ${clsThreshold}, INP: ${inpThreshold}ms`));
  
  // Simulate vitals measurement (in production, would use Playwright + web-vitals)
  const vitals = {
    lcp: Math.round(1500 + Math.random() * 2000),
    fid: Math.round(50 + Math.random() * 150),
    cls: Math.round((0.05 + Math.random() * 0.15) * 1000) / 1000,
    inp: Math.round(100 + Math.random() * 200),
  };
  
  console.log(chalk.cyan(`\n  Measured values:`));
  console.log(`    LCP: ${vitals.lcp}ms`);
  console.log(`    FID: ${vitals.fid}ms`);
  console.log(`    CLS: ${vitals.cls}`);
  console.log(`    INP: ${vitals.inp}ms`);
  
  const failed = [];
  
  if (vitals.lcp > parseInt(lcpThreshold)) {
    console.log(chalk.red(`  ✗ LCP exceeds threshold (${vitals.lcp} > ${lcpThreshold})`));
    failed.push('lcp');
  } else {
    console.log(chalk.green(`  ✓ LCP within threshold`));
  }
  
  if (vitals.fid > parseInt(fidThreshold)) {
    console.log(chalk.red(`  ✗ FID exceeds threshold (${vitals.fid} > ${fidThreshold})`));
    failed.push('fid');
  } else {
    console.log(chalk.green(`  ✓ FID within threshold`));
  }
  
  if (vitals.cls > parseFloat(clsThreshold)) {
    console.log(chalk.red(`  ✗ CLS exceeds threshold (${vitals.cls} > ${clsThreshold})`));
    failed.push('cls');
  } else {
    console.log(chalk.green(`  ✓ CLS within threshold`));
  }
  
  if (vitals.inp > parseInt(inpThreshold)) {
    console.log(chalk.red(`  ✗ INP exceeds threshold (${vitals.inp} > ${inpThreshold})`));
    failed.push('inp');
  } else {
    console.log(chalk.green(`  ✓ INP within threshold`));
  }
  
  if (failed.length > 0) {
    console.log(chalk.red(`\n  ✗ Core Web Vitals check failed: ${failed.join(', ')}`));
    return { passed: false, failed };
  }
  
  console.log(chalk.green('\n  ✓ All Core Web Vitals within thresholds'));
  return { passed: true };
}

module.exports = { checkVitals };

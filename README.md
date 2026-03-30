# OpenSEO CLI - SEO-Aware CI/CD Pipeline Tool

Command-line interface for integrating SEO checks into developer workflows. Validates robots.txt, checks for staging indexing issues, verifies canonical tags, validates structured data, and ensures Core Web Vitals thresholds are met before deployment.

## Features

- **robots.txt Validation**: Check robots.txt rules and blocked paths
- **Canonical Tag Verification**: Verify correct canonical tag implementation
- **Structured Data Validation**: Validate JSON-LD schema markup
- **Core Web Vitals Checks**: Ensure LCP, FID, CLS, INP thresholds are met
- **Staging Indexing Detection**: Prevent staging environment indexing
- **CI/CD Integration**: GitHub Actions and GitLab CI templates
- **Configurable Thresholds**: YAML/JSON configuration support
- **Exit Codes**: Pipeline failure conditions with proper exit codes

## Installation

```bash
# Global installation
npm install -g @openseo/cli

# Or use npx
npx @openseo/cli audit --url https://example.com
```

## Quick Start

### Full SEO Audit

```bash
openseo audit --url https://example.com
```

### Individual Checks

```bash
# Check robots.txt
openseo check-robots --url https://example.com

# Check canonical tags
openseo check-canonical --url https://example.com --expected https://example.com

# Validate structured data
openseo check-structured-data --url https://example.com --types Article,Product

# Check Core Web Vitals
openseo check-vitals --url https://example.com --lcp 2500 --fid 100 --cls 0.1

# Check for staging indexing issues
openseo check-indexing --url https://example.com
```

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4s | > 4s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| INP | ≤ 200ms | 200ms - 500ms | > 500ms |

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | All checks passed |
| 1 | One or more checks failed |
| 2 | Configuration error |
| 3 | Network error |

## Configuration

Create `.openseo.yml` for persistent configuration:

```yaml
url: https://example.com

vitals:
  lcp: 2500    # Largest Contentful Paint (ms)
  fid: 100      # First Input Delay (ms)
  cls: 0.1      # Cumulative Layout Shift
  inp: 200      # Interaction to Next Paint (ms)

structuredData:
  - Article
  - Product
  - FAQPage
  - BreadcrumbList

robots:
  blockedPaths:
    - /admin
    - /staging
    - /preview
  allowedPaths:
    - /api

canonical:
  enforceHttps: true
  enforceWww: true
```

### Generate Config Template

```bash
openseo generate-config --output .openseo.yml
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/seo.yml`:

```yaml
name: SEO Checks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  seo-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install OpenSEO CLI
        run: npm install -g @openseo/cli
        
      - name: Run SEO Audit
        run: openseo audit --url ${{ secrets.PRODUCTION_URL }}
        env:
          OPENSEO_API_KEY: ${{ secrets.OPENSEO_API_KEY }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
seo_checks:
  stage: test
  image: node:20-alpine
  script:
    - npm install -g @openseo/cli
    - openseo audit --url $PRODUCTION_URL
  only:
    - main
  variables:
    PRODUCTION_URL: "https://example.com"
```

### Bitbucket Pipelines

Create `bitbucket-pipelines.yml`:

```yaml
image: node:20

pipelines:
  pull-request:
    - step:
        name: SEO Checks
        script:
          - npm install -g @openseo/cli
          - openseo audit --url $PRODUCTION_URL
  branches:
    main:
      - step:
          name: SEO Checks
          script:
            - npm install -g @openseo/cli
            - openseo audit --url $PRODUCTION_URL
```

## Commands

### audit

Run all SEO checks:

```bash
openseo audit --url <url> [options]
```

Options:
- `--url` - Target URL (required)
- `--config` - Config file path (default: .openseo.yml)
- `--output` - Output format (json, text) (default: text)
- `--fail-fast` - Exit on first failure

### check-robots

Validate robots.txt:

```bash
openseo check-robots --url <url> [options]
```

Options:
- `--blocked-paths` - Paths that should be blocked

### check-canonical

Verify canonical tags:

```bash
openseo check-canonical --url <url> [options]
```

Options:
- `--expected` - Expected canonical URL
- `--enforce-https` - Enforce HTTPS canonical

### check-structured-data

Validate JSON-LD structured data:

```bash
openseo check-structured-data --url <url> [options]
```

Options:
- `--types` - Required schema types (comma-separated)

### check-vitals

Verify Core Web Vitals:

```bash
openseo check-vitals --url <url> [options]
```

Options:
- `--lcp` - LCP threshold in ms (default: 2500)
- `--fid` - FID threshold in ms (default: 100)
- `--cls` - CLS threshold (default: 0.1)
- `--inp` - INP threshold in ms (default: 200)

### check-indexing

Detect staging/indexing issues:

```bash
openseo check-indexing --url <url>
```

### generate-config

Generate configuration template:

```bash
openseo generate-config [options]
```

Options:
- `--output` - Output file path (default: .openseo.yml)
- `--format` - Format (yaml, json) (default: yaml)

## Programmatic Usage

```javascript
const { runAudit } = require('@openseo/cli');

async function main() {
  const results = await runAudit({
    url: 'https://example.com',
    config: {
      vitals: { lcp: 2500, fid: 100, cls: 0.1 }
    }
  });
  
  if (!results.passed) {
    console.error('SEO checks failed:', results.errors);
    process.exit(1);
  }
  
  console.log('All SEO checks passed!');
}

main();
```

## Output Examples

### Success Output

```
✓ robots.txt validated
✓ Canonical tag verified: https://example.com
✓ Structured data valid (Article, Product)
✓ Core Web Vitals within thresholds
  - LCP: 1.8s ✓
  - FID: 45ms ✓
  - CLS: 0.05 ✓
✓ No staging indexing issues detected

All checks passed!
```

### Failure Output

```
✗ robots.txt validation failed
  - /admin should be blocked but is accessible

✗ Core Web Vitals exceeded thresholds
  - LCP: 3.2s (threshold: 2.5s)
  - CLS: 0.15 (threshold: 0.1)

2 checks failed. Fix issues before deployment.
```

## Project Structure

```
├── src/
│   ├── commands/
│   │   ├── audit.js        # Full audit command
│   │   ├── robots.js       # robots.txt check
│   │   ├── canonical.js   # Canonical tag check
│   │   ├── structured-data.js  # Structured data validation
│   │   ├── vitals.js       # Core Web Vitals check
│   │   └── indexing.js    # Staging indexing check
│   └── index.js            # CLI entry point
├── templates/
│   ├── github-actions.yml  # GitHub Actions template
│   └── gitlab-ci.yml       # GitLab CI template
├── package.json
└── README.md
```

## Development

```bash
# Clone and setup
git clone https://github.com/onetrustit-projects-repo/openseo.git
cd openseo/cli

# Install dependencies
npm install

# Link for local testing
npm link

# Run tests
npm test

# Run audit locally
node src/index.js audit --url https://example.com
```

## Publishing to npm

```bash
# Login to npm
npm login

# Publish
npm publish --access public
```

## Task

Task ID: a396c037-be86-4699-8458-3aabebb6c4a5

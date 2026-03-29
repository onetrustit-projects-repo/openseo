# OpenSEO CLI

SEO-aware CLI tool for CI/CD pipelines. Validates robots.txt, canonical tags, structured data, Core Web Vitals, and indexing issues.

## Installation

```bash
npm install -g @openseo/cli
```

## Usage

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

### Generate Config

```bash
openseo generate-config --output .openseo.yml
```

## Exit Codes

- `0` - All checks passed
- `1` - One or more checks failed

## CI/CD Integration

### GitHub Actions

See `.github/workflows/openseo.yml` for the workflow template.

### GitLab CI

See `.gitlab-ci.yml` for the CI template.

## Configuration

Create `.openseo.yml` for persistent configuration:

```yaml
url: https://example.com

vitals:
  lcp: 2500
  fid: 100
  cls: 0.1
  inp: 200

structuredData:
  - Article
  - Product
  - FAQPage

robots:
  blockedPaths:
    - /admin
    - /staging
```

---

Task: a396c037-be86-4699-8458-3aabebb6c4a5

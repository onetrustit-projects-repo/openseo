# Automated Technical SEO Audit Engine

Comprehensive automated audit system that crawls websites to identify technical SEO issues. Features include broken link detection, duplicate content identification, redirect chain analysis, meta tag validation, schema markup checking, and prioritized remediation reports.

## Features

### Crawling
- **Website Crawling**: Full-site crawling with configurable depth
- **JavaScript Rendering**: Playwright-based for JS-heavy sites
- **Rate Limiting**: Respectful crawling with configurable delays
- **Queue Management**: Redis-based distributed crawling queue
- **Crawl Budget**: Optimize crawl efficiency

### Issue Detection

#### Broken Links
- 404 error detection
- 5xx server error detection
- External link validation
- Internal link tracking

#### Redirect Chains
- Multi-hop redirect detection
- Redirect chain length tracking
- Loop detection
- Mixed content redirect detection

#### Duplicate Content
- SimHash-based similarity detection
- Canonical tag analysis
- Near-duplicate detection
- Content fingerprinting

#### Meta Tags
- Missing title detection
- Duplicate meta descriptions
- Title length validation (50-60 chars)
- Meta description length (150-160 chars)
- Open Graph tag analysis

#### Schema Markup
- JSON-LD validation
- Schema.org error detection
- Missing required fields
- Invalid type detection
- Property validation

#### Crawl Issues
- robots.txt blocking detection
- noindex detection
- canonical chain issues
- hreflang validation
- Sitemap analysis

### Reporting

#### Severity Ratings
- **Critical**: Direct ranking impact (broken links, 5xx errors)
- **High**: Important issues (missing meta, redirect loops)
- **Medium**: Moderate impact (duplicate content, long redirect chains)
- **Low**: Minor improvements (title length, description length)

#### Remediation Reports
- Specific fix recommendations
- Affected URLs list
- Code snippets for fixes
- Priority ordering

### Scheduled Audits
- Recurring audit scheduling
- Delta detection between runs
- Progress tracking over time
- Automatic notifications

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│   Audit API     │
│  (React)        │     │   (Express)    │
│  Port: 3460   │     │   Port: 3091   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Crawler       │
                        │  (Playwright)  │
                        └─────────────────┘
```

## Quick Start

### API Server

```bash
cd api
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Audit

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/audit/run` | Start new audit |
| GET | `/api/audit/:id` | Get audit status |
| GET | `/api/audit` | List all audits |
| GET | `/api/audit/:id/results` | Get audit results |
| POST | `/api/audit/:id/cancel` | Cancel audit |
| GET | `/api/audit/:id/progress` | Get crawl progress |

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | List all issues |
| GET | `/api/issues/summary` | Issue summary by severity |
| GET | `/api/issues/remediation` | Remediation recommendations |
| GET | `/api/issues/by-type/:type` | Issues by type |
| DELETE | `/api/issues/:id` | Dismiss issue |

### Crawl

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/crawl/start` | Start crawl manually |
| GET | `/api/crawl/:id/status` | Crawl status |
| POST | `/api/crawl/schedule` | Schedule recurring crawl |

## Example Usage

### Start Audit

```bash
curl -X POST http://localhost:3091/api/audit/run \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "maxPages": 100,
    "maxDepth": 3,
    "respectRobots": true
  }'
```

### Get Audit Results

```bash
curl http://localhost:3091/api/audit/audit_123/results
```

### Get Issue Summary

```bash
curl http://localhost:3091/api/issues/summary
```

### Get Remediation Recommendations

```bash
curl "http://localhost:3091/api/issues/remediation?severity=high"
```

## Issue Types

| Type | Description | Severity |
|------|-------------|----------|
| broken_link | 404 or unreachable page | critical |
| redirect_chain | Multiple redirects in chain | high |
| redirect_loop | Redirect loop detected | critical |
| missing_title | Page has no title tag | high |
| duplicate_title | Multiple pages with same title | medium |
| missing_description | Page has no meta description | medium |
| duplicate_description | Duplicate meta descriptions | low |
| invalid_schema | Schema markup has errors | high |
| missing_schema | Important schema not present | medium |
| blocked_by_robots | robots.txt blocking crawl | high |
| noindex_found | noindex directive found | medium |
| canonical_chain | Canonical chain issues | medium |

## Severity Levels

| Level | Color | Description |
|-------|-------|-------------|
| critical | red | Direct negative impact on SEO |
| high | orange | Important issues to fix soon |
| medium | yellow | Moderate impact |
| low | blue | Minor improvements |

## Remediation Examples

### Fix Broken Links

```javascript
{
  "issue": "broken_link",
  "affectedUrls": [
    "https://example.com/old-page",
    "https://example.com/moved-page"
  ],
  "recommendation": "Set up 301 redirects to relevant pages",
  "fixCode": "redirect 301 /old-page /new-page"
}
```

### Fix Redirect Chain

```javascript
{
  "issue": "redirect_chain",
  "chain": [
    "/A -> /B (301)",
    "/B -> /C (301)",
    "/C -> /D (301)"
  ],
  "recommendation": "Redirect A directly to D",
  "fixCode": "redirect 301 /A /D"
}
```

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   ├── crawler/
│   │   │   └── crawler.js    # Playwright crawler
│   │   └── routes/
│   │       ├── audit.js     # Audit endpoints
│   │       ├── issues.js    # Issue endpoints
│   │       └── crawl.js     # Crawl endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Dashboard UI
│   │   └── main.jsx          # Entry point
│   └── package.json
└── README.md
```

## Development

### Run API

```bash
cd api
npm install
npm run dev
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Task

Task ID: f8f54be4-2d0e-46d0-9a89-113fcf2cc008

# Automated Technical SEO Audit Engine

Comprehensive automated audit system for technical SEO issues.

## Features

- **Crawler**: Extracts links, meta tags, schema markup
- **Broken Link Detection**: 404 errors and dead pages
- **Redirect Chain Tracking**: Multi-hop redirect analysis
- **Schema Validation**: JSON-LD error detection
- **Meta Tag Analysis**: Missing/duplicate tags
- **Duplicate Content Detection**: SimHash-based
- **Prioritized Reports**: Severity-based issue ranking

## API Endpoints

- `POST /api/audit/run` - Start new audit
- `GET /api/audit/:id` - Get audit status
- `GET /api/audit` - List all audits
- `GET /api/audit/:id/results` - Get audit results
- `GET /api/issues` - List issues
- `GET /api/issues/summary` - Issue summary
- `GET /api/issues/remediation` - Fix recommendations

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: f8f54be4-2d0e-46d0-9a89-113fcf2cc008

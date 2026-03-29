# Backlink Analysis Module

Comprehensive backlink discovery, monitoring, and analysis for OpenSEO.

## Features

### Backlink Discovery & Monitoring
- Track new and lost backlinks
- Analyze anchor text distribution
- Domain authority metrics
- Competitor backlink comparison

### Toxic Link Detection
- ML-based spam pattern detection
- Risk scoring (high/medium/low)
- Automatic recommendations
- Disavow file management

### Disavow Management
- Add/remove domains and URLs
- Generate Google-compatible disavow files
- Parse existing disavow files
- Upload disavow files

### Link Building Outreach
- Create and manage campaigns
- Track prospect outreach
- Monitor status progression
- Outreach history logging

## API Endpoints

### Backlinks
- `GET /api/backlinks` - List backlinks
- `GET /api/backlinks/summary` - Get summary
- `GET /api/backlinks/anchors` - Anchor text distribution
- `POST /api/backlinks/discover` - Discover new backlinks

### Analysis
- `POST /api/analysis/toxicity` - Analyze toxic patterns
- `POST /api/analysis/domain-authority` - Calculate DA metrics
- `POST /api/analysis/compare` - Compare domains
- `GET /api/analysis/report/:domain` - Full report

### Disavow
- `GET /api/disavow` - List entries
- `POST /api/disavow/generate` - Generate file
- `POST /api/disavow/parse` - Parse content
- `POST /api/disavow/entries` - Add entries
- `GET /api/disavow/export` - Export file

### Outreach
- `GET /api/outreach/campaigns` - List campaigns
- `POST /api/outreach/campaigns` - Create campaign
- `POST /api/outreach/prospects` - Add prospects
- `GET /api/outreach/stats` - Statistics

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: 534c9b58-dfc8-40a2-a3a3-6061bf3fd9e4

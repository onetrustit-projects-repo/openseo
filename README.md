# Backlink Analysis Module

Comprehensive backlink discovery, monitoring, and analysis for OpenSEO. Features include backlink tracking, anchor text analysis, toxic link detection, domain authority metrics, competitor comparison, disavow file management, and link building outreach tracking.

## Features

### Backlink Discovery & Monitoring
- **New/Lost Tracking**: Track newly acquired and recently lost backlinks
- **Anchor Text Analysis**: Distribution and keyword analysis of anchor text
- **Domain Authority Metrics**: DA/PA scoring with trend analysis
- **Competitor Comparison**: Compare backlink profiles against competitors
- **Historical Data**: Track backlinks over time with first-seen/last-seen

### Toxic Link Detection
- **ML-Based Pattern Detection**: Identify spam and manipulative link patterns
- **Risk Scoring**: High/Medium/Low toxicity classifications
- **Pattern Library**: Casino, pharma, adult content, link schemes, etc.
- **Automatic Recommendations**: Suggest disavow actions for toxic links

### Disavow File Management
- **Add/Remove Entries**: Manage domains and URLs to disavow
- **Google-Compatible Format**: Generate valid disavow files
- **Parse Existing Files**: Import current disavow files
- **Bulk Operations**: Add multiple entries at once

### Link Building Outreach
- **Campaign Management**: Create and track link building campaigns
- **Prospect Tracking**: Manage outreach prospects with status
- **Status Progression**: New → Contacted → Follow-up → Guest Post → Live
- **Outreach History**: Log all communication attempts

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│  Backlink API   │
│  (React)        │     │  (Express)     │
│  Port: 3456     │     │  Port: 3088    │
└─────────────────┘     └─────────────────┘
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

### Backlinks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/backlinks` | List backlinks with filtering |
| GET | `/api/backlinks/summary` | Get backlink summary |
| GET | `/api/backlinks/anchors` | Anchor text distribution |
| POST | `/api/backlinks/discover` | Discover new backlinks |
| GET | `/api/backlinks/history` | Historical data |

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/toxicity` | Analyze toxic patterns |
| POST | `/api/analysis/domain-authority` | Calculate DA metrics |
| POST | `/api/analysis/compare` | Compare domains |
| GET | `/api/analysis/report/:domain` | Full analysis report |
| GET | `/api/analysis/competitors` | List competitors |

### Disavow

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/disavow` | List disavow entries |
| POST | `/api/disavow/entries` | Add entries |
| DELETE | `/api/disavow/:id` | Remove entry |
| POST | `/api/disavow/generate` | Generate disavow file |
| POST | `/api/disavow/parse` | Parse disavow file |
| GET | `/api/disavow/export` | Export disavow file |

### Outreach

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/outreach/campaigns` | List campaigns |
| POST | `/api/outreach/campaigns` | Create campaign |
| GET | `/api/outreach/campaigns/:id` | Get campaign |
| POST | `/api/outreach/prospects` | Add prospects |
| PATCH | `/api/outreach/prospects/:id` | Update prospect |
| GET | `/api/outreach/stats` | Outreach statistics |

## Example Usage

### Analyze Backlinks for Toxicity

```bash
curl -X POST http://localhost:3088/api/analysis/toxicity \
  -H "Content-Type: application/json" \
  -d '{
    "backlinks": [
      {"source": "https://spam-site.com/link", "anchorText": "casino bonus"},
      {"source": "https://blog.example.com/seo", "anchorText": "learn seo"}
    ]
  }'
```

### Generate Disavow File

```bash
curl -X POST http://localhost:3088/api/disavow/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "openseo.io",
    "entries": [
      {"type": "domain", "value": "spam-site.com"},
      {"type": "url", "value": "https://bad-link.com/page"}
    ]
  }'
```

### Create Outreach Campaign

```bash
curl -X POST http://localhost:3088/api/outreach/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Guest Post Outreach Q2",
    "target": "openseo.io",
    "goal": 50,
    "startDate": "2026-04-01"
  }'
```

### Compare Domains

```bash
curl -X POST http://localhost:3088/api/analysis/compare \
  -H "Content-Type: application/json" \
  -d '{
    "domains": ["openseo.io", "ahrefs.com", "semrush.com"]
  }'
```

## Toxicity Patterns

The system detects these toxic patterns:

| Pattern | Weight | Description |
|---------|--------|-------------|
| casino | 0.8 | Casino/gambling content |
| pharma | 0.7 | Pharmaceutical spam |
| porn | 0.95 | Adult content |
| xxx | 0.9 | Adult content |
| buy links | 0.9 | Paid link scheme |
| free backlink | 0.9 | Link scheme |
| forex | 0.5 | Trading |
| bitcoin | 0.4 | Cryptocurrency |

Risk levels:
- **High**: Score >= 0.7
- **Medium**: Score >= 0.4
- **Low**: Score < 0.4

## Outreach Status Flow

```
NEW → CONTACTED → FOLLOW_UP → GUEST_POST_SUBMITTED → LIVE
```

## Domain Authority Metrics

Calculated based on:
- Total backlinks
- Unique referring domains
- Link diversity (DoFollow vs NoFollow)
- TLD distribution (.edu, .gov, .com, etc.)
- Link velocity (new links over time)

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── backlinks.js    # Backlink endpoints
│   │       ├── analysis.js     # Analysis endpoints
│   │       ├── disavow.js      # Disavow endpoints
│   │       └── outreach.js     # Outreach endpoints
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

Task ID: 534c9b58-dfc8-40a2-a3a3-6061bf3fd9e4

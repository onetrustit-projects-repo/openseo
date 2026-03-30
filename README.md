# Competitive Keyword Intelligence Dashboard

Comprehensive keyword research and competitive analysis features for OpenSEO, including ranking trends, competitor benchmarks, SERP feature tracking, and gap analysis.

## Features

### Keyword Management
- **Keyword Portfolio**: Track and manage keyword lists
- **Difficulty Scoring**: Calculate keyword difficulty based on competition
- **Search Volume**: Historical and current search volume data
- **CPC Metrics**: Cost-per-click and competition level
- **Position Tracking**: Monitor keyword positions with change detection

### SERP Feature Tracking
- **Featured Snippets**: Track and monitor featured snippet opportunities
- **People Also Ask**: Monitor PAA boxes for keywords
- **Video Results**: Track video presence in SERPs
- **Image Pack**: Monitor image pack visibility
- **Local Pack**: Track local business pack appearances

### Competitive Analysis
- **Competitor Benchmarking**: Compare keyword performance against competitors
- **Authority Score**: Domain authority comparison
- **Keyword Overlap**: Identify shared and unique keywords
- **Gap Analysis**: Find keywords competitors rank for that you don't
- **Position Comparison**: Side-by-side ranking comparison

### Trend Analysis
- **Historical Trends**: Track keyword positions over time
- **Volume Trends**: Search volume changes over time
- **Position Forecasting**: Predict future rankings
- **Trend Visualization**: Charts and graphs for analysis

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│  Keyword API    │
│  (React)        │     │  (Express)     │
│  Port: 3457    │     │  Port: 3089    │
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

### Keywords

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/keywords` | List keywords |
| GET | `/api/keywords/summary` | Portfolio summary |
| GET | `/api/keywords/difficulty` | Difficulty breakdown |
| POST | `/api/keywords` | Add keyword |
| DELETE | `/api/keywords/:id` | Remove keyword |
| GET | `/api/keywords/trends` | Keyword trend data |

### SERP

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/serp/features` | SERP features list |
| GET | `/api/serp/analysis/:keyword` | Analyze keyword SERP |
| POST | `/api/serp/track` | Track SERP features |
| GET | `/api/serp/history` | SERP history |

### Competitors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/competitors` | List competitors |
| GET | `/api/competitors/analysis` | Competitive analysis |
| GET | `/api/competitors/gap` | Keyword gap analysis |
| GET | `/api/competitors/overlap` | Keyword overlap |

### Trends

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trends/keywords` | Keyword trends |
| GET | `/api/trends/volume` | Volume trends |
| GET | `/api/trends/forecast` | Position forecast |
| GET | `/api/trends/compare` | Compare trends |

## Example Usage

### Add Keyword

```bash
curl -X POST http://localhost:3089/api/keywords \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "seo tools",
    "searchVolume": 18100,
    "difficulty": 65,
    "cpc": 4.50,
    "competition": 0.45
  }'
```

### Get Keyword Gap Analysis

```bash
curl "http://localhost:3089/api/competitors/gap?domains=openseo.io,competitor1.com,competitor2.com"
```

### Track SERP Features

```bash
curl -X POST http://localhost:3089/api/serp/track \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "best seo tools",
    "features": ["featured_snippet", "people_also_ask", "video"]
  }'
```

### Get Position Forecast

```bash
curl "http://localhost:3089/api/trends/forecast?keyword=seo%20tools&days=30"
```

## Keyword Difficulty Calculation

Difficulty is calculated based on:
- Domain authority of top-ranking pages
- Number of backlinks to ranking pages
- Search result quality
- Competition level (paid ads)

Formula:
```
difficulty = (avgDA * 0.3) + (avgBacklinks * 0.3) + (competition * 0.4)
```

## SERP Features

| Feature | Description |
|---------|-------------|
| featured_snippet | Position 0 box with answer |
| people_also_ask | Related questions box |
| video | Video carousel |
| image_pack | Image results carousel |
| local_pack | Local business listings |
| top_stories | News articles |
| shopping | Product listings |

## Gap Analysis

Gap analysis identifies:
- **Opportunities**: Keywords competitors rank for that you don't
- **Weaknesses**: Keywords you rank for but competitors outrank you
- **Strengths**: Keywords where you outperform competitors

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── keywords.js     # Keyword endpoints
│   │       ├── serp.js         # SERP endpoints
│   │       ├── competitors.js  # Competitor endpoints
│   │       └── trends.js       # Trend endpoints
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

Task ID: 294433ac-0262-44dc-95b4-188f7811b8aa

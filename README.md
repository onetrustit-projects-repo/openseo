# OpenSEO Clone - Self-Hosted SEO Platform

100% self-hosted SEO tool with no third-party API dependencies.

## Features

- **Keyword Research**: Google Suggest-based keyword discovery
- **Backlink Analysis**: Analyze backlinks and domain authority
- **Site Audits**: Lighthouse-style SEO audits
- **Rank Tracking**: Track keyword rankings over time

## Architecture

```
├── backend/          # Express.js API (port 3002)
│   └── src/
│       ├── routes/   # API endpoints
│       └── server.js
├── frontend/         # Next.js 14 (port 3000)
│   └── src/
│       └── app/     # App Router pages
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm start  # Runs on port 3002
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

Open http://localhost:3000

## API Endpoints

- `GET /api/keywords/suggest?q=term` - Get keyword suggestions
- `GET /api/keywords/research?q=term` - Full keyword research
- `GET /api/backlinks?domain=example.com` - Backlink analysis
- `GET /api/audits?url=https://example.com` - Site audit
- `GET /api/ranks?keyword=term&domain=example.com` - Rank tracking

## Self-Hosted

No third-party API dependencies required. All features use local analysis or free data sources.

# OpenSEO Public REST API with Developer Portal

Comprehensive REST API for SEO features with interactive developer portal.

## Features

- **URL Auditing**: Full page analysis for SEO issues
- **Keyword Analysis**: Research, difficulty scoring, and tracking
- **Schema Validation**: Validate and generate structured data markup
- **Content Scoring**: SEO content quality analysis
- **Rank Tracking**: Monitor keyword positions across search engines
- **Site Crawling**: Bulk site analysis and sitemap generation
- **Webhook Support**: Event-driven notifications
- **Developer Portal**: Interactive documentation and API key management

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Developer      │────▶│   REST API      │
│  Portal         │     │   (Express)     │
│  (React)        │     │   Port: 3080    │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  In-Memory      │
                        │  Storage        │
                        └─────────────────┘
```

## Quick Start

### API Server
```bash
cd api
npm install
npm run dev
```

### Developer Portal
```bash
cd portal
npm install
npm run dev
```

## API Endpoints

### URL Audit
- `POST /api/url-audit/analyze` - Analyze URL for SEO issues
- `POST /api/url-audit/batch` - Batch analyze multiple URLs
- `GET /api/url-audit/history/:url` - Get audit history

### Keywords
- `POST /api/keywords/research` - Research keywords
- `POST /api/keywords/analyze` - Analyze keyword metrics
- `POST /api/keywords/track` - Track keyword rankings

### Schema
- `POST /api/schema/validate` - Validate schema markup
- `POST /api/schema/generate` - Generate schema markup

### Content
- `POST /api/content/score` - Score content for SEO
- `POST /api/content/analyze` - Deep content analysis

### Rank Tracking
- `POST /api/ranks/track` - Track keyword rankings
- `POST /api/ranks/history` - Get ranking history
- `GET /api/ranks/features` - Get SERP features

### Site Crawling
- `POST /api/crawl/start` - Start crawl job
- `GET /api/crawl/status/:jobId` - Get crawl status
- `GET /api/crawl/results/:jobId` - Get crawl results

### Webhooks
- `POST /api/webhooks` - Register webhook
- `GET /api/webhooks` - List webhooks
- `GET /api/webhooks/events` - Available events

### Analytics
- `GET /api/analytics/usage` - Get usage analytics
- `GET /api/analytics/limits` - Get rate limits

## Authentication

Include your API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key" https://api.openseo.dev/api/url-audit/analyze
```

## API Documentation

Interactive documentation available at `/api-docs` when the server is running.

---

Task: 876d5efc-2848-4e7c-b36c-9f088be20ff3

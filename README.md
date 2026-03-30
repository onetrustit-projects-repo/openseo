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
- **OpenAPI Spec**: Full OpenAPI 3.0 documentation

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Developer      │────▶│   REST API      │
│  Portal         │     │   (Express)     │
│  (React)        │     │   Port: 3080   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  In-Memory     │
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

## Authentication

All API requests require authentication via API key.

### Using API Key

Include your API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key" https://api.openseo.dev/api/url-audit/analyze
```

### Test Keys

For development, use these test keys:
- `openseo-test-key-001` - Free plan (100 requests/min)
- `openseo-test-key-002` - Pro plan (1000 requests/min)

## API Endpoints

### URL Audit

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/url-audit/analyze` | Analyze URL for SEO issues |
| POST | `/api/url-audit/batch` | Batch analyze multiple URLs |
| GET | `/api/url-audit/history/:url` | Get audit history |

### Keywords

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/keywords/research` | Research keywords |
| POST | `/api/keywords/analyze` | Analyze keyword metrics |
| POST | `/api/keywords/track` | Track keyword rankings |

### Schema

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/schema/validate` | Validate schema markup |
| POST | `/api/schema/generate` | Generate schema markup |

### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/content/score` | Score content for SEO |
| POST | `/api/content/analyze` | Deep content analysis |

### Rank Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ranks/track` | Track keyword rankings |
| POST | `/api/ranks/history` | Get ranking history |
| GET | `/api/ranks/features` | Get SERP features |

### Site Crawling

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/crawl/start` | Start crawl job |
| GET | `/api/crawl/status/:jobId` | Get crawl status |
| GET | `/api/crawl/results/:jobId` | Get crawl results |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks` | Register webhook |
| GET | `/api/webhooks` | List webhooks |
| GET | `/api/webhooks/events` | Available events |
| DELETE | `/api/webhooks/:id` | Delete webhook |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/usage` | Get usage analytics |
| GET | `/api/analytics/limits` | Get rate limits |
| GET | `/api/analytics/summary` | Get account summary |

## Code Examples

### cURL

```bash
# Analyze a URL
curl -X POST https://api.openseo.dev/api/url-audit/analyze \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Research keywords
curl -X POST https://api.openseo.dev/api/keywords/research \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"seed": "SEO tools", "limit": 10}'
```

### Node.js

```javascript
const response = await fetch('https://api.openseo.dev/api/url-audit/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data.data.score);
```

### Python

```python
import requests

# Analyze URL
response = requests.post(
    'https://api.openseo.dev/api/url-audit/analyze',
    headers={'X-API-Key': 'your-api-key'},
    json={'url': 'https://example.com'}
)
data = response.json()
print(f"Score: {data['data']['score']}")

# Research keywords
response = requests.post(
    'https://api.openseo.dev/api/keywords/research',
    headers={'X-API-Key': 'your-api-key'},
    json={'seed': 'SEO tools', 'limit': 10}
)
keywords = response.json()['keywords']
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    body, _ := json.Marshal(map[string]string{"url": "https://example.com"})
    req, _ := http.NewRequest("POST", "https://api.openseo.dev/api/url-audit/analyze", 
        bytes.NewBuffer(body))
    req.Header.Set("X-API-Key", "your-api-key")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}
```

## Webhooks

Register webhooks to receive notifications when events occur.

### Available Events

- `audit.complete` - URL audit completed
- `crawl.complete` - Site crawl completed
- `rank.change` - Keyword ranking changed
- `issue.detected` - New SEO issue detected
- `report.ready` - Scheduled report ready

### Register Webhook

```bash
curl -X POST https://api.openseo.dev/api/webhooks \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["audit.complete", "crawl.complete"]
  }'
```

### Webhook Payload

```json
{
  "event": "audit.complete",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "url": "https://example.com",
    "score": 87
  }
}
```

## Rate Limits

| Plan | Requests/min | Requests/month |
|------|--------------|----------------|
| Free | 100 | 10,000 |
| Pro | 1,000 | 100,000 |
| Enterprise | 10,000 | Unlimited |

## API Documentation

Interactive documentation available at:
- `/api-docs` - Swagger UI
- `/api-docs.json` - OpenAPI JSON spec

## Development

### Run API Server

```bash
cd api
npm install
npm run dev
```

### Run Portal

```bash
cd portal
npm install
npm run dev
```

### Run Both

```bash
# Terminal 1
cd api && npm run dev

# Terminal 2
cd portal && npm run dev
```

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   ├── middleware/
│   │   │   └── auth.js       # API key & JWT auth
│   │   └── routes/
│   │       ├── auth.js       # Authentication
│   │       ├── url-audit.js  # URL auditing
│   │       ├── keywords.js    # Keyword research
│   │       ├── schema.js     # Schema validation
│   │       ├── content.js     # Content scoring
│   │       ├── ranks.js      # Rank tracking
│   │       ├── crawl.js      # Site crawling
│   │       ├── webhooks.js   # Webhook management
│   │       └── analytics.js   # Usage analytics
│   ├── docs/
│   │   └── openapi.yaml      # OpenAPI spec
│   └── package.json
├── portal/
│   ├── src/
│   │   ├── App.jsx          # Developer portal UI
│   │   └── main.jsx          # Entry point
│   └── package.json
└── README.md
```

## Task

Task ID: 876d5efc-2848-4e7c-b36c-9f088be20ff3

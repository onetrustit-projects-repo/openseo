# Core Web Vitals Monitoring and Optimization Suite

Real user monitoring (RUM) and synthetic testing platform for Core Web Vitals metrics (LCP, FID, CLS, INP).

## Features

### Real User Monitoring (RUM)
- **web-vitals SDK**: Lightweight JavaScript snippet for collecting real user metrics
- **Browser-native**: Uses Performance Observer API, no external dependencies
- **Session-based**: Automatic collection on page load and interaction
- **Privacy-preserving**: Sends only essential metric data

### Synthetic Testing
- **Playwright-based**: Real browser testing with Lighthouse metrics
- **Multi-device**: Desktop and mobile simulation
- **Thresholds evaluated**: Automatic pass/fail against Core Web Vitals thresholds
- **Opportunity detection**: Identifies specific optimization opportunities

### Dashboard
- **Overview Tab**: Summary scores, device breakdown, geographic distribution
- **Trend Charts**: 30-day metric history with p75 values
- **Alerts**: Threshold-based alerting for poor performance
- **Recommendations**: Actionable optimization tips with code examples

### API
- RESTful endpoints for all operations
- Supports metric collection, synthetic testing, alerts
- Time-series data aggregation

## Architecture

```
┌─────────────────────┐
│   Client Website    │
│  (web-vitals SDK)   │
└──────────┬──────────┘
           │
           ▼ POST /api/collect
┌─────────────────────┐
│   Backend API       │
│   (Express)         │
│   Port: 3090        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Dashboard UI     │
│   (React)           │
└─────────────────────┘
```

## Quick Start

### Backend

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

### Add RUM to Your Site

Add the SDK to your HTML:

```html
<script 
  src="https://your-domain.com/web-vitals-sdk.js" 
  data-endpoint="https://your-domain.com/api/collect"
></script>
```

Or initialize manually:

```html
<script>
  OpenSeoWebVitals.init({ 
    endpoint: '/api/collect',
    debug: false 
  });
</script>
```

## API Endpoints

### Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics` | List all page metrics |
| GET | `/api/metrics/summary` | Overall summary |
| GET | `/api/metrics/history/:page` | Historical data for page |
| GET | `/api/metrics/devices` | Device breakdown |
| GET | `/api/metrics/geo` | Geographic distribution |
| POST | `/api/collect` | Collect RUM data |
| GET | `/api/collect/history` | Get collected metrics |
| GET | `/api/collect/aggregate` | Aggregated time-series data |

### Synthetic Testing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/synthetic/tests` | List tests |
| POST | `/api/synthetic/run` | Run new test |
| GET | `/api/synthetic/results/:id` | Get test results |
| DELETE | `/api/synthetic/:id` | Delete test |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List alerts |
| POST | `/api/alerts` | Create alert |
| PATCH | `/api/alerts/:id/acknowledge` | Acknowledge alert |
| DELETE | `/api/alerts/:id` | Delete alert |

### Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | All recommendations |
| GET | `/api/recommendations?metric=LCP` | Filter by metric |
| GET | `/api/recommendations/:id` | Get specific recommendation |

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4s | > 4s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| INP | ≤ 200ms | 200ms - 500ms | > 500ms |

## Key Files

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── metrics.js     # Metrics endpoints
│   │       ├── synthetic.js   # Playwright testing
│   │       ├── alerts.js      # Alert management
│   │       ├── recommendations.js  # Optimization tips
│   │       └── collection.js  # RUM collection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Dashboard UI
│   │   └── main.jsx           # Entry point
│   ├── public/
│   │   └── web-vitals-sdk.js  # RUM collection SDK
│   └── package.json
└── README.md
```

## Configuration

### Environment Variables

```env
PORT=3090
NODE_ENV=development
```

### Dashboard Port

Frontend runs on port 5173 (Vite dev server) by default.
Backend API runs on port 3090.

Update `vite.config.js` if API is on different port:

```js
server: {
  proxy: {
    '/api': 'http://localhost:3090'
  }
}
```

## Example: Collect Metrics

```bash
# Send RUM metrics
curl -X POST http://localhost:3090/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "page": "/pricing",
    "url": "https://example.com/pricing",
    "metrics": {
      "LCP": 2.3,
      "FID": 45,
      "CLS": 0.05,
      "INP": 120
    },
    "userAgent": "Mozilla/5.0..."
  }'

# Get aggregated metrics
curl "http://localhost:3090/api/collect/aggregate?page=/pricing&interval=1h"

# Run synthetic test
curl -X POST http://localhost:3090/api/synthetic/run \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "device": "desktop"}'
```

## Development

### Run Both Services

```bash
# Terminal 1
cd api && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Build for Production

```bash
cd frontend && npm run build
```

## Task

Task ID: fcb28672-a50e-4498-b92d-c17b4c9bec9b

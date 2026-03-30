# Google Search Console Integration Dashboard

Connect to Google Search Console API to automatically import keyword rankings, impressions, click-through rates, and search performance data. Features include trends over time, customizable date ranges, pre/post campaign comparison, and anomaly detection for traffic drops.

## Features

### Google Search Console Integration
- **OAuth2 Authentication**: Secure GSC connection via OAuth2
- **Automatic Data Sync**: Daily background sync with GSC
- **Historical Data**: Store and query historical performance data
- **Multi-site Support**: Connect multiple GSC properties

### Performance Metrics
- **Keyword Rankings**: Track keyword positions over time
- **Impressions**: Monitor search impression volume
- **Click-Through Rate**: Analyze CTR trends
- **Average Position**: Track ranking position changes
- **Device Breakdown**: Desktop, mobile, tablet performance
- **Geographic Data**: Performance by country/region

### Dashboard & Visualization
- **Performance Trends**: Line charts for clicks, impressions, CTR
- **Top Pages**: Best performing pages by traffic
- **Top Queries**: Highest ranking keywords
- **Date Range Selection**: Custom date ranges for analysis
- **Campaign Comparison**: Pre/post campaign performance

### Alerting & Insights
- **Anomaly Detection**: Automatic detection of traffic drops
- **Ranking Changes**: Alert on significant position changes
- **Impression Drops**: Notify on impression decreases
- **Custom Thresholds**: Configurable alert sensitivity

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│   GSC API       │
│  (React)        │     │   (Express)    │
│  Port: 3453   │     │   Port: 3094   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Google Search  │
                        │  Console API    │
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

## Google OAuth2 Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Search Console API"
4. Create OAuth 2.0 credentials

### 2. Configure OAuth Consent

1. Go to APIs & Services > OAuth consent screen
2. Choose "External" user type
3. Add scopes: `https://www.googleapis.com/auth/webmasters.readonly`
4. Add test users for development

### 3. Get Credentials

1. Go to APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Note your Client ID and Client Secret

### 4. Set Environment Variables

```bash
GSC_CLIENT_ID=your-client-id
GSC_CLIENT_SECRET=your-client-secret
GSC_REDIRECT_URI=http://localhost:3094/api/gsc/oauth/callback
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gsc/oauth/url` | Get OAuth consent URL |
| GET | `/api/gsc/oauth/callback` | OAuth callback |
| GET | `/api/gsc/oauth/status` | Check auth status |
| POST | `/api/gsc/oauth/revoke` | Revoke access |

### Performance Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gsc/performance` | Performance metrics |
| GET | `/api/gsc/analytics` | Analytics summary |
| GET | `/api/gsc/top-pages` | Top performing pages |
| GET | `/api/gsc/top-queries` | Top ranking queries |
| GET | `/api/gsc/device-breakdown` | Device performance |
| GET | `/api/gsc/geo-breakdown` | Geographic data |

### Sync & Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/trigger` | Trigger manual sync |
| GET | `/api/sync/status` | Sync job status |
| GET | `/api/sync/history` | Sync history |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/anomalies` | Detected anomalies |
| POST | `/api/alerts/configure` | Configure alert thresholds |
| GET | `/api/alerts/history` | Alert history |

## Example Usage

### Get Performance Metrics

```bash
curl "http://localhost:3094/api/gsc/performance?startDate=2026-01-01&endDate=2026-01-31"
```

### Get Top Pages

```bash
curl "http://localhost:3094/api/gsc/top-pages?limit=10&sortBy=clicks"
```

### Get Top Queries

```bash
curl "http://localhost:3094/api/gsc/top-queries?limit=20&sortBy=position"
```

### Trigger Manual Sync

```bash
curl -X POST http://localhost:3094/api/sync/trigger
```

### Get Anomalies

```bash
curl "http://localhost:3094/api/alerts/anomalies?days=7&severity=high"
```

## Date Ranges

Common date range presets:
- `7d` - Last 7 days
- `30d` - Last 30 days
- `90d` - Last 90 days
- `yesterday` - Yesterday only
- `7dBefore` - 7 days before same period last month
- `compare` - Compare to previous period

## Anomaly Detection

The system automatically detects:

| Anomaly Type | Detection Method |
|--------------|------------------|
| Traffic Drop | > 20% decrease in clicks |
| Impression Drop | > 30% decrease in impressions |
| Ranking Drop | > 5 position decrease for top 10 |
| CTR Drop | > 15% decrease in CTR |

## Performance Metrics

### Response Format

```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "keys": ["query"],
        "clicks": 1234,
        "impressions": 45678,
        "ctr": 0.027,
        "position": 12.3
      }
    ],
    "aggregations": {
      "totalClicks": 50000,
      "totalImpressions": 1000000,
      "averageCtr": 0.05,
      "averagePosition": 15.2
    }
  }
}
```

## Campaign Comparison

Compare performance before and after a campaign:

```bash
curl "http://localhost:3094/api/gsc/analytics/compare?before=2026-01-01&after=2026-02-01&campaign=Valentines"
```

## Scheduled Sync

The system can automatically sync with GSC daily:

```bash
# Enable daily sync
curl -X POST http://localhost:3094/api/sync/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "frequency": "daily",
    "time": "02:00",
    "sites": ["https://example.com"]
  }'
```

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── gsc.js        # GSC endpoints
│   │       ├── sync.js       # Sync endpoints
│   │       └── alerts.js     # Alert endpoints
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

### Environment Variables

```bash
# Google OAuth2
GSC_CLIENT_ID=your-client-id
GSC_CLIENT_SECRET=your-client-secret
GSC_REDIRECT_URI=http://localhost:3094/api/gsc/oauth/callback

# Database (optional)
DATABASE_URL=postgresql://localhost:5432/gsc_data

# Sync
SYNC_API_KEY=your-sync-api-key
```

## Task

Task ID: a8ab6854-5956-47e5-a53a-ab775b00fba2

# Automated Report Generation and White-Labeling

Report generation system with customizable templates for client presentations. Supports PDF, CSV, PPTX, and HTML export formats with full white-label branding capabilities.

## Features

### Report Generation
- **Customizable Report Templates**: Pre-built SEO report templates with drag-and-drop sections
- **Executive Summary Generation**: AI-powered high-level summaries of SEO performance
- **Benchmark Comparisons**: Compare client metrics against industry averages and competitors
- **Multiple Export Formats**: PDF, CSV, PPTX, and HTML export options

### Templates
- **Pre-built Templates**: SEO Summary, Technical Audit, Keyword Tracking
- **Custom Template Builder**: Create custom report templates
- **Section Preview**: Preview template structure before generation
- **Template Library**: Store and manage multiple templates

### Scheduling
- **Automated Delivery**: Schedule reports daily, weekly, or monthly
- **Multiple Recipients**: Send reports to multiple email addresses
- **Manual Trigger**: Trigger report generation on-demand
- **Schedule Management**: Create, edit, pause, and delete schedules

### White-Label Branding
- **Custom Logos**: Upload company logos
- **Brand Colors**: Configure primary, secondary, and accent colors
- **Company Info**: Custom company name, URL, and footer text
- **Brand Preview**: Preview branding before applying
- **Multiple Brands**: Create and manage multiple brand configurations

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│   Reports API   │
│  (React)        │     │   (Express)    │
│  Port: 3461     │     │   Port: 3083   │
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

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | List all reports |
| GET | `/api/reports/:id` | Get report by ID |
| POST | `/api/reports/generate` | Generate new report |
| POST | `/api/reports/:id/export` | Export report in format |
| POST | `/api/reports/executive-summary` | Generate executive summary |
| POST | `/api/reports/benchmark` | Generate benchmark comparison |
| DELETE | `/api/reports/:id` | Delete report |

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/:id` | Get template by ID |
| POST | `/api/templates` | Create custom template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |
| GET | `/api/templates/:id/preview` | Preview template structure |

### Schedules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedules` | List all schedules |
| POST | `/api/schedules` | Create scheduled report |
| PUT | `/api/schedules/:id` | Update schedule |
| DELETE | `/api/schedules/:id` | Delete schedule |
| POST | `/api/schedules/:id/trigger` | Trigger report now |
| GET | `/api/schedules/frequencies` | List available frequencies |

### Branding

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/branding` | List all brandings |
| GET | `/api/branding/:id` | Get branding by ID |
| POST | `/api/branding` | Create new branding |
| PUT | `/api/branding/:id` | Update branding |
| DELETE | `/api/branding/:id` | Delete branding |
| POST | `/api/branding/:id/preview` | Preview branding |
| POST | `/api/branding/:id/logo` | Upload logo |

## Example Usage

### Generate Report

```bash
curl -X POST http://localhost:3083/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "March SEO Report",
    "templateId": "tpl_seo_summary",
    "format": "pdf",
    "branding": { "id": "default" }
  }'
```

### Create Schedule

```bash
curl -X POST http://localhost:3083/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly SEO Summary",
    "templateId": "tpl_seo_summary",
    "frequency": "weekly",
    "time": "09:00",
    "recipients": ["client@example.com"]
  }'
```

### Create White-Label Branding

```bash
curl -X POST http://localhost:3083/api/branding \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme SEO Agency",
    "primaryColor": "#1E40AF",
    "secondaryColor": "#3B82F6",
    "accentColor": "#F59E0B",
    "companyName": "Acme SEO Agency",
    "companyUrl": "https://acme-seo.com",
    "footerText": "Powered by Acme SEO"
  }'
```

### Generate Executive Summary

```bash
curl -X POST http://localhost:3083/api/reports/executive-summary \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "totalKeywords": 1247,
      "organicTraffic": "24.5K",
      "domainRating": 67,
      "backlinks": 8432
    }
  }'
```

### Generate Benchmark

```bash
curl -X POST http://localhost:3083/api/reports/benchmark \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "client.com",
    "competitors": ["competitor1.com", "competitor2.com"]
  }'
```

## Report Templates

### SEO Summary Report
Overview of key SEO metrics including:
- Executive summary
- Keyword performance
- Technical issues
- Backlink analysis
- Recommendations

### Technical Audit Report
Deep dive into technical SEO:
- Site speed metrics
- Crawlability analysis
- Indexability coverage
- Schema markup validation
- Mobile usability

### Keyword Tracking Report
Keyword ranking changes and trends:
- Keyword overview
- Ranking changes
- SERP features
- Competitor analysis

## Export Formats

### PDF
Full-featured report with charts and formatting.

### CSV
Data export for further analysis in spreadsheets.

### PPTX
PowerPoint presentation format for client meetings.

### HTML
Web-ready format for online viewing.

## White-Label Features

Customize reports with your brand:
- **Logo**: Upload company logo (URL or base64)
- **Colors**: Primary, secondary, and accent colors
- **Typography**: Custom font family
- **Company Info**: Name, URL, footer text
- **Preview**: See branding before generating reports

## Scheduling

Report delivery schedules:
- **Daily**: Every day at specified time
- **Weekly**: Once a week on specified day/time
- **Monthly**: Once a month on specified date/time

Each schedule includes:
- Multiple recipients
- Template selection
- Branding options
- Enable/disable toggle

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── reports.js     # Report endpoints
│   │       ├── templates.js   # Template endpoints
│   │       ├── schedules.js   # Schedule endpoints
│   │       └── branding.js   # Branding endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Dashboard UI
│   │   └── main.jsx          # Entry point
│   └── package.json
└── README.md
```

## Development

### Run API Server

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

Task ID: bb502599-5065-4878-abae-875a421a53d4

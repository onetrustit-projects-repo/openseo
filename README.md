# Automated Report Generation and White-Labeling

Report generation system with customizable templates for client presentations.

## Features

### Report Generation
- Customizable report templates
- Executive summary generation
- Benchmark comparisons
- Multiple export formats (PDF, CSV, PPTX, HTML)

### Templates
- Pre-built SEO report templates
- Drag-and-drop section builder
- Template preview

### Scheduling
- Automated report delivery
- Daily, weekly, monthly schedules
- Multiple recipients

### White-Label Branding
- Custom logos and colors
- Brand configuration
- Preview before publishing

## API Endpoints

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports/generate` - Generate report
- `POST /api/reports/:id/export` - Export report
- `POST /api/reports/executive-summary` - Generate summary
- `POST /api/reports/benchmark` - Generate benchmark

### Templates
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `GET /api/templates/:id/preview` - Preview template

### Schedules
- `GET /api/schedules` - List schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `POST /api/schedules/:id/trigger` - Trigger now

### Branding
- `GET /api/branding` - List brandings
- `POST /api/branding` - Create branding
- `PUT /api/branding/:id` - Update branding
- `POST /api/branding/:id/preview` - Preview branding

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: bb502599-5065-4878-abae-875a421a53d4

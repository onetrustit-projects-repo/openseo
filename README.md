# Video and Visual Search SEO Optimization

Comprehensive tools for video and image SEO optimization including transcript analysis, schema generation, alt text optimization, and visual search tracking.

## Features

### Video SEO
- **Video Transcript Analysis**: Extract and analyze video transcripts for searchability
- **Video Schema Generator**: Generate JSON-LD schema markup for videos
- **Batch Video Analysis**: Process multiple videos at once
- **Transcript Quality Scoring**: Evaluate transcript completeness and clarity

### Image SEO
- **Image Alt Text Analysis**: Assess alt text quality and SEO effectiveness
- **Bulk Alt Text Generation**: Generate optimized alt text for multiple images
- **Image Compression Recommendations**: Get size/format optimization suggestions
- **SEO Optimization Checklist**: Comprehensive image optimization audit

### Visual Search Tracking
- **Google Images Ranking**: Track image rankings in Google Image Search
- **Google Lens Visibility**: Analyze how images appear in Google Lens
- **Video Ranking Tracking**: Monitor video positions in search results
- **Visual Search Performance**: Track impressions, clicks, and CTR

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│   Visual API    │
│  (React)        │     │   (Express)    │
│  Port: 3459     │     │   Port: 3081   │
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

### Video SEO

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/video/analyze` | Analyze video for SEO |
| POST | `/api/video/transcript` | Extract and analyze transcript |
| POST | `/api/video/schema` | Generate video schema markup |
| POST | `/api/video/batch` | Batch analyze videos |

### Image SEO

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image/analyze` | Analyze images for SEO |
| POST | `/api/image/alt-text` | Generate optimized alt text |
| POST | `/api/image/bulk-alt` | Bulk generate alt text |
| POST | `/api/image/compress` | Get compression recommendations |
| POST | `/api/image/optimize` | Generate optimization checklist |

### Visual Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/visual/track` | Track visual content rankings |
| POST | `/api/visual/performance` | Get performance metrics |
| POST | `/api/visual/google-lens` | Analyze Google Lens visibility |
| POST | `/api/visual/video-rankings` | Track video rankings |
| GET | `/api/visual/overview` | Get visual search overview |

## Example Usage

### Analyze Video

```bash
curl -X POST http://localhost:3081/api/video/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtube.com/watch?v=example",
    "title": "SEO Tutorial 2024",
    "description": "Complete guide to SEO optimization"
  }'
```

### Generate Video Schema

```bash
curl -X POST http://localhost:3081/api/video/schema \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/videos/tutorial.mp4",
    "title": "SEO Tutorial 2024",
    "description": "Complete guide to SEO optimization",
    "duration": "PT15M30S",
    "uploadDate": "2024-01-15"
  }'
```

### Generate Alt Text

```bash
curl -X POST http://localhost:3081/api/image/alt-text \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/images/product.jpg",
    "imageName": "seo-tools-comparison-2024.jpg",
    "context": "product page showing SEO tools",
    "targetKeywords": ["seo tools", "comparison"]
  }'
```

### Bulk Alt Text

```bash
curl -X POST http://localhost:3081/api/image/bulk-alt \
  -H "Content-Type: application/json" \
  -d '{
    "images": [
      {"url": "https://example.com/1.jpg"},
      {"url": "https://example.com/2.jpg"},
      {"url": "https://example.com/3.jpg"}
    ],
    "context": "product gallery",
    "targetKeywords": ["product", "buy"]
  }'
```

### Track Visual Rankings

```bash
curl -X POST http://localhost:3081/api/visual/track \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "images": [
      {"url": "https://example.com/image1.jpg"},
      {"url": "https://example.com/image2.jpg"}
    ]
  }'
```

## Image Alt Text Best Practices

The alt text generator follows these guidelines:
- **Length**: Keep alt text between 10-125 characters
- **Specificity**: Avoid generic terms like "image" or "picture"
- **Keywords**: Include relevant keywords naturally
- **Context**: Describe what's shown and its purpose
- **Format**: Filenames are converted to readable descriptions

## Video Schema Types

The schema generator creates:
- `VideoObject` - Main video metadata
- `Clip` - Video segments/chapters
- `SeekToAction` - Interactive bookmarkable points

## Compression Recommendations

Recommendations include:
- Format conversion (PNG → WebP/AVIF)
- Quality reduction to 80%
- Dimension scaling for large images
- Target sizes under 200KB

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── video.js       # Video SEO endpoints
│   │       ├── image.js       # Image SEO endpoints
│   │       └── visual.js      # Visual tracking endpoints
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

### Interactive Documentation

API documentation available at:
- `/api-docs` - Swagger UI

## Task

Task ID: bfe0b91a-5349-470e-bc44-309346b421f6

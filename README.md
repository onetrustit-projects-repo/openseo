# AI-Powered Content Optimization Suggestions

Semantic content optimization with AI-powered suggestions for SEO. Features include content brief generation from keywords, NLP-based content scoring, related topic suggestions, readability improvements, and meta description generation.

## Features

### Content Analysis
- **NLP-Based Content Scoring**: Analyze content using natural language processing
- **Semantic Analysis**: Evaluate semantic relevance to target keywords
- **Readability Metrics**: Flesch-Kincaid, Gunning Fog, SMOG index
- **Keyword Density**: Analyze keyword usage and distribution
- **Content Length Recommendations**: Optimal word count suggestions

### Content Brief Generator
- **AI-Generated Briefs**: Create comprehensive briefs from target keywords
- **Top-Ranking Analysis**: Analyze top SERP results for brief structure
- **Required Topics**: List topics to cover based on competitor analysis
- **Suggested Headings**: H1-H6 structure recommendations
- **Target Word Count**: Recommended content length

### Meta Description Generator
- **Character-Aware**: Generate within 155-160 character limit
- **Keyword Integration**: Naturally include target keywords
- **Call-to-Action**: Suggest compelling CTAs
- **Multiple Variations**: Generate A/B testing variants

### Readability Improvements
- **Sentence Length Analysis**: Flag overly long sentences
- **Passive Voice Detection**: Identify passive voice constructions
- **Complex Word Suggestions**: Simplify complex language
- **Paragraph Length**: Recommend shorter paragraphs
- **List Formatting**: Suggest bullet/numbered lists

### Topic Suggestions
- **Semantic Keywords**: Related terms based on embeddings
- **Questions to Answer**: Common questions from SERP analysis
- **Trending Topics**: Currently ranking topics in niche
- **FAQ Suggestions**: FAQ content recommendations

### Heading Structure
- **H1 Optimization**: Title tag recommendations
- **Heading Hierarchy**: Proper H1-H6 structure
- **Keyword Placement**: Where to include keywords in headings

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│   Content API   │
│  (React)        │     │   (Express)    │
│  Port: 3458    │     │   Port: 3092   │
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

### Content Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/content/analyze` | Full NLP content analysis |
| POST | `/api/content/score` | Calculate content score |
| GET | `/api/content/readability` | Readability metrics |

### Brief Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/brief/generate` | Generate content brief |
| POST | `/api/brief/analyze-serp` | Analyze top SERP results |
| GET | `/api/brief/templates` | Available brief templates |

### Suggestions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/suggestions/readability` | Readability improvements |
| POST | `/api/suggestions/topics` | Related topic suggestions |
| POST | `/api/suggestions/headings` | Heading structure tips |
| POST | `/api/suggestions/semantics` | Semantic enhancements |
| POST | `/api/suggestions/keywords` | Keyword suggestions |

### Meta Description

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/content/meta-description` | Generate meta descriptions |

## Example Usage

### Analyze Content

```bash
curl -X POST http://localhost:3092/api/content/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your article content here...",
    "targetKeyword": "seo tools",
    "url": "https://example.com/seo-tools-guide"
  }'
```

### Generate Content Brief

```bash
curl -X POST http://localhost:3092/api/brief/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "best seo tools",
    "targetWordCount": 2000,
    "competitors": 5
  }'
```

### Get Meta Description

```bash
curl -X POST http://localhost:3092/api/content/meta-description \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Best SEO Tools for 2024",
    "content": "Looking for the best SEO tools? Our comprehensive guide covers...",
    "targetKeyword": "seo tools"
  }'
```

### Get Readability Suggestions

```bash
curl -X POST http://localhost:3092/api/suggestions/readability \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your content here..."
  }'
```

### Get Related Topics

```bash
curl -X POST http://localhost:3092/api/suggestions/topics \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "content marketing",
    "count": 10
  }'
```

## Content Score Calculation

Content score (0-100) based on:
- **Keyword Optimization** (25%): Density, placement, variations
- **Readability** (25%): Sentence length, paragraph structure
- **Semantic Relevance** (20%): Related terms, NLP analysis
- **Structure** (15%): Headings, lists, formatting
- **Length** (15%): Word count vs recommended

## Readability Metrics

| Metric | Description | Good Score |
|--------|-------------|------------|
| Flesch Reading Ease | 0-100 scale | 60-70 |
| Gunning Fog Index | Years of education needed | < 12 |
| SMOG Index | Grade level | < 10 |
| Flesch-Kincaid Grade | US grade level | 7-8 |

## NLP Features

The system uses:
- **Sentence Tokenization**: Split content into sentences
- **Part-of-Speech Tagging**: Identify nouns, verbs, adjectives
- **Named Entity Recognition**: Extract entities
- **Keyword Extraction**: TF-IDF based keyword identification
- **Sentiment Analysis**: Content sentiment scoring

## Project Structure

```
├── api/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   └── routes/
│   │       ├── content.js     # Content analysis
│   │       ├── brief.js       # Brief generation
│   │       └── suggestions.js  # AI suggestions
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

Task ID: c31a1d23-f785-411a-bda5-3182efed1c4a

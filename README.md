# Browser Extension for Inline SEO Recommendations

Chrome/Firefox extension providing real-time SEO scoring and suggestions while writing content in any web-based text editor.

## Features

### Real-time SEO Analysis
- **Content Scoring**: Live SEO score (0-100) based on multiple factors
- **Keyword Density**: Monitor keyword usage and density
- **Readability Analysis**: Flesch-Kincaid grade level and readability
- **Heading Structure**: Detect H1-H6 tags and suggest improvements
- **Content Length**: Word count with optimal range recommendations
- **Internal/External Links**: Count and analyze link usage

### Issue Detection
- **Missing Alt Text**: Detect images without alt attributes
- **Thin Content**: Alert when content is too short
- **Keyword Stuffing**: Detect excessive keyword repetition
- **Poor Meta Opportunities**: Suggest meta description improvements
- **Readability Issues**: Flag overly complex sentences

### One-Click Fixes
- **Add Alt Text**: Generate alt text suggestions
- **Improve Readability**: Simplify complex sentences
- **Fix Keyword Density**: Suggest keyword additions or removals
- **Enhance Headings**: Recommend heading structure improvements

### Compatibility
- **Google Docs**: Full support for Google Docs editor
- **Notion**: Content block analysis
- **WordPress**: Gutenberg and classic editor support
- **Any textarea/contenteditable**: Generic text area detection

## Architecture

```
┌─────────────────────────┐
│   Browser Extension     │
├─────────────────────────┤
│  manifest.json          │ Extension config
│  background/           │ Service worker
│  content/              │ Content scripts
│  popup/                │ Popup UI
│  icons/                │ Extension icons
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   OpenSEO Backend      │
│   (Optional API)       │
└─────────────────────────┘
```

## Installation

### Chrome

1. Clone the repository
2. Open `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select `manifest.json`

### Microsoft Edge

1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension directory

## Configuration

### API Settings

Click the extension icon → Settings tab to configure:
- **API Endpoint**: Your OpenSEO API URL (leave empty for local analysis)
- **API Key**: Your API key for premium features
- **Target Keyword**: Set a default target keyword for all pages

### Analysis Settings

- **Auto-analyze**: Enable/disable automatic analysis
- **Analysis Delay**: Debounce delay for typing (ms)
- **Score Threshold**: Minimum score to show green indicator

## Usage

### Automatic Analysis

1. Navigate to any text editor (Google Docs, Notion, etc.)
2. Start typing - the extension analyzes in real-time
3. Look for the floating SEO indicator in the corner
4. Click to expand detailed recommendations

### Manual Analysis

1. Click the OpenSEO extension icon
2. Click "Analyze Page" button
3. View detailed breakdown in the popup

### One-Click Fixes

1. Click the extension icon
2. View issues listed with "Fix" buttons
3. Click "Fix" to apply the recommendation
4. Review and accept the change

## Files Structure

```
├── manifest.json           # Extension configuration
├── background/
│   └── service-worker.js  # Background service worker
├── content/
│   ├── content-script.js   # Main content analysis
│   └── content-script.css  # Floating panel styles
├── popup/
│   ├── popup.html         # Popup UI
│   └── popup.js          # Popup logic
├── icons/
│   ├── icon16.png        # Toolbar icon
│   ├── icon48.png        # Extension page icon
│   └── icon128.png       # Chrome Web Store icon
└── README.md
```

## Technical Details

### Content Detection

The extension detects editable areas using:
- `contenteditable` attribute detection
- `textarea` elements
- `input[type="text"]` elements
- Rich text editors (ProseMirror, Quill, etc.)

### Scoring Algorithm

Base score (0-100) calculated from:
- **Keyword Optimization** (25%): Title, headings, content keyword presence
- **Readability** (25%): Sentence length, syllable count, Flesch score
- **Structure** (20%): Heading hierarchy, paragraph length
- **Length** (15%): Word count vs recommended
- **Links** (15%): Internal/external link balance

### Permissions

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Access current tab for analysis |
| `storage` | Save user preferences |
| `scripting` | Inject content scripts |

### API Communication

When backend API is configured:
- Content is sent for advanced NLP analysis
- SERP data for keyword competition
- Historical performance data

When offline or no API:
- All analysis runs locally using Compromise.js
- Limited to basic readability and structure checks

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 88+ | Full |
| Firefox | 78+ | Full |
| Edge | 88+ | Full |
| Safari | 15+ | Partial (no service worker) |

## Development

### Building

```bash
# No build step required
# Extension loads directly from source
```

### Testing

```bash
# Load extension in browser
# Navigate to test page
# Check console for debug logs
```

### Debugging

1. Chrome: Extensions page → Service Worker link
2. Firefox: about:debugging → Debug button
3. Content scripts: Open DevTools on page

## Privacy

- All analysis can run locally (no server required)
- If API is configured, only text content is sent
- No tracking or analytics
- No data collection by third parties

## License

MIT

## Task

Task ID: 0d5159c0-b6e8-4ea2-8a12-cf2aea47393e

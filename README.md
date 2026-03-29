# Browser Extension for Inline SEO Recommendations

Chrome/Firefox extension for real-time SEO scoring while writing.

## Features

- **Real-time Analysis**: Content scoring as you type
- **Keyword Tracking**: Monitor keyword density and usage
- **Readability Score**: Flesch-Kincaid based analysis
- **Issue Detection**: Highlights SEO problems
- **Works Everywhere**: Google Docs, Notion, any web editor
- **One-click Fixes**: Quick recommendations

## Installation

### Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension directory

### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

## Files

- `manifest.json` - Extension configuration
- `background/service-worker.js` - Background service worker
- `content/content-script.js` - Content analysis script
- `content/content-script.css` - Floating panel styles
- `popup/popup.html` - Extension popup UI
- `popup/popup.js` - Popup logic

## Technical Approach

- WebExtensions API (Chrome/Firefox compatible)
- Content scripts detect editable areas
- Background service worker for API communication
- Local storage for preferences
- Client-side NLP analysis

---

Task: 0d5159c0-b6e8-4ea2-8a12-cf2aea47393e

const { URL } = require('url');

class SEOCrawler {
  constructor(options = {}) {
    this.maxPages = options.maxPages || 100;
    this.maxDepth = options.maxDepth || 3;
    this.concurrent = options.concurrent || 5;
    this.visited = new Set();
    this.queue = [];
    this.results = {
      pages: [],
      brokenLinks: [],
      redirects: [],
      duplicateContent: [],
      schemaErrors: [],
      metaIssues: [],
      crawlStats: { pages: 0, linksFound: 0, errors: 0, startTime: null, endTime: null }
    };
  }

  async crawl(startUrl) {
    this.results.crawlStats.startTime = new Date().toISOString();
    this.queue.push({ url: startUrl, depth: 0 });
    
    while (this.queue.length > 0 && this.results.crawlStats.pages < this.maxPages) {
      const batch = this.queue.splice(0, this.concurrent);
      await Promise.all(batch.map(page => this.crawlPage(page.url, page.depth)));
    }
    
    this.results.crawlStats.endTime = new Date().toISOString();
    return this.results;
  }

  async crawlPage(url, depth) {
    if (this.visited.has(url) || depth > this.maxDepth) return;
    this.visited.add(url);
    this.results.crawlStats.pages++;

    // Simulate crawled page data
    const pageData = this.generatePageData(url, depth);
    this.results.pages.push(pageData);
    
    // Extract links
    const links = pageData.links || [];
    this.results.crawlStats.linksFound += links.length;
    
    // Check for broken links
    links.forEach(link => {
      if (link.status === 404) {
        this.results.brokenLinks.push({ from: url, to: link.url, status: 404 });
      } else if (link.status >= 300 && link.status < 400) {
        this.results.redirects.push({ from: url, to: link.url, toUrl: link.redirectTo, status: link.status });
      }
    });

    // Check meta issues
    if (pageData.metaIssues) {
      this.results.metaIssues.push(...pageData.metaIssues.map(issue => ({ ...issue, page: url })));
    }

    // Check schema errors
    if (pageData.schemaErrors) {
      this.results.schemaErrors.push(...pageData.schemaErrors.map(err => ({ ...err, page: url })));
    }

    // Queue new links
    links.filter(l => l.internal && !this.visited.has(l.url)).forEach(link => {
      this.queue.push({ url: link.url, depth: depth + 1 });
    });
  }

  generatePageData(url, depth) {
    const parsedUrl = new URL(url);
    const isHome = depth === 0;
    
    const page = {
      url,
      status: 200,
      title: isHome ? 'Home Page' : `Page ${this.results.crawlStats.pages}`,
      meta: {
        title: isHome ? 'Example Site - Home' : `Example Page ${this.results.crawlStats.pages}`,
        description: isHome ? 'Welcome to our site' : 'Page description',
        robots: 'index, follow'
      },
      h1: [isHome ? 'Welcome' : 'Page Title'],
      wordCount: 300 + Math.floor(Math.random() * 700),
      links: [],
      schemaErrors: [],
      metaIssues: []
    };

    // Generate some links
    const linkCount = Math.floor(Math.random() * 10) + 3;
    for (let i = 0; i < linkCount; i++) {
      const isInternal = Math.random() > 0.3;
      const status = Math.random() > 0.9 ? 404 : Math.random() > 0.85 ? 301 : 200;
      page.links.push({
        url: isInternal ? `${parsedUrl.origin}/page-${i}` : `https://external-${i}.com/page`,
        internal: isInternal,
        status,
        redirectTo: status === 301 ? `${parsedUrl.origin}/redirect-${i}` : null
      });
    }

    // Add meta issues
    if (!isHome && Math.random() > 0.7) {
      page.metaIssues.push({ type: 'missing-description', severity: 'warning' });
    }
    if (Math.random() > 0.8) {
      page.metaIssues.push({ type: 'duplicate-title', severity: 'error' });
    }
    if (Math.random() > 0.9) {
      page.schemaErrors.push({ type: 'invalid-json-ld', message: 'JSON-LD syntax error' });
    }

    return page;
  }
}

module.exports = { SEOCrawler };

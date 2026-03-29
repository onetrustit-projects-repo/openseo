const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const auditRoutes = require('./routes/audit');
const crawlRoutes = require('./routes/crawl');
const issuesRoutes = require('./routes/issues');

const app = express();
const PORT = process.env.PORT || 3092;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', module: 'seo-audit', version: '1.0.0' });
});

app.use('/api/audit', auditRoutes);
app.use('/api/crawl', crawlRoutes);
app.use('/api/issues', issuesRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Audit API running on port ${PORT}`);
});

module.exports = app;

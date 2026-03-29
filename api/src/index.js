const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const backlinksRoutes = require('./routes/backlinks');
const analysisRoutes = require('./routes/analysis');
const disavowRoutes = require('./routes/disavow');
const outreachRoutes = require('./routes/outreach');

const app = express();
const PORT = process.env.PORT || 3088;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', module: 'backlink-analysis', version: '1.0.0' });
});

app.use('/api/backlinks', backlinksRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/disavow', disavowRoutes);
app.use('/api/outreach', outreachRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Backlink API running on port ${PORT}`);
});

module.exports = app;

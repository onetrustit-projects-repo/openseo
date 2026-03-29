const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const keywordsRoutes = require('./routes/keywords');
const serpRoutes = require('./routes/serp');
const competitorsRoutes = require('./routes/competitors');
const trendsRoutes = require('./routes/trends');

const app = express();
const PORT = process.env.PORT || 3089;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', module: 'keyword-intelligence', version: '1.0.0' });
});

app.use('/api/keywords', keywordsRoutes);
app.use('/api/serp', serpRoutes);
app.use('/api/competitors', competitorsRoutes);
app.use('/api/trends', trendsRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Keyword Intelligence API running on port ${PORT}`);
});

module.exports = app;

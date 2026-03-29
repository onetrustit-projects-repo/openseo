const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contentRoutes = require('./routes/content');
const briefRoutes = require('./routes/brief');
const suggestionsRoutes = require('./routes/suggestions');

const app = express();
const PORT = process.env.PORT || 3091;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', module: 'ai-content', version: '1.0.0' });
});

app.use('/api/content', contentRoutes);
app.use('/api/brief', briefRoutes);
app.use('/api/suggestions', suggestionsRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO AI Content API running on port ${PORT}`);
});

module.exports = app;

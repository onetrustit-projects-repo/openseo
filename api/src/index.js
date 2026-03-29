const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const gscRoutes = require('./routes/gsc');
const syncRoutes = require('./routes/sync');
const alertsRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3093;
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', module: 'gsc', version: '1.0.0' }));
app.use('/api/gsc', gscRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/alerts', alertsRoutes);
app.use((err, req, res, next) => { console.error(err.message); res.status(500).json({ error: err.message }); });
app.listen(PORT, () => console.log(`OpenSEO GSC API running on port ${PORT}`));
module.exports = app;

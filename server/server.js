import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';
import analyticsRoutes from './routes/analytics.js';
import { getDbPool, isDbConnected } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'connected (MySQL)' : 'standby',
    version: '1.0.0',
    service: 'eCitizen Civic Public Service API'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start Express Server
async function startServer() {
  // Attempt MySQL connection
  await getDbPool();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 eCitizen Public Service API running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/requests`);
    console.log(`======================================================\n`);
  });
}

startServer();

import express from 'express';
import dotenv from 'dotenv';
// ---- Robust env loader & fallbacks ----
// Some environments may fail to parse .env (e.g., special characters in JWT_SECRET).
// We guard against that and provide safe fallbacks so the server doesn't crash.
try {
  const result = dotenv.config();
  if (result?.error) {
    console.error('dotenv config error:', result.error);
  }
} catch (e) {
  console.error('dotenv threw during config:', e);
}
const FALLBACK_ENV = {
  PORT: '3001',
  MONGO_URI: 'mongodb://localhost:27017/clbp-predictive-system',
  JWT_SECRET: 'dev-fallback-secret'
};
for (const [k, v] of Object.entries(FALLBACK_ENV)) {
  if (!process.env[k] || String(process.env[k]).trim() === '') {
    process.env[k] = v;
  }
}
// Optional extra: admin restart token to gracefully exit (nodemon/system manager will restart)
if (!process.env.ADMIN_RESTART_TOKEN) process.env.ADMIN_RESTART_TOKEN = 'dev-restart-key';
// ---------------------------------------

import fs from 'fs';
import path from 'path';
import connectDB from './config/db.js';
import installerRoutes from './routes/installer.js';
import questionnaireRoutes from './routes/questionnaires.js';
import settingsRoutes from './routes/settings.js';
import reportsRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import predictRoutes from './routes/predict.js';
import dataRoutes from './routes/data.js';
import dashboardRoutes from './routes/dashboard.js';
import assessmentRoutes from './routes/assessments.js';
import noteRoutes from './routes/notes.js';
import analysisRoutes from './routes/analysis.js';
import Setting from './models/Setting.js';

// Load env vars
dotenv.config();

const app = express();
// Admin restart endpoint: POST /api/admin/restart  (requires token)
app.post('/api/admin/restart', (req, res) => {
  try {
    const token = req.query.token || req.headers['x-restart-token'];
    const expected = process.env.ADMIN_RESTART_TOKEN;
    if (!token || token !== expected) {
      return res.status(403).json({ error: 'forbidden' });
    }
    // Touch a file to trigger nodemon file-watch restart
    try {
      const fs = require('fs');
    } catch (e) {}
    try {
      // ESM import fallback for fs
      import('fs').then(fsmod => {
        try {
          fsmod.writeFileSync(new URL('./restart.trigger', import.meta.url), String(Date.now()));
        } catch {}
      });
    } catch {}

    res.json({ ok: true, message: 'Restarting process now' });
    setTimeout(() => {
      console.log('Admin-initiated restart via /api/admin/restart');
      // Exit with non-zero so nodemon definitely restarts
      process.exit(1);
    }, 50);
  } catch (e) {
    console.error('Restart endpoint error:', e);
    res.status(500).json({ error: 'restart_failed', details: e?.message });
  }
});

// Admin diagnostic: GET /api/admin/env (redacts secrets)
app.get('/api/admin/env', (req, res) => {
  const redacted = (v) => (typeof v === 'string' && v.length > 6 ? v.slice(0,3) + '***' + v.slice(-3) : v);
  const data = {
    PORT: process.env.PORT,
    MONGO_URI: redacted(process.env.MONGO_URI),
    JWT_SECRET: redacted(process.env.JWT_SECRET),
    MONGOOSE_DEBUG: process.env.MONGOOSE_DEBUG,
    ADMIN_RESTART_TOKEN: redacted(process.env.ADMIN_RESTART_TOKEN),
  };
  res.json({ ok: true, env: data });
});

const port = process.env.PORT || 3001;
app.use(express.json());

// Determine if the app is installed by checking for the lock file
const isInstalled = () => {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    return fs.existsSync(path.join(currentDir, 'installer.lock'));
};

// Installer and status routes are always available
app.use('/api/installer', installerRoutes);
app.get('/api/status', (req, res) => {
    res.json({ installed: isInstalled() });
});


const startServer = async () => {
    if (!isInstalled()) {
        console.log('Application not installed. Running in installer mode.');
        // If not installed, we only want the installer routes to be available.
        // The main app routes will not be mounted.
    } else {
        try {
            console.log('Application is installed. Starting main server...');
            // Connect to database
            await connectDB();

            // Seed initial settings
            await Setting.seedInitialSettings();

            // Mount main application API Routes
            app.use('/api/questionnaires', questionnaireRoutes);
            app.use('/api/settings', settingsRoutes);
            app.use('/api/reports', reportsRoutes);
            app.use('/api/users', userRoutes);
            app.use('/api/predict', predictRoutes);
            app.use('/api/data', dataRoutes);
            app.use('/api/dashboard', dashboardRoutes);
            app.use('/api/assessments', assessmentRoutes);
            app.use('/api/notes', noteRoutes);
            app.use('/api/analysis', analysisRoutes);

            console.log('Main application routes mounted.');

        } catch (error) {
            console.error('Failed to start main application:', error);
            // We don't exit the process here, so the installer routes remain available
            // in case the database connection fails after installation.
        }
    }

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        if (!isInstalled()) {
            console.log('Navigate to the frontend to begin installation.');
        }
    });
};

startServer();
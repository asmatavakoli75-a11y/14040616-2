// Use a fully async startup sequence to guarantee env vars are loaded first.

async function main() {
    // --- 1. Load Environment Variables ---
    const dotenv = await import('dotenv');
    dotenv.config();

    // --- 2. Load Core Dependencies ---
    const express = (await import('express')).default;
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;

    // --- 3. Apply Fallbacks ---
    const FALLBACK_ENV = {
      PORT: '3001', DB_HOST: '127.0.0.1', DB_USER: 'root',
      DB_PASSWORD: 'password', DB_NAME: 'clbp_db', DB_PORT: '3306',
      DB_DIALECT: 'mysql', JWT_SECRET: 'dev-fallback-secret',
      ADMIN_RESTART_TOKEN: 'dev-restart-key'
    };
    for (const [k, v] of Object.entries(FALLBACK_ENV)) {
        if (!process.env[k] || String(process.env[k]).trim() === '') {
            process.env[k] = v;
        }
    }

    // --- 4. Initialize Database Connection ---
    const { connectDB, default: sequelize } = await import('./config/db.js');

    // --- 5. Initialize Express App ---
    const app = express();
    app.use(express.json());
    const port = process.env.PORT || 3001;

    // --- 6. Define Helper and Status Routes ---
    const isInstalled = () => {
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        return fs.existsSync(path.join(currentDir, 'installer.lock'));
    };

    const installerRoutes = (await import('./routes/installer.js')).default;
    app.use('/api/installer', installerRoutes);
    app.get('/api/status', (req, res) => {
        res.json({ installed: isInstalled() });
    });

    // --- 7. Start Server Logic ---
    if (!isInstalled()) {
        console.log('Application not installed. Running in installer mode.');
    } else {
        try {
            console.log('Application is installed. Starting main server...');
            await connectDB();
            await sequelize.sync();
            console.log('Database synchronized.');

            // Dynamically import and mount main routes
            const routes = [
                { path: '/api/questionnaires', module: './routes/questionnaires.js' },
                { path: '/api/settings', module: './routes/settings.js' },
                { path: '/api/reports', module: './routes/reports.js' },
                { path: '/api/users', module: './routes/users.js' },
                { path: '/api/predict', module: './routes/predict.js' },
                { path: '/api/data', module: './routes/data.js' },
                { path: '/api/dashboard', module: './routes/dashboard.js' },
                { path: '/api/assessments', module: './routes/assessments.js' },
                { path: '/api/notes', module: './routes/notes.js' },
                { path: '/api/analysis', module: './routes/analysis.js' },
            ];
            for (const route of routes) {
                const { default: router } = await import(route.module);
                app.use(route.path, router);
            }
            console.log('Main application routes mounted.');

        } catch (error) {
            console.error('Failed to start main application:', error);
            process.exit(1); // Exit if the main app fails to start
        }
    }

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        if (!isInstalled()) {
            console.log('Navigate to the frontend to begin installation.');
        }
    });
}

main().catch(error => {
    console.error("Critical error during server startup:", error);
    process.exit(1);
});
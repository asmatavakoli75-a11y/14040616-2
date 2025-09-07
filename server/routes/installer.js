import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Helper function to get the path to the .env file
const getEnvPath = () => {
    // __dirname is not available in ES modules, so we use import.meta.url
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    return path.join(currentDir, '..', '.env');
};

// @desc    Test database connection
// @route   POST /api/installer/test-db
// @access  Public
router.post('/test-db', async (req, res) => {
    const { dbHost, dbName, dbUser, dbPass } = req.body;
    const mongoUri = `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin`;

    try {
        const tempConnection = await mongoose.createConnection(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).asPromise();

        await tempConnection.close();
        res.status(200).json({ message: 'Database connection successful.' });
    } catch (error) {
        console.error('DB Connection Test Error:', error);
        res.status(400).json({ message: 'Database connection failed.', error: error.message });
    }
});

// @desc    Write .env configuration file
// @route   POST /api/installer/write-config
// @access  Public
router.post('/write-config', async (req, res) => {
    const { dbHost, dbName, dbUser, dbPass } = req.body;
    const mongoUri = `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin`;
    const jwtSecret = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');

    const envContent = `
PORT=3001
MONGO_URI=${mongoUri}
JWT_SECRET=${jwtSecret}
`;

    try {
        await fs.writeFile(getEnvPath(), envContent.trim());
        res.status(200).json({ message: 'Configuration file written successfully. Please restart the server.' });
    } catch (error) {
        console.error('Write Config Error:', error);
        res.status(500).json({ message: 'Failed to write configuration file.', error: error.message });
    }
});

// @desc    Create initial admin user
// @route   POST /api/installer/create-admin
// @access  Public
router.post('/create-admin', async (req, res) => {
    // This should only be callable if the config exists but the app isn't "finalized"
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All admin fields are required.' });
    }

    try {
        // Check if an admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'An admin user already exists.' });
        }

        const admin = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: 'admin',
        });

        // Create a lock file to prevent installer from running again
        await fs.writeFile(path.join(path.dirname(getEnvPath()), 'installer.lock'), 'installed');

        res.status(201).json({ message: 'Admin user created successfully.', adminId: admin._id });

    } catch (error) {
        console.error('Create Admin Error:', error);
        // This can happen if the DB isn't connected yet because the server hasn't restarted
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please restart the server after writing the config.' });
        }
        res.status(500).json({ message: 'Failed to create admin user.', error: error.message });
    }
});

export default router;

import express from 'express';
import db from '../models/index.js';

const { Setting } = db;
const router = express.Router();

// Helper function for error responses
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// @desc    Get all settings as a key-value map
// @route   GET /api/settings
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    // Convert array to a key-value object for easier use on the frontend
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    handleError(res, error, 'Error fetching settings');
  }
});

// @desc    Update or create a setting (upsert)
// @route   PUT /api/settings/:key
// @access  Private/Admin
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ message: 'Value is required' });
  }

  try {
    // Sequelize's upsert will create or update based on unique constraints (the 'key' field)
    const [setting, created] = await Setting.upsert({
      key,
      value,
    });
    res.json(setting);
  } catch (error) {
    handleError(res, error, 'Error updating setting', 400);
  }
});

export default router;

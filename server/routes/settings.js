import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({});
    // Convert array to a key-value object for easier use on the frontend
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  try {
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates it if it doesn't exist
    );
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

export default router;

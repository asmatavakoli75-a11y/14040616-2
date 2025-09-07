import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
// @access  Private/Admin
router.get('/metrics', async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // NOTE: The following are placeholders as the exact logic depends on other models
    // that are not fully defined in the context of this task (e.g., Assessments).
    const completionRate = 85.3; // Placeholder
    const riskDistribution = { low: 45.2, moderate: 38.7, high: 16.1 }; // Placeholder
    const modelAccuracy = 94.7; // Placeholder

    const metrics = {
      totalPatients,
      completionRate,
      riskDistribution,
      modelAccuracy,
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get recent patients
// @route   GET /api/dashboard/recent-patients
// @access  Private/Admin
router.get('/recent-patients', async (req, res) => {
  try {
    const recentPatients = await User.find({ role: 'patient' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(recentPatients);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;

import express from 'express';
import db from '../models/index.js';

const { User, Assessment } = db;
const router = express.Router();

// Helper function for error responses
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
// @access  Private/Admin
router.get('/metrics', async (req, res) => {
  try {
    const totalPatients = await User.count({ where: { role: 'patient' } });

    const totalAssessments = await Assessment.count();
    const completedAssessments = await Assessment.count({ where: { status: 'completed' } });
    const completionRate = totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;

    // NOTE: The following are placeholders as the exact logic can be complex.
    const riskDistribution = { low: 45.2, moderate: 38.7, high: 16.1 }; // Placeholder
    const modelAccuracy = 94.7; // Placeholder

    const metrics = {
      totalPatients,
      completionRate: parseFloat(completionRate.toFixed(2)),
      riskDistribution,
      modelAccuracy,
    };
    res.json(metrics);
  } catch (error) {
    handleError(res, error, 'Error fetching dashboard metrics');
  }
});

// @desc    Get recent patients
// @route   GET /api/dashboard/recent-patients
// @access  Private/Admin
router.get('/recent-patients', async (req, res) => {
  try {
    const recentPatients = await User.findAll({
      where: { role: 'patient' },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: { exclude: ['password'] }
    });
    res.json(recentPatients);
  } catch (error) {
    handleError(res, error, 'Error fetching recent patients');
  }
});

export default router;

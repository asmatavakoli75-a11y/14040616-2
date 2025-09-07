import express from 'express';

const router = express.Router();

// @desc    Get a prediction based on assessment data
// @route   POST /api/predict
// @access  Public
router.post('/', async (req, res) => {
  const { responses, selectedBodyRegions } = req.body;

  // --- Mock Prediction Logic ---
  // In a real application, this is where you would preprocess the data
  // and feed it into a trained machine learning model.

  // For now, we'll generate a mock prediction based on the number of responses.
  try {
    const responseCount = Object.keys(responses || {}).length;
    const regionCount = (selectedBodyRegions || []).length;

    if (responseCount === 0) {
      return res.status(400).json({ message: 'No assessment data provided.' });
    }

    // A simple mock algorithm: risk increases with more answers and selected regions
    let riskScore = 20 + (responseCount * 2) + (regionCount * 5);
    riskScore = Math.min(riskScore, 100); // Cap score at 100

    let riskLevel = 'low';
    if (riskScore > 70) {
      riskLevel = 'high';
    } else if (riskScore > 40) {
      riskLevel = 'moderate';
    }

    const predictionResult = {
      riskScore: Math.round(riskScore),
      riskLevel,
      confidence: 0.85 + Math.random() * 0.1, // Mock confidence
      recommendedAction: 'Consult with a specialist for further evaluation.',
      timestamp: new Date().toISOString(),
    };

    // Simulate model processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.status(200).json(predictionResult);

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error generating prediction.' });
  }
});

export default router;

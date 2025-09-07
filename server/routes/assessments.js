import express from 'express';
import Assessment from '../models/Assessment.js';

const router = express.Router();

// @desc    Get assessments by patient ID
// @route   GET /api/assessments/patient/:patientId
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const assessments = await Assessment.find({ patientId: req.params.patientId })
      .populate({
        path: 'questionnaireId',
        select: 'title description questions',
        populate: {
          path: 'questions',
          model: 'Question',
        },
      })
      .populate({
        path: 'responses.questionId',
        model: 'Question',
        select: 'text',
      })
      .sort({ createdAt: -1 });

    if (!assessments) {
      return res.status(404).json({ message: 'No assessments found for this patient' });
    }

    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { patientId, questionnaireId, responses } = req.body;

    if (!patientId || !questionnaireId || !responses) {
      return res.status(400).json({ message: 'Patient ID, Questionnaire ID, and responses are required' });
    }

    // Convert responses object to the array format expected by the model
    const responsesArray = Object.entries(responses).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const newAssessment = new Assessment({
      patientId,
      questionnaireId,
      responses: responsesArray,
      status: 'completed',
      completedAt: new Date(),
    });

    const savedAssessment = await newAssessment.save();
    res.status(201).json(savedAssessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

import express from 'express';
import Assessment from '../models/Assessment.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

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

    const questionIds = Object.keys(responses);
    const questions = await Question.find({ '_id': { $in: questionIds } });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let totalScore = 0;

    const responsesArray = Object.entries(responses).map(([questionId, answer]) => {
      const question = questionMap.get(questionId);
      let score = 0;
      if (question && ['multiple-choice', 'checkboxes', 'dropdown'].includes(question.questionType)) {
        const answers = Array.isArray(answer) ? answer : [answer];
        for (const ans of answers) {
            const chosenOption = question.options.find(opt => opt.text === ans);
            if (chosenOption) {
                score += chosenOption.score;
            }
        }
      } else if (question && question.questionType === 'linear-scale') {
        score = Number(answer) || 0;
      }

      totalScore += score;

      return {
        questionId: new mongoose.Types.ObjectId(questionId),
        answer,
        score,
      };
    });

    const newAssessment = new Assessment({
      patientId,
      questionnaireId,
      responses: responsesArray,
      riskScore: totalScore, // Using the existing riskScore field for total score
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

// @desc    Export all assessments as CSV
// @route   GET /api/assessments/export
// @access  Private/Admin
router.get('/export', async (req, res) => {
  try {
    const assessments = await Assessment.find({})
      .populate('patientId', 'firstName lastName email')
      .populate('questionnaireId', 'title');

    let csv = 'PatientFirstName,PatientLastName,PatientEmail,QuestionnaireTitle,TotalScore,CompletedAt\n';

    for (const assessment of assessments) {
      const patientFirstName = assessment.patientId ? assessment.patientId.firstName : 'N/A';
      const patientLastName = assessment.patientId ? assessment.patientId.lastName : 'N/A';
      const patientEmail = assessment.patientId ? assessment.patientId.email : 'N/A';
      const questionnaireTitle = assessment.questionnaireId ? assessment.questionnaireId.title : 'N/A';
      const totalScore = assessment.riskScore || 0;
      const completedAt = assessment.completedAt ? assessment.completedAt.toISOString() : 'N/A';

      csv += `${patientFirstName},${patientLastName},${patientEmail},"${questionnaireTitle}",${totalScore},${completedAt}\n`;
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('assessments_export.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting assessments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

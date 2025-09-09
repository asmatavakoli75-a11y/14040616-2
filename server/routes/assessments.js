import express from 'express';
import db from '../models/index.js';

const { Assessment, Question, Questionnaire, User } = db;
const router = express.Router();

// Helper function for error responses
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// @desc    Get assessments by patient ID
// @route   GET /api/assessments/patient/:patientId
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      where: { patientId: req.params.patientId },
      include: [
        {
          model: Questionnaire,
          as: 'questionnaire',
          include: { model: Question, as: 'Questions' }
        },
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!assessments) {
      return res.status(404).json({ message: 'No assessments found for this patient' });
    }
    res.json(assessments);
  } catch (error) {
    handleError(res, error, 'Error fetching assessments');
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
    const questions = await Question.findAll({ where: { id: questionIds } });
    const questionMap = new Map(questions.map(q => [q.id.toString(), q]));

    let totalScore = 0;
    const responsesArray = [];

    for (const [questionId, answer] of Object.entries(responses)) {
      const question = questionMap.get(questionId);
      if (!question) continue;

      let score = 0;
      if (['multiple-choice', 'checkboxes', 'dropdown'].includes(question.questionType)) {
        const answers = Array.isArray(answer) ? answer : [answer];
        for (const ans of answers) {
          const chosenOption = question.options.find(opt => opt.text === ans);
          if (chosenOption) {
            score += chosenOption.score || 0;
          }
        }
      } else if (question.questionType === 'linear-scale') {
        score = Number(answer) || 0;
      }
      totalScore += score;

      // Denormalize: add question text to the response object for easier retrieval
      responsesArray.push({
        questionId: parseInt(questionId, 10),
        questionText: question.text,
        answer,
        score,
      });
    }

    const newAssessment = await Assessment.create({
      patientId,
      questionnaireId,
      responses: responsesArray,
      riskScore: totalScore,
      status: 'completed',
    });

    res.status(201).json(newAssessment);
  } catch (error) {
    handleError(res, error, 'Error creating assessment', 400);
  }
});

// @desc    Export all assessments as CSV
// @route   GET /api/assessments/export
// @access  Private/Admin
router.get('/export', async (req, res) => {
    try {
        const assessments = await Assessment.findAll({
            include: [
                { model: User, as: 'patient', attributes: ['firstName', 'lastName', 'email'] },
                { model: Questionnaire, as: 'questionnaire', attributes: ['title'] }
            ]
        });

        let csv = 'PatientFirstName,PatientLastName,PatientEmail,QuestionnaireTitle,TotalScore,CompletedAt\n';

        for (const assessment of assessments) {
            const patientFirstName = assessment.patient ? assessment.patient.firstName : 'N/A';
            const patientLastName = assessment.patient ? assessment.patient.lastName : 'N/A';
            const patientEmail = assessment.patient ? assessment.patient.email : 'N/A';
            const questionnaireTitle = assessment.questionnaire ? assessment.questionnaire.title : 'N/A';
            const totalScore = assessment.riskScore || 0;
            const completedAt = assessment.createdAt ? new Date(assessment.createdAt).toISOString() : 'N/A';

            csv += `${patientFirstName},${patientLastName},${patientEmail},"${questionnaireTitle}",${totalScore},${completedAt}\n`;
        }

        res.header('Content-Type', 'text/csv');
        res.attachment('assessments_export.csv');
        res.send(csv);

    } catch (error) {
        handleError(res, error, 'Error exporting assessments');
    }
});

export default router;

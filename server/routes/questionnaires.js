import express from 'express';
import db from '../models/index.js';

const { Questionnaire, Question, sequelize } = db; // Destructure sequelize from db
const router = express.Router();

// Helper function for error responses
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// @desc    Fetch all questionnaires with their questions
// @route   GET /api/questionnaires
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll({
      include: { model: Question, as: 'Questions' }, // Use the alias if defined, otherwise model name
      order: [['createdAt', 'DESC']]
    });
    res.json(questionnaires);
  } catch (error) {
    handleError(res, error, 'Error fetching questionnaires');
  }
});

// @desc    Fetch a single questionnaire
// @route   GET /api/questionnaires/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id, {
      include: { model: Question, as: 'Questions' }
    });
    if (questionnaire) {
      res.json(questionnaire);
    } else {
      res.status(404).json({ message: 'Questionnaire not found' });
    }
  } catch (error) {
    handleError(res, error, `Error fetching questionnaire ${req.params.id}`);
  }
});

// @desc    Create a questionnaire
// @route   POST /api/questionnaires
// @access  Private/Admin
router.post('/', async (req, res) => {
  const { title, description, questions } = req.body; // questions is an array of question IDs
  try {
    const questionnaire = await Questionnaire.create({ title, description });
    if (questions && questions.length > 0) {
      await questionnaire.setQuestions(questions); // Set association
    }
    res.status(201).json(questionnaire);
  } catch (error) {
    handleError(res, error, 'Error creating questionnaire', 400);
  }
});

// @desc    Update a questionnaire
// @route   PUT /api/questionnaires/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  const { title, description, questions } = req.body; // questions is an array of question IDs
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    // Update main fields
    await questionnaire.update({ title, description });
    // Update associated questions
    if (questions) {
      await questionnaire.setQuestions(questions);
    }
    const updatedQuestionnaire = await Questionnaire.findByPk(req.params.id, {
        include: { model: Question, as: 'Questions' }
    });
    res.json(updatedQuestionnaire);
  } catch (error) {
    handleError(res, error, 'Error updating questionnaire', 400);
  }
});

// @desc    Delete a questionnaire (and its associations, but not the questions themselves)
// @route   DELETE /api/questionnaires/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    await questionnaire.destroy(); // This will also delete entries in the junction table
    res.json({ message: 'Questionnaire removed' });
  } catch (error) {
    handleError(res, error, 'Error deleting questionnaire');
  }
});


// --- Question-related endpoints ---

// Note: The logic for adding/updating/deleting questions is now simplified.
// We assume questions are managed globally via a separate /api/questions endpoint.
// The questionnaire endpoint is only used to associate existing questions.
// This is a more RESTful approach. If the original intent was to create questions
// *within* a questionnaire context, the logic would be different, but for this
// migration, we simplify to a more standard relational pattern.

// For example, to add an existing question to a questionnaire:
// POST /api/questionnaires/:id/questions
router.post('/:id/questions', async (req, res) => {
    const { questionId } = req.body;
    try {
        const questionnaire = await Questionnaire.findByPk(req.params.id);
        if (!questionnaire) return res.status(404).json({ message: "Questionnaire not found" });

        const question = await Question.findByPk(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        await questionnaire.addQuestion(question);
        res.status(200).json({ message: "Question added to questionnaire" });
    } catch (error) {
        handleError(res, error, 'Error adding question to questionnaire', 400);
    }
});

// To remove a question from a questionnaire:
// DELETE /api/questionnaires/:id/questions/:questionId
router.delete('/:id/questions/:questionId', async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findByPk(req.params.id);
        if (!questionnaire) return res.status(404).json({ message: "Questionnaire not found" });

        const question = await Question.findByPk(req.params.questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        await questionnaire.removeQuestion(question);
        res.json({ message: 'Question removed from questionnaire' });
    } catch (error) {
        handleError(res, error, 'Error removing question from questionnaire');
    }
});


export default router;

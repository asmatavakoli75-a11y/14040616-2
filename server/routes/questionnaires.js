import express from 'express';
import Questionnaire from '../models/Questionnaire.js';
import Question from '../models/Question.js';

const router = express.Router();

// @desc    Fetch all questionnaires
// @route   GET /api/questionnaires
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({}).populate('questions');
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch a single questionnaire
// @route   GET /api/questionnaires/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id).populate('questions');
    if (questionnaire) {
      res.json(questionnaire);
    } else {
      res.status(404).json({ message: 'Questionnaire not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a questionnaire
// @route   POST /api/questionnaires
// @access  Private/Admin
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const questionnaire = new Questionnaire({
      title,
      description,
      questions: [],
    });

    const createdQuestionnaire = await questionnaire.save();
    res.status(201).json(createdQuestionnaire);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// @desc    Update a questionnaire
// @route   PUT /api/questionnaires/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (questionnaire) {
      questionnaire.title = title || questionnaire.title;
      questionnaire.description = description || questionnaire.description;
      if (questions) {
        questionnaire.questions = questions;
      }

      const updatedQuestionnaire = await questionnaire.save();
      res.json(updatedQuestionnaire);
    } else {
      res.status(404).json({ message: 'Questionnaire not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// @desc    Delete a questionnaire
// @route   DELETE /api/questionnaires/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (questionnaire) {
      // Also delete all questions associated with it
      await Question.deleteMany({ _id: { $in: questionnaire.questions } });
      await questionnaire.deleteOne(); // Using deleteOne() instead of remove()
      res.json({ message: 'Questionnaire removed' });
    } else {
      res.status(404).json({ message: 'Questionnaire not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Question-related endpoints ---

// @desc    Add a question to a questionnaire
// @route   POST /api/questionnaires/:id/questions
// @access  Private/Admin
router.post('/:id/questions', async (req, res) => {
  const { text, questionType, options, isRequired, minScale, maxScale, minLabel, maxLabel } = req.body;

  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (questionnaire) {
      const question = new Question({
        text,
        questionType,
        options,
        isRequired,
        minScale,
        maxScale,
        minLabel,
        maxLabel
      });

      const createdQuestion = await question.save();
      questionnaire.questions.push(createdQuestion._id);
      await questionnaire.save();

      res.status(201).json(createdQuestion);
    } else {
      res.status(404).json({ message: 'Questionnaire not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid question data' });
  }
});

// @desc    Update a question in a questionnaire
// @route   PUT /api/questionnaires/:id/questions/:questionId
// @access  Private/Admin
router.put('/:id/questions/:questionId', async (req, res) => {
  const { text, questionType, options, isRequired, minScale, maxScale, minLabel, maxLabel } = req.body;

  try {
    const question = await Question.findById(req.params.questionId);

    if (question) {
      if (text !== undefined) question.text = text;
      if (questionType !== undefined) question.questionType = questionType;
      if (options !== undefined) question.options = options;
      if (isRequired !== undefined) question.isRequired = isRequired;
      if (minScale !== undefined) question.minScale = minScale;
      if (maxScale !== undefined) question.maxScale = maxScale;
      if (minLabel !== undefined) question.minLabel = minLabel;
      if (maxLabel !== undefined) question.maxLabel = maxLabel;

      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid question data' });
  }
});

// @desc    Delete a question from a questionnaire
// @route   DELETE /api/questionnaires/:id/questions/:questionId
// @access  Private/Admin
router.delete('/:id/questions/:questionId', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    const question = await Question.findById(req.params.questionId);

    if (questionnaire && question) {
      // Remove question from questionnaire's list
      questionnaire.questions.pull(req.params.questionId);
      await questionnaire.save();

      // Delete the question itself
      await question.deleteOne();

      res.json({ message: 'Question removed' });
    } else {
      res.status(404).json({ message: 'Questionnaire or Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

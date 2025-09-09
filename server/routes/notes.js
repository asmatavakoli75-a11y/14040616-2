import express from 'express';
import db from '../models/index.js';

const { Note, User } = db;
const router = express.Router();

// Helper function for error responses
const handleError = (res, error, message = 'Server Error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// @desc    Get notes by patient ID
// @route   GET /api/notes/patient/:patientId
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { patientId: req.params.patientId },
      include: {
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      },
      order: [['createdAt', 'DESC']]
    });

    if (!notes) {
      return res.status(404).json({ message: 'No notes found for this patient' });
    }
    res.json(notes);
  } catch (error) {
    handleError(res, error, 'Error fetching notes');
  }
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Assuming authorId comes from auth middleware, e.g., req.user.id
    // As the original code did not specify the author, this is an assumption.
    const { patientId, text, authorId } = req.body;

    if (!patientId || !text || !authorId) {
      return res.status(400).json({ message: 'Patient ID, text, and author ID are required' });
    }

    const newNote = await Note.create({
      patientId,
      authorId,
      text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    handleError(res, error, 'Error creating note', 400);
  }
});

export default router;

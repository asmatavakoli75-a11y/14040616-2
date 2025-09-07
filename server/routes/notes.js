import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// @desc    Get notes by patient ID
// @route   GET /api/notes/patient/:patientId
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const notes = await Note.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    if (!notes) {
      return res.status(404).json({ message: 'No notes found for this patient' });
    }
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { patientId, content, category } = req.body;

    if (!patientId || !content) {
      return res.status(400).json({ message: 'Patient ID and content are required' });
    }

    const newNote = new Note({
      patientId,
      content,
      category,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

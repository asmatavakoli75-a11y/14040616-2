import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;

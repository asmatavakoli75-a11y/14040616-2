import mongoose from 'mongoose';

const questionnaireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
}, { timestamps: true });

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

export default Questionnaire;

import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Questionnaire',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  responses: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
      },
      score: {
        type: Number,
        default: 0,
      }
    },
  ],
  riskScore: {
    type: Number,
  },
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;

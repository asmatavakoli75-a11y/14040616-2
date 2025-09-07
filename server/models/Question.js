import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ['text', 'paragraph', 'multiple-choice', 'checkboxes', 'dropdown', 'date', 'datetime', 'linear-scale'],
    default: 'text',
  },
  options: {
    type: [String],
    // Options are required only for specific question types
    required: function() {
      return ['multiple-choice', 'checkboxes', 'dropdown'].includes(this.questionType);
    },
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  // Add min and max for linear scale
  minScale: {
    type: Number,
    required: function() {
      return this.questionType === 'linear-scale';
    },
    default: 1,
  },
  maxScale: {
    type: Number,
    required: function() {
      return this.questionType === 'linear-scale';
    },
    default: 5,
  },
  minLabel: {
    type: String,
    trim: true,
    default: '',
  },
  maxLabel: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;

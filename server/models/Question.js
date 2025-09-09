import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('text', 'paragraph', 'multiple-choice', 'checkboxes', 'dropdown', 'date', 'datetime', 'linear-scale'),
    allowNull: false,
    defaultValue: 'text',
  },
  // Storing options as JSON. Complex validation (e.g., required for certain types)
  // must be handled at the application/controller level.
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Scale fields are nullable because they are only required for 'linear-scale' type.
  // This logic must be enforced in the application layer.
  minScale: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxScale: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  minLabel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maxLabel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Question;

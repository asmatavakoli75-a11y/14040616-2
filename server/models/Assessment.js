import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Foreign key for the User model (the patient)
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Note: Sequelize defaults to plural table names
      key: 'id',
    }
  },
  // Foreign key for the Questionnaire model
  questionnaireId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Questionnaires',
      key: 'id',
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
  },
  // Storing array of response objects as JSON.
  // A better long-term solution is a separate 'Responses' table.
  responses: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  riskScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Assessment;

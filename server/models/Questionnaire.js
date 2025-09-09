import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Questionnaire = sequelize.define('Questionnaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // Assuming description can be optional
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields
});

export default Questionnaire;

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Foreign key for the User this note is about (the patient)
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  // Foreign key for the User who wrote the note (the author)
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  text: {
    type: DataTypes.TEXT, // TEXT is more suitable for long content
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Note;

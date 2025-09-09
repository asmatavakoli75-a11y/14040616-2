import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PredictionModel = sequelize.define('PredictionModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // e.g., pending, training, completed, failed
  },
  performance: {
    type: DataTypes.JSON,
    allowNull: true, // Performance metrics might not exist if training fails
  },
  modelData: {
    type: DataTypes.BLOB('long'), // Use BLOB for binary data, 'long' for larger models
    allowNull: true,
  },
  parameters: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default PredictionModel;

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Using JSON type to accommodate various structures for settings,
  // similar to Mongoose's 'Mixed' type.
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Note: The original static method 'seedInitialSettings' should be
// re-implemented as a separate seeding script or function that runs
// after the database models are synchronized.

export default Setting;

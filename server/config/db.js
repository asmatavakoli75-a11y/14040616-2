import { Sequelize } from 'sequelize';

// Environment variables are loaded from the main server.js file

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to console.log to see executed SQL queries
  }
);

// Function to test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

// Export the sequelize instance for model definitions and the connect function
export { connectDB };
export default sequelize;
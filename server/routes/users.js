import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all patients
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'patient' },
      attributes: { exclude: ['password'] } // Exclude password from result
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      id: user.id, // Use id instead of _id
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    // Handle potential validation errors from Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id, // Use id instead of _id
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

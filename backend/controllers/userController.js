const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  console.log('Registration attempt:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    console.log('Checking if user already exists');
    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists');
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    console.log('Creating new user');
    user = new User({
      name,
      email,
      password
    });

    console.log('Hashing password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Saving user to database');
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    console.log('Generating JWT');
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign error:', err);
          throw err;
        }
        console.log('Registration successful');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error during registration:', err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  console.log('Login attempt:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('Searching for user with email:', email);
    let user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    console.log('User found, comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    console.log('Password matched, generating token');
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign error:', err);
          throw err;
        }
        console.log('Login successful, sending token');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error during login:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getAuthenticatedUser = async (req, res) => {
  try {
    console.log('Fetching authenticated user');
    const user = await User.findById(req.user.id).select('-password');
    console.log('User found:', user);
    res.json(user);
  } catch (err) {
    console.error('Server error while fetching authenticated user:', err.message);
    res.status(500).send('Server Error');
  }
};
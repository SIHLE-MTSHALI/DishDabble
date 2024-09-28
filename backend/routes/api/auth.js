const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const userController = require('../../controllers/userController');

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Private
router.get('/', auth, userController.getAuthenticatedUser);

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.login
);

module.exports = router;
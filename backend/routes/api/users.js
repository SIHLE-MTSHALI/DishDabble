const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const userController = require('../../controllers/userController');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  userController.registerUser
);

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', userController.getAllUsers);

// @route   GET api/users/random
// @desc    Get random users
// @access  Public
router.get('/random', userController.getRandomUsers);

// @route   GET api/users/profile/:username
// @desc    Get user profile
// @access  Public
router.get('/profile/:username', userController.getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, userController.updateUserProfile);

// @route   PUT api/users/follow/:id
// @desc    Follow a user
// @access  Private
router.put('/follow/:id', auth, userController.followUser);

// @route   PUT api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.put('/unfollow/:id', auth, userController.unfollowUser);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', userController.getUserById);

// @route   GET api/users/:id/followers
// @desc    Get user's followers
// @access  Public
router.get('/:id/followers', userController.getUserFollowers);

// @route   GET api/users/:id/following
// @desc    Get users that a user is following
// @access  Public
router.get('/:id/following', userController.getUserFollowing);

// @route   GET api/users/check-usernames
// @desc    Check for users without usernames
// @access  Private (should be restricted to admins in production)
router.get('/check-usernames', auth, userController.checkUsersWithoutUsernames);

// @route   POST api/users/generate-usernames
// @desc    Generate usernames for users without them
// @access  Private (should be restricted to admins in production)
router.post('/generate-usernames', auth, userController.generateUsernamesForExistingUsers);

module.exports = router;
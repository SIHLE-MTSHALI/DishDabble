const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const notificationController = require('./notificationController');

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Private
exports.getAuthenticatedUser = async (req, res) => {
  console.log('Fetching authenticated user:', req.user.id);
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('Authenticated user fetched successfully');
    res.json(user);
  } catch (err) {
    console.error('Error in getAuthenticatedUser:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  console.log('User login attempt');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid credentials: password does not match');
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

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
        if (err) throw err;
        console.log('User logged in successfully:', user.id);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/users
// @desc    Register user
// @access  Public
exports.registerUser = async (req, res) => {
  console.log('Attempting to register new user');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log('New user registered:', user.id);

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
        if (err) throw err;
        console.log('JWT generated for user:', user.id);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/users
// @desc    Get all users
// @access  Public
exports.getAllUsers = async (req, res) => {
  console.log('Fetching all users');
  try {
    const users = await User.find().select('-password');
    console.log(`Retrieved ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('Error in getAllUsers:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
exports.getUserById = async (req, res) => {
  console.log('Fetching user by ID:', req.params.id);
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('User found:', user.id);
    res.json(user);
  } catch (err) {
    console.error('Error in getUserById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/follow/:id
// @desc    Follow a user
// @access  Private
exports.followUser = async (req, res) => {
  console.log(`User ${req.user.id} attempting to follow user ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user) {
      console.log('Target user not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.id === currentUser.id) {
      console.log('User attempted to follow themselves');
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    if (currentUser.following.includes(user.id)) {
      console.log(`User ${currentUser.id} is already following ${user.id}`);
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    currentUser.following.push(user.id);
    user.followers.push(currentUser.id);

    await currentUser.save();
    await user.save();

    console.log(`User ${currentUser.id} successfully followed ${user.id}`);

    // Create notification
    await notificationController.createNotification('follow', user.id, currentUser.id);

    // Emit socket event
    req.io.to(user.id.toString()).emit('followerUpdated', {
      followers: user.followers
    });
    console.log('Emitted followerUpdated event');

    res.json({ following: currentUser.following, followers: user.followers });
  } catch (err) {
    console.error('Error in followUser:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
exports.unfollowUser = async (req, res) => {
  console.log(`User ${req.user.id} attempting to unfollow user ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user) {
      console.log('Target user not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.id === currentUser.id) {
      console.log('User attempted to unfollow themselves');
      return res.status(400).json({ msg: 'You cannot unfollow yourself' });
    }

    if (!currentUser.following.includes(user.id)) {
      console.log(`User ${currentUser.id} is not following ${user.id}`);
      return res.status(400).json({ msg: 'You are not following this user' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== user.id.toString());
    user.followers = user.followers.filter(id => id.toString() !== currentUser.id.toString());

    await currentUser.save();
    await user.save();

    console.log(`User ${currentUser.id} successfully unfollowed ${user.id}`);

    // Emit socket event
    req.io.to(user.id.toString()).emit('followerUpdated', {
      followers: user.followers
    });
    console.log('Emitted followerUpdated event');

    res.json({ following: currentUser.following, followers: user.followers });
  } catch (err) {
    console.error('Error in unfollowUser:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/profile/:username
// @desc    Get user profile
// @access  Public
exports.getUserProfile = async (req, res) => {
  console.log('Fetching user profile for username:', req.params.username);
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');

    if (!user) {
      console.log('User not found:', req.params.username);
      return res.status(404).json({ msg: 'User not found' });
    }

    const recipes = await Recipe.find({ user: user._id }).sort({ createdAt: -1 });
    console.log(`Retrieved ${recipes.length} recipes for user ${user.id}`);

    res.json({ user, recipes });
  } catch (err) {
    console.error('Error in getUserProfile:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  console.log(`Updating profile for user ${req.user.id}`);
  const { name, bio, website, avatar } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.website = website || user.website;
    user.avatar = avatar || user.avatar;

    await user.save();
    console.log('User profile updated successfully:', user.id);

    res.json(user);
  } catch (err) {
    console.error('Error in updateUserProfile:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/random
// @desc    Get random users
// @access  Public
exports.getRandomUsers = async (req, res) => {
  console.log('Fetching random users');
  try {
    const limit = parseInt(req.query.limit) || 10;

    console.log(`getRandomUsers: Limit ${limit}`);

    const totalUsers = await User.countDocuments();
    console.log(`getRandomUsers: Total users: ${totalUsers}`);

    const randomUsers = await User.aggregate([
      { $sample: { size: limit } },
      { $project: {
          password: 0,
          email: 0
        }
      }
    ]);

    console.log(`getRandomUsers: Found ${randomUsers.length} random users`);

    res.json(randomUsers);
  } catch (err) {
    console.error('getRandomUsers: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const notificationController = require('./notificationController');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

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

  const { name, username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

    user = await User.findOne({ username });
    if (user) {
      console.log('Username already exists:', username);
      return res.status(400).json({ errors: [{ msg: 'Username already taken' }] });
    }

    user = new User({
      name,
      username,
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

    // Log each user's data
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user._id,
        name: user.name,
        username: user.username,
        hasUsername: !!user.username
      });
    });

    // Check if any user is missing a username
    const usersWithoutUsername = users.filter(user => !user.username);
    if (usersWithoutUsername.length > 0) {
      console.warn(`Warning: ${usersWithoutUsername.length} users are missing a username`);
      usersWithoutUsername.forEach((user, index) => {
        console.warn(`User without username ${index + 1}:`, {
          id: user._id,
          name: user.name,
          email: user.email
        });
      });
    }

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

    console.log('Current user before save:', currentUser);
    console.log('Target user before save:', user);

    try {
      await currentUser.save();
    } catch (saveErr) {
      console.error('Error saving current user:', saveErr);
      return res.status(500).json({ msg: 'Error updating current user', error: saveErr.message });
    }

    try {
      await user.save();
    } catch (saveErr) {
      console.error('Error saving target user:', saveErr);
      return res.status(500).json({ msg: 'Error updating target user', error: saveErr.message });
    }

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
    console.error('Error in followUser:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
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

    console.log('Current user before save:', currentUser);
    console.log('Target user before save:', user);

    try {
      await currentUser.save();
    } catch (saveErr) {
      console.error('Error saving current user:', saveErr);
      return res.status(500).json({ msg: 'Error updating current user', error: saveErr.message });
    }

    try {
      await user.save();
    } catch (saveErr) {
      console.error('Error saving target user:', saveErr);
      return res.status(500).json({ msg: 'Error updating target user', error: saveErr.message });
    }

    console.log(`User ${currentUser.id} successfully unfollowed ${user.id}`);

    // Emit socket event
    req.io.to(user.id.toString()).emit('followerUpdated', {
      followers: user.followers
    });
    console.log('Emitted followerUpdated event');

    res.json({ following: currentUser.following, followers: user.followers });
  } catch (err) {
    console.error('Error in unfollowUser:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// @route   GET api/users/profile/:username
// @desc    Get user profile
// @access  Public
exports.getUserProfile = async (req, res) => {
  console.log('Fetching user profile for:', req.params.username);
  try {
    if (!req.params.username) {
      console.log('Username parameter is missing');
      return res.status(400).json({ msg: 'Username is required' });
    }

    // First, try to find the user by username
    let user = await User.findOne({ username: req.params.username }).select('-password');
    console.log('User search by username result:', user ? 'Found' : 'Not found');

    // If user is not found by username, check if it's a valid ObjectId and try to find by ID
    if (!user && mongoose.Types.ObjectId.isValid(req.params.username)) {
      console.log('Username not found, trying to find by ObjectId');
      user = await User.findById(req.params.username).select('-password');
      console.log('User search by ObjectId result:', user ? 'Found' : 'Not found');
    }

    if (!user) {
      console.log('User not found:', req.params.username);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('User found:', user.username);

    const recipes = await Recipe.find({ user: user._id }).sort({ createdAt: -1 }).limit(10);
    console.log(`Retrieved ${recipes.length} recipes for user ${user.id}`);

    const userProfileData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt
    };

    res.json({ user: userProfileData, recipes });
  } catch (err) {
    console.error('Error in getUserProfile:', err.message);
    console.error('Full error object:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
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

    // Return only necessary user data
    const updatedUserData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt
    };

    res.json(updatedUserData);
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
    console.log(`getRandomUsers: Total users in database: ${totalUsers}`);

    const randomUsers = await User.aggregate([
      { $sample: { size: limit } },
      { $project: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          bio: 1,
          followers: 1
        }
      }
    ]);

    console.log(`getRandomUsers: Found ${randomUsers.length} random users`);
    
    // Log each user's data
    randomUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user._id,
        name: user.name,
        username: user.username,
        hasUsername: !!user.username
      });
    });

    // Check if any user is missing a username
    const usersWithoutUsername = randomUsers.filter(user => !user.username);
    if (usersWithoutUsername.length > 0) {
      console.warn(`Warning: ${usersWithoutUsername.length} users are missing a username`);
      usersWithoutUsername.forEach((user, index) => {
        console.warn(`User without username ${index + 1}:`, {
          id: user._id,
          name: user.name
        });
      });
    }

    res.json(randomUsers);
  } catch (err) {
    console.error('getRandomUsers: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/:id/followers
// @desc    Get user's followers
// @access  Public
exports.getUserFollowers = async (req, res) => {
  console.log(`Fetching followers for user ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name avatar username');

    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Retrieved ${user.followers.length} followers for user ${user.id}`);
    res.json(user.followers);
  } catch (err) {
    console.error('Error in getUserFollowers:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/:id/following
// @desc    Get users that a user is following
// @access  Public
exports.getUserFollowing = async (req, res) => {
  console.log(`Fetching following list for user ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id).populate('following', 'name avatar username');

    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Retrieved ${user.following.length} users that user ${user.id} is following`);
    res.json(user.following);
  } catch (err) {
    console.error('Error in getUserFollowing:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/users/check-usernames
// @desc    Check for users without usernames
// @access  Private (should be restricted to admins in production)
exports.checkUsersWithoutUsernames = async (req, res) => {
  console.log('Checking for users without usernames');
  try {
    const usersWithoutUsername = await User.find({ username: { $in: [null, ''] } }).select('_id name email');
    
    console.log(`Found ${usersWithoutUsername.length} users without usernames`);
    
    if (usersWithoutUsername.length > 0) {
      usersWithoutUsername.forEach((user, index) => {
        console.log(`User ${index + 1} without username:`, {
          id: user._id,
          name: user.name,
          email: user.email
        });
      });
    }

    res.json({
      count: usersWithoutUsername.length,
      users: usersWithoutUsername
    });
  } catch (err) {
    console.error('Error in checkUsersWithoutUsernames:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/users/generate-usernames
// @desc    Generate usernames for users without them
// @access  Private (should be restricted to admins in production)
exports.generateUsernamesForExistingUsers = async (req, res) => {
  console.log('Generating usernames for users without them');
  try {
    const usersWithoutUsername = await User.find({ username: { $in: [null, ''] } });
    console.log(`Found ${usersWithoutUsername.length} users without usernames`);

    let updatedCount = 0;
    for (let user of usersWithoutUsername) {
      const firstName = user.name.split(' ')[0];
      const lastName = user.name.split(' ').slice(1).join(' ');
      let username = faker.internet.userName({ firstName, lastName }).toLowerCase();
      
      // Check if the generated username already exists
      let usernameExists = await User.findOne({ username });
      let attempts = 0;
      while (usernameExists && attempts < 10) {
        username = faker.internet.userName({ firstName, lastName }).toLowerCase();
        usernameExists = await User.findOne({ username });
        attempts++;
      }

      if (!usernameExists) {
        user.username = username;
        await user.save();
        updatedCount++;
      } else {
        console.warn(`Could not generate a unique username for user ${user._id} after 10 attempts`);
      }
    }

    console.log(`Generated usernames for ${updatedCount} users`);
    res.json({ message: `Generated usernames for ${updatedCount} users` });
  } catch (error) {
    console.error('Error generating usernames for existing users:', error);
    res.status(500).json({ error: 'Server error while generating usernames' });
  }
};

module.exports = exports;
const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const notificationController = require('./notificationController');
const mongoose = require('mongoose');

// Helper function to delete image file
const deleteImage = (filename) => {
  const imagePath = path.join(__dirname, '..', '..', 'uploads', filename);
  fs.unlink(imagePath, (err) => {
    if (err) console.error('Error deleting image:', err);
  });
};

exports.createRecipe = async (req, res) => {
  console.log('createRecipe: Received request');
  console.log('createRecipe: Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('createRecipe: Request body:', JSON.stringify(req.body, null, 2));
  console.log('createRecipe: Request files:', req.files);
  console.log('createRecipe: User ID:', req.user.id);
  console.log('createRecipe: MongoDB connection state:', mongoose.connection.readyState);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('createRecipe: Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection is not established');
    }

    const { title, description, ingredients, instructions, prepTime, cookTime, difficulty, servings, tags } = req.body;

    console.log('createRecipe: Received title:', title);
    console.log('createRecipe: Received description:', description);
    console.log('createRecipe: Received ingredients (type):', typeof ingredients);
    console.log('createRecipe: Received ingredients (value):', ingredients);
    console.log('createRecipe: Received instructions (type):', typeof instructions);
    console.log('createRecipe: Received instructions (value):', instructions);
    console.log('createRecipe: Received prepTime:', prepTime);
    console.log('createRecipe: Received cookTime:', cookTime);
    console.log('createRecipe: Received difficulty:', difficulty);
    console.log('createRecipe: Received servings:', servings);
    console.log('createRecipe: Received tags (type):', typeof tags);
    console.log('createRecipe: Received tags (value):', tags);

    let parsedIngredients, parsedInstructions, parsedTags;

    try {
      parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
      parsedInstructions = Array.isArray(instructions) ? instructions : JSON.parse(instructions);
      parsedTags = Array.isArray(tags) ? tags : (tags ? JSON.parse(tags) : []);
    } catch (parseError) {
      console.error('createRecipe: Error parsing JSON:', parseError);
      return res.status(400).json({ msg: 'Invalid format for ingredients, instructions, or tags', error: parseError.message });
    }

    console.log('createRecipe: Parsed ingredients:', JSON.stringify(parsedIngredients, null, 2));
    console.log('createRecipe: Parsed instructions:', JSON.stringify(parsedInstructions, null, 2));
    console.log('createRecipe: Parsed tags:', JSON.stringify(parsedTags, null, 2));

    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
      console.log('createRecipe: Invalid ingredients array');
      return res.status(400).json({ msg: 'At least one ingredient is required' });
    }

    if (!Array.isArray(parsedInstructions) || parsedInstructions.length === 0) {
      console.log('createRecipe: Invalid instructions array');
      return res.status(400).json({ msg: 'At least one instruction is required' });
    }

    const newRecipe = new Recipe({
      user: req.user.id,
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      prepTime,
      cookTime,
      difficulty,
      servings,
      tags: parsedTags
    });

    console.log('createRecipe: New recipe object:', JSON.stringify(newRecipe, null, 2));

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      newRecipe.images = req.files.map(file => file.filename);
      console.log('createRecipe: Uploaded images:', newRecipe.images);
    }

    const recipe = await newRecipe.save();
    console.log('createRecipe: Recipe saved successfully:', JSON.stringify(recipe, null, 2));
    res.json(recipe);
  } catch (err) {
    console.error('createRecipe: Error:', err);
    console.error('createRecipe: Error message:', err.message);
    console.error('createRecipe: Error stack:', err.stack);
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      console.log('createRecipe: Mongoose validation errors:', validationErrors);
      return res.status(400).json({ msg: 'Validation Error', errors: validationErrors });
    }
    if (err.message === 'MongoDB connection is not established') {
      return res.status(500).json({ msg: 'Database connection error', error: err.message });
    }
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    console.log('getAllRecipes: Fetching recipes');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    console.log(`getAllRecipes: Page ${page}, Limit ${limit}, StartIndex ${startIndex}`);

    const totalRecipes = await Recipe.countDocuments();
    console.log(`getAllRecipes: Total recipes in database: ${totalRecipes}`);

    const recipes = await Recipe.find()
      .populate('user', ['name', 'avatar'])
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const hasMore = startIndex + recipes.length < totalRecipes;

    res.json({
      recipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    console.log(`getRecipeById: Fetching recipe with ID ${req.params.id}`);
    const recipe = await Recipe.findById(req.params.id).populate('user', ['name', 'avatar']);
    if (!recipe) {
      console.log(`getRecipeById: Recipe with ID ${req.params.id} not found`);
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    console.log('getRecipeById: Recipe data:', JSON.stringify(recipe, null, 2));
    console.log('getRecipeById: Ingredients:', JSON.stringify(recipe.ingredients, null, 2));
    res.json(recipe);
  } catch (err) {
    console.error('getRecipeById: Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Handle image uploads and deletions
    if (req.files && req.files.length > 0) {
      // Delete old images
      recipe.images.forEach(deleteImage);
      
      // Add new images
      recipe.images = req.files.map(file => file.filename);
    }

    // Update other fields
    const { title, description, ingredients, instructions, prepTime, cookTime, difficulty, servings, tags } = req.body;
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = JSON.parse(ingredients);
    if (instructions) recipe.instructions = JSON.parse(instructions);
    if (prepTime) recipe.prepTime = prepTime;
    if (cookTime) recipe.cookTime = cookTime;
    if (difficulty) recipe.difficulty = difficulty;
    if (servings) recipe.servings = servings;
    if (tags) recipe.tags = JSON.parse(tags);

    await recipe.save();

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete associated images
    recipe.images.forEach(deleteImage);

    await recipe.remove();
    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if the recipe has already been liked by this user
    if (recipe.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Recipe already liked' });
    }

    recipe.likes.push(req.user.id);
    await recipe.save();

    // Create notification
    await notificationController.createNotification('like', recipe.user, req.user.id, recipe._id);

    // Emit socket event
    req.io.to(recipe.user.toString()).emit('recipeLiked', {
      recipeId: recipe._id,
      likes: recipe.likes
    });

    console.log(`Recipe ${recipe._id} liked by user ${req.user.id}`);
    res.json(recipe.likes);
  } catch (err) {
    console.error('Error in likeRecipe:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.unlikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if the recipe has not yet been liked by this user
    if (!recipe.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Recipe has not yet been liked' });
    }

    // Remove the like
    recipe.likes = recipe.likes.filter(like => like.toString() !== req.user.id);

    await recipe.save();

    // Emit socket event
    req.io.to(recipe.user.toString()).emit('recipeLiked', {
      recipeId: recipe._id,
      likes: recipe.likes
    });

    console.log(`Recipe ${recipe._id} unliked by user ${req.user.id}`);
    res.json(recipe.likes);
  } catch (err) {
    console.error('Error in unlikeRecipe:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if the recipe has already been saved by this user
    if (recipe.saves.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Recipe already saved' });
    }

    recipe.saves.push(req.user.id);
    await recipe.save();

    // Create notification
    await notificationController.createNotification('save', recipe.user, req.user.id, recipe._id);

    res.json(recipe.saves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.unsaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if the recipe has not yet been saved by this user
    if (!recipe.saves.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Recipe has not yet been saved' });
    }

    // Remove the save
    recipe.saves = recipe.saves.filter(save => save.toString() !== req.user.id);

    await recipe.save();

    res.json(recipe.saves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Check if the user has already rated this recipe
    const ratingIndex = recipe.ratings.findIndex(r => r.user.toString() === req.user.id);

    if (ratingIndex > -1) {
      // Update existing rating
      recipe.ratings[ratingIndex].value = rating;
    } else {
      // Add new rating
      recipe.ratings.push({ user: req.user.id, value: rating });
    }

    await recipe.save();

    res.json(recipe.ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const totalRecipes = await Recipe.countDocuments({ user: req.params.userId });
    const recipes = await Recipe.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const hasMore = startIndex + recipes.length < totalRecipes;

    res.json({
      recipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    console.log('searchRecipes: Searching for recipes');
    const { term } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    console.log(`searchRecipes: Term: ${term}, Page ${page}, Limit ${limit}, StartIndex ${startIndex}`);

    const query = {
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { 'ingredients.name': { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } }
      ]
    };

    const totalRecipes = await Recipe.countDocuments(query);
    console.log(`searchRecipes: Total matching recipes: ${totalRecipes}`);

    const recipes = await Recipe.find(query)
      .populate('user', ['name', 'avatar'])
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const hasMore = startIndex + recipes.length < totalRecipes;

    console.log(`searchRecipes: Found ${recipes.length} recipes`);

    res.json({
      recipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error('searchRecipes: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTrendingRecipes = async (req, res) => {
  try {
    console.log('getTrendingRecipes: Fetching trending recipes');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    console.log(`getTrendingRecipes: Page ${page}, Limit ${limit}, StartIndex ${startIndex}`);

    const totalRecipes = await Recipe.countDocuments();
    console.log(`getTrendingRecipes: Total recipes: ${totalRecipes}`);

    const recipes = await Recipe.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          savesCount: { $size: "$saves" }
        }
      },
      {
        $sort: {
          likesCount: -1,
          savesCount: -1,
          createdAt: -1
        }
      },
      { $skip: startIndex },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.email': 0
        }
      }
    ]);

    const hasMore = startIndex + recipes.length < totalRecipes;

    console.log(`getTrendingRecipes: Found ${recipes.length} trending recipes`);

    res.json({
      recipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error('getTrendingRecipes: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getFeedRecipes = async (req, res) => {
  try {
    console.log('getFeedRecipes: Fetching feed recipes');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    console.log(`getFeedRecipes: Page ${page}, Limit ${limit}, StartIndex ${startIndex}`);

    // Get the list of users that the current user follows
    const user = await User.findById(req.user.id);
    const following = user.following;

    console.log(`getFeedRecipes: User is following ${following.length} users`);

    const totalRecipes = await Recipe.countDocuments({ user: { $in: following } });
    console.log(`getFeedRecipes: Total feed recipes: ${totalRecipes}`);

    const recipes = await Recipe.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'avatar'])
      .skip(startIndex)
      .limit(limit);

    const hasMore = startIndex + recipes.length < totalRecipes;

    console.log(`getFeedRecipes: Found ${recipes.length} feed recipes`);

    res.json({
      recipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error('getFeedRecipes: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.commentRecipe = async (req, res) => {
  const { text } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    const newComment = {
      user: req.user.id,
      text,
      name: req.user.name,
      avatar: req.user.avatar
    };

    recipe.comments.unshift(newComment);
    await recipe.save();

    // Create notification
    await notificationController.createNotification('comment', recipe.user, req.user.id, recipe._id);

    // Emit socket event
    req.io.to(recipe.user.toString()).emit('recipeCommented', {
      recipeId: recipe._id,
      comments: recipe.comments
    });

    console.log(`Recipe ${recipe._id} commented by user ${req.user.id}`);
    res.json(recipe.comments);
  } catch (err) {
    console.error('Error in commentRecipe:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRandomRecipes = async (req, res) => {
  try {
    console.log('getRandomRecipes: Fetching random recipes');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    console.log(`getRandomRecipes: Page ${page}, Limit ${limit}, StartIndex ${startIndex}`);

    const totalRecipes = await Recipe.countDocuments();
    console.log(`getRandomRecipes: Total recipes: ${totalRecipes}`);

    // Get a random set of recipes
    const randomRecipes = await Recipe.aggregate([
      { $sample: { size: totalRecipes } }, // Get all recipes in random order
      { $skip: startIndex },
      { $limit: limit },
      { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          'user.password': 0,
          'user.email': 0
        }
      }
    ]);

    const hasMore = startIndex + randomRecipes.length < totalRecipes;

    console.log(`getRandomRecipes: Found ${randomRecipes.length} random recipes`);

    res.json({
      recipes: randomRecipes,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit)
    });
  } catch (err) {
    console.error('getRandomRecipes: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
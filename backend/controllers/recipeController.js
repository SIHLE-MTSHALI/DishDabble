const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

// Helper function to delete image file
const deleteImage = (filename) => {
  const imagePath = path.join(__dirname, '..', '..', 'uploads', filename);
  fs.unlink(imagePath, (err) => {
    if (err) console.error('Error deleting image:', err);
  });
};

exports.createRecipe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRecipe = new Recipe({
      user: req.user.id,
      ...req.body
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      newRecipe.images = req.files.map(file => file.filename);
    }

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('user', ['name', 'avatar'])
      .sort({ likes: -1, date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', ['name', 'avatar']);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
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
    if (recipe.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Recipe already liked' });
    }

    recipe.likes.unshift(req.user.id);
    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
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
    if (!recipe.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Recipe has not yet been liked' });
    }

    // Remove the like
    recipe.likes = recipe.likes.filter(
      (like) => like.toString() !== req.user.id
    );

    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    const { term } = req.query;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { 'ingredients.name': { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } }
      ]
    });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
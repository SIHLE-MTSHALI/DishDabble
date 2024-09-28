const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');

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

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
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

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

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
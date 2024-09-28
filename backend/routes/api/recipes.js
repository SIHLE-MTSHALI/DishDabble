const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const recipeController = require('../../controllers/recipeController');

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('ingredients', 'At least one ingredient is required').isArray({ min: 1 }),
      check('instructions', 'At least one instruction is required').isArray({ min: 1 }),
      check('prepTime', 'Preparation time is required').isNumeric(),
      check('cookTime', 'Cooking time is required').isNumeric(),
      check('difficulty', 'Difficulty level is required').isIn(['Easy', 'Medium', 'Hard']),
      check('servings', 'Number of servings is required').isNumeric()
    ]
  ],
  recipeController.createRecipe
);

// @route   GET api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', recipeController.getAllRecipes);

// @route   GET api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', recipeController.getRecipeById);

// @route   PUT api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', auth, recipeController.updateRecipe);

// @route   DELETE api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', auth, recipeController.deleteRecipe);

module.exports = router;
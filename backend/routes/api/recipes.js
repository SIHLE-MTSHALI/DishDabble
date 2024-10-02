const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const recipeController = require('../../controllers/recipeController');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
});

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post(
  '/',
  [
    auth,
    upload.array('images', 5), // Allow up to 5 images
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
// @desc    Get all recipes with pagination
// @access  Public
router.get('/', recipeController.getAllRecipes);

// @route   GET api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', recipeController.getRecipeById);

// @route   PUT api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put(
  '/:id',
  [
    auth,
    upload.array('images', 5), // Allow up to 5 images
  ],
  recipeController.updateRecipe
);

// @route   DELETE api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', auth, recipeController.deleteRecipe);

// @route   PUT api/recipes/like/:id
// @desc    Like a recipe
// @access  Private
router.put('/like/:id', auth, recipeController.likeRecipe);

// @route   PUT api/recipes/unlike/:id
// @desc    Unlike a recipe
// @access  Private
router.put('/unlike/:id', auth, recipeController.unlikeRecipe);

// @route   PUT api/recipes/save/:id
// @desc    Save a recipe
// @access  Private
router.put('/save/:id', auth, recipeController.saveRecipe);

// @route   PUT api/recipes/unsave/:id
// @desc    Unsave a recipe
// @access  Private
router.put('/unsave/:id', auth, recipeController.unsaveRecipe);

// @route   POST api/recipes/rate/:id
// @desc    Rate a recipe
// @access  Private
router.post(
  '/rate/:id',
  [
    auth,
    [
      check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
    ]
  ],
  recipeController.rateRecipe
);

// @route   GET api/recipes/user/:userId
// @desc    Get recipes by user ID with pagination
// @access  Public
router.get('/user/:userId', recipeController.getUserRecipes);

// @route   GET api/recipes/search
// @desc    Search recipes with pagination
// @access  Public
router.get('/search', recipeController.searchRecipes);

// @route   GET api/recipes/trending
// @desc    Get trending recipes with pagination
// @access  Public
router.get('/trending', recipeController.getTrendingRecipes);

// @route   GET api/recipes/feed
// @desc    Get feed recipes for authenticated user with pagination
// @access  Private
router.get('/feed', auth, recipeController.getFeedRecipes);

module.exports = router;
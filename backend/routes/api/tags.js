const express = require('express');
const router = express.Router();
const tagController = require('../../controllers/tagController');

// @route   GET api/tags/random
// @desc    Get random tags
// @access  Public
router.get('/random', tagController.getRandomTags);

module.exports = router;
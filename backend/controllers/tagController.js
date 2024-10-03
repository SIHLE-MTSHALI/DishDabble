const Recipe = require('../models/Recipe');

// @route   GET api/tags/random
// @desc    Get random tags
// @access  Public
exports.getRandomTags = async (req, res) => {
  console.log('Fetching random tags');
  try {
    const limit = parseInt(req.query.limit) || 10;

    console.log(`getRandomTags: Limit ${limit}`);

    const randomTags = await Recipe.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sample: { size: limit } },
      { $project: { _id: 0, name: '$_id', count: 1 } }
    ]);

    console.log(`getRandomTags: Found ${randomTags.length} random tags`);

    res.json(randomTags);
  } catch (err) {
    console.error('getRandomTags: Error:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
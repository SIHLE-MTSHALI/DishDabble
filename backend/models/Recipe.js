const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: [{
    type: String
  }],
  images: [{
    type: String
  }],
  prepTime: {
    type: Number,
    required: true
  },
  cookTime: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  tags: [{
    type: String
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);
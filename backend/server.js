const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/recipes', require('./routes/api/recipes'));

// Search route
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { term } = req.query;
    console.log(`Searching for recipes with term: ${term}`);
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { 'ingredients.name': { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } }
      ]
    });
    console.log(`Found ${recipes.length} recipes matching the search term`);
    res.json(recipes);
  } catch (err) {
    console.error('Error in recipe search:', err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`API is running at http://localhost:${PORT}`);
  console.log('Press CTRL-C to stop the server');
});
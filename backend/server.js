require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Load environment variables
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

console.log('MongoDB URI:', mongoURI);
console.log('JWT Secret:', jwtSecret);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('likeRecipe', async ({ recipeId, userId }) => {
    try {
      const Recipe = require('./models/Recipe');
      const recipe = await Recipe.findById(recipeId);
      if (recipe) {
        console.log(`Recipe ${recipeId} liked by user ${userId}`);
        io.to(recipe.user.toString()).emit('recipeLiked', {
          recipeId,
          likes: recipe.likes
        });
      }
    } catch (error) {
      console.error('Error in likeRecipe socket event:', error);
    }
  });

  socket.on('commentRecipe', async ({ recipeId, userId, comment }) => {
    try {
      const Recipe = require('./models/Recipe');
      const recipe = await Recipe.findById(recipeId);
      if (recipe) {
        console.log(`Recipe ${recipeId} commented by user ${userId}`);
        io.to(recipe.user.toString()).emit('recipeCommented', {
          recipeId,
          comments: recipe.comments
        });
      }
    } catch (error) {
      console.error('Error in commentRecipe socket event:', error);
    }
  });

  socket.on('followUser', async ({ userId, followerId }) => {
    try {
      const User = require('./models/User');
      const user = await User.findById(userId);
      if (user) {
        console.log(`User ${userId} followed by user ${followerId}`);
        io.to(userId).emit('followerUpdated', {
          followers: user.followers
        });
      }
    } catch (error) {
      console.error('Error in followUser socket event:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/recipes', require('./routes/api/recipes'));
app.use('/api/notifications', require('./routes/api/notifications'));
app.use('/api/tags', require('./routes/api/tags')); // New tags route

// Search route
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { term } = req.query;
    console.log(`Searching for recipes with term: ${term}`);
    const Recipe = require('./models/Recipe');
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

// Database population route (for development only)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/populate-db', async (req, res) => {
    try {
      const { populateDatabase } = require('./dataGenerator');
      await populateDatabase(50, 100); // Generate 50 users and 100 recipes
      res.json({ message: 'Database populated successfully' });
    } catch (error) {
      console.error('Error populating database:', error);
      res.status(500).json({ error: 'Failed to populate database' });
    }
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`API is running at http://localhost:${PORT}`);
  console.log('Press CTRL-C to stop the server');
});
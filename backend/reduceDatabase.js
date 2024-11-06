const mongoose = require('mongoose');
const { populateDatabase } = require('./dataGenerator');

// Import models
const User = require('./models/User');
const Recipe = require('./models/Recipe');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dishdabble';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

const reduceDatabaseSize = async () => {
  try {
    await clearDatabase();
    
    // Repopulate with reduced data
    // Adjust these numbers as needed
    await populateDatabase(100, 500);
    
    console.log('Database size reduced successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error reducing database size:', error);
    process.exit(1);
  }
};

reduceDatabaseSize();

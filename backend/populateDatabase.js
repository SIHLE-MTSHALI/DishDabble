require('dotenv').config();
const mongoose = require('mongoose');
const { populateDatabase } = require('./dataGenerator');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const runPopulation = async () => {
  await connectDB();
  
  try {
    await populateDatabase(50, 100); // Generate 50 users and 100 recipes
    console.log('Database population completed successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

runPopulation();
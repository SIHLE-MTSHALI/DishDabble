# DishDabble

Welcome to DishDabble, a passion project for food lovers and home cooks! This community-driven recipe sharing platform allows users to submit recipes, explore culinary creations from others, and interact through comments, ratings, and more.

## About the Developers

DishDabble is the result of a collaborative effort between two passionate developers:

- Sihle Mtshali
- Xola Mthembu

We've combined our skills and creativity to bring you this exciting platform for culinary exploration and sharing. For more information about the contributors, please check the AUTHORS file in the root directory of the project.

## Features

As the developers of DishDabble, we're excited to share the following features:

- User authentication (register, login, logout)
- Create, read, update, and delete recipes
- Advanced recipe search and filtering
- User profiles with followers and following lists
- Tag system for easy recipe categorization
- Notifications for user interactions
- Trending recipes page
- Explore page for discovering new content
- Responsive design for seamless mobile and desktop experience

## Technologies Used

We've carefully chosen a modern tech stack to build DishDabble:

- Frontend: React, Redux, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Real-time updates: Socket.io

## Project Structure

The project is organized into two main directories:

### Backend

- `controllers/`: Handles the logic for different API endpoints
- `middleware/`: Contains custom middleware, including authentication
- `models/`: Defines the data models for MongoDB
- `routes/`: Sets up the API routes
- `server.js`: The main entry point for the backend
- `dataGenerator.js`: A script to generate sample data for testing and development
- `checkUsersWithoutUsernames.js`: A utility script to check and update users without usernames

### Frontend

- `src/actions/`: Redux actions for state management
- `src/components/`: Reusable React components
- `src/pages/`: Individual page components
- `src/reducers/`: Redux reducers for state updates
- `src/styles/`: Global styles and theming
- `src/utils/`: Utility functions and helpers

## Getting Started

To get DishDabble up and running on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/SIHLE-MTSHALI/dishdabble.git
   cd dishdabble
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm run install-all
   ```

3. Set up environment variables:

   For the backend, create a `.env` file in the `backend` directory with the following content:
   ```
   MONGO_URI=mongodb://localhost:27017/dishdabble
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
   Replace `your_jwt_secret_here` with a secure random string. You can generate one using the provided `generate_secret_key.py` script:
   ```
   python ../generate_secret_key.py
   ```

   For the frontend, create a `.env` file in the `frontend` directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the application:
   ```
   npm run dev
   ```

   This will start both the backend server and the frontend development server concurrently.

5. Open your browser and navigate to `http://localhost:3000` to see DishDabble in action!

## Key Components

Here's a brief overview of some key components we've implemented:

- `RecipeList`: Displays a grid of recipe cards
- `RecipeDetail`: Shows full recipe information
- `RecipeForm`: Allows users to create or edit recipes
- `TagList`: Manages recipe tags
- `UserList`: Displays user information
- `FollowersList` and `FollowingList`: Show user connections
- `Navigation`: The main navigation component
- `ProfilePage`: Displays user profile and recipes
- `ExplorePage`: Helps users discover new content
- `TrendingPage`: Shows popular recipes
- `SearchPage`: Allows advanced recipe search

## Data Generation

To help with testing and development, we've included a `dataGenerator.js` script in the backend. This script can populate the database with sample recipes, users, and tags.

### Running the Data Generator

To run the data generator, follow these steps:

1. Ensure your MongoDB server is running and the connection string in your `.env` file is correct.

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Run the data generator script:
   ```
   node dataGenerator.js
   ```

4. The script will start generating data and you'll see progress messages in the console.

### What to Expect

After running the data generator script:

- The script will create a number of sample users, recipes, and tags in your database.
- You'll see console output indicating the progress, such as "Created X users", "Created Y recipes", etc.
- Once complete, the script will output a summary of the data generated.
- You can now log in to the application using any of the generated user accounts. The default password for all generated users is "password123".
- The generated data will include a variety of recipes with different ingredients, cooking times, and difficulty levels, as well as associated tags.
- User profiles will have random followers and following relationships established.

This generated data provides a realistic starting point for testing and development, allowing you to immediately explore the full functionality of DishDabble without having to manually create content.

## Notifications

We've implemented a notification system to keep users engaged. The `notificationController.js` handles creating and managing notifications for various user interactions.

## Authentication and Authorization

User authentication is handled using JWT. The `auth.js` middleware ensures that certain routes are protected and only accessible to authenticated users.

## Future Improvements

As with any project, there's always room for improvement. Here are some areas we're considering for future updates:

1. Implement a rating system for recipes
2. Add a meal planning feature
3. Integrate with external APIs for nutritional information
4. Implement a recommendation system based on user preferences
5. Add social media sharing capabilities
6. Enhance real-time features using Socket.io
7. Implement a chat system for users to discuss recipes
8. Add a feature for users to create and share cooking videos

## Contributing

We welcome contributions to DishDabble! If you have ideas for improvements or new features, please feel free to submit a pull request or open an issue.

## Closing Thoughts

Developing DishDabble has been an exciting journey for both of us, and we're proud of how it's shaping up. We hope you enjoy using it as much as we've enjoyed creating it. Happy cooking and happy coding!

-- Sihle Mtshali and Xola Mthembu
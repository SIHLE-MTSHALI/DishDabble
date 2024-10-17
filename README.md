# DishDabble

Welcome to DishDabble, a passion project for food lovers and home cooks! This community-driven recipe sharing platform allows users to submit recipes, explore culinary creations from others, and interact through comments, ratings, and more.

## About the Developers

DishDabble is the result of a collaborative effort between two passionate developers:

- Sihle Mtshali
- Xola Mthembu

We've combined our skills and creativity to bring you this exciting platform for culinary exploration and sharing. For more information about the contributors, please check the AUTHORS file in the root directory of the project.

## Features

DishDabble offers a rich set of features designed to enhance your culinary experience:

- User Authentication: Secure register, login, and logout functionality.
- Recipe Management: Create, read, update, and delete your own recipes.
- Advanced Search: Find recipes using various filters and search criteria.
- User Profiles: Customize your profile and view others' profiles.
- Social Interaction: Follow other users and build your culinary network.
- Tag System: Easily categorize and find recipes using tags.
- Notifications: Stay updated on interactions related to your content.
- Trending Recipes: Discover popular recipes on the Trending page.
- Explore Page: Find new and exciting recipes from the community.
- Responsive Design: Enjoy a seamless experience on both mobile and desktop devices.

## Technologies Used

DishDabble is built with a modern and robust tech stack:

- Frontend:
  - React: A powerful library for building user interfaces.
  - Redux: For efficient state management across the application.
  - Material-UI: Providing a sleek and responsive design.

- Backend:
  - Node.js: A JavaScript runtime for building scalable network applications.
  - Express.js: A minimal and flexible Node.js web application framework.
  - MongoDB: A NoSQL database for storing and managing application data.

- Authentication:
  - JSON Web Tokens (JWT): Ensuring secure and stateless authentication.

- Real-time Updates:
  - Socket.io: Enabling real-time, bidirectional and event-based communication.

## Project Structure

The project is organized into two main directories:

### Backend

- `controllers/`: Handles the logic for different API endpoints (auth, recipes, users, tags, notifications).
- `middleware/`: Contains custom middleware, including authentication.
- `models/`: Defines the data models for MongoDB (User, Recipe, Notification).
- `routes/`: Sets up the API routes for various functionalities.
- `config/`: Stores configuration files, including database connection.
- `server.js`: The main entry point for the backend.
- `dataGenerator.js`: A script to generate sample data for testing and development.
- `checkUsersWithoutUsernames.js`: A utility script to check and update users without usernames.
- `generate_secret_key.py`: A script to generate a secure JWT secret.

### Frontend

- `src/actions/`: Redux actions for state management (auth, recipes, users, tags, notifications).
- `src/components/`: Reusable React components (auth, layout, recipes, tags, users).
- `src/pages/`: Individual page components (Home, Explore, Trending, Profile, Search, Notifications).
- `src/reducers/`: Redux reducers for state updates.
- `src/styles/`: Global styles and theming.
- `src/utils/`: Utility functions and helpers.
- `src/store/`: Redux store configuration.

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
   python backend/generate_secret_key.py
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

Here's a brief overview of some key components in DishDabble:

- `RecipeList`: Displays a grid of recipe cards, used on various pages.
- `RecipeDetail`: Shows full recipe information, including ingredients and instructions.
- `RecipeForm`: Allows users to create new recipes or edit existing ones.
- `TagList`: Manages and displays recipe tags for easy categorization.
- `UserList`: Displays user information in a list format.
- `FollowersList` and `FollowingList`: Show user connections and social interactions.
- `Navigation`: The main navigation component for easy app traversal.
- `ProfilePage`: Displays user profile information and their submitted recipes.
- `ExplorePage`: Helps users discover new content from various users.
- `TrendingPage`: Shows popular recipes based on user interactions.
- `SearchPage`: Allows advanced recipe search with multiple filters.
- `NotificationsPage`: Displays user notifications for various interactions.

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
   or
   ```
   npm run populate-db
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

We've implemented a robust notification system to keep users engaged. The `notificationController.js` handles creating and managing notifications for various user interactions, including:

- New followers
- Likes on recipes
- Comments on recipes
- Mentions in comments

Notifications are displayed in real-time using Socket.io, ensuring users are always up-to-date with the latest interactions.

## Authentication and Authorization

User authentication is handled using JWT (JSON Web Tokens). The `auth.js` middleware ensures that certain routes are protected and only accessible to authenticated users. This includes:

- Creating, updating, and deleting recipes
- Following/unfollowing users
- Accessing user-specific data

## Future Improvements

As with any project, there's always room for improvement. Here are some areas we're considering for future updates:

1. Implement a rating system for recipes-Done.
2. Add a meal planning feature for weekly recipe organization
3. Integrate with external APIs for nutritional information and ingredient substitutions
4. Implement a recommendation system based on user preferences and browsing history
5. Add social media sharing capabilities for recipes
6. Enhance real-time features using Socket.io, such as live cooking sessions
7. Implement a chat system for users to discuss recipes and cooking techniques
8. Add a feature for users to create and share cooking videos
9. Implement a recipe scaling feature to adjust ingredient quantities
10. Add support for multiple languages to reach a broader audience

## Closing Thoughts

Developing DishDabble has been an exciting journey for both of us, and we're proud of how it's shaping up. We've learned a lot about full-stack development, from designing intuitive user interfaces to implementing efficient backend systems. We hope that DishDabble will inspire home cooks to explore new recipes, share their culinary creations, and connect with fellow food enthusiasts.

We're committed to continually improving DishDabble and welcome your feedback and suggestions. Whether you're a seasoned chef or a cooking novice, we hope you'll find DishDabble to be a valuable tool in your culinary adventures.

Happy cooking and happy coding!

-- Sihle Mtshali and Xola Mthembu

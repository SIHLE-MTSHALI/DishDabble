# DishDabble

DishDabble is a community-driven recipe sharing platform where users can submit recipes, browse others' creations, and interact through comments and ratings.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete recipes
- Search recipes
- User profiles
- Responsive design

## Technologies Used

- Frontend: React, Redux, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later) installed
- npm (usually comes with Node.js) installed
- MongoDB installed and running

### Installing MongoDB

1. Download and install MongoDB Community Server from the [official MongoDB website](https://www.mongodb.com/try/download/community).

2. Follow the installation instructions for your operating system.

3. After installation, make sure MongoDB is running. On most systems, it should start automatically. If not, you can start it manually:

   - On Windows: Run MongoDB as a service or use the MongoDB Compass GUI.
   - On macOS/Linux: Run `sudo service mongod start` or `brew services start mongodb-community`.

4. To verify MongoDB is running, open a terminal and type:
   ```
   mongo
   ```
   If it connects successfully, MongoDB is running correctly.

## Getting Started

To get a local copy up and running, follow these steps:

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

   Note: The `.gitignore` file is set up to prevent these `.env` files from being committed to the repository, ensuring that your sensitive information remains private.

4. Start the application:
   ```
   npm run dev
   ```

   This will start both the backend server and the frontend development server concurrently.

5. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Using the Application

1. **Register/Login**: Start by creating an account or logging in if you already have one.

2. **Browse Recipes**: On the home page, you'll see a list of recently added recipes. You can also use the search bar to find specific recipes.

3. **View Recipe Details**: Click on a recipe card to view its full details, including ingredients, instructions, and user ratings.

4. **Create a Recipe**: Once logged in, click on the "Add Recipe" button in the navigation bar. Fill out the form with your recipe details and submit.

5. **Edit/Delete Recipes**: On your profile page or when viewing a recipe you've created, you'll see options to edit or delete the recipe.

6. **User Profile**: Click on your username in the navigation bar to view your profile. Here you can see all the recipes you've created.

## What a Functional App Should Look Like

- **Landing Page**: A welcoming page with a brief description of DishDabble and options to register or log in.
- **Home Page**: After logging in, you'll see a feed of recipes, a search bar, and navigation options.
- **Recipe Details**: Clicking on a recipe should show a detailed view with all recipe information, including ingredients, instructions, and user ratings.
- **Add/Edit Recipe Form**: A form with fields for title, description, ingredients, instructions, cooking time, difficulty, etc.
- **User Profile**: A page showing user information and a list of their created recipes.
- **Responsive Design**: The app should look good and be functional on both desktop and mobile devices.

## Running Tests

To run the frontend tests:
```
npm test
```

## Building for Production

To create a production build of the frontend:
```
npm run build
```

## Troubleshooting

- If you encounter a "MongoDB connection error", make sure MongoDB is running on your system and the MONGO_URI in your `.env` file is correct.
- If you see "Network Error" when trying to interact with the backend, ensure both frontend and backend servers are running and the REACT_APP_API_URL in the frontend `.env` file is correct.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Note on .gitignore

The project includes a `.gitignore` file to prevent sensitive information and unnecessary files from being committed to the repository. This includes:

- Node modules
- Environment variable files (.env)
- Build outputs
- Log files
- Editor-specific files

Make sure to keep your sensitive information (like API keys and database credentials) in the `.env` files, which are ignored by git.
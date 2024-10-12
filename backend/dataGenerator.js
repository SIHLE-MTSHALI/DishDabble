const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Recipe = require('./models/Recipe');

// Expanded ingredient categories for more variety
const proteinIngredients = [
  'chicken', 'beef', 'pork', 'tofu', 'fish', 'shrimp', 'lamb', 'turkey', 'duck',
  'salmon', 'tuna', 'venison', 'goat', 'rabbit', 'crab', 'lobster', 'scallops', 'mussels',
  'tempeh', 'seitan', 'beans', 'lentils', 'chickpeas', 'eggs', 'cheese', 'yogurt'
];

const vegetableIngredients = [
  'broccoli', 'carrots', 'spinach', 'bell peppers', 'onions', 'garlic', 'tomatoes',
  'zucchini', 'eggplant', 'mushrooms', 'asparagus', 'green beans', 'peas', 'corn',
  'kale', 'cauliflower', 'brussels sprouts', 'cabbage', 'leeks', 'pumpkin', 'sweet potatoes'
];

const carbIngredients = [
  'rice', 'pasta', 'potatoes', 'bread', 'quinoa', 'noodles', 'couscous', 'barley',
  'bulgur', 'polenta', 'tortillas', 'naan', 'baguette', 'udon noodles', 'soba noodles'
];

const spicesAndHerbs = [
  'salt', 'pepper', 'paprika', 'cumin', 'coriander', 'cinnamon', 'nutmeg', 'ginger',
  'thyme', 'rosemary', 'basil', 'parsley', 'cilantro', 'oregano', 'turmeric',
  'chili powder', 'saffron', 'cardamom', 'dill', 'fennel', 'lemongrass', 'bay leaves'
];

const cookingMethods = [
  'Baked', 'Fried', 'Grilled', 'Roasted', 'Boiled', 'Steamed', 'Sautéed', 'Simmered',
  'Broiled', 'Poached', 'Stir-Fried', 'Smoked', 'Braised', 'Stewed', 'Blanched'
];

const cuisines = [
  'Italian', 'Chinese', 'Mexican', 'Indian', 'French', 'Japanese', 'Thai', 'Greek',
  'Spanish', 'American', 'Middle Eastern', 'Vietnamese', 'Korean', 'Brazilian',
  'Moroccan', 'Ethiopian', 'Turkish', 'Caribbean', 'Peruvian', 'Russian'
];

const mealTypes = [
  'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Side Dish',
  'Brunch', 'Soup', 'Salad', 'Beverage', 'Main Course', 'Entree'
];

const difficulties = ['Easy', 'Medium', 'Hard'];

// Expanded instructions phrases for more variety
const instructionPhrases = [
  'Preheat your oven to {temperature}.',
  'Season the {mainIngredient} with {spice}, salt, and pepper.',
  'In a large pot, bring water to a boil and cook the {carb} until al dente.',
  'Heat olive oil in a skillet over medium heat.',
  '{cookingMethod} the {mainIngredient} for {time} minutes on each side.',
  'Add the {vegetable} to the pan and cook until tender.',
  'Stir in the {secondaryIngredient} and simmer for {time} minutes.',
  'Combine the {mainIngredient} and {vegetable} in a baking dish.',
  'Pour the sauce over the {mainIngredient} and bake for {time} minutes.',
  'Garnish with fresh {herb} before serving.',
  'Serve the {mainIngredient} over the {carb} and enjoy!',
  'Mix {ingredient1} and {ingredient2} in a bowl until well combined.',
  'Let the dish rest for {time} minutes before serving.',
  'Marinate the {mainIngredient} in {marinade} for {time} hours.',
  'Grill the {mainIngredient} over medium-high heat.',
  'Blend all the ingredients until smooth.',
  'Bake in the preheated oven until golden brown.',
  'Sauté the {vegetable} with garlic and olive oil.',
  'Whisk together the dressing ingredients.',
  'Layer the {ingredient1} and {ingredient2} in a serving dish.',
  'Reduce the heat and let it simmer uncovered.'
];

// Function to generate a fake user
const generateFakeUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }),
    password: password,
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    createdAt: faker.date.past()
  };
};

// Function to generate a more realistic recipe
const generateUniqueRecipe = () => {
  // Select random elements from expanded ingredient categories
  const mainProtein = faker.helpers.arrayElement(proteinIngredients);
  const mainVegetable = faker.helpers.arrayElement(vegetableIngredients);
  const carb = faker.helpers.arrayElement(carbIngredients);
  const secondaryVegetable = faker.helpers.arrayElement(vegetableIngredients);
  const spice = faker.helpers.arrayElement(spicesAndHerbs);
  const herb = faker.helpers.arrayElement(spicesAndHerbs);
  const cookingMethod = faker.helpers.arrayElement(cookingMethods);
  const cuisine = faker.helpers.arrayElement(cuisines);
  const mealType = faker.helpers.arrayElement(mealTypes);
  const difficulty = faker.helpers.arrayElement(difficulties);
  const temperature = faker.number.int({ min: 150, max: 300 }) + '°C';
  const time = faker.number.int({ min: 5, max: 60 }) + ' minutes';
  const marinade = faker.helpers.arrayElement(['soy sauce', 'lemon juice', 'yogurt', 'wine', 'vinegar']);
  const ingredient1 = faker.helpers.arrayElement(vegetableIngredients);
  const ingredient2 = faker.helpers.arrayElement(proteinIngredients);

  // Generate a realistic title using the selected ingredients and cooking method
  const title = `${cookingMethod} ${mainProtein} with ${mainVegetable} and ${carb}`;

  // Generate a realistic description
  const description = `Experience the flavors of ${cuisine} cuisine with this ${difficulty.toLowerCase()} ${mealType.toLowerCase()} recipe. ${title} combines the richness of ${mainProtein} and the freshness of ${mainVegetable}, served over ${carb} and seasoned with ${spice} and ${herb}.`;

  // Generate ingredients list with realistic quantities
  const ingredientsList = [
    { name: mainProtein, quantity: `${faker.number.int({ min: 200, max: 500 })}g` },
    { name: mainVegetable, quantity: `${faker.number.int({ min: 100, max: 300 })}g` },
    { name: secondaryVegetable, quantity: `${faker.number.int({ min: 100, max: 300 })}g` },
    { name: carb, quantity: `${faker.number.int({ min: 100, max: 300 })}g` },
    { name: spice, quantity: `${faker.number.int({ min: 1, max: 2 })} tsp` },
    { name: herb, quantity: '1 tbsp' },
    { name: 'Olive oil', quantity: '2 tbsp' },
    { name: 'Salt', quantity: 'to taste' },
    { name: 'Pepper', quantity: 'to taste' }
  ];

  // Generate instructions using expanded phrases
  const instructionsList = instructionPhrases.map(phrase => {
    // Replace placeholders with actual values
    return phrase
      .replace('{temperature}', temperature)
      .replace('{mainIngredient}', mainProtein)
      .replace('{secondaryIngredient}', secondaryVegetable)
      .replace('{vegetable}', mainVegetable)
      .replace('{carb}', carb)
      .replace('{spice}', spice)
      .replace('{herb}', herb)
      .replace('{ingredient1}', ingredient1)
      .replace('{ingredient2}', ingredient2)
      .replace('{time}', faker.number.int({ min: 5, max: 60 }) + ' minutes')
      .replace('{marinade}', marinade)
      .replace('{cookingMethod}', cookingMethod);
  });

  // Select a random subset of instructions for each recipe
  const selectedInstructions = faker.helpers.arrayElements(instructionsList, faker.number.int({ min: 5, max: 10 }));

  // Generate tags for the recipe with more variety
  const tags = faker.helpers.uniqueArray(
    () => faker.helpers.arrayElement([...cuisines, ...mealTypes, ...proteinIngredients, ...vegetableIngredients, ...carbIngredients, ...spicesAndHerbs, difficulty, cookingMethod]),
    faker.number.int({ min: 3, max: 7 })
  );

  // Return the recipe object
  return {
    title,
    description,
    ingredients: ingredientsList,
    instructions: selectedInstructions,
    prepTime: faker.number.int({ min: 10, max: 30 }),
    cookTime: faker.number.int({ min: 15, max: 60 }),
    servings: faker.number.int({ min: 2, max: 6 }),
    difficulty: difficulty,
    cuisine: cuisine,
    mealType: mealType,
    tags: tags,
    image: faker.image.urlLoremFlickr({ category: 'food' }),
    createdAt: faker.date.past()
  };
};

// Function to generate fake user interactions
const generateFakeInteractions = async (users, recipes, maxNewUsers = 200) => {
  let allUsers = [...users];
  let newUsersCreated = 0;

  for (let recipe of recipes) {
    // Decide whether to create a new user for this interaction
    if (newUsersCreated < maxNewUsers && faker.datatype.boolean()) {
      const newUserData = await generateFakeUser();
      const newUser = await new User(newUserData).save();
      allUsers.push(newUser);
      newUsersCreated++;
    }

    // Generate random likes
    const likeCount = faker.number.int({min: 1, max: Math.min(allUsers.length, 500)});
    const likers = faker.helpers.arrayElements(allUsers, likeCount);
    recipe.likes = likers.map(user => user._id);

    // Generate random comments
    const commentCount = faker.number.int({min: 0, max: 35});
    recipe.comments = Array(commentCount).fill().map(() => {
      const commenter = faker.helpers.arrayElement(allUsers);
      return {
        user: commenter._id,
        text: faker.lorem.sentence(),
        name: commenter.name,
        avatar: commenter.avatar,
        date: faker.date.past()
      };
    });

    // Generate random ratings
    const ratingCount = faker.number.int({min: 6, max: 123});
    recipe.ratings = Array(ratingCount).fill().map(() => {
      const rater = faker.helpers.arrayElement(allUsers);
      return {
        user: rater._id,
        value: faker.number.int({min: 1, max: 5})
      };
    });

    await recipe.save();
  }

  return newUsersCreated;
};


// Function to ensure all recipes have ratings, comments, and likes
const ensureAllRecipesHaveInteractions = async (users) => {
  try {
    const recipes = await Recipe.find();
    console.log(`Ensuring interactions for ${recipes.length} recipes`);

    for (let recipe of recipes) {
      let modified = false;

      // Ensure ratings
      if (!recipe.ratings || recipe.ratings.length < 6) {
        const ratingCount = faker.number.int({min: 6, max: 123});
        recipe.ratings = Array(ratingCount).fill().map(() => ({
          user: faker.helpers.arrayElement(users)._id,
          value: faker.number.int({min: 1, max: 5})
        }));
        modified = true;
      }

      // Ensure comments
      if (!recipe.comments || recipe.comments.length === 0) {
        const commentCount = faker.number.int({min: 1, max: 10});
        recipe.comments = Array(commentCount).fill().map(() => {
          const commenter = faker.helpers.arrayElement(users);
          return {
            user: commenter._id,
            text: faker.lorem.sentence(),
            name: commenter.name,
            avatar: commenter.avatar,
            date: faker.date.past()
          };
        });
        modified = true;
      }

      // Ensure likes
      if (!recipe.likes || recipe.likes.length === 0) {
        const likeCount = faker.number.int({min: 1, max: Math.min(users.length, 50)});
        recipe.likes = faker.helpers.arrayElements(users, likeCount).map(user => user._id);
        modified = true;
      }

      if (modified) {
        await recipe.save();
      }
    }

    console.log('All recipes now have ratings, comments, and likes');
  } catch (error) {
    console.error('Error ensuring interactions for all recipes:', error);
  }
};

// Function to populate the database with users and recipes
const populateDatabase = async (userCount = 850, recipeCount = 10500) => {
  try {
    // Generate user data
    const userPromises = Array.from({ length: userCount }, async () => {
      const userData = await generateFakeUser();
      return userData;
    });
    const userDataArray = await Promise.all(userPromises);

    // Insert users into the database using insertMany for bulk operation
    const users = await User.insertMany(userDataArray);
    console.log(`${users.length} users created`);

    // Generate recipes in batches to optimize performance
    const recipes = [];
    for (let i = 0; i < recipeCount; i++) {
      // Decide whether to use an existing user or create a new one
      let user;
      if (faker.datatype.boolean() || users.length >= recipeCount) {
        // Use existing user
        user = faker.helpers.arrayElement(users);
      } else {
        // Create new user
        const userData = await generateFakeUser();
        user = await new User(userData).save();
        users.push(user);
      }

      const recipeData = generateUniqueRecipe();
      recipeData.user = user._id;
      recipeData.createdAt = faker.date.past();
      const recipe = await new Recipe(recipeData).save();
      recipes.push(recipe);

      if ((i + 1) % 100 === 0) {
        console.log(`${i + 1} recipes created`);
      }
    }

    console.log(`${recipes.length} fake recipes created`);
    console.log(`${users.length} total users after recipe creation`);

    // Generate interactions
    const newUsersFromInteractions = await generateFakeInteractions(users, recipes);
    console.log(`Fake interactions generated with ${newUsersFromInteractions} additional users created`);

    // Ensure all recipes have ratings, comments, and likes
    await ensureAllRecipesHaveInteractions(users);

    console.log(`Total users in the database: ${users.length + newUsersFromInteractions}`);
    console.log('Database population completed successfully'); 

    // Call the new function to ensure minimum followers, following, and recipes
    await ensureMinimumInteractions();

    // Generate usernames for users without them
    await generateUsernamesForExistingUsers();

  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// New function to ensure minimum followers, following, and recipes
const ensureMinimumInteractions = async () => {
  try {
    const users = await User.find();
    const minFollowers = 33;
    const minFollowing = 23;
    const minRecipes = 5;

    for (let user of users) {
      // Ensure minimum followers
      while (user.followers.length < minFollowers) {
        const follower = faker.helpers.arrayElement(users.filter(u => u._id.toString() !== user._id.toString() && !user.followers.includes(u._id)));
        if (follower) {
          user.followers.push(follower._id);
          follower.following.push(user._id);
          await follower.save();
        }
      }

      // Ensure minimum following
      while (user.following.length < minFollowing) {
        const userToFollow = faker.helpers.arrayElement(users.filter(u => u._id.toString() !== user._id.toString() && !user.following.includes(u._id)));
        if (userToFollow) {
          user.following.push(userToFollow._id);
          userToFollow.followers.push(user._id);
          await userToFollow.save();
        }
      }

      await user.save();

      // Ensure minimum recipes
      const userRecipes = await Recipe.countDocuments({ user: user._id });
      const recipesToCreate = Math.max(0, minRecipes - userRecipes);
      for (let i = 0; i < recipesToCreate; i++) {
        const recipeData = generateUniqueRecipe();
        recipeData.user = user._id;
        await new Recipe(recipeData).save();
      }
    }

    console.log('Minimum interactions ensured for all users');
  } catch (error) {
    console.error('Error ensuring minimum interactions:', error);
  }
};

// New function to generate usernames for existing users without usernames
const generateUsernamesForExistingUsers = async () => {
  try {
    const usersWithoutUsername = await User.find({ username: { $in: [null, ''] } });
    console.log(`Found ${usersWithoutUsername.length} users without usernames`);

    for (let user of usersWithoutUsername) {
      const firstName = user.name.split(' ')[0];
      const lastName = user.name.split(' ').slice(1).join(' ');
      user.username = faker.internet.userName({ firstName, lastName }).toLowerCase();
      await user.save();
    }

    console.log('Usernames generated for all users without usernames');
  } catch (error) {
    console.error('Error generating usernames for existing users:', error);
  }
};

module.exports = { populateDatabase };
import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR,
  SEARCH_RECIPES,
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  SAVE_RECIPE,
  UNSAVE_RECIPE,
  RATE_RECIPE,
  GET_TRENDING_RECIPES,
  GET_FEED_RECIPES,
  UPDATE_RECIPE_LIKES,
  UPDATE_RECIPE_COMMENTS,
  GET_MORE_RECIPES,
  GET_RANDOM_RECIPES
} from './types';
import { emitLikeRecipe, emitCommentRecipe } from '../utils/socket';

const API_URL = process.env.REACT_APP_API_URL;

// Add new recipe
export const addRecipe = formData => async dispatch => {
  try {
    console.log('addRecipe: Adding new recipe');
    console.log(`addRecipe: API URL - ${API_URL}/api/recipes`);
    console.log('addRecipe: Form data being sent:', Object.fromEntries(formData));

    const res = await axios.post(`${API_URL}/api/recipes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('addRecipe: API response:', res.data);

    dispatch({
      type: ADD_RECIPE,
      payload: res.data
    });

    dispatch(setAlert('Recipe Created', 'success'));
    console.log('addRecipe: New recipe dispatched to store');
  } catch (err) {
    console.error('addRecipe: Error adding new recipe:', err);
    console.error('addRecipe: Error response:', err.response);
    console.error('addRecipe: Error data:', err.response?.data);
    console.error('addRecipe: Error status:', err.response?.status);
    console.error('addRecipe: Error headers:', err.response?.headers);

    let errorMessage = 'Error creating recipe';
    if (err.response?.data?.errors) {
      errorMessage += ': ' + err.response.data.errors.map(e => e.msg).join(', ');
    } else if (err.response?.data?.msg) {
      errorMessage += ': ' + err.response.data.msg;
    }

    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert(errorMessage, 'error'));
  }
};

// Get all recipes with pagination
export const getRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`getRecipes: Fetching recipes - page ${page}, limit ${limit}`);
    console.log(`getRecipes: API URL - ${API_URL}/api/recipes?page=${page}&limit=${limit}`);
    
    const res = await axios.get(`${API_URL}/api/recipes?page=${page}&limit=${limit}`);
    console.log('getRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('getRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? GET_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });

    console.log('getRecipes: Recipes dispatched to store');
  } catch (err) {
    console.error('getRecipes: Error fetching recipes:', err);
    console.error('getRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching recipes', 'error'));
  }
};

// Get recipe by ID
export const getRecipe = id => async dispatch => {
  try {
    console.log(`getRecipe: Fetching recipe with ID ${id}`);
    console.log(`getRecipe: API URL - ${API_URL}/api/recipes/${id}`);

    const res = await axios.get(`${API_URL}/api/recipes/${id}`);
    console.log('getRecipe: API response:', res.data);

    dispatch({
      type: GET_RECIPE,
      payload: res.data
    });

    console.log('getRecipe: Recipe dispatched to store');
  } catch (err) {
    console.error(`getRecipe: Error fetching recipe with ID ${id}:`, err);
    console.error('getRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching recipe', 'error'));
  }
};

// Update recipe
export const updateRecipe = (id, formData) => async dispatch => {
  try {
    console.log(`updateRecipe: Updating recipe with ID ${id}`);
    console.log(`updateRecipe: API URL - ${API_URL}/api/recipes/${id}`);

    const res = await axios.put(`${API_URL}/api/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('updateRecipe: API response:', res.data);

    dispatch({
      type: UPDATE_RECIPE,
      payload: res.data
    });

    dispatch(setAlert('Recipe Updated', 'success'));
    console.log('updateRecipe: Updated recipe dispatched to store');
  } catch (err) {
    console.error(`updateRecipe: Error updating recipe with ID ${id}:`, err);
    console.error('updateRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error updating recipe', 'error'));
  }
};

// Delete recipe
export const deleteRecipe = id => async dispatch => {
  try {
    console.log(`deleteRecipe: Deleting recipe with ID ${id}`);
    console.log(`deleteRecipe: API URL - ${API_URL}/api/recipes/${id}`);

    await axios.delete(`${API_URL}/api/recipes/${id}`);
    console.log('deleteRecipe: Recipe deleted successfully');

    dispatch({
      type: DELETE_RECIPE,
      payload: id
    });

    dispatch(setAlert('Recipe Removed', 'success'));
    console.log('deleteRecipe: Recipe removal dispatched to store');
  } catch (err) {
    console.error(`deleteRecipe: Error deleting recipe with ID ${id}:`, err);
    console.error('deleteRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error deleting recipe', 'error'));
  }
};

// Search recipes with pagination
export const searchRecipes = (searchTerm, page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`searchRecipes: Searching recipes - term: ${searchTerm}, page ${page}, limit ${limit}`);
    console.log(`searchRecipes: API URL - ${API_URL}/api/recipes/search?term=${searchTerm}&page=${page}&limit=${limit}`);
    
    const res = await axios.get(`${API_URL}/api/recipes/search?term=${searchTerm}&page=${page}&limit=${limit}`);
    console.log('searchRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('searchRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? SEARCH_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });

    console.log('searchRecipes: Search results dispatched to store');
  } catch (err) {
    console.error('searchRecipes: Error searching recipes:', err);
    console.error('searchRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error searching recipes', 'error'));
  }
};

// Get user recipes with pagination
export const getUserRecipes = (userId, page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`getUserRecipes: Fetching user recipes - userId: ${userId}, page ${page}, limit ${limit}`);
    console.log(`getUserRecipes: API URL - ${API_URL}/api/recipes/user/${userId}?page=${page}&limit=${limit}`);

    const res = await axios.get(`${API_URL}/api/recipes/user/${userId}?page=${page}&limit=${limit}`);
    console.log('getUserRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('getUserRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? GET_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });

    console.log('getUserRecipes: User recipes dispatched to store');
  } catch (err) {
    console.error(`getUserRecipes: Error fetching user recipes for userId ${userId}:`, err);
    console.error('getUserRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching user recipes', 'error'));
  }
};

// Like a recipe
export const likeRecipe = id => async dispatch => {
  try {
    console.log(`likeRecipe: Liking recipe with ID ${id}`);
    console.log(`likeRecipe: API URL - ${API_URL}/api/recipes/like/${id}`);

    const res = await axios.put(`${API_URL}/api/recipes/like/${id}`);
    console.log('likeRecipe: API response:', res.data);

    dispatch({
      type: LIKE_RECIPE,
      payload: { id, likes: res.data }
    });

    emitLikeRecipe(id);
    console.log('likeRecipe: Like action dispatched to store');
  } catch (err) {
    console.error(`likeRecipe: Error liking recipe with ID ${id}:`, err);
    console.error('likeRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error liking recipe', 'error'));
  }
};

// Unlike a recipe
export const unlikeRecipe = id => async dispatch => {
  try {
    console.log(`unlikeRecipe: Unliking recipe with ID ${id}`);
    console.log(`unlikeRecipe: API URL - ${API_URL}/api/recipes/unlike/${id}`);

    const res = await axios.put(`${API_URL}/api/recipes/unlike/${id}`);
    console.log('unlikeRecipe: API response:', res.data);

    dispatch({
      type: UNLIKE_RECIPE,
      payload: { id, likes: res.data }
    });

    emitLikeRecipe(id);
    console.log('unlikeRecipe: Unlike action dispatched to store');
  } catch (err) {
    console.error(`unlikeRecipe: Error unliking recipe with ID ${id}:`, err);
    console.error('unlikeRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error unliking recipe', 'error'));
  }
};

// Save a recipe
export const saveRecipe = id => async dispatch => {
  try {
    console.log(`saveRecipe: Saving recipe with ID ${id}`);
    console.log(`saveRecipe: API URL - ${API_URL}/api/recipes/save/${id}`);

    const res = await axios.put(`${API_URL}/api/recipes/save/${id}`);
    console.log('saveRecipe: API response:', res.data);

    dispatch({
      type: SAVE_RECIPE,
      payload: { id, saves: res.data }
    });

    console.log('saveRecipe: Save action dispatched to store');
  } catch (err) {
    console.error(`saveRecipe: Error saving recipe with ID ${id}:`, err);
    console.error('saveRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error saving recipe', 'error'));
  }
};

// Unsave a recipe
export const unsaveRecipe = id => async dispatch => {
  try {
    console.log(`unsaveRecipe: Unsaving recipe with ID ${id}`);
    console.log(`unsaveRecipe: API URL - ${API_URL}/api/recipes/unsave/${id}`);

    const res = await axios.put(`${API_URL}/api/recipes/unsave/${id}`);
    console.log('unsaveRecipe: API response:', res.data);

    dispatch({
      type: UNSAVE_RECIPE,
      payload: { id, saves: res.data }
    });

    console.log('unsaveRecipe: Unsave action dispatched to store');
  } catch (err) {
    console.error(`unsaveRecipe: Error unsaving recipe with ID ${id}:`, err);
    console.error('unsaveRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error unsaving recipe', 'error'));
  }
};

// Rate a recipe
export const rateRecipe = (id, rating) => async dispatch => {
  try {
    console.log(`rateRecipe: Rating recipe with ID ${id}, rating: ${rating}`);
    console.log(`rateRecipe: API URL - ${API_URL}/api/recipes/rate/${id}`);

    const res = await axios.post(`${API_URL}/api/recipes/rate/${id}`, { rating });
    console.log('rateRecipe: API response:', res.data);

    dispatch({
      type: RATE_RECIPE,
      payload: { id, ratings: res.data }
    });

    console.log('rateRecipe: Rate action dispatched to store');
  } catch (err) {
    console.error(`rateRecipe: Error rating recipe with ID ${id}:`, err);
    console.error('rateRecipe: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error rating recipe', 'error'));
  }
};

// Get trending recipes with pagination
export const getTrendingRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`getTrendingRecipes: Fetching trending recipes - page ${page}, limit ${limit}`);
    console.log(`getTrendingRecipes: API URL - ${API_URL}/api/recipes/trending?page=${page}&limit=${limit}`);
    
    const res = await axios.get(`${API_URL}/api/recipes/trending?page=${page}&limit=${limit}`);
    console.log('getTrendingRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('getTrendingRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? GET_TRENDING_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });

    console.log('getTrendingRecipes: Trending recipes dispatched to store');
  } catch (err) {
    console.error('getTrendingRecipes: Error fetching trending recipes:', err);
    console.error('getTrendingRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching trending recipes', 'error'));
  }
};

// Get feed recipes with pagination
export const getFeedRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`getFeedRecipes: Fetching feed recipes - page ${page}, limit ${limit}`);
    console.log(`getFeedRecipes: API URL - ${API_URL}/api/recipes/feed?page=${page}&limit=${limit}`);

    const res = await axios.get(`${API_URL}/api/recipes/feed?page=${page}&limit=${limit}`);
    console.log('getFeedRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('getFeedRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? GET_FEED_RECIPES : GET_MORE_RECIPES,
      payload: {
        recipes: res.data.recipes,
        hasMore: res.data.hasMore,
        currentPage: res.data.currentPage
      }
    });

    console.log('getFeedRecipes: Feed recipes dispatched to store');
  } catch (err) {
    console.error('getFeedRecipes: Error fetching feed recipes:', err);
    console.error('getFeedRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching feed recipes', 'error'));
  }
};

// Update recipe likes (real-time)
export const updateRecipeLikes = (recipeId, likes) => ({
  type: UPDATE_RECIPE_LIKES,
  payload: { id: recipeId, likes }
});

// Update recipe comments (real-time)
export const updateRecipeComments = (recipeId, comments) => ({
  type: UPDATE_RECIPE_COMMENTS,
  payload: { id: recipeId, comments }
});

// Add comment to recipe
export const addComment = (recipeId, comment) => async dispatch => {
  try {
    console.log(`addComment: Adding comment to recipe with ID ${recipeId}`);
    console.log(`addComment: API URL - ${API_URL}/api/recipes/comment/${recipeId}`);

    const res = await axios.post(`${API_URL}/api/recipes/comment/${recipeId}`, { text: comment });
    console.log('addComment: API response:', res.data);

    dispatch({
      type: UPDATE_RECIPE_COMMENTS,
      payload: { id: recipeId, comments: res.data }
    });

    emitCommentRecipe(recipeId, comment);
    console.log('addComment: Comment action dispatched to store');
  } catch (err) {
    console.error(`addComment: Error adding comment to recipe with ID ${recipeId}:`, err);
    console.error('addComment: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error adding comment', 'error'));
  }
};

// Get random recipes with pagination
export const getRandomRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    console.log(`getRandomRecipes: Fetching random recipes - page ${page}, limit ${limit}`);
    console.log(`getRandomRecipes: API URL - ${API_URL}/api/recipes/random?page=${page}&limit=${limit}`);
    
    const res = await axios.get(`${API_URL}/api/recipes/random?page=${page}&limit=${limit}`);
    console.log('getRandomRecipes: API response:', res.data);

    if (!res.data || !Array.isArray(res.data.recipes)) {
      console.error('getRandomRecipes: Invalid data structure received from API:', res.data);
      throw new Error('Invalid data structure received from API');
    }

    dispatch({
      type: page === 1 ? GET_RANDOM_RECIPES : GET_MORE_RECIPES,
      payload: {
        recipes: res.data.recipes,
        hasMore: res.data.hasMore,
        currentPage: res.data.currentPage
      }
    });

    console.log('getRandomRecipes: Random recipes dispatched to store');
  } catch (err) {
    console.error('getRandomRecipes: Error fetching random recipes:', err);
    console.error('getRandomRecipes: Error details:', err.response);
    dispatch({
      type: RECIPE_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Error fetching random recipes', 'error'));
  }
};

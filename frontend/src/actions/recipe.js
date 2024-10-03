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
  GET_MORE_RECIPES
} from './types';
import { emitLikeRecipe, emitCommentRecipe } from '../utils/socket';

const API_URL = process.env.REACT_APP_API_URL;

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
    const res = await axios.get(`${API_URL}/api/recipes/${id}`);

    dispatch({
      type: GET_RECIPE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add new recipe
export const addRecipe = formData => async dispatch => {
  try {
    const res = await axios.post(`${API_URL}/api/recipes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    dispatch({
      type: ADD_RECIPE,
      payload: res.data
    });

    dispatch(setAlert('Recipe Created', 'success'));
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update recipe
export const updateRecipe = (id, formData) => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    dispatch({
      type: UPDATE_RECIPE,
      payload: res.data
    });

    dispatch(setAlert('Recipe Updated', 'success'));
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete recipe
export const deleteRecipe = id => async dispatch => {
  try {
    await axios.delete(`${API_URL}/api/recipes/${id}`);

    dispatch({
      type: DELETE_RECIPE,
      payload: id
    });

    dispatch(setAlert('Recipe Removed', 'success'));
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Search recipes with pagination
export const searchRecipes = (searchTerm, page = 1, limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/search?term=${searchTerm}&page=${page}&limit=${limit}`);

    dispatch({
      type: page === 1 ? SEARCH_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get user recipes with pagination
export const getUserRecipes = (userId, page = 1, limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/user/${userId}?page=${page}&limit=${limit}`);

    dispatch({
      type: page === 1 ? GET_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Like a recipe
export const likeRecipe = id => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/recipes/like/${id}`);

    dispatch({
      type: LIKE_RECIPE,
      payload: { id, likes: res.data }
    });

    emitLikeRecipe(id);
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Unlike a recipe
export const unlikeRecipe = id => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/recipes/unlike/${id}`);

    dispatch({
      type: UNLIKE_RECIPE,
      payload: { id, likes: res.data }
    });

    emitLikeRecipe(id);
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Save a recipe
export const saveRecipe = id => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/recipes/save/${id}`);

    dispatch({
      type: SAVE_RECIPE,
      payload: { id, saves: res.data }
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Unsave a recipe
export const unsaveRecipe = id => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/recipes/unsave/${id}`);

    dispatch({
      type: UNSAVE_RECIPE,
      payload: { id, saves: res.data }
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Rate a recipe
export const rateRecipe = (id, rating) => async dispatch => {
  try {
    const res = await axios.post(`${API_URL}/api/recipes/rate/${id}`, { rating });

    dispatch({
      type: RATE_RECIPE,
      payload: { id, ratings: res.data }
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get trending recipes with pagination
export const getTrendingRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/trending?page=${page}&limit=${limit}`);

    dispatch({
      type: page === 1 ? GET_TRENDING_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get feed recipes with pagination
export const getFeedRecipes = (page = 1, limit = 10) => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/feed?page=${page}&limit=${limit}`);

    dispatch({
      type: page === 1 ? GET_FEED_RECIPES : GET_MORE_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
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
    const res = await axios.post(`${API_URL}/api/recipes/comment/${recipeId}`, { text: comment });

    dispatch({
      type: UPDATE_RECIPE_COMMENTS,
      payload: { id: recipeId, comments: res.data }
    });

    emitCommentRecipe(recipeId, comment);
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
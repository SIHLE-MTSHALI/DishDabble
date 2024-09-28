import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR,
  SEARCH_RECIPES
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Get all recipes
export const getRecipes = () => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes`);

    dispatch({
      type: GET_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
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
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(`${API_URL}/api/recipes`, formData, config);

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
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`${API_URL}/api/recipes/${id}`, formData, config);

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

// Search recipes
export const searchRecipes = searchTerm => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/search?term=${searchTerm}`);

    dispatch({
      type: SEARCH_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get user recipes
export const getUserRecipes = userId => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/recipes/user/${userId}`);

    dispatch({
      type: GET_RECIPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
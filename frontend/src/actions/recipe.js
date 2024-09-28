import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR
} from './types';

// Get all recipes
export const getRecipes = () => async dispatch => {
  try {
    const res = await axios.get('/api/recipes');

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
    const res = await axios.get(`/api/recipes/${id}`);

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
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/recipes', formData, config);

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
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/recipes/${id}`, formData, config);

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
    await axios.delete(`/api/recipes/${id}`);

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
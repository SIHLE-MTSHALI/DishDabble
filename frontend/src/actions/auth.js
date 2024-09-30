import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

const API_URL = process.env.REACT_APP_API_URL;

// Load User
export const loadUser = () => async dispatch => {
  console.log('loadUser action called');
  if (localStorage.token) {
    console.log('Token found in localStorage:', localStorage.token);
    setAuthToken(localStorage.token);
  } else {
    console.log('No token found in localStorage');
  }

  try {
    console.log('Sending request to load user');
    console.log('Current axios headers:', axios.defaults.headers.common);
    const res = await axios.get(`${API_URL}/api/auth`);
    console.log('Load user response:', res.data);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.error('Error loading user:', err.response ? err.response.data : err.message);
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  console.log('Attempting to register user:', { name, email });
  console.log('API URL:', `${API_URL}/api/users`);

  try {
    console.log('Sending POST request to register user');
    const res = await axios.post(`${API_URL}/api/users`, body, config);
    console.log('Registration response:', res.data);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    console.log('Dispatched REGISTER_SUCCESS');

    // Set the token in axios headers
    setAuthToken(res.data.token);
    console.log('Token set after registration:', res.data.token);

    dispatch(loadUser());
    console.log('Dispatched loadUser');
  } catch (err) {
    console.error('Registration error:', err.response ? err.response.data : err.message);

    const errors = err.response && err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        console.log('Dispatching error alert:', error.msg);
        dispatch(setAlert(error.msg, 'danger'));
      });
    }

    dispatch({
      type: REGISTER_FAIL
    });
    console.log('Dispatched REGISTER_FAIL');
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  console.log('Attempting to login user:', email);
  console.log('API URL:', `${API_URL}/api/auth`);

  try {
    console.log('Sending POST request to login user');
    const res = await axios.post(`${API_URL}/api/auth`, body, config);
    console.log('Login response:', res.data);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    console.log('Dispatched LOGIN_SUCCESS');

    // Set the token in axios headers
    setAuthToken(res.data.token);
    console.log('Token set after login:', res.data.token);
    console.log('Token stored in localStorage:', localStorage.getItem('token'));

    dispatch(loadUser());
    console.log('Dispatched loadUser');
  } catch (err) {
    console.error('Login error:', err.response ? err.response.data : err.message);

    const errors = err.response && err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        console.log('Dispatching error alert:', error.msg);
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else {
      dispatch(setAlert('Login failed. Please check your credentials.', 'danger'));
    }

    dispatch({
      type: LOGIN_FAIL
    });
    console.log('Dispatched LOGIN_FAIL');
  }
};

// Logout
export const logout = () => dispatch => {
  setAuthToken(null);
  console.log('Token removed on logout');
  dispatch({ type: LOGOUT });
};
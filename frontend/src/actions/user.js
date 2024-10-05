import axios from 'axios';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_FOLLOWERS,
  GET_RANDOM_USERS,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  GET_FOLLOWERS,
  GET_FOLLOWING,
  USER_ERROR
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Follow a user
export const followUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_URL}/api/users/follow/${userId}`);

    dispatch({
      type: FOLLOW_USER,
      payload: { userId, followers: res.data.followers, following: res.data.following }
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error following user', status: err.response?.status || 500 }
    });
  }
};

// Unfollow a user
export const unfollowUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_URL}/api/users/unfollow/${userId}`);

    dispatch({
      type: UNFOLLOW_USER,
      payload: { userId, followers: res.data.followers, following: res.data.following }
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error unfollowing user', status: err.response?.status || 500 }
    });
  }
};

// Update followers (real-time)
export const updateFollowers = (followers) => ({
  type: UPDATE_FOLLOWERS,
  payload: followers
});

// Get random users
export const getRandomUsers = (limit = 10) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/random?limit=${limit}`);

    dispatch({
      type: GET_RANDOM_USERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error fetching random users', status: err.response?.status || 500 }
    });
  }
};

// Get user profile
export const getUserProfile = (userId) => async (dispatch) => {
  console.log(`Fetching user profile for user ID: ${userId}`);
  try {
    if (!userId) {
      console.error('User ID is undefined or null');
      throw new Error('User ID is required');
    }

    const url = `${API_URL}/api/users/profile/${userId}`;
    console.log('API URL:', url);

    const res = await axios.get(url);
    console.log('User profile API response:', res.data);

    if (!res.data) {
      console.error('API response is empty');
      throw new Error('Empty response from server');
    }

    dispatch({
      type: GET_USER_PROFILE,
      payload: res.data
    });
    console.log('Dispatched GET_USER_PROFILE action');
  } catch (err) {
    console.error('Error fetching user profile:', err);
    console.error('Error details:', err.response);
    dispatch({
      type: USER_ERROR,
      payload: { 
        msg: err.response?.data?.msg || err.message || 'Error fetching user profile', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Get user's followers
export const getFollowers = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/${userId}/followers`);

    dispatch({
      type: GET_FOLLOWERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error fetching followers', status: err.response?.status || 500 }
    });
  }
};

// Get user's following
export const getFollowing = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/${userId}/following`);

    dispatch({
      type: GET_FOLLOWING,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error fetching following', status: err.response?.status || 500 }
    });
  }
};

// Update user profile
export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_URL}/api/users/profile`, profileData);

    dispatch({
      type: UPDATE_USER_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error updating user profile', status: err.response?.status || 500 }
    });
  }
};
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
  console.log(`Attempting to follow user: ${userId}`);
  try {
    const res = await axios.put(`${API_URL}/api/users/follow/${userId}`);
    console.log('Follow user response:', res.data);

    dispatch({
      type: FOLLOW_USER,
      payload: { userId, followers: res.data.followers, following: res.data.following }
    });
    console.log('FOLLOW_USER action dispatched');
  } catch (err) {
    console.error('Error in followUser action:', err.response?.data || err.message);
    dispatch({
      type: USER_ERROR,
      payload: { 
        msg: err.response?.data?.msg || err.response?.data?.error || err.message || 'Error following user', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Unfollow a user
export const unfollowUser = (userId) => async (dispatch) => {
  console.log(`Attempting to unfollow user: ${userId}`);
  try {
    const res = await axios.put(`${API_URL}/api/users/unfollow/${userId}`);
    console.log('Unfollow user response:', res.data);

    dispatch({
      type: UNFOLLOW_USER,
      payload: { userId, followers: res.data.followers, following: res.data.following }
    });
    console.log('UNFOLLOW_USER action dispatched');
  } catch (err) {
    console.error('Error in unfollowUser action:', err.response?.data || err.message);
    dispatch({
      type: USER_ERROR,
      payload: { 
        msg: err.response?.data?.msg || err.response?.data?.error || err.message || 'Error unfollowing user', 
        status: err.response?.status || 500 
      }
    });
  }
};

// Update followers (real-time)
export const updateFollowers = (followers) => ({
  type: UPDATE_FOLLOWERS,
  payload: followers
});

// Get random users with pagination
export const getRandomUsers = (page = 1, limit = 10) => async (dispatch) => {
  console.log(`getRandomUsers action: Fetching random users (page ${page}, limit ${limit})`);
  console.log('API URL:', `${API_URL}/api/users/random?page=${page}&limit=${limit}`);
  try {
    const res = await axios.get(`${API_URL}/api/users/random?page=${page}&limit=${limit}`);
    console.log('getRandomUsers action: Received data:', res.data);
    
    if (Array.isArray(res.data.users)) {
      console.log('Number of users received:', res.data.users.length);
      res.data.users.forEach((user, index) => {
        console.log(`User ${index}:`, {
          id: user._id,
          name: user.name,
          username: user.username,
          hasUsername: !!user.username
        });
      });
    } else {
      console.log('Received data is not an array:', res.data);
    }

    dispatch({
      type: GET_RANDOM_USERS,
      payload: {
        users: res.data.users,
        hasMore: res.data.hasMore,
        page: page
      }
    });
    console.log('getRandomUsers action: Dispatched GET_RANDOM_USERS');
  } catch (err) {
    console.error('getRandomUsers action: Error:', err.response?.data || err.message);
    console.error('Full error object:', err);
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error fetching random users', status: err.response?.status || 500 }
    });
  }
};

// Get user profile
export const getUserProfile = (userIdentifier) => async (dispatch) => {
  console.log(`Fetching user profile for: ${userIdentifier}`);
  try {
    if (!userIdentifier) {
      console.error('User identifier is undefined or null');
      throw new Error('User identifier is required');
    }

    const url = `${API_URL}/api/users/profile/${userIdentifier}`;
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
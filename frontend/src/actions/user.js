import axios from 'axios';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_FOLLOWERS,
  GET_RANDOM_USERS,
  GET_USER_PROFILE,
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
      payload: { msg: err.response.statusText, status: err.response.status }
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
      payload: { msg: err.response.statusText, status: err.response.status }
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
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get user profile
export const getUserProfile = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/api/users/profile/${username}`);

    dispatch({
      type: GET_USER_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
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
      payload: { msg: err.response.statusText, status: err.response.status }
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
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
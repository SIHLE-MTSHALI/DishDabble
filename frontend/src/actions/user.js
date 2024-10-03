import axios from 'axios';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_FOLLOWERS,
  GET_RANDOM_USERS,
  USER_ERROR
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Follow a user
export const followUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`${API_URL}/api/users/follow/${userId}`);

    dispatch({
      type: FOLLOW_USER,
      payload: { userId, followers: res.data.followers }
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
      payload: { userId, followers: res.data.followers }
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
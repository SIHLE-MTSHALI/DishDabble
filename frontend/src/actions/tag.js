import axios from 'axios';
import {
  GET_RANDOM_TAGS,
  TAG_ERROR
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Get random tags
export const getRandomTags = (limit = 10) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/api/tags/random?limit=${limit}`);

    dispatch({
      type: GET_RANDOM_TAGS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: TAG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
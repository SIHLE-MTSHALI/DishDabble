import axios from 'axios';
import {
  GET_RANDOM_TAGS,
  TAG_ERROR
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Get random tags with pagination
export const getRandomTags = (page = 1, limit = 10) => async (dispatch) => {
  console.log(`getRandomTags action: Fetching random tags (page ${page}, limit ${limit})`);
  console.log('API URL:', `${API_URL}/api/tags/random?page=${page}&limit=${limit}`);
  try {
    const res = await axios.get(`${API_URL}/api/tags/random?page=${page}&limit=${limit}`);
    console.log('getRandomTags action: Received data:', res.data);
    
    if (Array.isArray(res.data.tags)) {
      console.log('Number of tags received:', res.data.tags.length);
      res.data.tags.forEach((tag, index) => {
        console.log(`Tag ${index}:`, {
          id: tag._id,
          name: tag.name
        });
      });
    } else {
      console.log('Received data is not an array:', res.data);
    }

    dispatch({
      type: GET_RANDOM_TAGS,
      payload: {
        tags: res.data.tags,
        hasMore: res.data.hasMore,
        page: page
      }
    });
    console.log('getRandomTags action: Dispatched GET_RANDOM_TAGS');
  } catch (err) {
    console.error('getRandomTags action: Error:', err.response?.data || err.message);
    console.error('Full error object:', err);
    dispatch({
      type: TAG_ERROR,
      payload: { msg: err.response?.data?.msg || 'Error fetching random tags', status: err.response?.status || 500 }
    });
  }
};
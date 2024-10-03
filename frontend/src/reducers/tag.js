import { GET_RANDOM_TAGS } from '../actions/types';

const initialState = {
  randomTags: [],
  loading: true,
  error: null
};

const tagReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RANDOM_TAGS:
      return {
        ...state,
        randomTags: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default tagReducer;
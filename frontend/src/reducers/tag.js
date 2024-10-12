import { GET_RANDOM_TAGS, TAG_ERROR } from '../actions/types';

const initialState = {
  randomTags: [],
  loading: true,
  error: null,
  hasMore: true,
  page: 1
};

const tagReducer = (state = initialState, action) => {
  const { type, payload } = action;

  console.log('tagReducer: Received action', { type, payload });

  switch (type) {
    case GET_RANDOM_TAGS:
      console.log('tagReducer: Handling GET_RANDOM_TAGS');
      console.log('Payload:', payload);
      const updatedTags = payload.page === 1 ? payload.tags : [...state.randomTags, ...payload.tags];
      console.log('Updated tags:', updatedTags);
      return {
        ...state,
        randomTags: updatedTags,
        hasMore: payload.hasMore,
        page: payload.page,
        loading: false,
        error: null
      };
    case TAG_ERROR:
      console.error('tagReducer: Handling TAG_ERROR', payload);
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default tagReducer;
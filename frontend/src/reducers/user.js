import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_FOLLOWERS,
  GET_RANDOM_USERS
} from '../actions/types';

const initialState = {
  randomUsers: [],
  loading: true,
  error: null
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RANDOM_USERS:
      return {
        ...state,
        randomUsers: payload,
        loading: false
      };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        randomUsers: state.randomUsers.map(user =>
          user._id === payload.userId
            ? { ...user, followers: payload.followers }
            : user
        ),
        loading: false
      };
    case UPDATE_FOLLOWERS:
      return {
        ...state,
        randomUsers: state.randomUsers.map(user =>
          user._id === payload.userId
            ? { ...user, followers: payload.followers }
            : user
        ),
        loading: false
      };
    default:
      return state;
  }
};

export default userReducer;
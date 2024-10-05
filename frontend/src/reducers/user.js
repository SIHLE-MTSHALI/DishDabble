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
} from '../actions/types';

const initialState = {
  randomUsers: [],
  userProfile: null,
  followers: [],
  following: [],
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
        loading: false,
        error: null
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
        userProfile: state.userProfile && state.userProfile._id === payload.userId
          ? { ...state.userProfile, followers: payload.followers }
          : state.userProfile,
        loading: false,
        error: null
      };
    case UPDATE_FOLLOWERS:
      return {
        ...state,
        randomUsers: state.randomUsers.map(user =>
          user._id === payload.userId
            ? { ...user, followers: payload.followers }
            : user
        ),
        userProfile: state.userProfile && state.userProfile._id === payload.userId
          ? { ...state.userProfile, followers: payload.followers }
          : state.userProfile,
        loading: false,
        error: null
      };
    case GET_USER_PROFILE:
      console.log('GET_USER_PROFILE reducer - Payload:', payload);
      const userProfileData = payload.user || payload; // Handle both {user: {...}} and {...} formats
      const recipesData = payload.recipes || [];
      console.log('GET_USER_PROFILE reducer - Extracted user profile data:', userProfileData);
      return {
        ...state,
        userProfile: userProfileData,
        recipes: recipesData,
        loading: false,
        error: null
      };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: payload,
        loading: false,
        error: null
      };
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: payload,
        loading: false,
        error: null
      };
    case GET_FOLLOWING:
      return {
        ...state,
        following: payload,
        loading: false,
        error: null
      };
    case USER_ERROR:
      console.error('USER_ERROR reducer - Payload:', payload);
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default userReducer;
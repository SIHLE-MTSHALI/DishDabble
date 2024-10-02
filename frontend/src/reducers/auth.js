import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_FOLLOWERS
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      console.log('USER_LOADED reducer called with payload:', payload);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log('REGISTER_SUCCESS or LOGIN_SUCCESS reducer called with payload:', payload);
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      console.log('REGISTER_FAIL, AUTH_ERROR, LOGIN_FAIL, or LOGOUT reducer called');
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case FOLLOW_USER:
      console.log('FOLLOW_USER reducer called with payload:', payload);
      return {
        ...state,
        user: {
          ...state.user,
          following: payload.following
        }
      };
    case UNFOLLOW_USER:
      console.log('UNFOLLOW_USER reducer called with payload:', payload);
      return {
        ...state,
        user: {
          ...state.user,
          following: payload.following
        }
      };
    case UPDATE_FOLLOWERS:
      console.log('UPDATE_FOLLOWERS reducer called with payload:', payload);
      return {
        ...state,
        user: {
          ...state.user,
          followers: payload
        }
      };
    default:
      return state;
  }
}

export default authReducer;
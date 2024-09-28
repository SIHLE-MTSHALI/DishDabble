import { combineReducers } from 'redux';
import auth from './auth';
import recipe from './recipe';
// Import other reducers here

export default combineReducers({
  auth,
  recipe,
  // Add other reducers here
});
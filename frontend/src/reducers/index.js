import { combineReducers } from 'redux';
import auth from './auth';
import recipe from './recipe';
import alert from './alert';

export default combineReducers({
  auth,
  recipe,
  alert
});
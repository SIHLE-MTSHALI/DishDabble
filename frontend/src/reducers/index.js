import { combineReducers } from 'redux';
import auth from './auth';
import recipe from './recipe';
import alert from './alert';
import notification from './notification';

export default combineReducers({
  auth,
  recipe,
  alert,
  notification
});
import axios from 'axios';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  ADD_NOTIFICATION,
  NOTIFICATION_ERROR
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

// Get all notifications
export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/api/notifications`);

    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = (id) => async dispatch => {
  try {
    const res = await axios.put(`${API_URL}/api/notifications/${id}`);

    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add new notification (typically called from socket event)
export const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification
});
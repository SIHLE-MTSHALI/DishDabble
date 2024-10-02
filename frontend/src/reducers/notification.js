import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  ADD_NOTIFICATION,
  NOTIFICATION_ERROR
} from '../actions/types';

const initialState = {
  notifications: [],
  loading: true,
  error: {}
};

const notificationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false
      };
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === payload._id ? { ...notification, read: true } : notification
        ),
        loading: false
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications]
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default notificationReducer;
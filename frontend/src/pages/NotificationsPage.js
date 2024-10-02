import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Favorite, Comment, PersonAdd } from '@mui/icons-material';
import { getNotifications, markNotificationAsRead } from '../actions/notification';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    dispatch(getNotifications());

    // Set up Socket.io connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });
    }
  }, [socket, dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Favorite color="error" />;
      case 'comment':
        return <Comment color="primary" />;
      case 'follow':
        return <PersonAdd color="secondary" />;
      default:
        return null;
    }
  };

  const renderNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <Link to={`/profile/${notification.sender._id}`}>{notification.sender.username}</Link> liked your recipe{' '}
            <Link to={`/recipe/${notification.recipe._id}`}>{notification.recipe.title}</Link>
          </span>
        );
      case 'comment':
        return (
          <span>
            <Link to={`/profile/${notification.sender._id}`}>{notification.sender.username}</Link> commented on your recipe{' '}
            <Link to={`/recipe/${notification.recipe._id}`}>{notification.recipe.title}</Link>
          </span>
        );
      case 'follow':
        return (
          <span>
            <Link to={`/profile/${notification.sender._id}`}>{notification.sender.username}</Link> started following you
          </span>
        );
      default:
        return 'You have a new notification';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography variant="body1">You have no notifications.</Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <ListItem 
                alignItems="flex-start" 
                onClick={() => handleMarkAsRead(notification._id)}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>{renderNotificationIcon(notification.type)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={renderNotificationText(notification)}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                      {notification.type === 'comment' && ` — ${notification.content}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default NotificationsPage;
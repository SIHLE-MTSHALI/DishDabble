import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Home, Explore, AddCircleOutline, Notifications, AccountCircle } from '@mui/icons-material';
import { logout } from '../../actions/auth';

const Navigation = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const notifications = useSelector(state => state.notification.notifications);
  const dispatch = useDispatch();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          DishDabble
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" component={RouterLink} to="/home">
                <Home />
              </IconButton>
              <IconButton color="inherit" component={RouterLink} to="/explore">
                <Explore />
              </IconButton>
              <IconButton color="inherit" component={RouterLink} to="/create-recipe">
                <AddCircleOutline />
              </IconButton>
              <IconButton color="inherit" component={RouterLink} to="/notifications">
                <Badge badgeContent={unreadNotificationsCount} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={RouterLink} to="/profile">
                <AccountCircle />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Home, Explore, Search, TrendingUp, AddCircleOutline, Notifications, AccountCircle } from '@mui/icons-material';
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/home" startIcon={<Home />}>
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/explore" startIcon={<Explore />}>
                Explore
              </Button>
              <Button color="inherit" component={RouterLink} to="/search" startIcon={<Search />}>
                Search
              </Button>
              <Button color="inherit" component={RouterLink} to="/trending" startIcon={<TrendingUp />}>
                Trending
              </Button>
              <Button color="inherit" component={RouterLink} to="/create-recipe" startIcon={<AddCircleOutline />}>
                Create
              </Button>
              <Button color="inherit" component={RouterLink} to="/notifications" startIcon={
                <Badge badgeContent={unreadNotificationsCount} color="secondary">
                  <Notifications />
                </Badge>
              }>
                Notifications
              </Button>
              <Button color="inherit" component={RouterLink} to="/profile" startIcon={<AccountCircle />}>
                Profile
              </Button>
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
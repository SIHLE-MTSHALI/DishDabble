import React, { useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { followUser, unfollowUser } from '../../actions/user';

const UserList = ({ users, followUser, unfollowUser, currentUser }) => {
  useEffect(() => {
    console.log('UserList: Received users', users);
    users.forEach((user, index) => {
      console.log(`User ${index}:`, {
        id: user._id,
        name: user.name,
        username: user.username,
        usernameType: typeof user.username,
        hasUsername: !!user.username
      });
    });
  }, [users]);

  const handleFollowToggle = (userId, isFollowing) => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  if (!users || users.length === 0) {
    console.log('UserList: No users to display');
    return <Typography>No users found.</Typography>;
  }

  return (
    <List>
      {users.map(user => {
        console.log('UserList: Rendering user', {
          id: user._id,
          name: user.name,
          username: user.username,
          usernameType: typeof user.username,
          hasUsername: !!user.username
        });
        return (
          <ListItem key={user._id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={user.name || 'User'} src={user.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component={Link}
                  to={`/profile/${user.username || user._id}`}
                  color="inherit"
                  style={{ textDecoration: 'none' }}
                >
                  {user.name || 'Anonymous'}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    @{user.username || 'unnamed'}
                  </Typography>
                  {user.bio && (
                    <>
                      {" — "}
                      {user.bio}
                    </>
                  )}
                </>
              }
            />
            {currentUser && currentUser._id !== user._id && (
              <Button
                variant="outlined"
                onClick={() => handleFollowToggle(user._id, user.followers && user.followers.includes(currentUser._id))}
              >
                {user.followers && user.followers.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

const mapStateToProps = state => {
  console.log('UserList: mapStateToProps', state);
  return {
    currentUser: state.auth.user
  };
};

export default connect(mapStateToProps, { followUser, unfollowUser })(UserList);
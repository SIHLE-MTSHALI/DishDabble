import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { followUser, unfollowUser } from '../../actions/user';

const UserList = ({ users, followUser, unfollowUser, currentUser }) => {
  const handleFollowToggle = (userId, isFollowing) => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <List>
      {users.map(user => (
        <ListItem key={user._id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={user.name} src={user.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                component={Link}
                to={`/profile/${user.username}`}
                color="inherit"
                style={{ textDecoration: 'none' }}
              >
                {user.name}
              </Typography>
            }
            secondary={user.bio}
          />
          {currentUser && currentUser._id !== user._id && (
            <Button
              variant="outlined"
              onClick={() => handleFollowToggle(user._id, user.followers.includes(currentUser._id))}
            >
              {user.followers.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
};

const mapStateToProps = state => ({
  currentUser: state.auth.user
});

export default connect(mapStateToProps, { followUser, unfollowUser })(UserList);
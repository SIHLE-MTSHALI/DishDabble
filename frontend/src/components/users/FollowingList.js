import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

const FollowingList = ({ following }) => {
  return (
    <div className="following-list">
      <Typography variant="h6" gutterBottom>Following</Typography>
      {following.length === 0 ? (
        <Typography>Not following anyone yet.</Typography>
      ) : (
        <List>
          {following.map(user => (
            <ListItem key={user._id} component={Link} to={`/profile/${user.username}`}>
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.name} />
              </ListItemAvatar>
              <ListItemText 
                primary={user.name}
                secondary={`@${user.username}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default FollowingList;
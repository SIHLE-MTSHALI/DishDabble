import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

const FollowersList = ({ followers }) => {
  return (
    <div className="followers-list">
      <Typography variant="h6" gutterBottom>Followers</Typography>
      {followers.length === 0 ? (
        <Typography>No followers yet.</Typography>
      ) : (
        <List>
          {followers.map(follower => (
            <ListItem key={follower._id} component={Link} to={`/profile/${follower.username}`}>
              <ListItemAvatar>
                <Avatar src={follower.avatar} alt={follower.name} />
              </ListItemAvatar>
              <ListItemText 
                primary={follower.name}
                secondary={`@${follower.username}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default FollowersList;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowers } from '../../actions/user';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';
import Spinner from '../layout/Spinner';

const FollowersList = ({ userId }) => {
  const dispatch = useDispatch();
  const { followers, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getFollowers(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <Spinner />;
  }

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
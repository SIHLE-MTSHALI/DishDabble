import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowing } from '../../actions/user';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';

const FollowingList = ({ userId }) => {
  const dispatch = useDispatch();
  const { following, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getFollowing(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="following-list">
      <h2>Following</h2>
      {following.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        <ul>
          {following.map(user => (
            <li key={user._id}>
              <Link to={`/profile/${user.username}`}>
                <img src={user.avatar} alt={user.name} className="avatar" />
                <span>{user.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingList;
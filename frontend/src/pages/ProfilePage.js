import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Container, Grid, Paper, Avatar, Button, Box, Tabs, Tab, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipePost from '../components/recipes/RecipePost';
import { getUserRecipes } from '../actions/recipe';
import { getUserProfile, followUser, unfollowUser, getFollowers, getFollowing, updateUserProfile } from '../actions/user';
import Spinner from '../components/layout/Spinner';
import FollowersList from '../components/users/FollowersList';
import FollowingList from '../components/users/FollowingList';
import { fadeIn, slideInFromBottom } from '../styles/animations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  animation: `${fadeIn} 1s ease-out`,
}));

const ProfilePage = () => {
  console.log('ProfilePage component rendered');
  const { username: urlUsername } = useParams();
  const { user: authUser, loading: authLoading } = useSelector(state => state.auth);
  const { userProfile, loading: profileLoading, followers, following, error } = useSelector(state => state.user);
  const { recipes, loading: recipeLoading, hasMore, page } = useSelector(state => state.recipe);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    bio: '',
    website: '',
  });

  console.log('Current state:', { authUser, userProfile, profileLoading, followers, following, error, recipes, recipeLoading });
  console.log('URL username:', urlUsername);
  console.log('Auth user:', authUser);

  useEffect(() => {
    const fetchProfileData = async () => {
      let profileId = urlUsername;
      if (!profileId && authUser) {
        profileId = authUser._id;
      }
      console.log('Profile ID to fetch:', profileId);
      
      if (profileId) {
        console.log('Attempting to fetch profile data for ID:', profileId);
        try {
          await dispatch(getUserProfile(profileId));
          console.log('getUserProfile action dispatched successfully');
          dispatch(getUserRecipes(profileId, 1));
        } catch (error) {
          console.error('Error dispatching getUserProfile:', error);
        }
      } else {
        console.log('No profile ID available to fetch profile data');
        if (!urlUsername && !authUser) {
          console.log('Both URL username and auth user are not available');
        }
      }
    };

    if (!authLoading) {
      console.log('Auth loading complete, fetching profile data');
      fetchProfileData();
    } else {
      console.log('Auth still loading, waiting to fetch profile data');
    }
  }, [dispatch, urlUsername, authUser, authLoading]);

  useEffect(() => {
    if (userProfile && (tabValue === 3 || tabValue === 4)) {
      if (tabValue === 3 && !followers) {
        console.log('Fetching followers for user:', userProfile._id);
        dispatch(getFollowers(userProfile._id));
      } else if (tabValue === 4 && !following) {
        console.log('Fetching following for user:', userProfile._id);
        dispatch(getFollowing(userProfile._id));
      }
    }
  }, [dispatch, userProfile, tabValue, followers, following]);

  useEffect(() => {
    if (error) {
      console.error('Error in user state:', error);
    }
  }, [error]);

  useEffect(() => {
    if (userProfile) {
      setEditProfileData({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        website: userProfile.website || '',
      });
    }
  }, [userProfile]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && userProfile) {
      console.log('Loading more recipes for user:', userProfile._id);
      dispatch(getUserRecipes(userProfile._id, page + 1));
    }
  }, [dispatch, hasMore, page, userProfile]);

  const handleFollowToggle = () => {
    if (userProfile && authUser) {
      if (userProfile.followers.includes(authUser._id)) {
        console.log('Unfollowing user:', userProfile._id);
        dispatch(unfollowUser(userProfile._id));
      } else {
        console.log('Following user:', userProfile._id);
        dispatch(followUser(userProfile._id));
      }
    }
  };

  const handleEditProfileOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditProfileClose = () => {
    setEditModalOpen(false);
  };

  const handleEditProfileChange = (e) => {
    setEditProfileData({
      ...editProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfileSubmit = async () => {
    console.log('Submitting profile update:', editProfileData);
    try {
      await dispatch(updateUserProfile(editProfileData));
      console.log('Profile updated successfully');
      setEditModalOpen(false);
      // Refresh the user profile data
      dispatch(getUserProfile(userProfile._id));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (authLoading || profileLoading || (recipeLoading && page === 1)) {
    console.log('Loading spinner displayed');
    return <Spinner />;
  }

  if (error) {
    console.log('Error occurred:', error);
    return (
      <Container>
        <Alert severity="error">
          {error.msg || 'An error occurred while fetching the user profile.'}
        </Alert>
      </Container>
    );
  }

  if (!userProfile) {
    console.log('User profile not found');
    return (
      <Container>
        <Alert severity="warning">User not found.</Alert>
      </Container>
    );
  }

  console.log('Rendering profile for user:', userProfile.name);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isOwnProfile = authUser && authUser._id === userProfile._id;

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              alt={userProfile.name}
              src={userProfile.avatar}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{userProfile.name}</Typography>
            <Typography variant="h6" color="textSecondary">
              @{userProfile.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {userProfile.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {recipes.length} Recipes | {userProfile.followers ? userProfile.followers.length : 0} Followers | {userProfile.following ? userProfile.following.length : 0} Following
            </Typography>
            {userProfile.bio && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                {userProfile.bio}
              </Typography>
            )}
            {userProfile.website && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                  {userProfile.website}
                </a>
              </Typography>
            )}
          </Grid>
          <Grid item>
            {isOwnProfile ? (
              <Button variant="contained" color="primary" onClick={handleEditProfileOpen} sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}>
                Edit Profile
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color={userProfile.followers.includes(authUser._id) ? "secondary" : "primary"}
                onClick={handleFollowToggle}
                sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}
              >
                {userProfile.followers.includes(authUser._id) ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" centered>
          <Tab label={isOwnProfile ? "My Recipes" : "Recipes"} />
          <Tab label="Saved Recipes" />
          <Tab label="Collections" />
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            {isOwnProfile ? "My Recipes" : `${userProfile.name}'s Recipes`}
          </Typography>
          {recipes.length === 0 ? (
            <Typography>{isOwnProfile ? "You haven't created any recipes yet." : "This user hasn't created any recipes yet."}</Typography>
          ) : (
            <InfiniteScroll
              dataLength={recipes.length}
              next={loadMoreRecipes}
              hasMore={hasMore}
              loader={<CircularProgress sx={{ mt: 2, mb: 2 }} />}
              endMessage={
                <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
                  You've seen all the recipes!
                </Typography>
              }
            >
              <Grid container spacing={3}>
                {recipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe._id} sx={{ animation: `${fadeIn} 1s ease-out` }}>
                    <RecipePost recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Saved Recipes
          </Typography>
          <Typography>
            This feature is coming soon! You'll be able to view all your saved recipes here.
          </Typography>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Collections
          </Typography>
          <Typography>
            This feature is coming soon! You'll be able to create and manage your recipe collections here.
          </Typography>
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Followers
          </Typography>
          {followers ? <FollowersList followers={followers} /> : <CircularProgress />}
        </Box>
      )}

      {tabValue === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Following
          </Typography>
          {following ? <FollowingList following={following} /> : <CircularProgress />}
        </Box>
      )}

      <Dialog open={editModalOpen} onClose={handleEditProfileClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.name}
            onChange={handleEditProfileChange}
          />
          <TextField
            margin="dense"
            name="bio"
            label="Bio"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.bio}
            onChange={handleEditProfileChange}
          />
          <TextField
            margin="dense"
            name="website"
            label="Website"
            type="url"
            fullWidth
            variant="standard"
            value={editProfileData.website}
            onChange={handleEditProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditProfileClose}>Cancel</Button>
          <Button onClick={handleEditProfileSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
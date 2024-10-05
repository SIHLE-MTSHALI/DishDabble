import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Container, Grid, Paper, Avatar, Button, Box, Tabs, Tab, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
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
  const { recipes, loading: recipeLoading, hasMore } = useSelector(state => state.recipe);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    bio: '',
    website: '',
  });
  const [localUserProfile, setLocalUserProfile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(1);

  console.log('Current state:', { authUser, userProfile, profileLoading, followers, following, error, recipes, recipeLoading });
  console.log('URL username:', urlUsername);
  console.log('Auth user:', authUser);

  useEffect(() => {
    const fetchProfileData = async () => {
      let profileIdentifier = urlUsername || (authUser && authUser.username);
      console.log('Profile identifier to fetch:', profileIdentifier);
      
      if (profileIdentifier) {
        console.log('Attempting to fetch profile data for:', profileIdentifier);
        try {
          await dispatch(getUserProfile(profileIdentifier));
          console.log('getUserProfile action dispatched successfully');
        } catch (error) {
          console.error('Error dispatching getUserProfile:', error);
          setSnackbarMessage('Error fetching user profile');
          setSnackbarOpen(true);
        }
      } else {
        console.log('No profile identifier available to fetch profile data');
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
    if (userProfile) {
      setLocalUserProfile(userProfile);
      dispatch(getUserRecipes(userProfile._id, 1));
      setPage(1);
    }
  }, [userProfile, dispatch]);

  useEffect(() => {
    if (localUserProfile && (tabValue === 3 || tabValue === 4)) {
      if (tabValue === 3 && (!followers || followers.length === 0)) {
        console.log('Fetching followers for user:', localUserProfile._id);
        dispatch(getFollowers(localUserProfile._id));
      } else if (tabValue === 4 && (!following || following.length === 0)) {
        console.log('Fetching following for user:', localUserProfile._id);
        dispatch(getFollowing(localUserProfile._id));
      }
    }
  }, [dispatch, localUserProfile, tabValue, followers, following]);

  useEffect(() => {
    if (error) {
      console.error('Error in user state:', error);
      setSnackbarMessage(error.msg || 'An error occurred');
      setSnackbarOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (localUserProfile) {
      setEditProfileData({
        name: localUserProfile.name || '',
        bio: localUserProfile.bio || '',
        website: localUserProfile.website || '',
      });
    }
  }, [localUserProfile]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && !recipeLoading && localUserProfile) {
      console.log('Loading more recipes for user:', localUserProfile._id);
      const nextPage = page + 1;
      dispatch(getUserRecipes(localUserProfile._id, nextPage));
      setPage(nextPage);
    }
  }, [dispatch, hasMore, recipeLoading, page, localUserProfile]);

  const handleFollowToggle = async () => {
    if (localUserProfile && authUser) {
      const isFollowing = localUserProfile.followers.includes(authUser._id);
      try {
        if (isFollowing) {
          console.log('Unfollowing user:', localUserProfile._id);
          await dispatch(unfollowUser(localUserProfile._id));
        } else {
          console.log('Following user:', localUserProfile._id);
          await dispatch(followUser(localUserProfile._id));
        }
        // Update local state after successful action
        setLocalUserProfile(prevProfile => ({
          ...prevProfile,
          followers: isFollowing
            ? prevProfile.followers.filter(id => id !== authUser._id)
            : [...prevProfile.followers, authUser._id]
        }));
        setSnackbarMessage(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error in follow/unfollow:', error);
        setSnackbarMessage('Error updating follow status');
        setSnackbarOpen(true);
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
      const updatedProfile = await dispatch(updateUserProfile(editProfileData));
      console.log('Profile updated successfully');
      setEditModalOpen(false);
      setLocalUserProfile(prevProfile => ({
        ...prevProfile,
        ...updatedProfile
      }));
      setSnackbarMessage('Profile updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Error updating profile');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (authLoading || profileLoading || (recipeLoading && page === 1)) {
    console.log('Loading spinner displayed');
    return <Spinner />;
  }

  if (!localUserProfile) {
    console.log('User profile not found');
    return (
      <Container>
        <Alert severity="warning">User not found.</Alert>
      </Container>
    );
  }

  console.log('Rendering profile for user:', localUserProfile.name);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isOwnProfile = authUser && authUser._id === localUserProfile._id;

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              alt={localUserProfile.name}
              src={localUserProfile.avatar}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{localUserProfile.name}</Typography>
            <Typography variant="h6" color="textSecondary">
              @{localUserProfile.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {localUserProfile.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {recipes.length} Recipes | {localUserProfile.followers ? localUserProfile.followers.length : 0} Followers | {localUserProfile.following ? localUserProfile.following.length : 0} Following
            </Typography>
            {localUserProfile.bio && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                {localUserProfile.bio}
              </Typography>
            )}
            {localUserProfile.website && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a href={localUserProfile.website} target="_blank" rel="noopener noreferrer">
                  {localUserProfile.website}
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
                color={localUserProfile.followers.includes(authUser._id) ? "secondary" : "primary"}
                onClick={handleFollowToggle}
                sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}
              >
                {localUserProfile.followers.includes(authUser._id) ? "Unfollow" : "Follow"}
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
            {isOwnProfile ? "My Recipes" : `${localUserProfile.name}'s Recipes`}
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
          {followers ? (
            followers.length > 0 ? (
              <FollowersList followers={followers} />
            ) : (
              <Typography>No followers yet.</Typography>
            )
          ) : (
            <CircularProgress />
          )}
        </Box>
      )}

      {tabValue === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Following
          </Typography>
          {following ? (
            following.length > 0 ? (
              <FollowingList following={following} />
            ) : (
              <Typography>Not following anyone yet.</Typography>
            )
          ) : (
            <CircularProgress />
          )}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProfilePage;
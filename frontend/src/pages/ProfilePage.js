import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Container, Grid, Paper, Avatar, Button, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipePost from '../components/recipes/RecipePost';
import { getUserRecipes } from '../actions/recipe';
import { getUserProfile, followUser, unfollowUser } from '../actions/user';
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
  const { username } = useParams();
  const { user: authUser, loading: authLoading } = useSelector(state => state.auth);
  const { userProfile, loading: profileLoading } = useSelector(state => state.user);
  const { recipes, loading: recipeLoading, hasMore, page } = useSelector(state => state.recipe);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProfileData = () => {
      if (username) {
        dispatch(getUserProfile(username));
        dispatch(getUserRecipes(username, 1));
      } else if (authUser && authUser.username) {
        dispatch(getUserProfile(authUser.username));
        dispatch(getUserRecipes(authUser._id, 1));
      }
    };

    if (!authLoading) {
      fetchProfileData();
    }
  }, [dispatch, username, authUser, authLoading]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && userProfile) {
      dispatch(getUserRecipes(userProfile._id, page + 1));
    }
  }, [dispatch, hasMore, page, userProfile]);

  const handleFollowToggle = () => {
    if (userProfile && authUser) {
      if (userProfile.followers.includes(authUser._id)) {
        dispatch(unfollowUser(userProfile._id));
      } else {
        dispatch(followUser(userProfile._id));
      }
    }
  };

  if (authLoading || profileLoading || (recipeLoading && page === 1)) {
    return <Spinner />;
  }

  if (!userProfile) {
    return (
      <Container>
        <Typography>User not found.</Typography>
      </Container>
    );
  }

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
          </Grid>
          <Grid item>
            {isOwnProfile ? (
              <Button variant="contained" color="primary" sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}>
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
          <FollowersList userId={userProfile._id} />
        </Box>
      )}

      {tabValue === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Following
          </Typography>
          <FollowingList userId={userProfile._id} />
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
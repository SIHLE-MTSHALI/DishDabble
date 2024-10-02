import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Container, Grid, Paper, Avatar, Button, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipePost from '../components/recipes/RecipePost';
import { getUserRecipes } from '../actions/recipe';
import Spinner from '../components/layout/Spinner';
import { fadeIn, slideInFromBottom } from '../styles/animations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  animation: `${fadeIn} 1s ease-out`,
}));

const ProfilePage = () => {
  const { user, loading: authLoading } = useSelector(state => state.auth);
  const { recipes, loading: recipeLoading, hasMore, page } = useSelector(state => state.recipe);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch(getUserRecipes(user._id, 1));
    }
  }, [dispatch, user]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && user) {
      dispatch(getUserRecipes(user._id, page + 1));
    }
  }, [dispatch, hasMore, page, user]);

  if (authLoading || (recipeLoading && page === 1)) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              alt={user.name}
              src={user.avatar}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{user.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              {user.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {recipes.length} Recipes | {user.followers ? user.followers.length : 0} Followers | {user.following ? user.following.length : 0} Following
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}>
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" centered>
          <Tab label="My Recipes" />
          <Tab label="Saved Recipes" />
          <Tab label="Collections" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            My Recipes
          </Typography>
          {recipes.length === 0 ? (
            <Typography>You haven't created any recipes yet.</Typography>
          ) : (
            <InfiniteScroll
              dataLength={recipes.length}
              next={loadMoreRecipes}
              hasMore={hasMore}
              loader={<CircularProgress sx={{ mt: 2, mb: 2 }} />}
              endMessage={
                <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
                  You've seen all your recipes!
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
    </Container>
  );
};

export default ProfilePage;
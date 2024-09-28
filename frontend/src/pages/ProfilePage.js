import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Container, Grid, Paper, Avatar, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import RecipeList from '../components/recipes/RecipeList';
import { getUserRecipes } from '../actions/recipe';
import Spinner from '../components/layout/Spinner';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ProfilePage = () => {
  const { user, loading: authLoading } = useSelector(state => state.auth);
  const { recipes, loading: recipeLoading } = useSelector(state => state.recipe);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getUserRecipes(user._id));
    }
  }, [dispatch, user]);

  if (authLoading || recipeLoading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              alt={user.name}
              src={user.avatar}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              {user.email}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      <Box mb={3}>
        <Typography variant="h5" gutterBottom>
          My Recipes
        </Typography>
        {recipes.length === 0 ? (
          <Typography>You haven't created any recipes yet.</Typography>
        ) : (
          <RecipeList recipes={recipes} />
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;
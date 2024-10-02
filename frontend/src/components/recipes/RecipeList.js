import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes } from '../../actions/recipe';
import RecipePost from './RecipePost';
import Spinner from '../layout/Spinner';
import { Grid, Typography, Container, Alert } from '@mui/material';

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector(state => state.recipe);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (recipes.length > 0) {
      console.log('Recipes loaded:', recipes);
    }
  }, [recipes]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.error('Error loading recipes:', error);
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Error loading recipes: {error.msg}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Recipes
      </Typography>
      {recipes.length === 0 ? (
        <Typography>No recipes found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {recipes.map(recipe => {
            if (!recipe) {
              console.error('Encountered undefined recipe in RecipeList');
              return null;
            }
            if (!recipe.user) {
              console.error('Recipe user is undefined:', recipe);
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                <RecipePost recipe={recipe} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default RecipeList;
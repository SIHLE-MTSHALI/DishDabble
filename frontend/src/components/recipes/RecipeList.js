import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes } from '../../actions/recipe';
import RecipeItem from './RecipeItem';
import { Grid, Typography, Container } from '@mui/material';

const RecipeList = () => {
  const dispatch = useDispatch();
  const recipes = useSelector(state => state.recipe.recipes);
  const loading = useSelector(state => state.recipe.loading);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading recipes...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Recipes
      </Typography>
      <Grid container spacing={3}>
        {recipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <RecipeItem recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeList;
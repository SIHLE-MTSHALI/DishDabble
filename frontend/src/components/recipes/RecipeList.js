import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes } from '../../actions/recipe';
import RecipeItem from './RecipeItem';
import Spinner from '../layout/Spinner';
import { Grid, Typography, Container } from '@mui/material';

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, loading } = useSelector(state => state.recipe);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
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
          {recipes.map(recipe => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <RecipeItem recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RecipeList;
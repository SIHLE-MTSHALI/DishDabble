import React from 'react';
import PropTypes from 'prop-types';
import RecipePost from './RecipePost';
import Spinner from '../layout/Spinner';
import { Grid, Typography, Container, Alert } from '@mui/material';

const RecipeList = ({ recipes, loading, error, title = 'Recipes' }) => {
  console.log('RecipeList: Rendering with props:', { recipes, loading, error, title });

  if (loading) {
    console.log('RecipeList: Loading...');
    return <Spinner />;
  }

  if (error) {
    console.error('RecipeList: Error:', error);
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Error loading recipes: {error.msg || 'Unknown error'}
        </Alert>
      </Container>
    );
  }

  console.log('RecipeList: Rendering recipes, count:', recipes.length);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        {title}
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

RecipeList.propTypes = {
  recipes: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string
};

export default RecipeList;
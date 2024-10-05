import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RecipePost from './RecipePost';
import Spinner from '../layout/Spinner';
import { Grid, Typography, Container, Alert, Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';

const RecipeList = ({ 
  recipes, 
  loading, 
  error, 
  title = 'Recipes', 
  hasMore, 
  onLoadMore,
  currentPage
}) => {
  console.log('RecipeList: Rendering with props:', { recipes: recipes.length, loading, error, title, hasMore, currentPage });

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      console.log('RecipeList: Loading more recipes');
      onLoadMore(currentPage + 1);
    }
  }, [hasMore, loading, onLoadMore, currentPage]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      console.log('RecipeList: In view, loading more recipes');
      handleLoadMore();
    }
  }, [inView, hasMore, loading, handleLoadMore]);

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

  // Check for duplicate recipe IDs
  const recipeIds = recipes.map(recipe => recipe._id);
  const duplicateIds = recipeIds.filter((id, index) => recipeIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    console.warn('RecipeList: Duplicate recipe IDs found:', duplicateIds);
  }

  // Filter out duplicate recipes
  const uniqueRecipes = recipes.filter((recipe, index, self) =>
    index === self.findIndex((t) => t._id === recipe._id)
  );

  console.log('RecipeList: Rendering recipes, count:', uniqueRecipes.length);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        {title}
      </Typography>
      {uniqueRecipes.length === 0 && !loading ? (
        <Typography>No recipes found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {uniqueRecipes.map((recipe, index) => {
            if (!recipe) {
              console.error('Encountered undefined recipe in RecipeList');
              return null;
            }
            if (!recipe.user) {
              console.error('Recipe user is undefined:', recipe);
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={`${recipe._id}-${index}`}>
                <RecipePost recipe={recipe} />
              </Grid>
            );
          })}
        </Grid>
      )}
      {loading && (
        <Box mt={3}>
          <Spinner />
        </Box>
      )}
      {hasMore && (
        <Box ref={ref} mt={3} textAlign="center">
          <Typography>Loading more recipes...</Typography>
        </Box>
      )}
    </Container>
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  hasMore: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default RecipeList;
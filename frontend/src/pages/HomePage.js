import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import RecipeList from '../components/recipes/RecipeList';
import { getFeedRecipes, getRandomRecipes } from '../actions/recipe';

const HomePage = () => {
  const dispatch = useDispatch();
  const { feedRecipes, randomRecipes, loading, error } = useSelector((state) => state.recipe);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadRecipes = useCallback((pageNum) => {
    if (isAuthenticated) {
      dispatch(getFeedRecipes(pageNum));
    } else {
      dispatch(getRandomRecipes(pageNum));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadRecipes(1);
  }, [loadRecipes]);

  const loadMoreRecipes = useCallback(() => {
    console.log('loadMoreRecipes called, current page:', page);
    if (hasMore && !loading) {
      const nextPage = page + 1;
      console.log('Loading more recipes, next page:', nextPage);
      loadRecipes(nextPage);
      setPage(nextPage);
    }
  }, [hasMore, loading, page, loadRecipes]);

  useEffect(() => {
    const recipes = isAuthenticated ? feedRecipes : randomRecipes;
    console.log('Recipes updated, length:', recipes.length);
    setHasMore(recipes.length % 10 === 0 && recipes.length > 0);
  }, [feedRecipes, randomRecipes, isAuthenticated]);

  const recipes = isAuthenticated ? feedRecipes : randomRecipes;
  const title = isAuthenticated ? 'Your Feed' : 'Discover Recipes';

  console.log('HomePage render - recipes:', recipes.length, 'hasMore:', hasMore, 'page:', page);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {title}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <RecipeList
          recipes={recipes}
          loading={loading}
          error={error}
          title={title}
          hasMore={hasMore}
          onLoadMore={loadMoreRecipes}
          currentPage={page}
        />
      </Box>
      {isAuthenticated && recipes.length === 0 && !loading && (
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          No recipes in your feed. Follow some users to see their recipes!
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;
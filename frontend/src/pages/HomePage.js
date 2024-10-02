import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipePost from '../components/recipes/RecipePost';
import { getFeedRecipes } from '../actions/recipe';
import { fadeIn } from '../styles/animations';

const HomePage = () => {
  const dispatch = useDispatch();
  const { feedRecipes, loading, hasMore, page } = useSelector((state) => state.recipe);

  useEffect(() => {
    dispatch(getFeedRecipes(1));
  }, [dispatch]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore) {
      dispatch(getFeedRecipes(page + 1));
    }
  }, [dispatch, hasMore, page]);

  if (loading && page === 1) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Your Feed
      </Typography>
      {feedRecipes.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          No recipes in your feed. Follow some users to see their recipes!
        </Typography>
      ) : (
        <InfiniteScroll
          dataLength={feedRecipes.length}
          next={loadMoreRecipes}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ mt: 2, mb: 2 }} />}
          endMessage={
            <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
              You've seen all the recipes in your feed!
            </Typography>
          }
        >
          {feedRecipes.map((recipe) => (
            <Box key={recipe._id} sx={{ mb: 4, animation: `${fadeIn} 1s ease-out` }}>
              <RecipePost recipe={recipe} />
            </Box>
          ))}
        </InfiniteScroll>
      )}
    </Container>
  );
};

export default HomePage;
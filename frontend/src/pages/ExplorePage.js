import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RecipePost from '../components/recipes/RecipePost';
import { searchRecipes, getTrendingRecipes } from '../actions/recipe';
import { fadeIn, slideInFromBottom } from '../styles/animations';

const categories = ['All', 'Desserts', 'Main Courses', 'Vegan', 'Gluten-Free', 'Quick & Easy', 'Healthy'];

const ExplorePage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { recipes, trendingRecipes, loading, hasMore, page } = useSelector((state) => state.recipe);

  useEffect(() => {
    dispatch(getTrendingRecipes());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchRecipes(searchTerm, 1));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      dispatch(searchRecipes(category, 1));
    } else {
      dispatch(getTrendingRecipes(1));
    }
  };

  const loadMoreRecipes = useCallback(() => {
    if (hasMore) {
      if (searchTerm || selectedCategory !== 'All') {
        dispatch(searchRecipes(searchTerm || selectedCategory, page + 1));
      } else {
        dispatch(getTrendingRecipes(page + 1));
      }
    }
  }, [dispatch, hasMore, searchTerm, selectedCategory, page]);

  const displayRecipes = searchTerm || selectedCategory !== 'All' ? recipes : trendingRecipes;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, animation: `${fadeIn} 1s ease-out` }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        Explore Delicious Recipes
      </Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, animation: `${slideInFromBottom} 0.5s ease-out` }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes, ingredients, or users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
          Search
        </Button>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleCategoryChange(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            sx={{ mr: 1, mb: 1, fontSize: '1rem', padding: '20px 10px' }}
          />
        ))}
      </Box>
      {loading && page === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {selectedCategory === 'All' && !searchTerm && (
            <Card sx={{ mb: 4, bgcolor: 'secondary.light', animation: `${fadeIn} 1s ease-out 0.5s` }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} /> Trending Recipes
                </Typography>
                <Grid container spacing={3}>
                  {trendingRecipes.slice(0, 3).map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                      <RecipePost recipe={recipe} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
          <InfiniteScroll
            dataLength={displayRecipes.length}
            next={loadMoreRecipes}
            hasMore={hasMore}
            loader={<CircularProgress sx={{ mt: 2, mb: 2 }} />}
            endMessage={
              <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
                You've seen all the recipes!
              </Typography>
            }
          >
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
              {displayRecipes.map((recipe) => (
                <Box key={recipe._id} sx={{ animation: `${fadeIn} 1s ease-out` }}>
                  <RecipePost recipe={recipe} />
                </Box>
              ))}
            </Masonry>
          </InfiniteScroll>
        </>
      )}
      {displayRecipes.length === 0 && !loading && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No recipes found. Try a different search term or category.
        </Typography>
      )}
    </Container>
  );
};

export default ExplorePage;
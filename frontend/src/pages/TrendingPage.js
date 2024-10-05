import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { getTrendingRecipes } from '../actions/recipe';
import RecipeList from '../components/recipes/RecipeList';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TrendingPage = ({ getTrendingRecipes, recipes, loading, error, hasMore }) => {
  const [timePeriod, setTimePeriod] = useState('day');
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log(`TrendingPage: Fetching trending recipes for time period: ${timePeriod}`);
    getTrendingRecipes(1, 10, timePeriod);
    setPage(1);
  }, [getTrendingRecipes, timePeriod]);

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && !loading) {
      console.log(`TrendingPage: Loading more trending recipes, page ${page + 1}`);
      getTrendingRecipes(page + 1, 10, timePeriod);
      setPage(prevPage => prevPage + 1);
    }
  }, [getTrendingRecipes, hasMore, loading, page, timePeriod]);

  const handleTimePeriodChange = (event) => {
    const newTimePeriod = event.target.value;
    console.log(`TrendingPage: Time period changed to ${newTimePeriod}`);
    setTimePeriod(newTimePeriod);
  };

  console.log('TrendingPage: Rendering with state:', { recipes, loading, error, timePeriod, page, hasMore });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trending Recipes
      </Typography>
      <FormControl sx={{ minWidth: 120, marginBottom: 2 }}>
        <InputLabel id="time-period-label">Time Period</InputLabel>
        <Select
          labelId="time-period-label"
          value={timePeriod}
          onChange={handleTimePeriodChange}
        >
          <MenuItem value="day">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </Select>
      </FormControl>
      <RecipeList 
        recipes={recipes} 
        loading={loading} 
        error={error}
        title={`Trending Recipes (${timePeriod})`}
        hasMore={hasMore}
        onLoadMore={loadMoreRecipes}
        currentPage={page}
      />
    </Box>
  );
};

const mapStateToProps = state => ({
  recipes: state.recipe.recipes,
  loading: state.recipe.loading,
  error: state.recipe.error,
  hasMore: state.recipe.hasMore
});

export default connect(mapStateToProps, { getTrendingRecipes })(TrendingPage);
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getTrendingRecipes } from '../actions/recipe';
import RecipeList from '../components/recipes/RecipeList';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TrendingPage = ({ getTrendingRecipes, recipes, loading, error }) => {
  const [timePeriod, setTimePeriod] = useState('day');
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log(`TrendingPage: Fetching trending recipes for time period: ${timePeriod}`);
    getTrendingRecipes(1, 10, timePeriod);
  }, [getTrendingRecipes, timePeriod]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      console.log('TrendingPage: Reached bottom of page, loading more results');
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1) {
      console.log(`TrendingPage: Loading more trending recipes, page ${page}`);
      getTrendingRecipes(page, 10, timePeriod);
    }
  }, [getTrendingRecipes, page, timePeriod]);

  const handleTimePeriodChange = (event) => {
    const newTimePeriod = event.target.value;
    console.log(`TrendingPage: Time period changed to ${newTimePeriod}`);
    setTimePeriod(newTimePeriod);
    setPage(1);
  };

  console.log('TrendingPage: Rendering with state:', { recipes, loading, error, timePeriod, page });

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
      />
    </Box>
  );
};

const mapStateToProps = state => ({
  recipes: state.recipe.recipes,
  loading: state.recipe.loading,
  error: state.recipe.error
});

export default connect(mapStateToProps, { getTrendingRecipes })(TrendingPage);
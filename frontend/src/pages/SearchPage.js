import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { searchRecipes } from '../actions/recipe';
import RecipeList from '../components/recipes/RecipeList';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

const SearchPage = ({ searchRecipes, recipes, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const location = useLocation();

  const handleSearch = useCallback((term = searchTerm) => {
    if (term.trim()) {
      console.log(`SearchPage: Initiating search for term: "${term}"`);
      searchRecipes(term, 1);
      setPage(1);
    }
  }, [searchTerm, searchRecipes]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tag = searchParams.get('tag');
    if (tag) {
      console.log(`SearchPage: Found tag in URL: "${tag}"`);
      setSearchTerm(tag);
      handleSearch(tag);
    }
  }, [location, handleSearch]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      console.log('SearchPage: Reached bottom of page, loading more results');
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1 && searchTerm.trim()) {
      console.log(`SearchPage: Loading more results for "${searchTerm}", page ${page}`);
      searchRecipes(searchTerm, page);
    }
  }, [searchRecipes, page, searchTerm]);

  console.log('SearchPage: Rendering with state:', { recipes, loading, error, searchTerm, page });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Search Recipes
      </Typography>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }} sx={{ display: 'flex', marginBottom: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for recipes..."
          sx={{ marginRight: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </Box>
      <RecipeList 
        recipes={recipes} 
        loading={loading} 
        error={error}
        title={`Search Results for "${searchTerm}"`}
      />
    </Box>
  );
};

const mapStateToProps = state => ({
  recipes: state.recipe.recipes,
  loading: state.recipe.loading,
  error: state.recipe.error
});

export default connect(mapStateToProps, { searchRecipes })(SearchPage);
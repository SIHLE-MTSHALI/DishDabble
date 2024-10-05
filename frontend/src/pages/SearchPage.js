import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { searchRecipes } from '../actions/recipe';
import RecipeList from '../components/recipes/RecipeList';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';

const SearchPage = ({ searchRecipes, recipes, loading, error, hasMore }) => {
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

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && !loading && searchTerm.trim()) {
      console.log(`SearchPage: Loading more results for "${searchTerm}", page ${page + 1}`);
      searchRecipes(searchTerm, page + 1);
      setPage(prevPage => prevPage + 1);
    }
  }, [searchRecipes, hasMore, loading, searchTerm, page]);

  console.log('SearchPage: Rendering with state:', { recipes, loading, error, searchTerm, page, hasMore });

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

export default connect(mapStateToProps, { searchRecipes })(SearchPage);
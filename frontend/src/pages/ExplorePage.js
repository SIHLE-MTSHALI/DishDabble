import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { getRandomRecipes } from '../actions/recipe';
import { getRandomUsers } from '../actions/user';
import { getRandomTags } from '../actions/tag';
import RecipeList from '../components/recipes/RecipeList';
import UserList from '../components/users/UserList';
import TagList from '../components/tags/TagList';

const ExplorePage = ({ getRandomRecipes, getRandomUsers, getRandomTags, recipes, users, tags, loading, error }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    console.log('ExplorePage: Fetching random data');
    getRandomRecipes();
    getRandomUsers();
    getRandomTags();
  }, [getRandomRecipes, getRandomUsers, getRandomTags]);

  useEffect(() => {
    console.log('ExplorePage: Users state updated', users);
  }, [users]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  console.log('ExplorePage: Rendering with state:', { recipes, users, tags, loading, error });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Explore
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="explore tabs">
        <Tab label="Random Recipes" />
        <Tab label="Random Users" />
        <Tab label="Random Tags" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && (
          <RecipeList 
            recipes={recipes} 
            loading={loading.recipe} 
            error={error.recipe}
            title="Random Recipes"
          />
        )}
        {activeTab === 1 && (
          loading.user ? (
            <Typography>Loading users...</Typography>
          ) : error.user ? (
            <Typography color="error">Error loading users: {error.user.msg}</Typography>
          ) : (
            <>
              <Typography>Number of users: {users.length}</Typography>
              {users.length > 0 ? (
                <UserList users={users} />
              ) : (
                <Typography>No users found.</Typography>
              )}
            </>
          )
        )}
        {activeTab === 2 && (
          loading.tag ? (
            <Typography>Loading tags...</Typography>
          ) : error.tag ? (
            <Typography color="error">Error loading tags: {error.tag.msg}</Typography>
          ) : (
            <TagList tags={tags} />
          )
        )}
      </Box>
    </Box>
  );
};

const mapStateToProps = state => {
  console.log('ExplorePage: mapStateToProps', state);
  return {
    recipes: state.recipe.randomRecipes,
    users: state.user.randomUsers,
    tags: state.tag.randomTags,
    loading: {
      recipe: state.recipe.loading,
      user: state.user.loading,
      tag: state.tag.loading
    },
    error: {
      recipe: state.recipe.error,
      user: state.user.error,
      tag: state.tag.error
    }
  };
};

export default connect(mapStateToProps, { getRandomRecipes, getRandomUsers, getRandomTags })(ExplorePage);
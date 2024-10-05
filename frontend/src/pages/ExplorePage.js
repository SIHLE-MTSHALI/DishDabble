import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { getRandomRecipes } from '../actions/recipe';
import { getRandomUsers } from '../actions/user';
import { getRandomTags } from '../actions/tag';
import RecipeList from '../components/recipes/RecipeList';
import UserList from '../components/users/UserList';
import TagList from '../components/tags/TagList';

const ExplorePage = ({ getRandomRecipes, getRandomUsers, getRandomTags, recipes, users, tags, loading, error, hasMore }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log('ExplorePage: Fetching initial random data');
    getRandomRecipes(1);
    getRandomUsers();
    getRandomTags();
  }, [getRandomRecipes, getRandomUsers, getRandomTags]);

  useEffect(() => {
    console.log('ExplorePage: Users state updated', users);
    if (users && users.length > 0) {
      users.forEach((user, index) => {
        console.log(`User ${index}:`, {
          id: user._id,
          name: user.name,
          username: user.username,
          hasUsername: !!user.username
        });
      });
    } else {
      console.log('ExplorePage: No users data available');
    }
  }, [users]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const loadMoreRecipes = useCallback(() => {
    if (hasMore && !loading.recipe) {
      console.log('ExplorePage: Loading more random recipes');
      const nextPage = page + 1;
      getRandomRecipes(nextPage);
      setPage(nextPage);
    }
  }, [hasMore, loading.recipe, page, getRandomRecipes]);

  console.log('ExplorePage: Rendering with state:', { 
    recipes: recipes.length, 
    users: users.length, 
    tags: tags.length, 
    loading, 
    error,
    hasMore,
    page
  });

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
            hasMore={hasMore}
            onLoadMore={loadMoreRecipes}
            currentPage={page}
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
                <>
                  <Typography>User data before passing to UserList:</Typography>
                  {users.map((user, index) => (
                    <Typography key={user._id}>
                      User {index}: ID: {user._id}, Name: {user.name}, Username: {user.username || 'undefined'}
                    </Typography>
                  ))}
                  <UserList users={users} />
                </>
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
  console.log('ExplorePage: mapStateToProps', {
    recipes: state.recipe.randomRecipes.length,
    users: state.user.randomUsers.length,
    tags: state.tag.randomTags.length,
    loading: state.recipe.loading && state.user.loading && state.tag.loading,
    error: state.recipe.error || state.user.error || state.tag.error,
    hasMore: state.recipe.hasMore
  });
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
    },
    hasMore: state.recipe.hasMore
  };
};

export default connect(mapStateToProps, { getRandomRecipes, getRandomUsers, getRandomTags })(ExplorePage);
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRandomRecipes } from '../actions/recipe';
import { getRandomUsers } from '../actions/user';
import { getRandomTags } from '../actions/tag';
import RecipeList from '../components/recipes/RecipeList';
import UserList from '../components/users/UserList';
import TagList from '../components/tags/TagList';

const ExplorePage = ({ getRandomRecipes, getRandomUsers, getRandomTags, recipes, users, tags, loading, error, hasMore }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [recipePage, setRecipePage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [tagPage, setTagPage] = useState(1);

  useEffect(() => {
    console.log('ExplorePage: Fetching initial random data');
    getRandomRecipes(1);
    getRandomUsers(1);
    getRandomTags(1);
  }, [getRandomRecipes, getRandomUsers, getRandomTags]);

  const handleTabChange = (event, newValue) => {
    console.log('ExplorePage: Tab changed to', newValue);
    setActiveTab(newValue);
  };

  const loadMoreRecipes = useCallback(() => {
    if (hasMore.recipe && !loading.recipe) {
      console.log('ExplorePage: Loading more random recipes');
      const nextPage = recipePage + 1;
      getRandomRecipes(nextPage);
      setRecipePage(nextPage);
    }
  }, [hasMore.recipe, loading.recipe, recipePage, getRandomRecipes]);

  const loadMoreUsers = useCallback(() => {
    if (hasMore.user && !loading.user) {
      console.log('ExplorePage: Loading more random users');
      const nextPage = userPage + 1;
      getRandomUsers(nextPage);
      setUserPage(nextPage);
    }
  }, [hasMore.user, loading.user, userPage, getRandomUsers]);

  const loadMoreTags = useCallback(() => {
    if (hasMore.tag && !loading.tag) {
      console.log('ExplorePage: Loading more random tags');
      const nextPage = tagPage + 1;
      getRandomTags(nextPage);
      setTagPage(nextPage);
    }
  }, [hasMore.tag, loading.tag, tagPage, getRandomTags]);

  console.log('ExplorePage: Rendering with state:', { 
    recipes: recipes?.length, 
    users: users?.length, 
    tags: tags?.length, 
    loading, 
    error,
    hasMore,
    recipePage,
    userPage,
    tagPage,
    activeTab
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Explore
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="explore tabs">
        <Tab label="Recipes" />
        <Tab label="Users" />
        <Tab label="Tags" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && (
          <InfiniteScroll
            dataLength={recipes?.length || 0}
            next={loadMoreRecipes}
            hasMore={hasMore.recipe}
            loader={<Typography>Loading more recipes...</Typography>}
          >
            <RecipeList 
              recipes={recipes || []} 
              loading={loading.recipe} 
              error={error.recipe}
              title="Explore Recipes"
            />
          </InfiniteScroll>
        )}
        {activeTab === 1 && (
          <InfiniteScroll
            dataLength={users?.length || 0}
            next={loadMoreUsers}
            hasMore={hasMore.user}
            loader={<Typography>Loading more users...</Typography>}
          >
            {loading.user && (!users || users.length === 0) ? (
              <Typography>Loading users...</Typography>
            ) : error.user ? (
              <Typography color="error">Error loading users: {error.user.msg}</Typography>
            ) : (
              <UserList users={users || []} />
            )}
          </InfiniteScroll>
        )}
        {activeTab === 2 && (
          <InfiniteScroll
            dataLength={tags?.length || 0}
            next={loadMoreTags}
            hasMore={hasMore.tag}
            loader={<Typography>Loading more tags...</Typography>}
          >
            {loading.tag && (!tags || tags.length === 0) ? (
              <Typography>Loading tags...</Typography>
            ) : error.tag ? (
              <Typography color="error">Error loading tags: {error.tag.msg}</Typography>
            ) : (
              <TagList tags={tags || []} />
            )}
          </InfiniteScroll>
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
    },
    hasMore: {
      recipe: state.recipe.hasMore,
      user: state.user.hasMore,
      tag: state.tag.hasMore
    }
  };
};

export default connect(mapStateToProps, { getRandomRecipes, getRandomUsers, getRandomTags })(ExplorePage);
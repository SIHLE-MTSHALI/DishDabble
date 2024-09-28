import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../../actions/recipe';
import Spinner from '../layout/Spinner';
import { Typography, Container, Box, List, ListItem, ListItemText, Chip, Button, Grid } from '@mui/material';

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { recipe, loading } = useSelector(state => state.recipe);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getRecipe(id));
  }, [dispatch, id]);

  if (loading || !recipe) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        {recipe.title}
      </Typography>
      <Box my={2}>
        <Typography variant="subtitle1" gutterBottom>
          {recipe.description}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img src={recipe.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={recipe.title} style={{width: '100%', height: 'auto'}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Details:</Typography>
          <Typography>Preparation Time: {recipe.prepTime} minutes</Typography>
          <Typography>Cooking Time: {recipe.cookTime} minutes</Typography>
          <Typography>Difficulty: {recipe.difficulty}</Typography>
          <Typography>Servings: {recipe.servings}</Typography>
          <Box my={2}>
            <Typography variant="h6">Tags:</Typography>
            {recipe.tags.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box my={2}>
        <Typography variant="h6">Ingredients:</Typography>
        <List>
          {recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box my={2}>
        <Typography variant="h6">Instructions:</Typography>
        <List>
          {recipe.instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${instruction}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      {user && user._id === recipe.user && (
        <Box mt={3}>
          <Button component={Link} to={`/edit-recipe/${recipe._id}`} variant="contained" color="primary" sx={{ mr: 2 }}>
            Edit Recipe
          </Button>
          <Button variant="contained" color="secondary">
            Delete Recipe
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RecipeDetail;
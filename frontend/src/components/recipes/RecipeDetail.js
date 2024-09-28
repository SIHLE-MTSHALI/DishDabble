import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../../actions/recipe';
import { Typography, Container, Box, List, ListItem, ListItemText, Chip } from '@mui/material';

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipe = useSelector(state => state.recipe.recipe);
  const loading = useSelector(state => state.recipe.loading);

  useEffect(() => {
    dispatch(getRecipe(id));
  }, [dispatch, id]);

  if (loading) {
    return <Typography>Loading recipe...</Typography>;
  }

  if (!recipe) {
    return <Typography>Recipe not found</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        {recipe.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {recipe.description}
      </Typography>
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
      <Box my={2}>
        <Typography>Preparation Time: {recipe.prepTime} minutes</Typography>
        <Typography>Cooking Time: {recipe.cookTime} minutes</Typography>
        <Typography>Difficulty: {recipe.difficulty}</Typography>
        <Typography>Servings: {recipe.servings}</Typography>
      </Box>
      <Box my={2}>
        <Typography variant="h6">Tags:</Typography>
        {recipe.tags.map((tag, index) => (
          <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
        ))}
      </Box>
    </Container>
  );
};

export default RecipeDetail;
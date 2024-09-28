import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';

const RecipeItem = ({ recipe }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={recipe.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={recipe.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.description.substring(0, 100)}...
        </Typography>
        <Box mt={2} mb={1}>
          <Typography variant="body2">
            Prep time: {recipe.prepTime} min | Cook time: {recipe.cookTime} min
          </Typography>
          <Typography variant="body2">
            Difficulty: {recipe.difficulty}
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap" mb={2}>
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        <Button component={Link} to={`/recipes/${recipe._id}`} variant="contained" color="primary">
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeItem;
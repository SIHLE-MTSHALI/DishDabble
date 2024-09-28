import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

const RecipeItem = ({ recipe }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={recipe.images[0] || 'https://via.placeholder.com/300x200'}
        alt={recipe.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.description.substring(0, 100)}...
        </Typography>
        <Box mt={2}>
          <Button component={Link} to={`/recipes/${recipe._id}`} variant="contained" color="primary">
            View Recipe
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeItem;
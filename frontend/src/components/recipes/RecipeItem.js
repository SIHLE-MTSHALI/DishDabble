import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { likeRecipe, unlikeRecipe } from '../../actions/recipe';

const RecipeItem = ({ recipe }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const currentUser = auth.user;

  const handleLike = () => {
    if (isAuthenticated) {
      if (recipe.likes.includes(currentUser._id)) {
        dispatch(unlikeRecipe(recipe._id));
      } else {
        dispatch(likeRecipe(recipe._id));
      }
    }
  };

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
        <Box display="flex" alignItems="center" mb={1}>
          <StarIcon color="primary" />
          <Typography variant="body2" ml={0.5}>
            {recipe.averageRating ? recipe.averageRating.toFixed(1) : 'N/A'} ({recipe.ratings ? recipe.ratings.length : 0} ratings)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <IconButton onClick={handleLike} disabled={!isAuthenticated}>
            {recipe.likes.includes(currentUser?._id) ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography variant="body2">
            {recipe.likes.length} {recipe.likes.length === 1 ? 'like' : 'likes'}
          </Typography>
        </Box>
        <Typography variant="body2" mb={1}>
          Posted by: {recipe.user.name}
        </Typography>
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
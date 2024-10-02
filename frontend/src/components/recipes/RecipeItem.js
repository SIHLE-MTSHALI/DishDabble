import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StarIcon from '@mui/icons-material/Star';
import { likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe } from '../../actions/recipe';
import { emitLikeRecipe } from '../../utils/socket';
import { fadeIn, slideInFromBottom } from '../../styles/animations';

const RecipeItem = ({ recipe }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const currentUser = auth.user;

  const [isLiked, setIsLiked] = useState(recipe.likes.includes(currentUser?._id));
  const [isSaved, setIsSaved] = useState(recipe.saves.includes(currentUser?._id));
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    setIsLiked(recipe.likes.includes(currentUser?._id));
    setIsSaved(recipe.saves.includes(currentUser?._id));
  }, [recipe, currentUser]);

  const handleLike = () => {
    if (isAuthenticated) {
      console.log('Handling like for recipe:', recipe._id);
      if (isLiked) {
        console.log('Unliking recipe');
        dispatch(unlikeRecipe(recipe._id));
      } else {
        console.log('Liking recipe');
        dispatch(likeRecipe(recipe._id));
        emitLikeRecipe(recipe._id);
      }
      setIsLiked(!isLiked);
    } else {
      console.log('User not authenticated. Cannot like recipe.');
    }
  };

  const handleSave = () => {
    if (isAuthenticated) {
      console.log('Handling save for recipe:', recipe._id);
      if (isSaved) {
        console.log('Unsaving recipe');
        dispatch(unsaveRecipe(recipe._id));
      } else {
        console.log('Saving recipe');
        dispatch(saveRecipe(recipe._id));
      }
      setIsSaved(!isSaved);
    } else {
      console.log('User not authenticated. Cannot save recipe.');
    }
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      handleLike();
    }
    setLastTap(now);
  };

  return (
    <Card sx={{ animation: `${fadeIn} 1s ease-out` }}>
      <CardMedia
        component="img"
        height="140"
        image={recipe.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={recipe.title}
        onClick={handleDoubleTap}
        style={{ cursor: 'pointer' }}
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
            {isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography variant="body2" mr={2}>
            {recipe.likes.length} {recipe.likes.length === 1 ? 'like' : 'likes'}
          </Typography>
          <IconButton onClick={handleSave} disabled={!isAuthenticated}>
            {isSaved ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
          <Typography variant="body2">
            {recipe.saves.length} {recipe.saves.length === 1 ? 'save' : 'saves'}
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
        <Button component={Link} to={`/recipes/${recipe._id}`} variant="contained" color="primary" sx={{ animation: `${slideInFromBottom} 0.5s ease-out` }}>
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeItem;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe, likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe, addComment } from '../../actions/recipe';
import Spinner from '../layout/Spinner';
import { Typography, Container, Box, List, ListItem, ListItemText, Chip, Button, Grid, IconButton, Modal, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { emitLikeRecipe, emitCommentRecipe } from '../../utils/socket';

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { recipe, loading } = useSelector(state => state.recipe);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(getRecipe(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (recipe) {
      console.log('Raw recipe data:', JSON.stringify(recipe, null, 2));
      console.log('Ingredients:', JSON.stringify(recipe.ingredients, null, 2));
    }
  }, [recipe]);

  const handleLike = () => {
    if (isAuthenticated) {
      if (recipe.likes.includes(user._id)) {
        dispatch(unlikeRecipe(recipe._id));
      } else {
        dispatch(likeRecipe(recipe._id));
        emitLikeRecipe(recipe._id);
      }
    }
  };

  const handleSave = () => {
    if (isAuthenticated) {
      if (recipe.saves.includes(user._id)) {
        dispatch(unsaveRecipe(recipe._id));
      } else {
        dispatch(saveRecipe(recipe._id));
      }
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      dispatch(addComment(recipe._id, comment));
      emitCommentRecipe(recipe._id, comment);
      setComment('');
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? recipe.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === recipe.images.length - 1 ? 0 : prevIndex + 1
    );
  };

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
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" flexWrap="wrap">
            {recipe.images && recipe.images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: 150,
                  height: 150,
                  m: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image || 'https://via.placeholder.com/150?text=No+Image'}
                  alt={`${recipe.title} - ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="image-modal"
            aria-describedby="enlarged-recipe-image"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              alignItems: 'center',
            }}>
              <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', left: 10 }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <img 
                src={recipe.images && recipe.images[currentImageIndex] ? recipe.images[currentImageIndex] : 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={`${recipe.title} - ${currentImageIndex + 1}`} 
                style={{maxWidth: '80vw', maxHeight: '80vh'}}
              />
              <IconButton onClick={handleNextImage} sx={{ position: 'absolute', right: 10 }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Modal>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Details:</Typography>
          <Typography>Preparation Time: {recipe.prepTime} minutes</Typography>
          <Typography>Cooking Time: {recipe.cookTime} minutes</Typography>
          <Typography>Difficulty: {recipe.difficulty}</Typography>
          <Typography>Servings: {recipe.servings}</Typography>
          <Box my={2} display="flex" alignItems="center">
            <StarIcon color="primary" />
            <Typography variant="body1" ml={0.5}>
              {recipe.averageRating ? recipe.averageRating.toFixed(1) : 'N/A'} ({recipe.ratings ? recipe.ratings.length : 0} ratings)
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleLike} disabled={!isAuthenticated}>
              {recipe.likes && recipe.likes.includes(user?._id) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="body1" mr={2}>
              {recipe.likes ? recipe.likes.length : 0} {recipe.likes && recipe.likes.length === 1 ? 'like' : 'likes'}
            </Typography>
            <IconButton onClick={handleSave} disabled={!isAuthenticated}>
              {recipe.saves && recipe.saves.includes(user?._id) ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <Typography variant="body1">
              {recipe.saves ? recipe.saves.length : 0} {recipe.saves && recipe.saves.length === 1 ? 'save' : 'saves'}
            </Typography>
          </Box>
          <Typography variant="body1" mb={2}>
            Posted by: {recipe.user ? recipe.user.name : 'Unknown'}
          </Typography>
          <Box my={2}>
            <Typography variant="h6">Tags:</Typography>
            {recipe.tags && recipe.tags.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box my={2}>
        <Typography variant="h6">Ingredients:</Typography>
        <List>
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`${ingredient.quantity || ''} ${ingredient.name || 'Unknown ingredient'}`} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box my={2}>
        <Typography variant="h6">Instructions:</Typography>
        <List>
          {recipe.instructions && recipe.instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${instruction}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box my={4}>
        <Typography variant="h6" gutterBottom>Comments</Typography>
        {isAuthenticated ? (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Post Comment
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" mb={2}>
            Please <Link to="/login">log in</Link> to add a comment.
          </Typography>
        )}
        {recipe.comments && recipe.comments.map((comment, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2">{comment.name}</Typography>
            <Typography variant="body1">{comment.text}</Typography>
          </Box>
        ))}
      </Box>
      {user && recipe.user && user._id === recipe.user._id && (
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
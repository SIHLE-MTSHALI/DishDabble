import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, FavoriteBorder, Comment, BookmarkBorder, Bookmark, AccessTime, Restaurant, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe, rateRecipe, addComment } from '../../actions/recipe';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';

const RecipePost = ({ recipe }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showFullRecipe, setShowFullRecipe] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (recipe && recipe.ratings && auth.user) {
      setUserRating(recipe.ratings.find(rating => rating.user === auth.user._id)?.value || 0);
    }
  }, [recipe, auth.user]);

  if (!recipe) {
    console.error('Recipe is undefined in RecipePost');
    return <Alert severity="error">Error: Recipe data is missing</Alert>;
  }

  if (!recipe.user) {
    console.error('Recipe user is undefined in RecipePost', recipe);
    return <Alert severity="error">Error: Recipe user data is missing</Alert>;
  }

  const handleLike = () => {
    try {
      if (recipe.likes.includes(auth.user._id)) {
        dispatch(unlikeRecipe(recipe._id));
      } else {
        dispatch(likeRecipe(recipe._id));
      }
    } catch (err) {
      console.error('Error in handleLike:', err);
      setError('Failed to like/unlike recipe');
    }
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      handleLike();
    }
    setLastTap(now);
  };

  const handleSave = () => {
    try {
      if (recipe.saves.includes(auth.user._id)) {
        dispatch(unsaveRecipe(recipe._id));
      } else {
        dispatch(saveRecipe(recipe._id));
      }
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError('Failed to save/unsave recipe');
    }
  };

  const handleRating = (event, newValue) => {
    try {
      setUserRating(newValue);
      dispatch(rateRecipe(recipe._id, newValue));
    } catch (err) {
      console.error('Error in handleRating:', err);
      setError('Failed to rate recipe');
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    try {
      if (comment.trim()) {
        dispatch(addComment(recipe._id, comment));
        setComment('');
      }
    } catch (err) {
      console.error('Error in handleComment:', err);
      setError('Failed to add comment');
    }
  };

  return (
    <Card ref={cardRef}>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {recipe.user.name ? recipe.user.name.charAt(0) : '?'}
          </Avatar>
        }
        title={<Link to={`/profile/${recipe.user._id}`}>{recipe.user.name}</Link>}
        subheader={new Date(recipe.createdAt).toLocaleDateString()}
      />
      <Carousel
        autoPlay={false}
        animation="slide"
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 0,
          }
        }}
        NextIcon={<ChevronRight />}
        PrevIcon={<ChevronLeft />}
      >
        {recipe.images && recipe.images.map((image, index) => (
          <CardMedia
            key={index}
            component="img"
            height="400"
            image={image}
            alt={`${recipe.title} - Image ${index + 1}`}
            onClick={handleDoubleTap}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Carousel>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {recipe.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <AccessTime fontSize="small" />
            <Typography variant="body2" ml={1}>
              Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Restaurant fontSize="small" />
            <Typography variant="body2" ml={1}>
              Serves: {recipe.servings}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Rating
            name="recipe-rating"
            value={userRating}
            precision={0.5}
            onChange={handleRating}
          />
          <Typography variant="body2">
            ({recipe.ratings.length} {recipe.ratings.length === 1 ? 'rating' : 'ratings'})
          </Typography>
          <Chip label={recipe.difficulty} color="primary" variant="outlined" />
        </Box>
        <Box mb={2}>
          {recipe.tags && recipe.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        {showFullRecipe && (
          <>
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List dense>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            {recipe.instructions && recipe.instructions.map((instruction, index) => (
              <Typography key={index} variant="body2" paragraph>
                {index + 1}. {instruction}
              </Typography>
            ))}
          </>
        )}
        <Button onClick={() => setShowFullRecipe(!showFullRecipe)}>
          {showFullRecipe ? 'Hide Full Recipe' : 'Show Full Recipe'}
        </Button>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={handleLike}>
          {recipe.likes && recipe.likes.includes(auth.user._id) ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography>{recipe.likes ? recipe.likes.length : 0}</Typography>
        <IconButton aria-label="comment" onClick={() => setShowComments(!showComments)}>
          <Comment />
        </IconButton>
        <Typography>{recipe.comments ? recipe.comments.length : 0}</Typography>
        <IconButton aria-label="save" onClick={handleSave}>
          {recipe.saves && recipe.saves.includes(auth.user._id) ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </CardActions>
      {showComments && (
        <Box sx={{ p: 2 }}>
          {recipe.comments && recipe.comments.map((comment) => (
            <Typography key={comment._id} variant="body2" sx={{ mb: 1 }}>
              <Link to={`/profile/${comment.user._id}`} style={{ fontWeight: 'bold', marginRight: '8px' }}>
                {comment.user.name}
              </Link>
              {comment.text}
            </Typography>
          ))}
          <Box component="form" onSubmit={handleComment} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
              Post
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default RecipePost;
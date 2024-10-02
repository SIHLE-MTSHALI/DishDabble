import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Avatar,
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { fadeIn, slideInFromBottom } from '../styles/animations';

const LandingPage = () => {
  const userPosts = [
    { id: 1, username: 'foodie123', image: 'https://source.unsplash.com/random/400x300?food', caption: 'Delicious homemade pasta!' },
    { id: 2, username: 'chefmaster', image: 'https://source.unsplash.com/random/400x300?dessert', caption: 'Perfect chocolate soufflé' },
    { id: 3, username: 'healthyeats', image: 'https://source.unsplash.com/random/400x300?salad', caption: 'Fresh summer salad' },
  ];

  const recipeImages = [
    'https://source.unsplash.com/random/800x600?recipe',
    'https://source.unsplash.com/random/800x600?cooking',
    'https://source.unsplash.com/random/800x600?baking',
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome to DishDabble
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover and Share Delicious Recipes
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/register" sx={{ mr: 2, animation: `${slideInFromBottom} 0.5s ease-out` }}>
            Sign Up
          </Button>
          <Button variant="outlined" color="primary" component={RouterLink} to="/login" sx={{ animation: `${slideInFromBottom} 0.5s ease-out 0.2s` }}>
            Log In
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 1s ease-out 0.5s` }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            User Posts
          </Typography>
          <Carousel showArrows={true} showStatus={false} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000}>
            {userPosts.map((post) => (
              <Card key={post.id} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={post.image}
                  alt={post.caption}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{post.username[0].toUpperCase()}</Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{post.username}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {post.caption}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={12} md={6} sx={{ animation: `${fadeIn} 1s ease-out 0.7s` }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Featured Recipes
          </Typography>
          <Carousel showArrows={true} showStatus={false} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={6000}>
            {recipeImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Featured recipe ${index + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              </div>
            ))}
          </Carousel>
        </Grid>
      </Grid>

      <Box sx={{ my: 4, animation: `${fadeIn} 1s ease-out 0.9s` }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Join a Community of Food Lovers
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Connect with fellow food enthusiasts, share your culinary creations, and discover new recipes from around the world.
        </Typography>
      </Box>

      <Box sx={{ my: 4, animation: `${fadeIn} 1s ease-out 1.1s` }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "DishDabble has transformed the way I cook. I've found so many amazing recipes and made great friends!"
                </Typography>
                <Typography variant="subtitle2" align="right" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  - Sarah M.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "As a professional chef, I love sharing my recipes and getting inspiration from the community."
                </Typography>
                <Typography variant="subtitle2" align="right" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  - Chef Alex
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "The variety of recipes on DishDabble is incredible. I've tried dishes from all over the world!"
                </Typography>
                <Typography variant="subtitle2" align="right" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  - Mike T.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LandingPage;
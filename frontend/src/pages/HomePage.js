import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import RecipeList from '../components/recipes/RecipeList';
import RecipeSearch from '../components/recipes/RecipeSearch';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Welcome to DishDabble
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Discover, share, and create delicious recipes with our community of food enthusiasts.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/?cooking"
              alt="Discover Recipes"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Discover Recipes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore a wide variety of recipes from around the world, suited for all skill levels and dietary preferences.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/?sharing-food"
              alt="Share Your Creations"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Share Your Creations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Show off your culinary skills by sharing your own recipes with the DishDabble community.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random/?food-community"
              alt="Join the Community"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Join the Community
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with fellow food lovers, exchange tips, and get inspired by the diverse DishDabble community.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h4" component="h2" sx={{ mt: 8, mb: 4 }}>
        Explore Recipes
      </Typography>
      <RecipeSearch />
      <RecipeList />
    </Container>
  );
};

export default HomePage;
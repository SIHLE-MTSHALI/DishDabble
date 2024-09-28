import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Container, Box } from '@mui/material';
import { styled } from '@mui/system';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://source.unsplash.com/random/?food)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const LandingPage = () => {
  return (
    <HeroSection>
      <Container maxWidth="md">
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to DishDabble
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Discover, share, and create delicious recipes with our community
        </Typography>
        <Box mt={4}>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Join Now
          </Button>
          <Button
            component={RouterLink}
            to="/recipes"
            variant="outlined"
            color="secondary"
            size="large"
          >
            Explore Recipes
          </Button>
        </Box>
      </Container>
    </HeroSection>
  );
};

export default LandingPage;
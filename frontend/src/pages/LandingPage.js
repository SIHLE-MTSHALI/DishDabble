import React from 'react';
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
          <Button variant="contained" color="primary" size="large">
            Join Now
          </Button>
          <Button variant="outlined" color="secondary" size="large" sx={{ ml: 2 }}>
            Explore Recipes
          </Button>
        </Box>
      </Container>
    </HeroSection>
  );
};

export default LandingPage;
import React from 'react';
import { Typography, Container, Box, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          DishDabble
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Discover, share, and create delicious recipes with our community
        </Typography>
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 3 }}>
          <Grid item>
            <Link component={RouterLink} to="/about" color="inherit">
              About
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/contact" color="inherit">
              Contact
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/terms" color="inherit">
              Terms of Service
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/privacy" color="inherit">
              Privacy Policy
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          {'Copyright © '}
          <Link color="inherit" href="https://dishdabble.com/">
            DishDabble
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

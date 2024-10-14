import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About DishDabble
        </Typography>
        <Typography variant="h6" gutterBottom>
          App Creators
        </Typography>
        <Typography paragraph>
          DishDabble was created by Sihle Mtshali and Xola Mthembu, two passionate Software Engineers dedicated to bringing people together through the love of food.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Sihle Mtshali
        </Typography>
        <Typography paragraph>
          Sihle is a full-stack developer with a passion for creating user-friendly and efficient web applications. With a background in computer science and years of experience in the industry, Sihle brings technical expertise and innovative problem-solving skills to the DishDabble team.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Xola Mthembu
        </Typography>
        <Typography paragraph>
          Xola is a software engineer specializing in backend development and database management. With a keen eye for detail and a love for optimizing systems, Xola ensures that DishDabble runs smoothly and securely, providing users with a seamless experience.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Our Mission
        </Typography>
        <Typography paragraph>
          At DishDabble, we believe that food has the power to bring people together. Our mission is to create a platform where food enthusiasts can discover new recipes, share their culinary creations, and connect with like-minded individuals from around the world.
        </Typography>
        <Typography paragraph>
          We're committed to fostering a community that celebrates diversity in cuisine and promotes the joy of cooking and sharing meals. Whether you're a seasoned chef or a kitchen novice, DishDabble is here to inspire your culinary journey.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;

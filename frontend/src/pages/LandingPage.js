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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Link,
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { fadeIn, slideInFromBottom, slideInFromLeft, slideInFromRight } from '../styles/animations';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LandingPage = () => {
  const userPosts = [
    { id: 1, username: 'foodie123', image: 'https://source.unsplash.com/random/400x300?food', caption: 'Delicious homemade pasta!', likes: 156, comments: 23 },
    { id: 2, username: 'chefmaster', image: 'https://source.unsplash.com/random/400x300?dessert', caption: 'Perfect chocolate soufflé', likes: 203, comments: 31 },
    { id: 3, username: 'healthyeats', image: 'https://source.unsplash.com/random/400x300?salad', caption: 'Fresh summer salad', likes: 178, comments: 19 },
  ];

  const recipeImages = [
    { image: 'https://source.unsplash.com/random/800x600?recipe', title: 'Gourmet Burger', difficulty: 'Medium', time: '30 mins' },
    { image: 'https://source.unsplash.com/random/800x600?cooking', title: 'Vegetarian Stir Fry', difficulty: 'Easy', time: '20 mins' },
    { image: 'https://source.unsplash.com/random/800x600?baking', title: 'Chocolate Lava Cake', difficulty: 'Hard', time: '45 mins' },
  ];

  const features = [
    { icon: <RestaurantIcon />, title: 'Recipe Discovery', text: 'Explore a vast collection of recipes from around the world, curated by our community of food enthusiasts and professional chefs.' },
    { icon: <PeopleIcon />, title: 'Social Cooking', text: 'Connect with fellow food lovers, share your culinary creations, and engage in cooking challenges and discussions.' },
    { icon: <TrendingUpIcon />, title: 'Trending Dishes', text: 'Stay updated with the latest food trends, seasonal recipes, and popular dishes in the DishDabble community.' },
    { icon: <SearchIcon />, title: 'Smart Search', text: 'Find recipes based on ingredients, dietary restrictions, cooking time, or skill level with our advanced search feature.' },
    { icon: <BookmarkIcon />, title: 'Personal Cookbook', text: 'Save your favorite recipes, create collections, and organize your culinary inspirations in your digital cookbook.' },
    { icon: <LocalOfferIcon />, title: 'Recipe Tagging', text: 'Easily categorize and find recipes with our comprehensive tagging system, covering cuisines, occasions, and dietary preferences.' },
  ];

  const recipeCategories = [
    { title: 'Quick & Easy', image: 'https://source.unsplash.com/random/300x200?quickmeal' },
    { title: 'Vegetarian Delights', image: 'https://source.unsplash.com/random/300x200?vegetarian' },
    { title: 'Decadent Desserts', image: 'https://source.unsplash.com/random/300x200?dessert' },
    { title: 'Healthy Options', image: 'https://source.unsplash.com/random/300x200?healthyfood' },
    { title: 'International Cuisine', image: 'https://source.unsplash.com/random/300x200?worldfood' },
    { title: 'Special Occasions', image: 'https://source.unsplash.com/random/300x200?feastfood' },
  ];

  const faqItems = [
    { question: 'How do I create an account?', answer: 'Click on the "Join Now" button and follow the simple registration process. You can sign up using your email or connect with your social media accounts.' },
    { question: 'Is DishDabble free to use?', answer: 'Yes, DishDabble is completely free to use. You can browse recipes, share your own, and interact with the community at no cost.' },
    { question: 'Can I modify or add my own recipes?', answer: 'Absolutely! You can easily add your own recipes or modify existing ones. Just click on "Add Recipe" in your profile to get started.' },
    { question: 'How does the recipe rating system work?', answer: 'Users can rate recipes on a scale of 1 to 5 stars. The overall rating is an average of all user ratings, helping you find the most loved recipes.' },
    { question: 'Are there options for dietary restrictions?', answer: 'Yes, you can filter recipes based on various dietary needs such as vegetarian, vegan, gluten-free, keto, and more.' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '3rem', md: '4.5rem' } }}>
          Unleash Your Inner Chef with DishDabble
        </Typography>
        <Typography variant="h4" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Your go-to platform for discovering, sharing, and mastering delicious recipes from around the world
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/register" size="large" sx={{ mr: 2, animation: `${slideInFromBottom} 0.5s ease-out`, fontSize: '1.2rem', py: 1.5, px: 4 }}>
            Join Now
          </Button>
          <Button variant="outlined" color="primary" component={RouterLink} to="/login" size="large" sx={{ animation: `${slideInFromBottom} 0.5s ease-out 0.2s`, fontSize: '1.2rem', py: 1.5, px: 4 }}>
            Log In
          </Button>
        </Box>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Featured Recipes
        </Typography>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
        >
          {recipeImages.map((recipe, index) => (
            <div key={index}>
              <img src={recipe.image} alt={recipe.title} style={{ maxHeight: '500px', objectFit: 'cover' }} />
              <div className="legend" style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '10px' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>{recipe.title}</Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>Difficulty: {recipe.difficulty} | Time: {recipe.time}</Typography>
              </div>
            </div>
          ))}
        </Carousel>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out 0.5s` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          How DishDabble Works
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: "Discover", text: "Browse through thousands of recipes or use our smart search to find exactly what you're craving." },
            { title: "Cook", text: "Follow step-by-step instructions, watch video tutorials, and use our interactive cooking timer." },
            { title: "Share", text: "Post photos of your culinary creations, write reviews, and share tips with the community." },
            { title: "Connect", text: "Follow your favorite chefs, join cooking challenges, and participate in foodie discussions." },
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, borderRadius: 4, boxShadow: 3 }}>
                <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>{index + 1}</Typography>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
                <Typography variant="body1" align="center">{step.text}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out 0.5s` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Discover DishDabble Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, borderRadius: 4, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: 'primary.main', fontSize: '2.5rem', mr: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{feature.title}</Typography>
                </Box>
                <Typography variant="body1">{feature.text}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${slideInFromLeft} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Explore Popular Recipe Categories
        </Typography>
        <Grid container spacing={3}>
          {recipeCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: 3, '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s' } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.title}
                />
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', bgcolor: 'rgba(0, 0, 0, 0.6)', color: 'white', p: 2 }}>
                  <Typography variant="h6">{category.title}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${slideInFromRight} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Join Our Vibrant Community
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3, p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Connect with Food Lovers</Typography>
              <Typography variant="body1" paragraph>
                DishDabble is more than just recipes – it's a community of passionate food enthusiasts. Share your culinary journey, get inspired by others, and make friends who share your love for good food.
              </Typography>
              <List>
                {['Follow your favorite chefs and home cooks', 'Participate in cooking challenges and competitions', 'Join discussion groups based on cuisines or dietary preferences', 'Attend virtual cooking classes and workshops'].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Latest Community Posts</Typography>
            <List>
              {userPosts.map((post) => (
                <ListItem key={post.id} sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 2 }}>
                  <Card sx={{ width: '100%', display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      image={post.image}
                      alt={post.caption}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>{post.username[0].toUpperCase()}</Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{post.username}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {post.caption}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {post.likes} likes • {post.comments} comments
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        {faqItems.map((item, index) => (
          <Accordion key={index} sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'primary.light' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ my: 8, animation: `${slideInFromLeft} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          DishDabble on the Go
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIphoneIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Mobile App</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Take DishDabble with you wherever you go! Our mobile app allows you to:
              </Typography>
              <List>
                {['Access recipes offline', 'Use voice commands for hands-free cooking', 'Scan ingredients to find matching recipes', 'Get personalized recipe recommendations'].map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>Download for iOS</Button>
                <Button variant="contained" color="secondary">Download for Android</Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: 0, paddingBottom: '177.78%' /* 16:9 aspect ratio */ }}>
              <img src="https://source.unsplash.com/random/600x800?smartphone" alt="DishDabble Mobile App" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {[
            { name: 'Sarah M.', role: 'Home Cook', text: "DishDabble has transformed the way I cook. I've found so many amazing recipes and made great friends!" },
            { name: 'Chef Alex', role: 'Professional Chef', text: "As a professional chef, I love sharing my recipes and getting inspiration from the community. DishDabble is a game-changer for culinary professionals." },
            { name: 'Mike T.', role: 'Food Blogger', text: "The variety of recipes on DishDabble is incredible. I've tried dishes from all over the world and it's greatly expanded my culinary horizons." },
            { name: 'Emily R.', role: 'Nutrition Student', text: "I appreciate how DishDabble includes nutritional information for recipes. It's been invaluable for my studies and personal meal planning." },
          ].map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 4, boxShadow: 3, p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                <CardContent>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 2 }}>
                    "{testimonial.text}"
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${slideInFromRight} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Awards and Recognition
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: 'Best Food App 2023', org: 'Tech Food Awards' },
            { title: 'Community Choice', org: 'Foodie Network' },
            { title: 'Innovation in Culinary Tech', org: 'Digital Gastronomy Summit' },
          ].map((award, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, borderRadius: 4, boxShadow: 3 }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>{award.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{award.org}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 8, animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 4 }}>
          Food Safety and Nutrition
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUserIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Food Safety First</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                At DishDabble, we prioritize food safety. Our recipes include important safety tips and proper handling instructions to ensure a safe cooking experience.
              </Typography>
              <List>
                {['Proper cooking temperatures', 'Food storage guidelines', 'Cross-contamination prevention', 'Allergen information'].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Nutritional Insights</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Make informed choices with our detailed nutritional information. Each recipe includes:
              </Typography>
              <List>
                {['Calorie count', 'Macronutrient breakdown', 'Vitamin and mineral content', 'Dietary tags (e.g., low-carb, high-protein)'].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 8, textAlign: 'center', animation: `${fadeIn} 1s ease-out` }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
          Ready to Start Your Culinary Journey?
        </Typography>
        <Typography variant="h5" paragraph color="text.secondary">
          Join DishDabble today and become part of a thriving community of food enthusiasts!
        </Typography>
        <Button variant="contained" color="primary" component={RouterLink} to="/register" size="large" sx={{ mt: 2, fontSize: '1.2rem', py: 1.5, px: 4 }}>
          Sign Up Now
        </Button>
      </Box>

      <Divider sx={{ my: 8 }} />

      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 DishDabble. All rights reserved. | <Link component={RouterLink} to="/privacy-policy">Privacy Policy</Link> | <Link component={RouterLink} to="/terms-of-service">Terms of Service</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;
import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const TermsOfServicePage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography paragraph>
          Welcome to DishDabble. By using our service, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing or using DishDabble, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          2. User Accounts
        </Typography>
        <Typography paragraph>
          To use certain features of DishDabble, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          3. Content
        </Typography>
        <Typography paragraph>
          Users are solely responsible for the content they post on DishDabble. By posting content, you grant DishDabble a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute that content.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          4. Prohibited Activities
        </Typography>
        <Typography paragraph>
          Users are prohibited from engaging in any unlawful or harmful activities on DishDabble, including but not limited to posting offensive content, infringing on intellectual property rights, or attempting to gain unauthorized access to our systems.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          5. Termination
        </Typography>
        <Typography paragraph>
          DishDabble reserves the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          6. Changes to Terms
        </Typography>
        <Typography paragraph>
          DishDabble reserves the right to modify or replace these Terms of Service at any time. It is your responsibility to check these terms periodically for changes.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          7. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about these Terms of Service, please contact us at legal@dishdabble.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfServicePage;

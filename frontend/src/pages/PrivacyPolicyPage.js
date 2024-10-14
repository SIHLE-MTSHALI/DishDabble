import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography paragraph>
          At DishDabble, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We collect information you provide directly to us, such as when you create an account, post content, or communicate with us. This may include your name, email address, and any other information you choose to provide.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on DishDabble.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          3. Information Sharing and Disclosure
        </Typography>
        <Typography paragraph>
          We do not sell or rent your personal information to third parties. We may share your information in limited circumstances, such as when required by law or to protect our rights.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          4. Data Security
        </Typography>
        <Typography paragraph>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          5. Your Rights
        </Typography>
        <Typography paragraph>
          You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          6. Cookies and Similar Technologies
        </Typography>
        <Typography paragraph>
          We use cookies and similar technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          7. Changes to This Policy
        </Typography>
        <Typography paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          8. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us at privacy@dishdabble.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicyPage;

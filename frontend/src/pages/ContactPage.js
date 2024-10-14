import React from 'react';
import { Typography, Container, Box, TextField, Button } from '@mui/material';

const ContactPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography paragraph>
          We'd love to hear from you! If you have any questions, suggestions, or just want to say hello, please feel free to reach out to us using the form below or via email.
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            required
            type="email"
          />
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            margin="normal"
            required
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Send Message
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Other Ways to Reach Us
          </Typography>
          <Typography>
            Email: support@dishdabble.com
          </Typography>
          <Typography>
            Address: 123 Foodie Street, Culinary City, 12345
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;

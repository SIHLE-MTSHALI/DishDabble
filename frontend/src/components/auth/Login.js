import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../actions/auth';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const Login = () => {
  console.log('Login component rendered');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Login component mounted or updated');
  }, []);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(`${e.target.name} changed:`, e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    dispatch(login(email, password));
  };

  const handleLogin = () => {
    console.log('Login button clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    dispatch(login(email, password));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
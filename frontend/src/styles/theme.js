import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E94B3C', // Rich Tomato Red
    },
    secondary: {
      main: '#2ECC71', // Fresh Leaf Green
    },
    background: {
      default: '#FDFEFE', // Creamy White
    },
    text: {
      primary: '#95A5A6', // Warm Grey
    },
    action: {
      active: '#F39C12', // Sunny Orange
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
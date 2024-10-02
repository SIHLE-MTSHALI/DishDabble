import { createTheme } from '@mui/material/styles';
import { fadeIn, slideInFromBottom, pulse, rotate, shimmer } from './animations';

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
      paper: '#FFFFFF',
    },
    text: {
      primary: '#95A5A6', // Warm Grey
      secondary: '#7F8C8D',
    },
    action: {
      active: '#F39C12', // Sunny Orange
    },
  },
  typography: {
    fontFamily: 'Montserrat, Lato, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '*': {
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          animation: `${fadeIn} 0.5s ease-in-out`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
          },
          animation: `${slideInFromBottom} 0.5s ease-in-out`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          animation: `${slideInFromBottom} 0.5s ease-in-out`,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animation: `${rotate} 1.5s linear infinite`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        bar: {
          animation: `${shimmer} 2s linear infinite`,
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '1000px 100%',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          animation: `${pulse} 2s infinite`,
        },
      },
    },
  },
});

export default theme;
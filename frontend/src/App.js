import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';

// Components
import LandingPage from './pages/LandingPage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import RecipeList from './components/recipes/RecipeList';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeForm from './components/recipes/RecipeForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<RecipeForm />} />
          <Route path="/edit-recipe/:id" element={<RecipeForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
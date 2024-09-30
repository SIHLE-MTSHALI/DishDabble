import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch } from 'react-redux';
import theme from './styles/theme';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeForm from './components/recipes/RecipeForm';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/routing/PrivateRoute';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Alert />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/post/:id" element={<RecipeDetail />} />
                <Route path="/create-post" element={<RecipeForm />} />
                <Route path="/edit-post/:id" element={<RecipeForm />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
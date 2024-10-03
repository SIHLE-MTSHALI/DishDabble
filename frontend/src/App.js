import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import theme from './styles/theme';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { initiateSocket, disconnectSocket, subscribeToNotifications } from './utils/socket';
import { addNotification } from './actions/notification';
import { updateRecipeLikes, updateRecipeComments } from './actions/recipe';
import { updateFollowers } from './actions/auth';

// Components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import TrendingPage from './pages/TrendingPage';
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
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      console.log('Initializing socket connection for user:', auth.user._id);
      initiateSocket(auth.user._id);
      
      subscribeToNotifications((err, data) => {
        if (err) {
          console.error('Error in socket subscription:', err);
          return;
        }
        
        console.log('Received socket event:', data);
        
        if (data.type === 'notification') {
          console.log('Dispatching addNotification');
          dispatch(addNotification(data.payload));
        } else if (data.type === 'recipeLiked') {
          console.log('Dispatching updateRecipeLikes');
          dispatch(updateRecipeLikes(data.payload.recipeId, data.payload.likes));
        } else if (data.type === 'recipeCommented') {
          console.log('Dispatching updateRecipeComments');
          dispatch(updateRecipeComments(data.payload.recipeId, data.payload.comments));
        } else if (data.type === 'followerUpdated') {
          console.log('Dispatching updateFollowers');
          dispatch(updateFollowers(data.payload.followers));
        }
      });
    }
    
    return () => {
      console.log('Disconnecting socket');
      disconnectSocket();
    };
  }, [auth.isAuthenticated, auth.user, dispatch]);

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
                <Route path="/search" element={<SearchPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/create-recipe" element={<RecipeForm />} />
                <Route path="/edit-recipe/:id" element={<RecipeForm />} />
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
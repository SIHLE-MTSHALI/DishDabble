import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from './App';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

test('renders learn react link', () => {
  const initialState = {
    auth: {
      token: null,
      isAuthenticated: false,
      loading: true,
      user: null
    },
    recipe: {
      recipes: [],
      recipe: null,
      loading: true,
      error: {}
    },
    alert: []
  };
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  const linkElement = screen.getByText(/DishDabble/i);
  expect(linkElement).toBeInTheDocument();
});
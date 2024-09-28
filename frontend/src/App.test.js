import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';

const mockStore = configureStore([]);

test('renders learn react link', () => {
  const initialState = {
    auth: {
      isAuthenticated: false,
      loading: false,
      user: null
    }
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
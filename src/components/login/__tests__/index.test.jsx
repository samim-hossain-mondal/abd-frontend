import React from 'react';
import {render, screen,waitFor} from '@testing-library/react';
import Login from '../index';

describe('Login', () => {
  it('should show logged in if user is logged in', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      oktaAuth: {
        signInWithRedirect: jest.fn(),
      },
      authState: {
        isAuthenticated: true,
      },
    }));
    render(<Login />);
    expect(screen.getByText('Logged in!')).toBeTruthy();
  });

  it('should show Loading... if user is not logged in', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      oktaAuth: {
        signInWithRedirect: jest.fn(),
      },
      authState: {
        isAuthenticated: false,
      },
    }));
    render(<Login />);
    waitFor(() => {
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });
});
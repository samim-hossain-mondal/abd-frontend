import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Login from '../index';

describe('Login', () => {
  it('should contain div with logged-in id if user is logged in', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      oktaAuth: {
        signInWithRedirect: jest.fn(),
      },
      authState: {
        isAuthenticated: true,
      },
    }));
    render(<Login />);
    expect(screen.getByTestId('logged-in')).toBeTruthy();
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

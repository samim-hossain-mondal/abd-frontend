import React from 'react';
import {render, screen} from '@testing-library/react';
import SecureRoute from '..';

describe('SecureRoute', () => {
  it('should show loading... when authState is false', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      oktaAuth: {
        signInWithRedirect: jest.fn(),
      },
      authState: {
        isAuthenticated: false,
      },
    }));
    jest.spyOn(React, 'useEffect').mockImplementation(() => {});
    render(<SecureRoute> <p>Hello World!!!</p> </SecureRoute>);
    expect(screen.getByText('loading ...')).toBeTruthy();
  });

  it('should show children when authState is true', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      oktaAuth: {
        signInWithRedirect: jest.fn(),
      },
      authState: {
        isAuthenticated: true,
      },
    }));
    jest.spyOn(React, 'useEffect').mockImplementation(() => {});
    render(<SecureRoute> <p>Hello World!!!</p> </SecureRoute>);
    expect(screen.getByText('Hello World!!!')).toBeTruthy();
  });
});
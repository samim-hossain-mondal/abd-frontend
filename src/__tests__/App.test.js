import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App'

describe('App',()=>{

  afterEach(cleanup);

  it('should render homepage by default',()=>{
    const { getByText } = render(
      <MemoryRouter initialEntries = {['/']}>
        <App/>
      </MemoryRouter>
    );
    expect(getByText('Welcome to Home page.')).toBeInTheDocument();
  });
});


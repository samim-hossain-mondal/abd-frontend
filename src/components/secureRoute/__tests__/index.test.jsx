import React from 'react';
import {render} from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { ProjectUserProvider } from '../../contexts/ProjectUserContext';
import { ErrorProvider } from '../../contexts/ErrorContext';
import SecureRoute from '..';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: jest.fn(),
}));

describe('SecureRoute', () => {
  it('should render', () => {
    useParams.mockReturnValue({projectId: '1'});
    useNavigate.mockReturnValue(jest.fn());
    useOktaAuth.mockReturnValue({
      authState: {
        isAuthenticated: true,
      }
    });
    
    const {container} = render(
      <ProjectUserProvider>
        <ErrorProvider>
          <SecureRoute>
            <div>Test</div>
          </SecureRoute>
        </ErrorProvider>
      </ProjectUserProvider>
    )
    expect(container).toMatchSnapshot();
  });
});
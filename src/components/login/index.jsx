import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Box } from '@mui/system';
import { LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HOME_ROUTE } from '../constants/routes';

function Loggedin() {
  const navigate = useNavigate();
  navigate(HOME_ROUTE);
}

function Login() {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => oktaAuth.signInWithRedirect();

  if (!authState) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!authState.isAuthenticated) {
    login();
  }

  return <Loggedin />;
}

export default Login;

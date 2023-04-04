import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Box } from '@mui/system';
import { LinearProgress } from '@mui/material';
import WelcomePage from '../welcomePage';

function Loggedin() {
  return <WelcomePage />;
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

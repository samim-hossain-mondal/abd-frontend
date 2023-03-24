import React, { useEffect, useState, useRef, useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Security, useOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import getAccessToken from './components/utilityFunctions/getAccessToken';
import MadeToStickContainer from './components/routes/MadeToStick';
import OurTeamsContainer from './components/routes/OurTeams';
import Navbar from './components/elements/NavBar'; 
import Login from './components/login';
import SecureRoute from './components/secureRoute';
import WelcomePage from './components/welcomePage';

import ScrollableHome from './components/routes/ScrollableHome'
import { CALENDAR_ROUTE, HOME_ROUTE, MADE_TO_STICK_ROUTE, OUR_TEAM_ROUTE, PO_NOTE_ROUTE, WELCOME_ROUTE } from './components/constants/routes';
import { ProjectUserContext } from './components/contexts/ProjectUserContext';
import { ErrorContext } from './components/contexts/ErrorContext';
import LoginCallbackPage from './components/elements/LoginCallbackPage';

const oktaAuth = new OktaAuth({
  issuer: `https://${process.env.REACT_APP_OCTA_DOMAIN}/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: `${window.location.origin}/login/callback`
});
const queryClient = new QueryClient();

export default function App() {
  const history = useNavigate();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}  >
      <AppRoutes />
    </Security>
  );
};

function AppRoutes() {
  const { authState } = useOktaAuth();
  const [authLoaded, setAuthLoaded] = useState(false);
  const poNotesRef = useRef(null);
  const dsmRef = useRef(null);
  const availabilityCalendarRef = useRef(null);
  const { updateUserDetails, projectId } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const setAxiosHeader = async () => {
    if (!authState) {
      axios.defaults.headers.common.Authorization = null;
      return;
    }
    const accessToken = await getAccessToken(authState);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setAuthLoaded(true);
    await updateUserDetails(setError, setSuccess);
    console.log("projectId >>>", projectId);
  };

  useEffect(() => {
    setAxiosHeader();
  }, [authState]);

  const handleScroll = (ref) => {
    ref.current.scrollIntoView();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box className="App">
        {authLoaded && window.location.pathname !== '/welcome' && (
        <Box>
          <Navbar authLoaded={authLoaded} />
        </Box>
        )}
        <Routes>
          <Route path='/' exact element={<Login />} />
          <Route path={`/:projectId${HOME_ROUTE}`} exact element={<SecureRoute>{authLoaded && <ScrollableHome poNotesRef={poNotesRef} dsmRef={dsmRef} availabilityCalendarRef={availabilityCalendarRef} handleScroll={handleScroll} scrollTo='dsm' />}</SecureRoute>} />
          <Route path={`/:projectId${MADE_TO_STICK_ROUTE}`} exact element={<SecureRoute>{authLoaded && <MadeToStickContainer />}</SecureRoute>} />
          <Route path={`/:projectId${OUR_TEAM_ROUTE}`} exact element={<SecureRoute>{authLoaded && <OurTeamsContainer />}</SecureRoute>} />
          <Route path={`/:projectId${PO_NOTE_ROUTE}`} exact element={<SecureRoute>{authLoaded && <ScrollableHome poNotesRef={poNotesRef} dsmRef={dsmRef} availabilityCalendarRef={availabilityCalendarRef} handleScroll={handleScroll} scrollTo='poNotes' />}</SecureRoute>} />
          <Route path={`/:projectId${CALENDAR_ROUTE}`} exact element={<SecureRoute>{authLoaded && <ScrollableHome poNotesRef={poNotesRef} dsmRef={dsmRef} availabilityCalendarRef={availabilityCalendarRef} handleScroll={handleScroll} scrollTo='availabilityCalendar' />}</SecureRoute>} />
          <Route path={WELCOME_ROUTE} element={<SecureRoute welcome>{authLoaded && < WelcomePage />}</SecureRoute>} />
          <Route path='/login/callback' element={<LoginCallbackPage />} />
          <Route path='*' element={<h1>404: Not Found</h1>} />
        </Routes>
      </Box>
    </QueryClientProvider >
  );
}
import React, { useEffect, useState, useRef, useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Security, useOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import getAccessToken from './components/utilityFunctions/getAccessToken';
// import HomeContainer from './components/routes/Home';
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
import TeamInformation from './components/teamInformation/TeamInformations';


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
  // const navigate = useNavigate();
  const { authState } = useOktaAuth();
  const [authLoaded, setAuthLoaded] = useState(false);
  const poNotesRef = useRef(null);
  const dsmRef = useRef(null);
  const availabilityCalendarRef = useRef(null);

  const { updateUserDetails } = useContext(ProjectUserContext);
  
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

          <Route path='/home' exact element={<SecureRoute>{authLoaded && <HomeContainer />}</SecureRoute>} />
          <Route path='/announcements' exact element={<SecureRoute>{authLoaded && <AnnouncementContainer />}</SecureRoute>} />
          <Route path='/information-radiators' exact element={<SecureRoute>{authLoaded && <InformationRadiatorContainer />}</SecureRoute>} />
          <Route path='/our-teams' exact element={<SecureRoute>{authLoaded && <OurTeamsContainer />}</SecureRoute>} />
          <Route path='/po-notes' exact element={<SecureRoute>{authLoaded && <PONotesContainer />}</SecureRoute>} />
          <Route path='/reference-material' exact element={<SecureRoute>{authLoaded && <RefMaterialsContainer />}</SecureRoute>} />
          <Route path='/availability-calendar' exact element={<SecureRoute>{authLoaded && <AvailabilityCalendar />}</SecureRoute>} />
          <Route path='/login/callback' element={<LoginCallback />} />
          {/* <Route path='*' element={<SecureRoute><h1>404: Not Found</h1></SecureRoute>} /> */}
          <Route path='*' element={<h1>404: Not Found</h1>} />
        </Routes>
      </Box>
    </QueryClientProvider >
  );
}
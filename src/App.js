import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Security, LoginCallback, useOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import getAccessToken from './components/utilityFunctions/getAccessToken';
import HomeContainer from './components/routes/Home';
import AnnouncementContainer from './components/routes/Announcements';
import InformationRadiatorContainer from './components/routes/InformationRadiator';
import OurTeamsContainer from './components/routes/OurTeams';
import PONotesContainer from './components/routes/PONotes';
import RefMaterialsContainer from './components/routes/RefMaterials';
import AvailabilityCalendar from './components/routes/availabilityCalendar';
import Navbar from './components/elements/NavBar';
import Login from './components/login';
import SecureRoute from './components/secureRoute';


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
  const setAxiosHeader = async () => {
    if (!authState) {
      axios.defaults.headers.common.Authorization = null;
      return;
    }
    const accessToken = await getAccessToken(authState);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setAuthLoaded(true);
  };

  useEffect(() => {
    setAxiosHeader();
  }, [authState]);

  return (
    <QueryClientProvider client={queryClient}>
      <Box className="App">
        <Box>
          <Navbar />
        </Box>
        <Routes>
          <Route path='/' exact element={<Login />} />
          {
            (authLoaded) && (
              <>
                <Route path='/home' exact element={<SecureRoute><HomeContainer /></SecureRoute>} />
                <Route path='/announcements' exact element={<SecureRoute><AnnouncementContainer /></SecureRoute>} />
                <Route path='/information-radiators' exact element={<SecureRoute><InformationRadiatorContainer /></SecureRoute>} />
                <Route path='/our-teams' exact element={<SecureRoute><OurTeamsContainer /></SecureRoute>} />
                <Route path='/po-notes' exact element={<SecureRoute><PONotesContainer /></SecureRoute>} />
                <Route path='/reference-material' exact element={<SecureRoute><RefMaterialsContainer /></SecureRoute>} />
                <Route path='/availability-calendar' exact element={<SecureRoute><AvailabilityCalendar /></SecureRoute>} />
              </>
            )
          }
          <Route path='/login/callback' element={<LoginCallback />} />
          <Route path='*' element={<h1>404: Not Found</h1>} />
        </Routes>
      </Box>
    </QueryClientProvider >
  );
}
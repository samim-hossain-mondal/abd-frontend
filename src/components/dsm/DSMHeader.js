import React from 'react';
import {
  AppBar, Typography, Box, useMediaQuery
} from '@mui/material';
import InformationModel from '../elements/InformationModel';

export default function DSMHeader() {
  const breakPoint510 = useMediaQuery('(max-width:510px)');
  const breakpoint391 = useMediaQuery('(min-width:391px)');
  return (
    <Box>
      <Box sx={{ backgroundColor: 'primary.light', padding: '5px' }} />
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }} >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: breakPoint510 ? '15px 5px 15px 5px' : '25px 50px 25px 50px' }}>
          <Box display="flex" justifyContent="flex-start" alignItems='center' width="100%">
            <Typography
              data-testid="poNotesIdentifier"
              variant="h5"
              noWrap
              sx={{ display: 'flex', alignItems: 'center', gap: breakpoint391 ? '4px' : "2px", fontWeight: 500, letterSpacing: '.025rem', color: 'secondary.main', textDecoration: 'none', width:'100%' }}
            >
              Daily Activity
              <InformationModel
                heading="Daily Activity"
                definition=" is the core feature of My Agile Board to maintain team collaboration and morale by facilitating Sentiment Meter, Daily Standup, and Daily retro board, Team requests, and PO Reminders."
                accessibilityInformation=""
              />
            </Typography>
          </Box>
        </Box>
      </AppBar>
    </Box >
  );
};

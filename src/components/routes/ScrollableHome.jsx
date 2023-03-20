import React from 'react';
import { Box } from '@mui/material';
import HomeContainer from './Home';
import PONotesContainer from './PONotes';
import AvailabilityCalendar from './availabilityCalendar';

export default function ScrollableHome() {
  return (
    <Box>
      <HomeContainer />
      <PONotesContainer />
      <AvailabilityCalendar />
    </Box>
  )
};
import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import HomeContainer from './Home';
import PONotesContainer from './PONotes';
import AvailabilityCalendar from './availabilityCalendar';

export default function ScrollableHome({poNotesRef, dsmRef, availabilityCalendarRef}) {
  return (
    <Box>
      <HomeContainer dsmRef={dsmRef}/>
      <PONotesContainer poNotesRef={poNotesRef}/>
      <AvailabilityCalendar availabilityCalendarRef={availabilityCalendarRef}/>
    </Box>
  )
};

ScrollableHome.propTypes = {
  poNotesRef: PropTypes.instanceOf(React.createRef),
  dsmRef: PropTypes.instanceOf(React.createRef),
  availabilityCalendarRef: PropTypes.instanceOf(React.createRef),
};

ScrollableHome.defaultProps = {
  poNotesRef: React.createRef(),
  dsmRef: React.createRef(),
  availabilityCalendarRef: React.createRef(),
};
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import HomeContainer from './Home';
import PONotesContainer from './PONotes';
import AvailabilityCalendar from './availabilityCalendar';

export default function ScrollableHome({poNotesRef, dsmRef, availabilityCalendarRef, handleScroll,scrollTo}) {
  useEffect(()=>{
  
    switch (scrollTo) {
      case 'poNotes':
        handleScroll(poNotesRef);
        break;
      case 'dsm':
        handleScroll(dsmRef);
        break;
      case 'availabilityCalendar':  
        handleScroll(availabilityCalendarRef);
        break;
      default:
        break;
    };
  },[scrollTo]);
  return (
    <Box>
      <div ref={dsmRef}>
        <HomeContainer />
      </div>
      <div ref={poNotesRef}>
        <PONotesContainer/>
      </div>
      <div ref={availabilityCalendarRef}>
        <AvailabilityCalendar/>
      </div>
    </Box>
  );
};


ScrollableHome.propTypes = {
  poNotesRef: PropTypes.instanceOf(Object),
  dsmRef: PropTypes.instanceOf(Object),
  availabilityCalendarRef: PropTypes.instanceOf(Object),
  handleScroll: PropTypes.func,
  scrollTo: PropTypes.string.isRequired,
};

ScrollableHome.defaultProps = {
  poNotesRef: null,
  dsmRef: null,
  availabilityCalendarRef: null,
  handleScroll: {
    current: null,
  },
};
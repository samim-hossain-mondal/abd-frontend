import React, { useEffect, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import HomeContainer from './Home';
import PONotesContainer from './PONotes';
import AvailabilityCalendar from './availabilityCalendar';
import DSMViewportContext from '../contexts/DSMViewportContext';
import PONotesViewportContext from '../contexts/PONotesViewportContext';

function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting),
      ),
    [],
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
export default function ScrollableHome({poNotesRef, dsmRef, availabilityCalendarRef, handleScroll,scrollTo}) {
  const dsmIsInViewPort = useIsInViewport(dsmRef);
  const poNotesIsInViewPort = useIsInViewport(poNotesRef);

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
        <DSMViewportContext.Provider value={dsmIsInViewPort}>
          <HomeContainer dsmIsInViewPort={dsmIsInViewPort}/>
        </DSMViewportContext.Provider>
      </div>
      <div ref={poNotesRef}>
        <PONotesViewportContext.Provider value={poNotesIsInViewPort}>
          <PONotesContainer poNotesIsInViewPort={poNotesIsInViewPort}/>
        </PONotesViewportContext.Provider>
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
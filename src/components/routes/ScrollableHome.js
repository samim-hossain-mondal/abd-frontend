import React, { useEffect, useState, useMemo } from 'react';
// import { useLocation } from 'react-router';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import HomeContainer from './Home';
import PONotesContainer from './PONotes';
import AvailabilityCalendar from './availabilityCalendar';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { RefreshContextProvider } from '../contexts/RefreshContext';
import PONotesViewportContext from '../contexts/PONotesViewportContext';
import FabRefresh from '../utilityFunctions/FabRefresh';
// import getRoute from '../utilityFunctions/getRoute';
// import {  DAILY_PAGE_NAME } from '../constants/routes';
// import { ProjectUserContext } from '../contexts/ProjectUserContext';
// import MobileTabs from '../elements/MobileTabs';

function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
export default function ScrollableHome({
  poNotesRef,
  dsmRef,
  availabilityCalendarRef,
  handleScroll,
  scrollTo,
}) {
  const dsmIsInViewPort = useIsInViewport(dsmRef);
  const poNotesIsInViewPort = useIsInViewport(poNotesRef);
  const availabilityIsInViewPort = useIsInViewport(availabilityCalendarRef);

  useEffect(() => {
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
    }
  }, [scrollTo]);

  // const { projectId } = useContext(ProjectUserContext)
  // const location = useLocation();
  // const aboveTablet = useMediaQuery('(min-width: 769px)');
  // const showMobileTabs = (location.pathname === getRoute(DAILY_PAGE_NAME, projectId))
  // const sections = [
  //   { name: 'Daily Retro', ref: dsmRef },
  //   { name: 'PO Notes', ref: poNotesRef },
  //   { name: 'Availability Calendar', ref: availabilityCalendarRef },
  // ];


  return (
    <RefreshContextProvider>
      {/* {(!aboveTablet) && (showMobileTabs) && (
        <MobileTabs 
          sections={sections}
        />)} */}
      <Box>
        <div ref={dsmRef}>
          <DSMViewportContext.Provider value={dsmIsInViewPort}>
            <HomeContainer />
          </DSMViewportContext.Provider>
        </div>
        <div ref={poNotesRef}>
          <PONotesViewportContext.Provider value={poNotesIsInViewPort}>
            <PONotesContainer />
          </PONotesViewportContext.Provider>
        </div>
        <div ref={availabilityCalendarRef}>
          <AvailabilityCalendar availabilityIsInViewPort={availabilityIsInViewPort} />
        </div>
        <FabRefresh
          poNotesIsInViewPort={poNotesIsInViewPort}
          dsmIsInViewPort={dsmIsInViewPort}
          availabilityIsInViewPort={availabilityIsInViewPort}
        />
      </Box>
    </RefreshContextProvider>
  );
}

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

ScrollableHome.defaultProps = {
  poNotesRef: null,
  dsmRef: null,
  availabilityCalendarRef: null,
  handleScroll: {
    current: null,
  },
};
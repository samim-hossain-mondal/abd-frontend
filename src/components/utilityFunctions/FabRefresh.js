import React, {useContext} from 'react';
import {Fab} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';
import { RefreshContext } from '../contexts/RefreshContext';

export default function FabRefresh({poNotesIsInViewPort, dsmIsInViewPort, availabilityIsInViewPort}) {
  const {refresh,setRefresh} = useContext(RefreshContext);
  const handleRefresh = () => {
    setRefresh({
      poNotes: poNotesIsInViewPort,
      sentiment: dsmIsInViewPort,
      request: dsmIsInViewPort,
      announcement: dsmIsInViewPort,
      celebration: dsmIsInViewPort,
      availabilityCalendar: availabilityIsInViewPort,
    })
  }
  console.log('FabRefresh: refresh', refresh);

  return (
    <Fab color="primary" aria-label="refresh" onClick={handleRefresh} sx={{
      position: 'sticky',
      bottom: 16,
      left: '99%',
    }}>
      <RefreshIcon />
    </Fab>
  );
};

FabRefresh.propTypes = {
  poNotesIsInViewPort: PropTypes.bool,
  dsmIsInViewPort: PropTypes.bool,
  availabilityIsInViewPort: PropTypes.bool,
};

FabRefresh.defaultProps = {
  poNotesIsInViewPort: false,
  dsmIsInViewPort: false,
  availabilityIsInViewPort: false,
};
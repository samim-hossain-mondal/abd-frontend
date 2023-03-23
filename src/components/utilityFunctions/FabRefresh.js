import React, {useContext} from 'react';
import {Box,Fab} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';
import { RefreshContext } from '../contexts/RefreshContext';

export default function FabRefresh({poNotesIsInViewPort, dsmIsInViewPort, availabilityIsInViewPort}) {
  const {setRefresh} = useContext(RefreshContext);
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

  return (
    <Box sx={{position: 'sticky', bottom: '1%', left: '99%', width: '65px', justifyContent: 'center'}}>
      <Fab color="primary" aria-label="refresh" onClick={handleRefresh}>
      <RefreshIcon />
    </Fab>
    </Box>
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
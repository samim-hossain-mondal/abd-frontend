import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import DSMHeader from '../dsm/DSMHeader';
import DSMBody from '../dsm/DSMBody';

import { DSMBodyLayoutProvider } from '../contexts/DSMBodyLayoutContext';

export default function HomeContainer({dsmRef}) {
  return (
    <Box ref={dsmRef}>
      <DSMHeader />
      <DSMBodyLayoutProvider>
        <DSMBody />
      </DSMBodyLayoutProvider>
    </Box>
  );
}

HomeContainer.propTypes = {
  dsmRef: PropTypes.instanceOf(Object),
};

HomeContainer.defaultProps = {
  dsmRef: null,
};
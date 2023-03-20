import React from 'react';
import { Box } from '@mui/material';
import DSMHeader from '../dsm/DSMHeader';
import DSMBody from '../dsm/DSMBody';

import { DSMBodyLayoutProvider } from '../contexts/DSMBodyLayoutContext';

export default function HomeContainer() {
  return (
    <Box>
      <DSMHeader />
      <DSMBodyLayoutProvider>
        <DSMBody />
      </DSMBodyLayoutProvider>
    </Box>
  );
}
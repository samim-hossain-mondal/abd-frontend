import React from 'react';
import { Box } from '@mui/material';
import DSMHeader from '../dsm/DSMHeader';
import DSMBody from '../dsm/DSMBody';

import { DSMBodyLayoutProvider } from '../contexts/DSMBodyLayoutContext';

export default function HomeContainer() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDate = (date) => {
    setSelectedDate(date);
  };
  return (
    <Box>
      <DSMHeader handleDate={handleDate} />
      <DSMBodyLayoutProvider > <DSMBody selectedDate={selectedDate} /> </DSMBodyLayoutProvider>
    </Box>
  );
}
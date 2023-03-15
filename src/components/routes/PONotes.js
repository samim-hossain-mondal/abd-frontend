import React from 'react';
import { Box } from '@mui/material';
import PONotesBody from '../poNotesComponents/PONotesBody';
import PONotesHeader from '../poNotesComponents/PONotesHeader';

export default function PONotesContainer() {
  const [query, setQuery] = React.useState({});

  return (
    <Box>
      <Box>
        <PONotesHeader query={query} setQuery={setQuery} />
      </Box>
      <Box > <PONotesBody query={query} /> </Box>
    </Box>
  );
};
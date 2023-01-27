import React from 'react';

import Box from '@mui/material/Box';

import Navbar from '../dumbComponents/navBar'
import PoNotesBody from '../poNotesComponents/poNotesBody';
import PoNotesHeader from '../poNotesComponents/poNotesHeader';

function poNotesContainer() {
  return (
    <Box>
      <Box> <Navbar /> </Box>
      <Box> <PoNotesHeader /> </Box>
      <Box> <PoNotesBody /> </Box>
    </Box>
  );
};

export default poNotesContainer;
import React from 'react';

import Box from '@mui/material/Box';

import Navbar from '../dumbComponents/navBar'
import PoNotesBody from '../poNotesComponents/poNotesBody';
import PoNotesHeader from '../poNotesComponents/poNotesHeader';

function PoNotesContainer() {
  return (
    <Box>
      <Box> <Navbar /> </Box>
      <Box> <PoNotesHeader /> </Box> <br /> <br /> <br />
      <Box> <PoNotesBody /> </Box>
    </Box>
  );
};

export default PoNotesContainer;
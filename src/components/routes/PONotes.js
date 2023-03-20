import React,{useState} from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import PONotesBody from '../poNotesComponents/PONotesBody';
import PONotesHeader from '../poNotesComponents/PONotesHeader';

export default function PONotesContainer({poNotesRef}) {
  const [query, setQuery] = useState({});

  return (
    <Box ref={poNotesRef}>
      <Box>
        <PONotesHeader query={query} setQuery={setQuery} />
      </Box>
      <Box > <PONotesBody query={query} /> </Box>
    </Box>
  );
};

PONotesContainer.propTypes = {
  poNotesRef: PropTypes.instanceOf(Object),
};

PONotesContainer.defaultProps = {
  poNotesRef: null,
};
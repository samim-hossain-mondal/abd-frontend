import React from 'react';
import PropTypes from 'prop-types';
import { Box, List, ListItem, TextField, Typography } from '@mui/material';

export default function Timeline({ isSubmit, timeline, setTimeline }) {
  const handleTimeline = (e) => {
    setTimeline(e.target.value);
  };
  return (
    <Box disabled>
      <Typography sx={{ fontWeight: 700, ml: '15px', pt: '8px' }}> Timeline
        <Box sx={{ display: 'inline', fontSize: '0.75rem' }}> (optional)</Box>
      </Typography>
      <List>
        <ListItem sx={{ pt: 0, pb: 0 }}>
          <TextField id="date" label="Select date" type="date"
            disabled={isSubmit} defaultValue={timeline} sx={{ width: '300px' }}
            InputLabelProps={{ shrink: true }} onChange={handleTimeline}
          />
        </ListItem>
      </List>
    </Box>
  );
}
Timeline.propTypes = {
  isSubmit: PropTypes.bool.isRequired,
  timeline: PropTypes.string.isRequired,
  setTimeline: PropTypes.func.isRequired
};
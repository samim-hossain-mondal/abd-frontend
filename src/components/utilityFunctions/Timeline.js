import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, List, ListItem, TextField } from '@mui/material';

export default function Timeline({ isSubmit, timeline, setTimeline }) {
  const handleTimeline = (e) => {
    setTimeline(e.target.value);
  };
  return (
    <Box disabled>
      <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '2px' }}>Timeline</Typography>
      <List>
        <ListItem>
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
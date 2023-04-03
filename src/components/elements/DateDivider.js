import React from 'react';
import { Button, Divider } from '@mui/material';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';

export default function DateDivider({ dateGroupName, sx }) {
  return (
    <Box sx={sx}>
      <Divider>
        <Button variant="contained" disabled
          sx={{
            height: "24px",
            fontSize: "10px",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}>
          {dateGroupName}
        </Button>
      </Divider>
    </Box >
  );
}

DateDivider.propTypes = {
  dateGroupName: PropTypes.instanceOf(Date).isRequired,
  sx: {}.isRequired,
};
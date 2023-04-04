import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';

export default function DateDivider({ dateGroupName, sx }) {
  return (
    <Box sx={sx}>
      <Divider>
        <Box
          sx={{
            height: "24px",
            borderStyle: "solid",
            borderColor: "grey.300",
            borderRadius: "8px",
            backgroundColor: "grey.100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              textTransform: "capitalize",
              fontWeight: 700,
              padding: '8px',
              color: 'grey.700'
            }}>
            {dateGroupName}
          </Typography>
        </Box>
      </Divider>
    </Box >
  );
}

DateDivider.propTypes = {
  dateGroupName: PropTypes.instanceOf(Date).isRequired,
  sx: {}.isRequired,
};
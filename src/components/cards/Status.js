import React from 'react'
import { Typography, Box } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { PropTypes } from 'prop-types';

function Status(props) {
  const { colour, status } = props;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: "center" }}>
      <Brightness1Icon sx={{ color: colour, height: 16 }} />
      <Typography ml={1} sx={{ fontSize: 12 }}>{status}</Typography>
    </Box>
  )
};
Status.propTypes = {
  colour: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
export default Status
import React from 'react';
import { Box } from '@mui/system';
import { Grid, IconButton, Typography } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import { PropTypes } from 'prop-types';

export default function CustomDropDown({ isMenu, value, openDropDown, setOpenDropDown, handleChange }) {

  return (<Box
    boxShadow={isMenu ? 'none' : '0px 30px 60px rgba(32, 56, 85, 0.15)'}
    border={isMenu ? '1px solid #E5E5E5' : 'none'}
    marginTop={isMenu ? '0px' : '10px'}
    borderRadius={isMenu ? '0px' : '8px'}
    sx={{
      cursor: 'pointer',
      height: '60px',
      ':hover': {
        opacity: '0.8',
        backgroundColor: '#d1d1d1',
      }
    }}
    onClick={() => handleChange(value)}>
    <Grid container spacing={1} sx={{ padding: '5px', paddingLeft: '10px', height: '100%' }} role="button" onClick={() => setOpenDropDown(!openDropDown)}>
      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <SegmentRoundedIcon sx={{
          WebkitTransform: 'scaleX(-1)',
          transform: 'scaleX(-1)'
        }} />
      </Grid>
      <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{value}</Typography>
      </Grid>
      {!isMenu &&
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          {openDropDown ?
            <IconButton>
              <ArrowDropUpRoundedIcon />
            </IconButton> :
            <IconButton>
              <ArrowDropDownRoundedIcon />
            </IconButton>
          }
        </Grid>}
    </Grid>
  </Box >
  )
}

CustomDropDown.propTypes = {
  isMenu: PropTypes.bool,
  value: PropTypes.string,
  openDropDown: PropTypes.bool,
  setOpenDropDown: PropTypes.func,
  handleChange: PropTypes.func,
}

CustomDropDown.defaultProps = {
  isMenu: false,
  value: '',
  openDropDown: false,
  setOpenDropDown: () => { },
  handleChange: () => { },
}
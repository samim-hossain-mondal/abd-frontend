import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PropTypes } from 'prop-types'
import React from 'react'

export default function InstructionBox({ header, points }) {
  return (
    <Box sx={{ margin: '15px 0' }}>
      <Typography variant='contentMain' sx={{
        'font-weight': 500,
        'font-size': '16px',
      }}>{header}</Typography>
      <Box sx={{ padding: '10px 0 10px 15px' }}>
        {points.map((point, index) => (
          <Typography variant='contentMain' >{index + 1}. {point} <br /></Typography>
        ))}
        {/* <Typography variant='contentMain' >1. Try not to be personal.</Typography>
        <br />
        <Typography variant='contentMain' >2. Seek attention to the core issue by highlighting the impact.</Typography> */}
      </Box>
    </Box>
  )
}

InstructionBox.propTypes = {
  header: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.string)
}

// default props
InstructionBox.defaultProps = {
  header: '',
  points: []
}



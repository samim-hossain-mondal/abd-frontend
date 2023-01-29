import React from 'react'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import PONotesInformationModel from './PONotesInformationModel'

export default function KeyDecisionsHeader(props) {
  const { countOfItems } = props;
  const heading = 'Key Decisions';
  const definition = ' are the vital outcomes/decisions from the various discussions that PO has been part of.';
  const accessibiltyInformation = 'PO is the owner of this section only PO can add or edit these entries.';
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center'
    }} ><Typography style={{
      fontFamily: 'Roboto',
      fontSize: '18px',
      lineHeight: '20px'
    }}
      sx={{
        color: "#FFFFFF",
        paddingRight: '5px'
      }}>
        KEY DECISIONS
        ({countOfItems})
      </Typography>
      <PONotesInformationModel heading={heading}
        definition={definition}
        accessibiltyInformation={accessibiltyInformation} />
    </Box>
  )
}

KeyDecisionsHeader.propTypes = {
  countOfItems: PropTypes.number.isRequired
}
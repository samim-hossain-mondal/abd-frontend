import React from 'react'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import PONotesInformationModel from './PONotesInformationModel'

export default function AgendaItemsTableHeader(props) {
  const { countOfItems } = props;
  const heading = 'Agenda Items';
  const definition = ' are the questions that the PO wanted to ask  the team members and the  leadership to derive some actions or decisions.'
  const accessibiltyInformation = '  PO is the owner of this section only PO can add or edit these entries.';
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
        AGENDA ITEMS
        ({countOfItems})
      </Typography>
      <PONotesInformationModel heading={heading}
        definition={definition}
        accessibiltyInformation={accessibiltyInformation} />
    </Box>
  )
}

AgendaItemsTableHeader.propTypes = {
  countOfItems: PropTypes.number.isRequired
}
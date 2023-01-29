import React from 'react'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import PONotesInformationModel from './PONotesInformationModel'

export default function ActionItemsHeader(props) {
  const { countOfItems } = props;
  const heading = 'Action Items';
  const definition = ' are the tasks that the Product Owner(PO) has to do in order to unblock the team, and can be linked to an issue in the Project management tool such as Jira.';
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
        ACTION ITEMS
        ({countOfItems})
      </Typography>
      <PONotesInformationModel heading={heading}
        definition={definition}
        accessibiltyInformation={accessibiltyInformation} />
    </Box>
  )
}

ActionItemsHeader.propTypes = {
  countOfItems: PropTypes.number.isRequired
}
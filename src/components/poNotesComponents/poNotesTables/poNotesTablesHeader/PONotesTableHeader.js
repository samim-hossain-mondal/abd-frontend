import React from 'react'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import InformationModel from '../../../elements/InformationModel';

export default function PONotesTableHeader(props) {
  // countOfItems is the number of items in the table
  const { countOfItems, definition, heading, accessibilityInformation } = props;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant='h6'>
        {heading.toUpperCase()}{' '}
        ({countOfItems})
      </Typography>
      {/* The information model displaying the information about Action Item is called here and information 
      about Action items (heading, definition and accessibility information) are passed as props */}
      <InformationModel heading={heading}
        definition={definition}
        accessibiltyInformation={accessibilityInformation} />
    </Box>
  )
}
// props validation
PONotesTableHeader.propTypes = {
  countOfItems: PropTypes.number.isRequired,
  definition: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  accessibilityInformation: PropTypes.string.isRequired,
}
import React from 'react'
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import InformationModel from '../../../elements/InformationModel';
import { agendaItems } from '../../../constants/PONotes';

export default function PONotesTableHeader(props) {
  const { countOfItems, definition, heading, accessibilityInformation } = props;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {
        (heading === agendaItems.heading) ? (
          <Typography variant='h6'>
            {agendaItems.subHeading.toUpperCase()}{' '}
            ({countOfItems})
          </Typography>
        ) : (
          <Typography variant='h6'>
            {heading.toUpperCase()}{' '}
            ({countOfItems})
          </Typography>
        )
      }
      {
        (heading === agendaItems.heading) ? (
          <InformationModel heading={agendaItems.subHeading}
            definition={definition}
            accessibiltyInformation={accessibilityInformation} />
        ) : (
          <InformationModel heading={heading}
            definition={definition}
            accessibiltyInformation={accessibilityInformation} />
        )
      }
    </Box>
  )
}

PONotesTableHeader.propTypes = {
  countOfItems: PropTypes.number.isRequired,
  definition: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  accessibilityInformation: PropTypes.string.isRequired,
}
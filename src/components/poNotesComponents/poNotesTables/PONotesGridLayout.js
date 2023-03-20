import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import PONotesTable from './PONotesTable';
import { actionItems, keyDecisions, agendaItems } from '../../constants/PONotes';

export default function PONotesGridLayout({ query }
) {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  return (
    // grid layout for the three tables
    <Box
      sx={{
        display: 'flex', flexDirection: (breakpoint1080)?'row':'column', flexWrap: 'nowrap',
        gap: '5vh', justifyContent:'space-around', padding: '50px 50px 50px 50px',
        alignItems: 'center',
      }}>

      {/* Table for action items */}
        <PONotesTable heading={actionItems.heading}
          checkBox
          definition={actionItems.definition}
          accessibilityInformation={actionItems.accessibilityInformation}
          query={query} />

        {/* Table for key decisions */}
        <PONotesTable heading={keyDecisions.heading}
          checkBox={false}
          definition={keyDecisions.definition}
          accessibilityInformation={keyDecisions.accessibilityInformation}
          query={query} />

        {/* Table for agenda items */}
        <PONotesTable
          heading={agendaItems.heading}
          checkBox
          definition={agendaItems.definition}
          accessibilityInformation={agendaItems.accessibilityInformation}
          query={query} />
    </Box>
  );
}

PONotesGridLayout.propTypes = {
  query: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
};
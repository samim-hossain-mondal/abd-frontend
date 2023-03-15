import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import PONotesGridLayout from './poNotesTables/PONotesGridLayout';

export default function PONotesBody({ query }) {
  return (
    <Grid >
      <Grid backgroundColor='backgroundColor.main' height='100%'>
        <PONotesGridLayout query={query} />
      </Grid>
    </Grid >
  )
}

PONotesBody.propTypes = {
  query: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
}
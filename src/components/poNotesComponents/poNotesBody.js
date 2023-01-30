import * as React from 'react';
import Grid from '@mui/material/Grid';
import PONotesGridLayout from './PONotesTables/PONotesGridLayout'

export default function poNotesBody() {
  return (
    <Grid>
      <Grid sx={{
        minWidth: "100%",
        height: "100vh", backgroundColor: '#E6EEF2'
      }}><PONotesGridLayout /></Grid>
    </Grid>
  )
}
import { React, useContext } from 'react';
import {
  Grid, Box, useMediaQuery
} from '@mui/material';
import CelebrationBoard from './CelebrationBoard';
import Sentiment from './Sentiment';
import Announcements from './Announcements';
import Requests from './Requests';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';

export default function DSMBody() {
  const { gridHeightState } = useContext(DSMBodyLayoutContext)
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const breakpoint391 = useMediaQuery('(min-width:391px)');


  return (
    <Grid>
      <Grid backgroundColor='backgroundColor.main' height='100%'>
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', padding: breakpoint1080 ? '50px 50px 50px 50px' : '25px 25px 25px 25px'
        }}>
          <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', height: breakpoint391 ? '78vh' : "78vh" }}>
            <Grid item xs={gridHeightState.celebration.fullExpanded || !breakpoint1080 ? 12 : 8} height="100%">
              <Sentiment />
              <CelebrationBoard />
            </Grid>
            {!gridHeightState.celebration.fullExpanded && breakpoint1080 && (
              <Grid item xs={4} height="100%">
                <Requests />
                <Announcements />
              </Grid>
            )}
          </Grid >
        </Box>
        {!breakpoint1080 &&
          <Box sx={{
            display: 'flex', flexWrap: 'wrap', padding: breakpoint1080 ? '0px 50px 50px 50px' : '0px 25px 25px 25px'
          }}>
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                height: (!breakpoint1080 && !gridHeightState.announcement.expanded && !gridHeightState.request.expanded) ? "auto" : "78vh"
              }}>
              <Grid item xs={12} height="100%" >
                <Requests />
                <Announcements />
              </Grid>
            </Grid >
          </Box>
        }
      </Grid>
    </Grid >
  );
}
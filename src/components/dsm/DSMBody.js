import { React, useContext } from 'react';
import {
  Grid, Box
} from '@mui/material';
import CelebrationBoard from './CelebrationBoard';
import Sentiment from './Sentiment';
import Announcements from './Announcements';
import Requests from './Requests';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';

export default function DSMBody() {
  const { gridHeightState } = useContext(DSMBodyLayoutContext)
  return (
    <Grid >
      <Grid backgroundColor='backgroundColor.main' height='100%'>
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', padding: '50px 50px 50px 50px'
        }}>
          <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Grid item xs={gridHeightState.celebration.fullExpanded ? 12 : 8} height="100vh">
              <Sentiment />
              <CelebrationBoard />
            </Grid>
            {!gridHeightState.celebration.fullExpanded && (
              <Grid item xs={4} height="100vh">
                <Requests />
                <Announcements />
              </Grid>
            )}
          </Grid >
        </Box>
      </Grid>
    </Grid >
  );
}

// DSMBody.propTypes = {
//   gridHeightState: PropTypes.shape({
//     sentiment: PropTypes.shape({
//       expanded: PropTypes.bool.isRequired,
//       height: PropTypes.number.isRequired,
//     }).isRequired,
//     celebration: PropTypes.shape({
//       expanded: PropTypes.bool.isRequired,
//       fullExpanded: PropTypes.bool.isRequired,
//       height: PropTypes.number.isRequired,
//     }).isRequired,
//     request: PropTypes.shape({
//       expanded: PropTypes.bool.isRequired,
//       height: PropTypes.number.isRequired,
//     }).isRequired,
//     announcement: PropTypes.shape({
//       expanded: PropTypes.bool.isRequired,
//       height: PropTypes.number.isRequired,
//     }).isRequired,
//   }).isRequired,
//   dispatchGridHeight: PropTypes.func.isRequired,
// }
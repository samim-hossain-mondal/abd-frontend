import React, { useContext } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { DSMBodyLayoutContext } from "../contexts/DSMBodyLayoutContext"

export default function CelebrationBoard() {
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandCelebration = () => {
    dispatchGridHeight({ type: "CELEBRATION" })
  };
  return (
    <Grid item height={gridHeightState.celebration.height}>
      <Accordion expanded={gridHeightState.celebration.expanded} onChange={handleExpandCelebration} sx={{
        height: gridHeightState.celebration.expanded ? "100%" : "none"
      }}>
        <AccordionSummary
          expandIcon={(gridHeightState.celebration.fullExpanded) ? <FullscreenExitIcon /> : <FullscreenIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          {/* All Content/Development of Celebration Board HEADER goes here */}
          <Typography variant="dsmSubMain">Celebration Board</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* All Content/Development of Celebration Board BODY goes here */}
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

// CelebrationBoard.propTypes = {
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
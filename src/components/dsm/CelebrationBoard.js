/* eslint-disable react/no-array-index-key */
import React, { useContext, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, CircularProgress } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import CelebrationCard from './CelebrationCard';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import { DOMAIN } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import AddCelebrationModal from './AddCelebrationModal';
import { celebrationTypes } from '../constants/DSM';


export default function CelebrationBoard() {
  const { setError } = useContext(ErrorContext);
  const [celebrations, setCelebrations] = useState([]);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const [openAddModal, setOpenAddModal] = useState(false);

  // handle states for add new celebrations
  const [newCelebration, setNewCelebration] = useState({
    type: celebrationTypes[0],
    content: '',
    anonymous: false
  });

  const resetModal = () => {
    setNewCelebration({
      type: celebrationTypes[0],
      content: '',
      anonymous: false
    })
  }

  const handleExpandCelebration = () => {
    dispatchGridHeight({ type: 'CELEBRATION' })
  };

  const handleAddButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAddModal(true);
  }


  const getCelebrations = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/api/dsm/celebrations`);
      return res.data;
    }
    catch (err) {
      console.error(err);
      setError(val => val + err);
      return [];
    }
  }

  const { error, isError, isLoading } = useQuery(celebrations, async () => {
    const res = await getCelebrations();
    setCelebrations(res);
    return res
  },
  {
    refetchInterval: 5000,
  }
  );
  if (isLoading) {
    return <CircularProgress />
  }
  if (isError) {
    return <div>Error! {error.message}</div>
  }


  // useEffect(() => {
  //   // setInterval(getCelebrations().then(celebrationsData =>
  //   //   setCelebrations(celebrationsData)
  //   // ), 5000)
  //   resetModal()
  // }, [])

  return (
    <Grid item
      height={gridHeightState.celebration.height}>
      <Accordion
        expanded={gridHeightState.celebration.expanded}
        onChange={handleExpandCelebration} sx={{
          overflow: 'auto',
          height: gridHeightState.celebration.expanded ? '100%' : 'auto'
        }}>
        <AccordionSummary
          expandIcon={(gridHeightState.celebration.fullExpanded) ?
            <IconButton>
              <FullscreenExitIcon />
            </IconButton> :
            <IconButton>
              <FullscreenIcon />
            </IconButton>}
          aria-controls="panel2a-content"
          id="panel2a-header"
          sx={{
            '.MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }
          }}
        >
          {/* All Content/Development of Celebration Board HEADER goes here */}
          <Typography variant="dsmSubMain">Celebration Board</Typography>
          <IconButton onClick={(e) => handleAddButtonClick(e)}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <Masonry className="celebration-masonry" sx={{ overflow: 'hidden' }} columns={{ xs: 1, sm: 2, md: 3, lg: gridHeightState.celebration.fullExpanded ? 4 : 3 }} spacing={2}>
            {celebrations.map((celebration) => (
              <CelebrationCard celebration={celebration} />
            ))}
          </Masonry>
          {/* All Content/Development of Celebration Board BODY goes here */}
        </AccordionDetails>
      </Accordion>
      <AddCelebrationModal
        resetModal={resetModal}
        openModal={openAddModal}
        setOpenModal={setOpenAddModal}
        newCelebration={newCelebration}
        setNewCelebration={setNewCelebration}
      />
    </Grid >
  );
};

// CelebrationBoard.propTypes = {
//   gridHeightState: Proptypes.shape({
//     sentiment: Proptypes.shape({
//       expanded: Proptypes.bool.isRequired,
//       height: Proptypes.number.isRequired,
//     }).isRequired,
//     celebration: Proptypes.shape({
//       expanded: Proptypes.bool.isRequired,
//       fullExpanded: Proptypes.bool.isRequired,
//       height: Proptypes.number.isRequired,
//     }).isRequired,
//     request: Proptypes.shape({
//       expanded: Proptypes.bool.isRequired,
//       height: Proptypes.number.isRequired,
//     }).isRequired,
//     announcement: Proptypes.shape({
//       expanded: Proptypes.bool.isRequired,
//       height: Proptypes.number.isRequired,
//     }).isRequired,
//   }).isRequired,
//   dispatchGridHeight: Proptypes.func.isRequired,
// }
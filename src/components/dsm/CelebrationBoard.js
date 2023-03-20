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
import DSMViewportContext from '../contexts/DSMViewportContext';
import AddCelebrationModal from './AddCelebrationModal';
import { celebrationTypes } from '../constants/DSM';

export default function CelebrationBoard() {
  const { setError } = useContext(ErrorContext);
  const DSMInViewPort = useContext(DSMViewportContext);
  const [celebrations, setCelebrations] = useState([]);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const [openAddModal, setOpenAddModal] = useState(false);

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
    if(DSMInViewPort){
      const res = await getCelebrations();
      setCelebrations(res);
      return res
    }
    setCelebrations([]);
    return [];
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
  const topPadding = (!gridHeightState.sentiment.expanded && !gridHeightState.celebration.fullExpanded) ? '2%' : '1%';

  return (
    <Grid item
      height={gridHeightState.celebration.height}
      paddingTop={gridHeightState.celebration.fullExpanded || !gridHeightState.sentiment.expanded ? topPadding : 'none'}
    >
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
          <Typography variant="dsmSubMain">Celebration Board</Typography>
          <IconButton onClick={(e) => handleAddButtonClick(e)}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <Masonry className="celebration-masonry" sx={{ overflow: 'hidden' }} spacing={2}>
            {celebrations.map((celebration) => (
              <CelebrationCard celebration={celebration} />
            ))}
          </Masonry>
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
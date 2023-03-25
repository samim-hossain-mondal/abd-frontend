import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, CircularProgress } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Masonry from '@mui/lab/Masonry';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import CelebrationCard from './CelebrationCard';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import { REFETCH_INTERVAL } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import AddCelebrationModal from './AddCelebrationModal';
import { celebrationTypes } from '../constants/dsm/Celebrations';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { GET_CELEBRATIONS } from '../constants/apiEndpoints';
import { RefreshContext } from '../contexts/RefreshContext';

export default function CelebrationBoard() {
  const { projectId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const DSMInViewPort = useContext(DSMViewportContext);
  const [celebrations, setCelebrations] = useState([]);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const [openAddModal, setOpenAddModal] = useState(false);

  const [newCelebration, setNewCelebration] = useState({
    type: celebrationTypes[0],
    content: '',
    anonymous: false
  });

  const onDeleteCelebration = (celebrationId) => {
    const updatedCelebrations = celebrations.filter(celebration => celebration.celebrationId !== celebrationId)
    setCelebrations(updatedCelebrations);
  }

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
      const resData = await makeRequest(GET_CELEBRATIONS(projectId))
      return resData;
    }
    catch (err) {
      console.error(err);
      setError(err.message);
      return [];
    }
  }

  if (refresh.celebration) {
    getCelebrations().then(resData => {
      setCelebrations(resData);
    })
    setRefresh(val => ({ ...val, celebration: false }));
  }

  useEffect(() => {
    getCelebrations().then((_celebrations) => {
      setCelebrations(_celebrations);
    })
  }, [])

  const { error, isError, isLoading } = useQuery(celebrations, async () => {
    if (DSMInViewPort) {
      const resData = await getCelebrations();
      setCelebrations(resData);
      return resData;
    }
    return [];
  },
    {
      refetchInterval: REFETCH_INTERVAL,
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
              <CelebrationCard
                celebration={celebration}
                isPreview={false}
                onDeleteCelebration={onDeleteCelebration}
              />
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
        setCelebrations={setCelebrations}
        celebrations={celebrations}
      />
    </Grid >
  );
};
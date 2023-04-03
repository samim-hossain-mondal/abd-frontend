/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, useMediaQuery, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Masonry from '@mui/lab/Masonry';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import { REFETCH_INTERVAL } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import AddCelebrationModal from './AddCelebrationModal';
import { celebrationTypes, HEADING, WATERMARK } from '../constants/dsm/Celebrations';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { GET_CELEBRATIONS } from '../constants/apiEndpoints';
import { RefreshContext } from '../contexts/RefreshContext';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import SkeletonCelebration from '../skeletons/dsm/celebration';
import { groupByDate } from '../utilityFunctions/dateMatcher';
import CelebrationsMansory from './CelebrationsMansory';

export default function CelebrationBoard({ selectedDate }) {
  const { userRole } = useContext(ProjectUserContext)
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const { projectId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const DSMInViewPort = useContext(DSMViewportContext);

  const [celebrations, setCelebrations] = useState([]);
  const [celebrationsByDate, setCelebrationsByDate] = useState([]);

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
    if (breakpoint1080)
      dispatchGridHeight({ type: 'CELEBRATION', userRole })
  };

  const handleAddButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAddModal(true);
  }

  const getCelebrations = async (params) => {
    try {
      // const resData = await makeRequest(GET_CELEBRATIONS_BY_DATE(projectId, dateGetter(selectedDate)))
      const resData = await makeRequest(GET_CELEBRATIONS(projectId), { params })
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  const limit = 15;

  const fetchMoreCelebrations = async (isRefresh = false) => {
    const page = isRefresh ? 1 : Math.ceil(celebrations.length / limit) + 1;
    const resData = await getCelebrations({ page, limit });
    if (resData.length < limit) {
      setHasMore(false);
    }
    const updateAnnouncements = [...celebrations, ...resData];

    setCelebrations(isRefresh ? resData : updateAnnouncements);
    return resData;
  }

  if (refresh.celebration) {
    setRefresh(val => ({ ...val, celebration: false }));
    fetchMoreCelebrations(true).then(resData => {
      setCelebrations(resData);
      setHasMore(true);
    })
  }

  useEffect(() => {
    setLoaded(false);
    fetchMoreCelebrations(true).then((_celebrations) => {
      setCelebrations(_celebrations);
      setLoaded(true);
    })
  }, [selectedDate])

  useEffect(() => {
    setCelebrationsByDate(groupByDate(celebrations));
  }, [celebrations, selectedDate])

  const { error, isError } = useQuery("", async () => {
    if (DSMInViewPort) {
      // setLoaded(false);
      const resData = await fetchMoreCelebrations(true);
      setCelebrations(resData);
      // setLoaded(true);
      return resData;
    }
    return [];
  },
    {
      refetchInterval: REFETCH_INTERVAL,
    }
  );

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
        id="scrollableCelebrationDiv"
        expanded={gridHeightState.celebration.expanded || !breakpoint1080}
        onChange={handleExpandCelebration} sx={{
          overflowX: 'auto',
          height: gridHeightState.celebration.expanded ? '100%' : 'auto'
        }}>
        <AccordionSummary
          expandIcon={
            !breakpoint1080 ? null : ((gridHeightState.celebration.fullExpanded) ?
              <Tooltip title="Minimize" placement='top'>
                <IconButton>
                  <FullscreenExitIcon />
                </IconButton>
              </Tooltip> :
              <Tooltip title="Expand" placement='top'>
                <IconButton>
                  <FullscreenIcon />
                </IconButton>
              </Tooltip>)
          }
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
          <Typography variant="dsmSubMain" fontSize='1.25rem' sx={{ textTransform: 'none' }}>{HEADING}</Typography>
          {
            // dateGetter(selectedDate) === dateGetter(new Date()) && (
            <Tooltip title="Add Celebration">
              <IconButton onClick={(e) => handleAddButtonClick(e)}>
                <AddCircleIcon color="primary" />
              </IconButton>
            </Tooltip>
            // )
          }
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: loaded && celebrations.length === 0 ? "20% 16px" : "none",
            paddingTop: "0px"
          }}
        >
          {loaded && celebrations.length === 0 ?
            (
              <Box sx={{ height: "100%" }}>
                <Typography
                  color="watermark.main"
                  fontSize='1.25rem'
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: 'none'
                  }}
                >
                  {WATERMARK}
                </Typography>
              </Box>
            )
            :
            (!loaded ?
              <Masonry className="celebration-masonry" sx={{ overflow: 'hidden' }} spacing={4}>
                {[...Array(gridHeightState.celebration.fullExpanded || !breakpoint1080 ? 32 : 16)].map(() =>
                  <SkeletonCelebration height="100px" />
                )}
              </Masonry> :
              (
                <InfiniteScroll
                  dataLength={celebrations.length}
                  next={fetchMoreCelebrations}
                  style={{
                    height: '100%',
                    width: '100%',
                    overflow: "hidden"
                  }}
                  hasMore={hasMore}
                  loader={
                    <Box sx={{ width: '100%' }}>
                      <SkeletonCelebration height="100px" />
                    </Box>
                  }
                  scrollThreshold="90%"
                  scrollableTarget="scrollableCelebrationDiv"
                >
                  {Object.keys(celebrationsByDate).map((dateGroupName, index) => (
                    <CelebrationsMansory
                      masonryIndex={index}
                      dateGroupName={dateGroupName}
                      celebrationsByDate={celebrationsByDate[dateGroupName]}
                      onDeleteCelebration={onDeleteCelebration}
                    />
                  ))}
                </InfiniteScroll>
              )
            )
          }
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

CelebrationBoard.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};
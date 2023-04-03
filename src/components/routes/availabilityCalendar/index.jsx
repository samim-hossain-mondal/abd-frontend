/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useQuery } from 'react-query';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  AppBar,
  Box,
  Dialog,
  Toolbar,
  Typography,
  Container,
  Grid,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorContext } from '../../contexts/ErrorContext';
import { RefreshContext } from '../../contexts/RefreshContext';
import { ProjectUserContext } from '../../contexts/ProjectUserContext';
import GenericInputModal from '../../timeline/inputModal';
import {
  VIEWS,
  DEFAULT_VIEW,
  PRIMARY_BUTTON_TEXT,
  PLACEHOLDER,
  LOADING_TEXT,
  SNACKBAR_TEXT,
  CHAR_COUNT,
} from '../../constants/Timeline/Calendar';
import makeRequest from '../../utilityFunctions/makeRequest/index';
import {
  CREATE_LEAVE,
  DELETE_LEAVE,
  GET_LEAVES,
  UPDATE_LEAVE,
} from '../../constants/apiEndpoints';
import { REFETCH_INTERVAL } from '../../../config';

import './availabilityCalendar.css';
import { LoadingContext } from '../../contexts/LoadingContext';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function AvailabilityCalendar({ availabilityIsInViewPort }) {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const { projectId } = useParams();
  const [eventsData, setEventsData] = useState([]);
  const [inputModal, setInputModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const { setLoading } = useContext(LoadingContext);

  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const { user } = useContext(ProjectUserContext);

  if (refresh.availabilityCalendar) {
    (async () => {
      try {
        const resData = await makeRequest(GET_LEAVES(projectId), setLoading);
        setEventsData(resData);
      } catch (err) {
        setError((val) => val + err);
      }
    })();
    setRefresh((val) => ({ ...val, availabilityCalendar: false }));
  }

  const handleMount = async () => {
    try {
      const resData = await makeRequest(GET_LEAVES(projectId), setLoading);
      setEventsData(resData);
    } catch (err) {
      setError((val) => val + err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  const { error, isError, isLoading } = useQuery(
    'events',
    async () => {
      if (availabilityIsInViewPort) {
        const resData = await makeRequest(GET_LEAVES(projectId), setLoading);
        setEventsData(resData);
        return resData;
      }
      return [];
    },
    {
      refetchInterval: REFETCH_INTERVAL,
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    return <div>Error! {error.message}</div>;
  }

  const eventsPrimaryData = eventsData?.map((eventData) => {
    const {
      startDate,
      endDate,
      event,
      userFullName,
      memberId,
      leaveId,
      isRisk,
    } = eventData;
    return {
      start: new Date(startDate),
      end: new Date(endDate),
      title: `@${userFullName}: ${event}`,
      memberId,
      leaveId,
      userFullName,
      startDate,
      endDate,
      event,
      isRisk,
    };
  });

  const handleInputModal = () => {
    setInputModal(true);
  };

  const handleInputModalClose = () => {
    setInputModal(false);
  };

  const handleAddEvent = async (event) => {
    const { content, startDate, endDate, isRisk } = event;
    if (endDate < startDate) {
      setError((val) => `${val} ${SNACKBAR_TEXT.DATE_ERROR}`);
      handleInputModalClose();
      return;
    }
    try {
      const reqBody = {
        event: content,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isRisk,
      };
      const resData = await makeRequest(CREATE_LEAVE(projectId), setLoading, {
        data: reqBody,
      });
      const newData = resData;
      newData.startDate = new Date(newData.startDate);
      newData.endDate = new Date(newData.endDate);
      setEventsData([...eventsData, newData]);
      handleInputModalClose();
      setSuccess(() => SNACKBAR_TEXT.SUCCESS);
    } catch (err) {
      setError((val) => val + err);
    }
  };

  const handleEditModal = (event) => {
    setEditModal(true);
    setSelectedEvent(event);
    if (event.memberId === user.memberId) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleEditModalClose = () => {
    setEditModal(false);
  };

  const handleEditEvent = async (editEvent) => {
    const { content, startDate, endDate, isRisk, defaultID } = editEvent;
    if (endDate < startDate) {
      setError((val) => `${val} ${SNACKBAR_TEXT.DATE_ERROR}`);
      handleEditModalClose();
      return;
    }
    try {
      const reqBody = {
        event: content,
        startDate,
        endDate,
        isRisk,
      };
      const resData = await makeRequest(
        UPDATE_LEAVE(projectId, defaultID),
        setLoading,
        {
          data: reqBody,
        }
      );
      const newEventsData = eventsData.map((event) => {
        if (event.leaveId === selectedEvent.leaveId) {
          return resData;
        }
        return event;
      });
      setEventsData([...newEventsData]);
      handleEditModalClose();
      setSuccess(() => SNACKBAR_TEXT.SUCCESS);
    } catch (err) {
      setError((val) => val + err);
    }
  };

  const handleDeleteEvent = async (leaveId) => {
    try {
      await makeRequest(DELETE_LEAVE(projectId, leaveId));
      const newEventsData = eventsData.filter(
        (event) => event.leaveId !== leaveId
      );
      setEventsData([...newEventsData]);
      handleEditModalClose();
      setSuccess(() => SNACKBAR_TEXT.DELETE);
    } catch (err) {
      setError((val) => val + err);
    }
  };

  const handleSelect = ({ start, end }) => {
    if (start >= new Date()) {
      handleInputModal();
      setSelectedStartDate(start);
      setSelectedEndDate(end);
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = '#3f51b5';

    const style = !event.isRisk
      ? {
          backgroundColor,
          borderRadius: '0px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block',
        }
      : {
          backgroundColor: 'red',
          borderRadius: '0px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block',
        };
    return {
      style,
    };
  };

  return eventsData ? (
    <Box
      sx={{ fontFamily: 'Roboto !important' }}
      data-testid='availability-calendar'>
      <Box>
        <AppBar
          position='static'
          sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <Box sx={{ display: { md: 'flex' } }}>
                <Typography
                  data-testid='poNotesIdentifier'
                  variant='h5'
                  noWrap
                  sx={{
                    ml: 5,
                    fontWeight: 500,
                    letterSpacing: '.025rem',
                    color: 'secondary.main',
                    textDecoration: 'none',
                  }}>
                  Availability Calendar
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Grid backgroundColor='backgroundColor.main' height='100%'>
        <Box
          sx={{
            gap: '5vh',
            padding: breakpoint1080
              ? '50px 50px 50px 50px'
              : '25px 25px 25px 25px',
          }}>
          <Calendar
            views={VIEWS}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView={DEFAULT_VIEW}
            events={eventsPrimaryData}
            style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
            onSelectEvent={(event) => handleEditModal(event)}
            onSelectSlot={handleSelect}
            eventPropGetter={eventStyleGetter}
            dayLayoutAlgorithm='no-overlap'
          />
          {inputModal && (
            <Dialog open={inputModal} onClose={handleInputModalClose}>
              <GenericInputModal
                onCloseButtonClick={handleInputModalClose}
                primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
                onPrimaryButtonClick={(event) => {
                  handleAddEvent(event);
                }}
                defaultStartDate={selectedStartDate}
                defaultEndDate={selectedEndDate}
                placeholder={PLACEHOLDER}
                totalCharacters={CHAR_COUNT}
              />
            </Dialog>
          )}
          {editModal && (
            <Dialog open={editModal} onClose={handleEditModalClose}>
              <GenericInputModal
                onCloseButtonClick={handleEditModalClose}
                primaryButtonText={PRIMARY_BUTTON_TEXT.EDIT}
                onPrimaryButtonClick={(event) => {
                  handleEditEvent(event);
                }}
                defaultID={selectedEvent.leaveId}
                defaultEvent={selectedEvent.event}
                defaultStartDate={new Date(selectedEvent.startDate)}
                defaultEndDate={new Date(selectedEvent.endDate)}
                defaultIsRisk={selectedEvent.isRisk}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                handleDelete={handleDeleteEvent}
                totalCharacters={CHAR_COUNT}
              />
            </Dialog>
          )}
        </Box>
      </Grid>
    </Box>
  ) : (
    <Box>
      <Typography variant='h4' align='center'>
        {LOADING_TEXT}
      </Typography>
    </Box>
  );
}

AvailabilityCalendar.propTypes = {
  availabilityIsInViewPort: PropTypes.bool.isRequired,
};

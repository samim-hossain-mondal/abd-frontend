/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  AppBar,
  Box,
  Dialog,
  Toolbar,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { ErrorContext } from '../../contexts/ErrorContext';
import { RefreshContext } from '../../contexts/RefreshContext';
import GenericInputModal from '../../timeline/inputModal';
import { getCurrentUserID } from '../../utilityFunctions/User';
import {
  VIEWS,
  DEFAULT_VIEW,
  PRIMARY_BUTTON_TEXT,
  PLACEHOLDER,
  LOADING_TEXT,
  SNACKBAR_TEXT,
} from '../../constants/Timeline/Calendar';
import './availabilityCalendar.css';
import makeRequest from '../../utilityFunctions/makeRequest/index';
import {
  CREATE_LEAVE,
  DELETE_LEAVE,
  GET_LEAVES,
  UPDATE_LEAVE,
} from '../../constants/apiEndpoints';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function AvailabilityCalendar() {
  const { projectId } = useParams();
  const [eventsData, setEventsData] = useState([]);
  const [inputModal, setInputModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);

  if (refresh.availabilityCalendar) {
    console.log('Handle Refresh For Calendar');
    setRefresh((val) => ({ ...val, availabilityCalendar: false }));
  }

  const handleMount = async () => {
    try {
      const resData = await makeRequest(GET_LEAVES(projectId));
      setEventsData(resData);
    } catch (err) {
      setError((val) => val + err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  const eventsPrimaryData = eventsData?.map((eventData) => {
    const { startDate, endDate, event, userFullName, userId, leaveId, isRisk } =
      eventData;
    return {
      start: new Date(startDate),
      end: new Date(endDate),
      title: `@${userFullName}: ${event}`,
      userId,
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
      const resData = await makeRequest(CREATE_LEAVE(projectId), {
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
    if (event.userId === getCurrentUserID()) {
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
      const resData = await makeRequest(UPDATE_LEAVE(projectId, defaultID), {
        data: reqBody,
      });
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
      // const resData = await makeRequest(DELETE_LEAVE(projectId, leaveId));
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
    <Box sx={{ fontFamily: 'Roboto !important' }} id='availability-calendar'>
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
            padding: '50px 50px 50px 50px',
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

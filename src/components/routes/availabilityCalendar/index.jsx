/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Dialog, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { ErrorContext } from '../../contexts/ErrorContext';
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
import { DOMAIN } from '../../../config';
import './availabilityCalendar.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function AvailabilityCalendar() {
  const [eventsData, setEventsData] = useState(null);
  const [inputModal, setInputModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const { setError, setSuccess } = useContext(ErrorContext);

  const handleMount = async () => {
    try{
      const response = await axios.get(`${DOMAIN}/api/leaves`);
      const {data} = response;
      setEventsData(data);
    }
    catch(err){
      setError(val=>val + err);
    }
  }

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
    if(endDate<startDate){
      setError(val=>`${val  } ${SNACKBAR_TEXT.DATE_ERROR}`);
      handleInputModalClose();
      return;
    }
    try{
      const res = await axios.post(`${DOMAIN}/api/leaves`, {
        event: content,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isRisk,
      });
      const newData = res.data;
      newData.startDate = new Date(newData.startDate);
      newData.endDate = new Date(newData.endDate);
      setEventsData([...eventsData, newData]);
      handleInputModalClose();
      setSuccess(()=>SNACKBAR_TEXT.SUCCESS);
    }
    catch(err){
      setError(val=>val + err);
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
    if(endDate<startDate){
      setError(val=>`${val  } ${SNACKBAR_TEXT.DATE_ERROR}`);
      handleEditModalClose();
      return;
    }
    try{
      const res = await axios.put(`${DOMAIN}/api/leaves/${defaultID}`, {
        event: content,
        startDate,
        endDate,
        isRisk
      });
      const newEventsData = eventsData.map((event) => {
        if (event.leaveId === selectedEvent.leaveId) {
          return res.data;
        }
        return event;
      });
      setEventsData([...newEventsData]);
      handleEditModalClose();
      setSuccess(()=>SNACKBAR_TEXT.SUCCESS);
    }
    catch(err){
      setError(val=>val + err);
    }
  };

  const handleDeleteEvent = async (leaveId) => {
    try{
      await axios.delete(`${DOMAIN}/api/leaves/${leaveId}`);
      const newEventsData = eventsData.filter(
        (event) => event.leaveId !== leaveId
      );
      setEventsData([...newEventsData]);
      handleEditModalClose();
      setSuccess(()=>SNACKBAR_TEXT.DELETE);
    }
    catch(err){
      setError(val=>val + err);
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
    <Box sx={{ fontFamily: 'Roboto !important' }}>
      <Calendar
        views={VIEWS}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView={DEFAULT_VIEW}
        events={eventsPrimaryData}
        style={{ height: '100vh' }}
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
  ) : (
    <Box>
      <Typography variant='h4' align='center'>
        {LOADING_TEXT}
      </Typography>
    </Box>
  );
}

/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Dialog, Typography } from '@mui/material';
import events from '../../constants/Timeline/Events';
import GenericInputModal from '../../timeline/inputModal';
import { getCurrentUserID } from '../../utilityFunctions/User';
import { VIEWS, DEFAULT_VIEW, PRIMARY_BUTTON_TEXT, PLACEHOLDER, LOADING_TEXT } from '../../constants/Timeline/Calendar';

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

  useEffect(() => {
    setEventsData(events);
  }, []);


  const eventsPrimaryData = eventsData?.map((event) => {
    const { startDatetime, endDatetime, eventName, name, uid, id, isRisk } = event;
    return { start: startDatetime, end: endDatetime, title: `@${name}: ${eventName}`, uid, id, name, startDatetime, endDatetime, eventName, isRisk };
  });

  const handleInputModal = () => {
    setInputModal(true);
  };

  const handleInputModalClose = () => {
    setInputModal(false);
  };

  const handleAddEvent = (event) => {
    const {content, startDatetime, endDatetime, isRisk} = event;
    // will be changed upon integration with backend
    const newEvent = {
      eventName: content,
      startDatetime,
      endDatetime,
      isRisk,
      uid: getCurrentUserID(),
      name: 'User1',
      id: 2,
    };
    setEventsData([...eventsData, newEvent]);
    handleInputModalClose();
  };

  const handleEditModal = (event) => {
    setEditModal(true);
    setSelectedEvent(event);
    if(event.uid === getCurrentUserID()) {
      setIsDisabled(false);
    }
    else{
      setIsDisabled(true);
    }
  };

  const handleEditModalClose = () => {
    setEditModal(false);
  };

  const handleEditEvent = (editEvent) => {
    const {content, startDatetime, endDatetime, isRisk, defaultID} = editEvent;
    // will be changed upon integration with backend
    const newEvent = {
      eventName: content,
      startDatetime,
      endDatetime,
      isRisk,
      uid: getCurrentUserID(),
      name: 'User1', 
      id: defaultID,
    };

    const newEventsData = eventsData.map((event) => {
      if(event.id === selectedEvent.id) {
        return newEvent;
      }
      return event;
    });
    setEventsData([...newEventsData]);
    handleEditModalClose();
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
    
    const style = (!event.isRisk)?{
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    }:{
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

  return eventsData?(
    <Box sx={{fontFamily: 'Roboto !important'}}>
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
      {
        (inputModal) && (
          <Dialog
            open={inputModal}
            onClose={handleInputModalClose}
          >
            <GenericInputModal
              onCloseButtonClick={handleInputModalClose}
              primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
              onPrimaryButtonClick={(event) => { handleAddEvent(event) }}
              defaultStartDatetime={selectedStartDate}
              defaultEndDatetime={selectedEndDate}
              placeholder={PLACEHOLDER}
            />
          </Dialog>
        )
      }
      {
        (editModal) && (
          <Dialog
            open={editModal}
            onClose={handleEditModalClose}
          >
            <GenericInputModal
              onCloseButtonClick={handleEditModalClose}
              primaryButtonText={PRIMARY_BUTTON_TEXT.EDIT}
              onPrimaryButtonClick={(event) => { handleEditEvent(event) }}
              defaultID={selectedEvent.id}
              defaultEventName={selectedEvent.eventName}
              defaultStartDatetime={selectedEvent.startDatetime}
              defaultEndDatetime={selectedEvent.endDatetime}
              defaultIsRisk={selectedEvent.isRisk}
              isDisabled={isDisabled}
              setIsDisabled={setIsDisabled}
            />
          </Dialog>
        )
      }
    </Box>
  ):(
    <Box>
      <Typography variant='h4' align='center'>{LOADING_TEXT}</Typography>
    </Box>
  );
};
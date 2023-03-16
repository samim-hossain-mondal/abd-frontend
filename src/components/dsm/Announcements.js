import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import axios from 'axios';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import GenericInputModal from '../elements/dsm/GenericInputModal';
import ChatContainer from '../elements/dsm/ChatContainer';
import { DOMAIN } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import { DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER } from '../constants/dsm/Announcements';

export default function Announcements() {

  const { setError, setSuccess } = useContext(ErrorContext);

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandAnnouncements = () => {
    dispatchGridHeight({ type: 'ANNOUNCEMENT' })
  };

  const [announcements, setAnnouncements] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const handleAddButtonClick = () => {
    setOpenAddModal(!openModal);
    dispatchGridHeight({ type: 'ANNOUNCEMENT' });
  }

  const handleModalClose = () => {
    setOpenAddModal(false);
  }

  // OPTIMIZE: Is backend for announcements paginated ?
  const getAnnouncements = async () =>{
    try {
      const res = await axios.get(`${DOMAIN}/api/dsm/announcements`);
      return res.data;
    }
    catch(err) {
      console.error(err);
      setError(val => val + err);
      return [];
    }
  }

  useEffect(() => {
    getAnnouncements().then((_announcements) => {
      setAnnouncements(_announcements);
    })
  }, [])

  const handleChatClick = (announcement) => {
    console.log(announcement);
  };

  const addAnnouncementToDB = async (content) => {
    try {
      const res = await axios.post(`${DOMAIN}/api/dsm/announcements`, {
        content, 
      });
      setSuccess(() => 'Announcement created successfully');

      return res.data;
    }
    catch(err) {
      console.error(err);
      setError(val => val + err);
      return false;
    }
  }

  return (
    <Grid item height={gridHeightState.announcement.height} >
      <Accordion expanded={gridHeightState.announcement.expanded} onChange={handleExpandAnnouncements} sx={{
        height: gridHeightState.announcement.expanded ? '100%' : 'none',
        overflow: 'auto',
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
          sx={{
            '.MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }
          }}
        >
          <Typography variant="dsmSubMain">Announcements</Typography>
          <IconButton onClick={handleAddButtonClick}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </AccordionSummary>
        <Dialog
          open={openModal}
          onClose={handleModalClose}
        >
          <GenericInputModal
            title='Announcement Statement'
            onCloseButtonClick={handleModalClose}
            primaryButtonText='Post'
            onPrimaryButtonClick={async (content) => {
              const newAnnouncement = await addAnnouncementToDB(content);
              if (newAnnouncement) {
                setAnnouncements(() => [newAnnouncement, ...announcements])
                handleModalClose();
              }
            }}

            placeholder={DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER}

            // TODO: add children component to check for addition on slack channel
          />
          
        </Dialog>
        <AccordionDetails sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '16px',
        }}>
          {announcements.map((announcement) => (
            <ChatContainer
              key={announcement.announcementId}
              name={announcement.author}
              content={announcement.content}
              date={new Date(announcement.createdAt)}
              onClick={() => handleChatClick(announcement)}
            />
          ))}

        </AccordionDetails>
      </Accordion>
    </ Grid >
  );
};

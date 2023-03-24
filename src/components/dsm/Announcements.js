import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import GenericInputModal from '../elements/dsm/GenericInputModal';
import ChatContainer from '../elements/dsm/ChatContainer';
import { ErrorContext } from '../contexts/ErrorContext';
import { DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER, GENERIC_NAME } from '../constants/dsm/Announcements';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_ANNOUNCMENT, GET_ANNOUNCMENTS } from '../constants/apiEndpoints';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { REFETCH_INTERVAL } from '../../config';

export default function Announcements() {
  const { projectId } = useParams();
  const DSMInViewPort = useContext(DSMViewportContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const { user } = useContext(ProjectUserContext)

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandAnnouncements = () => {
    dispatchGridHeight({ type: 'ANNOUNCEMENT' })
  };

  const [announcements, setAnnouncements] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const handleAddButtonClick = (e) => {
    e.stopPropagation();
    setOpenAddModal(!openModal);
  }

  const handleModalClose = () => {
    setOpenAddModal(false);
  }

  // OPTIMIZE: Is backend for announcements paginated ?
  const getAnnouncements = async () => {
    try {
      const resData = await makeRequest(GET_ANNOUNCMENTS(projectId))
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  if (refresh.announcement) {
    getAnnouncements().then(resData => {
      setAnnouncements(resData);
    })
    setRefresh((prev) => ({ ...prev, announcement: false }));
  }

  useEffect(() => {
    getAnnouncements().then((_announcements) => {
      setAnnouncements(_announcements);
    })
  }, [])

  const { error, isError, isLoading } = useQuery(announcements, async () => {
    if (DSMInViewPort) {
      const resData = await getAnnouncements();
      getAnnouncements(resData);
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

  const handleChatClick = (announcement) => {
    if (user.memberId !== announcement.memberId) {
      setError(ERROR_MESSAGE.UNAUTHORIZED);

    }
  };

  const addAnnouncementToDB = async (content) => {
    try {
      const reqBody = {
        content,
      }
      const resData = await makeRequest(CREATE_ANNOUNCMENT(projectId), { data: reqBody })
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).CREATED);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <Grid item height={gridHeightState.announcement.height}
      paddingTop={gridHeightState.request.expanded ? 'none' : '5%'}
    >
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
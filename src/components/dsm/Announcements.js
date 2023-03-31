import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, CircularProgress, Divider,Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import AnnouncementInputModal from '../elements/dsm/AnnouncementInputModal';
import AnnouncementChatContainer from '../elements/dsm/AnnouncementChatContainer';
import { ErrorContext } from '../contexts/ErrorContext';
import { DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER, GENERIC_NAME, MODAL_PRIMARY_BUTTON_TEXT, TITLE } from '../constants/dsm/Announcements';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_ANNOUNCMENT, DELETE_ANNOUNCMENT, GET_ANNOUNCMENTS, UPDATE_ANNOUNCMENT } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { USER_ROLES } from '../constants/users';
import { REFETCH_INTERVAL } from '../../config';

export default function Announcements() {
  const { projectId } = useParams();
  const DSMInViewPort = useContext(DSMViewportContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const { user, userRole } = useContext(ProjectUserContext)

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandAnnouncements = () => {
    dispatchGridHeight({ type: 'ANNOUNCEMENT' })
  };

  const [announcements, setAnnouncements] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setEditModalData({});
    setIsDisabled(true);
  };

  const handleChatClick = (request) => {
    setOpenEditModal(true);
    setEditModalData({ ...request });
    setIsDisabled(true);
  };

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

  const addAnnouncementToDB = async (content,title) => {
    try {
      const reqBody = {
        content,
        title
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

  const handleEditAnnouncement = async (content,title) => {
    try {
      const reqBody = {
        content,
        title
      }
      const resData = await makeRequest(UPDATE_ANNOUNCMENT(projectId, editModalData?.announcementId), { data: reqBody })
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).UPDATED);
      setAnnouncements(announcements.map((announcement) => {
        if (announcement.announcementId === editModalData?.announcementId) {
          return {
            ...announcement,
            content,
            title
          }
        }
        return announcement;
      }));
      handleEditModalClose();
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleDeleteAnnouncement = async () => {
    try {
      const resData = await makeRequest(DELETE_ANNOUNCMENT(projectId, editModalData?.announcementId))
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).DELETED);
      const announcementData = announcements.filter((announcement) => announcement.announcementId !== editModalData?.announcementId);
      setAnnouncements([...announcementData]);
      handleEditModalClose();
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  };

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
          <Typography variant="dsmSubMain">{TITLE}</Typography>
          {
            (userRole === USER_ROLES.ADMIN) && (
              <IconButton onClick={handleAddButtonClick}>
                <AddCircleIcon color="primary" />
              </IconButton>
            )
          }
        </AccordionSummary>
        <Dialog
          open={openModal}
          onClose={handleModalClose}
        >
          <AnnouncementInputModal
            onCloseButtonClick={handleModalClose}
            primaryButtonText={MODAL_PRIMARY_BUTTON_TEXT}
            onPrimaryButtonClick={async (content,title) => {
              const newAnnouncement = await addAnnouncementToDB(content,title);
              if (newAnnouncement) {
                getAnnouncements().then(resData => {
                  setAnnouncements(resData);
                });
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
            <Box
              key={announcement.announcementId}
            >
              <AnnouncementChatContainer
                key={announcement.announcementId}
                name={announcement.author}
                title={announcement.title}
                content={announcement.content}
                date={new Date(announcement.createdAt)}
                onClick={() => handleChatClick(announcement)}
              />
              <Divider variant="inset"/>
            </Box>
          ))}

        </AccordionDetails>
        
        {
          (openEditModal) && (
            <Dialog
              open={openEditModal}
              onClose={handleEditModalClose}
            >
              <AnnouncementInputModal
                onCloseButtonClick={handleEditModalClose}
                primaryButtonText={MODAL_PRIMARY_BUTTON_TEXT}
                onPrimaryButtonClick={handleEditAnnouncement}
                defaultValue={editModalData?.content}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                deleteRequest={handleDeleteAnnouncement}
                authorize={user.memberId === editModalData?.memberId}
                title={editModalData?.title}
               />
            </Dialog>
          )
        }

      </Accordion>
    </ Grid >
  );
};
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import axios from 'axios';
import { Stack } from '@mui/system';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';
import GenericInputModal from '../elements/dsm/GenericInputModal';
import { ErrorContext } from '../contexts/ErrorContext';
import { DOMAIN } from '../../config';
import ChatContainer from '../elements/dsm/ChatContainer';
import { getCurretUser } from '../utilityFunctions/User';
import { DSM_REQUEST_DEFAULT_TYPE, DSM_REQUEST_INPUT_PLACEHOLDER, DSM_REQUEST_TYPES, ERROR_MESSAGE, SUCCESS_MESSAGE, TITLE, PRIMARY_BUTTON_TEXT } from '../constants/dsm/Requests';

/*
ISSUES: 
        1. someplace key is missing console is showing error
        2. User must be able to tag user in request so we can use ReactTextAreaAutocomplete
*/

export default function Requests() {

  const { setError, setSuccess } = useContext(ErrorContext);

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandRequests = () => {
    dispatchGridHeight({ type: "REQUEST" })
  };

  const [requests, setRequests] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled,setIsDisabled] = useState(true);
  const [requestType, setRequestType] = useState(DSM_REQUEST_DEFAULT_TYPE);

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setEditModalData({});
    setIsDisabled(true);
    setRequestType(DSM_REQUEST_DEFAULT_TYPE);
  };

  const handleChatClick = (request) => {
    if(getCurretUser() !== request.author){
      setError(ERROR_MESSAGE.UNAUTHORIZED);
      return;
    }
    setOpenEditModal(true);
    setEditModalData({...request});
    setIsDisabled(true);
    setRequestType(request.type);
  };

  const handleAddButtonClick = () => {
    setOpenAddModal(!openModal);
    dispatchGridHeight({ type: "REQUEST" });
  }

  const handleModalClose = () => {
    setOpenAddModal(false);
  }

  const getRequests = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/api/dsm/team-requests`);
      return res.data;
    }
    catch (err) {
      setError(val => val + err);
      return [];
    }
  }

  useEffect(() => {
    getRequests().then((_requests) => {
      setRequests(_requests);
    })
  }, [])


  const addRequestToDB = async (content) => {
    try {
      const res = await axios.post(`${DOMAIN}/api/dsm/team-requests`, {
        author: getCurretUser(),
        content,
        type: requestType,
      });
      setSuccess(() => SUCCESS_MESSAGE.REQUEST_CREATED);
      return res.data;
    }
    catch (err) {
      setError(val => val + err);
      return false;
    }
  }

  const handleEditRequest = async (content) => {
    try {
      const res = await axios.put(`${DOMAIN}/api/dsm/team-requests/${editModalData.requestId}`, {
        content,
        type: requestType,
      });
      setSuccess(() => SUCCESS_MESSAGE.REQUEST_UPDATED);
      setRequests(requests.map((request) => {
        if (request.requestId === editModalData.requestId) {
          return {
            ...request,
            content,
            type: requestType,
          }
        }
        return request;
      }));
      handleEditModalClose();
      return res.data;
    }
    catch (err) {
      setError(val => val + err);
      return false;
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const res = await axios.delete(`${DOMAIN}/api/dsm/team-requests/${editModalData.requestId}`);
      setSuccess(() => SUCCESS_MESSAGE.REQUEST_DELETED);
      const requestData = requests.filter((request) => request.requestId !== editModalData.requestId);
      setRequests([...requestData]);
      handleEditModalClose();
      return res.data;
    }
    catch (err) {
      setError(val => val + err);
      return false;
    }
  };

  return (
    <Grid item height={gridHeightState.request.height} sx={{ ...(gridHeightState.request.expanded && { paddingBottom: "15px" }) }}>
      <Accordion expanded={gridHeightState.request.expanded} onChange={handleExpandRequests} sx={{
        height: gridHeightState.request.expanded ? "100%" : "none",
        overflow: "auto",
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          sx={{
            '.MuiAccordionSummary-content': {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }
          }}
        >
          {/* All Content/Development of Requests HEADER goes here */}
          <Typography variant="dsmSubMain">Requests</Typography>
          <IconButton onClick={handleAddButtonClick}>
            <AddCircleIcon color="primary" />
          </IconButton>

        </AccordionSummary>

        <Dialog
          open={openModal}
          onClose={handleModalClose}
        >
          <GenericInputModal
            title={TITLE}
            onCloseButtonClick={handleModalClose}
            primaryButtonText={PRIMARY_BUTTON_TEXT.POST}
            onPrimaryButtonClick={async (content) => {
              const isRequestSuccesfullyDone = await addRequestToDB(content);
              if (isRequestSuccesfullyDone) {
                getRequests().then((_requests) => {
                  setRequests(_requests);
                });
                handleModalClose();
              }
            }}
            placeholder={DSM_REQUEST_INPUT_PLACEHOLDER}
          >
            <Typography>
              Tags
            </Typography>
            <br />
            <Stack spacing={1} direction="row">
              <Chip label="Meeting" onClick={() => setRequestType(DSM_REQUEST_TYPES[0])} color={requestType === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'} />
              <Chip label="Resource" onClick={() => setRequestType(DSM_REQUEST_TYPES[1])} color={requestType === DSM_REQUEST_TYPES[1] ? 'primary' : 'default'} />
            </Stack>
          </GenericInputModal>
        </Dialog>

        <AccordionDetails sx={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "16px",
        }}>
          {requests.map((announcement) => (
            <ChatContainer
              key={announcement.announcementId}
              name={announcement.author}
              content={announcement.content}
              date={new Date(announcement.createdAt)}
              onClick={() => handleChatClick(announcement)}
            />
          ))}
        </AccordionDetails>

        {
          (openEditModal) && (
            <Dialog
              open={openEditModal}
              onClose={handleEditModalClose}
            >
              <GenericInputModal
                title={TITLE}
                onCloseButtonClick={handleEditModalClose}
                // primaryButtonText='Mark as Discussed' right now just adding save
                primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
                onPrimaryButtonClick={handleEditRequest}
                defaultValue={editModalData.content}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                deleteRequest={handleDeleteRequest}
              >
                <Typography>
                  Tags
                </Typography>
                <br />
                {
                  (!isDisabled)
                    ? (
                      <Stack spacing={1} direction="row">
                        <Chip label="Meeting" onClick={() => setRequestType(DSM_REQUEST_TYPES[0])} color={requestType === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'} />
                        <Chip label="Resource" onClick={() => setRequestType(DSM_REQUEST_TYPES[1])} color={requestType === DSM_REQUEST_TYPES[1] ? 'primary' : 'default'} />
                      </Stack>
                    )
                    :(
                      <Stack spacing={1} direction="row">
                        <Chip label="Meeting"  color={editModalData.type === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'} />
                        <Chip label="Resource" color={editModalData.type === DSM_REQUEST_TYPES[1] ? 'primary' : 'default'} />
                      </Stack>
                    )
                }
              </GenericInputModal>
            </Dialog>
          )
        }

      </Accordion>
    </Grid>
  );
};

import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, Chip, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';
import GenericInputModal from '../elements/dsm/GenericInputModal';
import { ErrorContext } from '../contexts/ErrorContext';
import ChatContainer from '../elements/dsm/ChatContainer';
import { DSM_REQUEST_DEFAULT_TYPE, DSM_REQUEST_INPUT_PLACEHOLDER, DSM_REQUEST_TYPES, TITLE, PRIMARY_BUTTON_TEXT, GENERIC_NAME } from '../constants/dsm/Requests';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_TEAM_REQUEST, DELETE_TEAM_REQUEST, GET_TEAM_REQUESTS, UPDATE_TEAM_REQUEST } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { REFETCH_INTERVAL } from '../../config';
import { RefreshContext } from '../contexts/RefreshContext';
/*
ISSUES: 
        1. someplace key is missing console is showing error
*/

export default function Requests() {

  const { user } = useContext(ProjectUserContext);

  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const { projectId } = useParams();

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext);

  const handleExpandRequests = () => {
    dispatchGridHeight({ type: 'REQUEST' })
  };

  const [requests, setRequests] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const DSMInViewPort = useContext(DSMViewportContext);
  const [requestType, setRequestType] = useState(DSM_REQUEST_DEFAULT_TYPE);

  if (refresh.request) {
    console.log('Handle Refresh Request');
    setRefresh(val => ({ ...val, request: false }));
  }

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setEditModalData({});
    setIsDisabled(true);
    setRequestType(DSM_REQUEST_DEFAULT_TYPE);
  };

  const handleChatClick = (request) => {
    // if (user.memberId !== request.memberId) {
    //   setError(ERROR_MESSAGE.UNAUTHORIZED);
    //   return;
    // }
    setOpenEditModal(true);
    setEditModalData({ ...request });
    setIsDisabled(true);
    setRequestType(request.type);
  };

  const handleAddButtonClick = (e) => {
    e.stopPropagation();
    setOpenAddModal(!openModal);
  }

  const handleModalClose = () => {
    setOpenAddModal(false);
  }

  const getRequests = async () => {
    try {
      const resData = await makeRequest(GET_TEAM_REQUESTS(projectId))
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  if (refresh.request) {
    getRequests().then(resData => {
      setRequests(resData);
    })
    setRefresh(val => ({ ...val, request: false }));
  }

  useEffect(() => {
    getRequests().then((_requests) => {
      setRequests(_requests);
    })
  }, [])

  const { error, isError, isLoading } = useQuery(requests, async () => {
    if (DSMInViewPort) {
      const resData = await getRequests();
      setRequests(resData);
      return resData
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


  const addRequestToDB = async (content) => {
    try {
      const reqBody = {
        content,
        type: requestType,
      }
      const resData = await makeRequest(CREATE_TEAM_REQUEST(projectId), { data: reqBody });
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).CREATED);
      return resData;
    }
    catch (err) {
      console.log(err);
      setError(err.message);
      return false;
    }
  }

  const handleEditRequest = async (content) => {
    try {
      const reqBody = {
        content,
        type: requestType,
      }
      const resData = await makeRequest(UPDATE_TEAM_REQUEST(projectId, editModalData.requestId), { data: reqBody })
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).UPDATED);
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
      return resData;
    }
    catch (err) {
      console.log(err);
      setError(err.message);
      return false;
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const resData = await makeRequest(DELETE_TEAM_REQUEST(projectId, editModalData.requestId))
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).DELETED);
      const requestData = requests.filter((request) => request.requestId !== editModalData.requestId);
      setRequests([...requestData]);
      handleEditModalClose();
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <Grid item height={gridHeightState.request.height} sx={{ ...(gridHeightState.request.expanded && { paddingBottom: '15px' }) }}>
      <Accordion expanded={gridHeightState.request.expanded} onChange={handleExpandRequests} sx={{
        height: gridHeightState.request.expanded ? '100%' : 'none',
        overflow: 'auto',
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          sx={{
            '.MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
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
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '16px',
        }}>
          {requests.map((request) => (
            <ChatContainer
              key={request.requestId}
              name={request.author}
              content={request.content}
              date={new Date(request.createdAt)}
              onClick={() => handleChatClick(request)}
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
                authorize={user.memberId === editModalData.memberId}
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
                    : (
                      <Stack spacing={1} direction="row">
                        <Chip label="Meeting" color={editModalData.type === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'} />
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
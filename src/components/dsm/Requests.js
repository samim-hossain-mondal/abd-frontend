import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, Chip, CircularProgress, useMediaQuery, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon, Done as DoneIcon } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import format from 'date-fns/format';
import { PropTypes } from 'prop-types';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';
import GenericInputModal from '../elements/dsm/GenericInputModal';
import { ErrorContext } from '../contexts/ErrorContext';
import ChatContainer from '../elements/dsm/ChatContainer';
import { DSM_REQUEST_DEFAULT_TYPE, DSM_REQUEST_INPUT_PLACEHOLDER, DSM_REQUEST_TYPES, TITLE, PRIMARY_BUTTON_TEXT, GENERIC_NAME, isRequestCompleted, DSM_REQUEST_STATUS } from '../constants/dsm/Requests';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_TEAM_REQUEST, DELETE_TEAM_REQUEST, GET_TEAM_REQUESTS_BY_DATE, UPDATE_TEAM_REQUEST } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { REFETCH_INTERVAL } from '../../config';
import { RefreshContext } from '../contexts/RefreshContext';
import { isAdmin } from '../constants/users';
/*
ISSUES: 
        1. someplace key is missing console is showing error
*/

export default function Requests({ selectedDate }) {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const { user, userRole } = useContext(ProjectUserContext);


  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const DSMInViewPort = useContext(DSMViewportContext);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext);
  
  const { projectId } = useParams();

  const handleExpandRequests = () => {
    dispatchGridHeight({ type: 'REQUEST' })
  };

  const [requests, setRequests] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [requestType, setRequestType] = useState(DSM_REQUEST_DEFAULT_TYPE);

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setEditModalData({});
    setIsDisabled(true);
    setRequestType(DSM_REQUEST_DEFAULT_TYPE);
  };

  const handleChatClick = (request) => {
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
      const resData = await makeRequest(GET_TEAM_REQUESTS_BY_DATE(projectId, format(selectedDate, 'yyyy-MM-dd')))
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
  }, [selectedDate])

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
      setError(err.message);
      return false;
    }
  }

  const handleEditRequest = async (content) => {
    try {
      const reqBody = {
        content,
        type: requestType,
        status: editModalData.status,
      }
      const resData = await makeRequest(UPDATE_TEAM_REQUEST(projectId, editModalData.requestId), { data: reqBody })
      setSuccess(() => SUCCESS_MESSAGE(GENERIC_NAME).UPDATED);
      setRequests(requests.map((request) => {
        if (request.requestId === editModalData.requestId) {
          return {
            ...resData
          }
        }
        return request;
      }));
      handleEditModalClose();
      return resData;
    }
    catch (err) {
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
    <Grid item height={gridHeightState.request.height}
      sx={{ ...(gridHeightState.request.expanded && { paddingBottom: '15px' }) }}
      marginBottom={!breakpoint1080 && !gridHeightState.request.expanded && !gridHeightState.announcement.expanded ? "40px" : 'none'
      }
    >
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
          {
            format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
              <IconButton onClick={(e) => handleAddButtonClick(e)}>
                <AddCircleIcon color="primary" />
              </IconButton>
            )
          }

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
              onClick={() => format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? handleChatClick(request) : null}
              chipContent={request.type}
              afterDate={
                isRequestCompleted(request.status) ? (
                  <DoneIcon
                    sx={{
                      fontSize: "1rem",
                      position: "relative",
                      top: "2px",
                      color: "green",
                    }}
                  />
                ) : (
                  ""
                )
              }
            />
          ))}
        </AccordionDetails>

        {
          (openEditModal) && format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
            <Dialog
              open={openEditModal}
              onClose={handleEditModalClose}
            >
              <GenericInputModal
                title={TITLE}
                onCloseButtonClick={handleEditModalClose}
                // primaryButtonText='Mark as Discussed' right now just adding save
                primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
                onPrimaryButtonClick={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? handleEditRequest : null}
                defaultValue={editModalData.content}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                deleteRequest={handleDeleteRequest}
                authorize={user.memberId === editModalData.memberId || isAdmin(userRole)}
              >
                <Typography>
                  Tags
                </Typography>
                <br />
                <Stack spacing={1} direction="row">
                  <Chip label="Meeting" onClick={isDisabled ? undefined : () => setRequestType(DSM_REQUEST_TYPES[0])} color={requestType === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'} />
                  <Chip label="Resource" onClick={isDisabled ? undefined : () => setRequestType(DSM_REQUEST_TYPES[1])} color={requestType === DSM_REQUEST_TYPES[1] ? 'primary' : 'default'} />
                </Stack>
                <br />
                {isAdmin(userRole) && !isDisabled && (
                  <>
                  {/* mui checkbox for status named as completed */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isRequestCompleted(editModalData.status)}
                          onChange={(e) => {
                            setEditModalData({
                              ...editModalData,
                              status: e.target.checked ? DSM_REQUEST_STATUS.APPROVED : DSM_REQUEST_STATUS.PENDING,
                            })
                          }}
                          name="completed"
                          color="primary"
                        />
                      }
                      label="Completed"
                    />
                  </>
                )}
              </GenericInputModal>
            </Dialog>
          )
        }
      </Accordion>
    </Grid >
  );
};

Requests.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};
/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, Chip, useMediaQuery, Tooltip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PropTypes } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext';
import GenericInputModal from '../elements/dsm/GenericInputModal';
import { ErrorContext } from '../contexts/ErrorContext';
import ChatContainer from '../elements/dsm/ChatContainer';
import { DSM_REQUEST_STATUS, DSM_REQUEST_DEFAULT_TYPE, DSM_REQUEST_INPUT_PLACEHOLDER, DSM_REQUEST_TYPES, TITLE, PRIMARY_BUTTON_TEXT, GENERIC_NAME, isRequestCompleted, WATERMARK_FOR_MEMBERS, WATERMARK_FOR_PO, HEADING, CHAR_COUNT } from '../constants/dsm/Requests';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_TEAM_REQUEST, DELETE_TEAM_REQUEST, GET_TEAM_REQUESTS, UPDATE_TEAM_REQUEST } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { REFETCH_INTERVAL } from '../../config';
import { RefreshContext } from '../contexts/RefreshContext';
import { isAdmin, isMember } from '../constants/users';
import SkeletonRequest from '../skeletons/dsm/request';
import { LoadingContext } from '../contexts/LoadingContext';
import PONotesDialog from '../poNotesComponents/PONotesDialog';
import { PO_NOTES_TYPES } from '../constants/PONotes';

export default function Requests({ selectedDate }) {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const { user, userRole } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const DSMInViewPort = useContext(DSMViewportContext);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext);
  const [loaded, setLoaded] = useState(false);
  const { projectId } = useParams();
  const { setLoading } = useContext(LoadingContext);

  const handleExpandRequests = () => {
    dispatchGridHeight({ type: 'REQUEST', userRole })
  };

  const [requests, setRequests] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [requestType, setRequestType] = useState(DSM_REQUEST_DEFAULT_TYPE);
  const [hasMore, setHasMore] = useState(true);
  const [openPONote, setOpenPONote] = useState(false);
  const [addContent, setAddContent] = useState(false);

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
    setAddContent(true);
  }

  const handleModalClose = () => {
    setOpenAddModal(false);
    setAddContent(false);
  }

  const getRequests = async (params) => {
    try {
      const resData = await makeRequest(GET_TEAM_REQUESTS(projectId), setLoading, { params })
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }
  const limit = 10;

  const fetchMoreRequests = async (isRefresh = false) => {
    const page = isRefresh ? 1 : Math.ceil(requests.length / limit) + 1;
    const resData = await getRequests({ page, limit });
    if (resData.length < limit) {
      setHasMore(false);
    }
    const updateAnnouncements = [...requests, ...resData];

    setRequests(isRefresh ? resData : updateAnnouncements);
    return resData;
  }

  if (refresh.request) {
    setRefresh(val => ({ ...val, request: false }));
    fetchMoreRequests(true).then(resData => {
      setRequests(resData);
      setHasMore(true);
    })
  }

  useEffect(() => {
    setLoaded(false);
    fetchMoreRequests(true).then((_requests) => {
      setRequests(_requests);
      setLoaded(true);
    })
  }, [selectedDate])

  const { error, isError } = useQuery("", async () => {
    if (DSMInViewPort) {
      const resData = await fetchMoreRequests(true);
      setRequests(resData);
      return resData
    }
    return [];
  },
    {
      refetchInterval: REFETCH_INTERVAL,
    }
  );

  if (isError) {
    return <div>Error! {error.message}</div>
  }

  const addRequestToDB = async (content) => {
    try {
      const reqBody = {
        content,
        type: requestType,
      }
      const resData = await makeRequest(CREATE_TEAM_REQUEST(projectId), setLoading, { data: reqBody });
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

      if (editModalData.isFlagged !== undefined) {
        reqBody.isFlagged = editModalData.isFlagged;
      }

      const resData = await makeRequest(UPDATE_TEAM_REQUEST(projectId, editModalData.requestId), setLoading, { data: reqBody })
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
      const resData = await makeRequest(DELETE_TEAM_REQUEST(projectId, editModalData.requestId), setLoading)
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


  const toggleRequestCompletion = async () => {
    editModalData.status = editModalData.status === DSM_REQUEST_STATUS.APPROVED ? DSM_REQUEST_STATUS.PENDING : DSM_REQUEST_STATUS.APPROVED;
    try {
      await handleEditRequest(editModalData.content);
      setSuccess('Request status updated successfully');
    }
    catch (err) {
      setError(err.message);
    }
  }

  const openCreateActionItemDialog = () => {
    setOpenPONote(true);
  }
  const handleClosePONote = () => {
    setOpenPONote(false);
  }

  return (
    <Grid item height={gridHeightState.request.height}
      sx={{ ...(gridHeightState.request.expanded && { paddingBottom: '15px' }) }}
      marginBottom={!breakpoint1080 && !gridHeightState.request.expanded && !gridHeightState.announcement.expanded ? "40px" : 'none'
      }
    >
      <Accordion
        id="scrollableRequestDiv"
        expanded={gridHeightState.request.expanded} onChange={handleExpandRequests} sx={{
          height: gridHeightState.request.expanded ? '100%' : 'none',
          overflow: 'auto',
        }}>
        <AccordionSummary
          expandIcon={
            <Tooltip title={gridHeightState.request.expanded ? 'Collapse' : 'Expand'} placement='top'>
              <ExpandMoreIcon />
            </Tooltip>
          }
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
          <Typography variant="dsmSubMain" fontSize='1.25rem' sx={{ textTransform: 'none' }}>{HEADING}</Typography>
          {isMember(userRole) &&
            <Tooltip title="Add Request" placement='top'>
              <IconButton onClick={(e) => handleAddButtonClick(e)}>
                <AddCircleIcon color="primary" />
              </IconButton>
            </Tooltip>
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
                fetchMoreRequests(true).then((_requests) => {
                  setRequests(_requests);
                });
                handleModalClose();
              }
            }}
            placeholder={DSM_REQUEST_INPUT_PLACEHOLDER}
            totalCharacters={CHAR_COUNT}
            authorName={user.name}
            authorId={user.userId}
            date={new Date()}
            addContent={addContent}
          >
            <Typography>
              Tags
            </Typography>
            <br />
            <Stack spacing={1} direction="row">
              <Chip label="Meeting"
                onClick={() => setRequestType(DSM_REQUEST_TYPES[0])} color={requestType === DSM_REQUEST_TYPES[0] ? 'primary' : 'default'}
              />
              <Chip label="Resource"
                onClick={() => setRequestType(DSM_REQUEST_TYPES[1])} color={requestType === DSM_REQUEST_TYPES[1] ? 'primary' : 'default'}
              />
            </Stack>
          </GenericInputModal>
        </Dialog>
        <AccordionDetails sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: loaded && requests.length === 0 ? "10% 16px" : '0 16px',
          gap: '16px',
        }}>
          {!loaded ?
            [...Array(6)].map(() =>
              <SkeletonRequest />
            )
            :
            (requests.length === 0 ?
              (
                <Box sx={{ height: "100%" }}>
                  <Typography
                    color="watermark.main"
                    fontSize='1.25rem'
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textTransform: 'none'
                    }}
                  >
                    {isMember(userRole) ? WATERMARK_FOR_MEMBERS : WATERMARK_FOR_PO}
                  </Typography>
                </Box>
              )
              :
              (<InfiniteScroll
                dataLength={requests.length}
                next={fetchMoreRequests}
                hasMore={hasMore}
                loader={
                  <Box sx={{ width: '100%' }}>
                    <SkeletonRequest />
                  </Box>
                }
                scrollableTarget="scrollableRequestDiv"
              >
                {requests.map((request, index) => (
                  <ChatContainer
                    key={request.requestId}
                    name={request.author}
                    content={request.content}
                    date={new Date(request.createdAt)}
                    previousRequestDate={index === 0 ? null : new Date(requests[index - 1]?.createdAt)}
                    onClick={() => handleChatClick(request)}
                    chipContent={request.type}
                    isRequestDone={isRequestCompleted(request.status)}
                    isRequestFlagged={request.isFlagged}
                  />
                ))}
              </InfiniteScroll >
              )
            )
          }
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
                primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
                onPrimaryButtonClick={handleEditRequest}
                defaultValue={editModalData.content}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                deleteRequest={handleDeleteRequest}
                authorize={user.memberId === editModalData.memberId}
                totalCharacters={CHAR_COUNT}
                authorName={editModalData.author}
                authorId={editModalData.memberId}
                date={new Date(editModalData.createdAt)}
                addContent={addContent}
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
                {isAdmin(userRole) && (
                  <>
                    <Button
                      variant='contained'
                      sx={{
                        margin: '8px 0',
                        padding: '8px 0',
                        width: '100%',
                        borderRadius: '8px',
                        color: 'customButton1.contrastText',
                        backgroundColor: 'customButton1.main',
                        '&:hover': {
                          color: 'customButton1.contrastText',
                          backgroundColor: 'customButton1.main',
                        },
                      }}
                      onClick={toggleRequestCompletion}>
                      Mark as {isRequestCompleted(editModalData.status) ? 'Incomplete' : 'Complete'}
                    </Button>

                    <PONotesDialog
                      open={openPONote}
                      handleClose={handleClosePONote}
                      value={editModalData?.content}
                      typeOfPONote={PO_NOTES_TYPES.ACTION_ITEM}
                      updateItem={false}
                      access={isAdmin(userRole)}
                    />
                    <Button
                      variant='contained'
                      sx={{
                        margin: '0px',
                        padding: '8px 0',
                        width: '100%',
                        borderRadius: '8px',
                        color: 'secondaryButton.contrastText',
                        backgroundColor: 'secondaryButton.main',
                        '&:hover': {
                          color: 'secondaryButton.contrastText',
                          backgroundColor: 'secondaryButton.main',
                        },
                      }}
                      onClick={openCreateActionItemDialog}>
                      Create Action Item
                    </Button>
                  </>
                )}

                {
                  user.memberId === editModalData.memberId &&
                  <Button
                    variant='contained'
                    sx={{
                      margin: '8px 0',
                      padding: '8px 0',
                      width: '100%',
                      borderRadius: '8px',
                      color: 'customButton1.contrastText',
                      backgroundColor: 'customButton1.main',
                      '&:hover': {
                        color: 'customButton1.contrastText',
                        backgroundColor: 'customButton1.main',
                      },
                    }}
                    onClick={() => {
                      editModalData.isFlagged = !editModalData.isFlagged;
                      handleEditRequest(editModalData.content);
                      setEditModalData({ ...editModalData });
                    }}
                  >
                    {editModalData.isFlagged ? 'Unflag' : 'Flag'}
                  </Button>
                }
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
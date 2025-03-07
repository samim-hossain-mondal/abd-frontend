/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Dialog, Box, Tooltip, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
// import { PropTypes } from 'prop-types';
// import { format } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DSMBodyLayoutContext } from '../contexts/DSMBodyLayoutContext'
import AnnouncementInputModal from '../elements/dsm/AnnouncementInputModal';
import AnnouncementChatContainer from '../elements/dsm/AnnouncementChatContainer';
import { ErrorContext } from '../contexts/ErrorContext';
import { CHAR_COUNT_CONTENT, CHAR_COUNT_TITLE, DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER, GENERIC_NAME, HEADING, MODAL_PRIMARY_BUTTON_TEXT, WATERMARK_FOR_MEMBERS, WATERMARK_FOR_PO } from '../constants/dsm/Announcements';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { CREATE_ANNOUNCEMENT, DELETE_ANNOUNCEMENT, UPDATE_ANNOUNCEMENT, GET_ANNOUNCEMENTS } from '../constants/apiEndpoints';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import DSMViewportContext from '../contexts/DSMViewportContext';
import { isAdmin, isMember } from '../constants/users';
import { REFETCH_INTERVAL } from '../../config';
import SkeletonAnnouncement from '../skeletons/dsm/announcement';
import { LoadingContext } from '../contexts/LoadingContext';
import InformationModel from '../elements/InformationModel';
import { AnnouncementInfo } from '../constants/AccesibilityInfo';
import MultipleSelectDropdown from '../elements/dsm/MultipleSelectDropdown';
// import dateGetter from '../utilityFunctions/DateGetter';

export default function Announcements() {
  const getElementHeight = (id) => {
    const element = document.getElementById(id);
    return element ? element.offsetHeight - 96 : 0;
  }
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const { projectId } = useParams();
  const DSMInViewPort = useContext(DSMViewportContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const { user, userRole } = useContext(ProjectUserContext)
  const [loaded, setLoaded] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext)
  const handleExpandAnnouncements = () => {
    dispatchGridHeight({ type: 'ANNOUNCEMENT', userRole })
  };
  const [accordionDetailsHeight, setAccordionDetailsHeight] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [openModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const { setLoading } = useContext(LoadingContext);

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
  const getAnnouncements = async (params) => {
    try {
      // const resData = await makeRequest(GET_ANNOUNCEMENTS_BY_DATE(projectId, dateGetter(selectedDate)))
      const resData = await makeRequest(GET_ANNOUNCEMENTS(projectId), setLoading, { params })
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  const limit = 10;

  const fetchMoreAnnouncements = async (isRefresh = false, query = {}) => {
    const page = isRefresh ? 1 : Math.ceil(announcements.length / limit) + 1;
    const resData = await getAnnouncements({ page, limit, ...query });
    if (resData.length < limit) {
      setHasMore(false);
    }
    const updateAnnouncements = [...announcements, ...resData];

    setAnnouncements(isRefresh ? resData : updateAnnouncements);
    return resData;
  }

  if (refresh.announcement) {
    setRefresh((prev) => ({ ...prev, announcement: false }));
    fetchMoreAnnouncements(true).then(resData => {
      setAnnouncements(resData);
      setHasMore(true);
    })
  }

  useEffect(() => {
    setAccordionDetailsHeight(getElementHeight('scrollableAnnouncementDiv'));
  }, [gridHeightState, announcements]);

  useEffect(() => {
    setLoaded(false);
    fetchMoreAnnouncements(true).then((_announcements) => {
      setAnnouncements(_announcements);
      setLoaded(true);
    })
  }, [])

  const { error, isError } = useQuery("", async () => {
    if (DSMInViewPort) {
      const resData = await fetchMoreAnnouncements(true);
      setAnnouncements(resData);
      return resData;
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

  const addAnnouncementToDB = async (content, title) => {
    try {
      const reqBody = {
        content,
        title
      }
      const resData = await makeRequest(CREATE_ANNOUNCEMENT(projectId), setLoading, { data: reqBody })
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).CREATED);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  const handleEditAnnouncement = async (content, title) => {
    try {
      const reqBody = {
        content,
        title
      }
      const resData = await makeRequest(UPDATE_ANNOUNCEMENT(projectId, editModalData?.announcementId), setLoading, { data: reqBody })
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
      const resData = await makeRequest(DELETE_ANNOUNCEMENT(projectId, editModalData?.announcementId, setLoading))
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
      marginTop={!breakpoint1080 && !gridHeightState.request.expanded && !gridHeightState.announcement.expanded ? "8px" : 'none'}
    >
      <Accordion
        id="scrollableAnnouncementDiv"
        expanded={gridHeightState.announcement.expanded} onChange={handleExpandAnnouncements}
        sx={{
          height: gridHeightState.announcement.expanded ? '100%' : 'none',
          paddingBottom: '16px'
        }}
      >
        <AccordionSummary
          expandIcon={
            <Tooltip title={gridHeightState.announcement.expanded ? 'Collapse' : 'Expand'}>
              <ExpandMoreIcon />
            </Tooltip>
          }
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
          <Box sx={{ display: 'flex', justifyContent: "flex-start", alignItems: "center" }}>
            <Typography variant="dsmSubMain" fontSize='1.25rem' sx={{ textTransform: 'none' }}>
              {HEADING}
            </Typography>
            <InformationModel
              heading={AnnouncementInfo.heading}
              definition={AnnouncementInfo.definition}
              accessibiltyInformation={AnnouncementInfo.accessibiltyInformation}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: "flex-start", gap: "8px", alignItems: "center" }}>
            <Tooltip title="Quick Filter" placement='top'>
              <IconButton>
                <MultipleSelectDropdown isAnnouncement filters={filters} setFilters={setFilters} fetchMore={fetchMoreAnnouncements} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
              </IconButton>
            </Tooltip>
            {
              (isAdmin(userRole) && (
                <Tooltip title="Add Announcement">
                  <IconButton onClick={handleAddButtonClick}>
                    <AddCircleIcon color="primary" />
                  </IconButton>
                </Tooltip>
              ))
            }
          </Box>
        </AccordionSummary>
        <Dialog
          open={openModal}
          onClose={handleModalClose}
          sx={{ zIndex: "900" }}
        >
          <AnnouncementInputModal
            onCloseButtonClick={handleModalClose}
            primaryButtonText={MODAL_PRIMARY_BUTTON_TEXT}
            onPrimaryButtonClick={async (content, title) => {
              const newAnnouncement = await addAnnouncementToDB(content, title);
              if (newAnnouncement) {
                fetchMoreAnnouncements(true).then(resData => {
                  setAnnouncements(resData);
                });
                handleModalClose();
              }
            }}
            placeholder={DSM_ANNOUNCEMENT_INPUT_PLACEHOLDER}
            totalCharactersTitle={CHAR_COUNT_TITLE}
            totalCharactersContent={CHAR_COUNT_CONTENT}
          />

        </Dialog>
        <AccordionDetails
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: loaded && announcements.length === 0 ? "none" : '0 16px',
            gap: '16px',
            height: `${accordionDetailsHeight}px`,
            overflow: 'scroll',
          }}>
          {!loaded ?
            [...Array(6)].map(() =>
              <SkeletonAnnouncement />
            )
            :
            (announcements.length === 0 ?
              (
                <Box sx={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                dataLength={announcements.length}
                next={fetchMoreAnnouncements}
                // style={{ display: 'flex', flexDirection: 'column-reverse' }} // To put endMessage and loader to the top.
                // inverse //
                hasMore={hasMore}
                loader={
                  <Box sx={{ width: '100%' }}>
                    <SkeletonAnnouncement />
                  </Box>
                }
                scrollThreshold="90%"
                scrollableTarget="scrollableAnnouncementDiv"
              >
                {announcements.map((announcement, index) => (
                  <Box
                    id={`${announcement.announcementId}scrollableDiv`}
                  >
                    <AnnouncementChatContainer
                      key={announcement.announcementId}
                      name={announcement.author}
                      title={announcement.title}
                      content={announcement.content}
                      date={new Date(announcement.createdAt)}
                      previousRequestDate={index === 0 ? null : new Date(announcements[index - 1]?.createdAt)}
                      onClick={() => handleChatClick(announcement)}
                    />
                  </Box>
                ))}
              </InfiniteScroll>
              )
            )
          }
        </AccordionDetails>
        {
          (openEditModal) && (
            <Dialog
              open={openEditModal}
              onClose={handleEditModalClose}
              sx={{ zIndex: "900" }}
            >
              <AnnouncementInputModal
                authorName={editModalData?.author}
                createdDate={new Date(editModalData?.createdAt)}
                openEditModal={openEditModal}
                onCloseButtonClick={handleEditModalClose}
                primaryButtonText={MODAL_PRIMARY_BUTTON_TEXT}
                onPrimaryButtonClick={handleEditAnnouncement}
                defaultValue={editModalData?.content}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                deleteRequest={handleDeleteAnnouncement}
                authorize={user.memberId === editModalData?.memberId}
                title={editModalData?.title}
                totalCharactersTitle={CHAR_COUNT_TITLE}
                totalCharactersContent={CHAR_COUNT_CONTENT}
              />
            </Dialog>
          )
        }
      </Accordion>
    </ Grid >
  );
};

Announcements.propTypes = {
  // selectedDate: PropTypes.instanceOf(Date).isRequired,
};
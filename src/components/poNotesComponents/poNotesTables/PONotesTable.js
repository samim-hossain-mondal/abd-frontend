/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import PONotesTableHeader from './poNotesTablesHeader/PONotesTableHeader';
import CustomCard from '../../cards/CustomCard';
import { REFETCH_INTERVAL } from '../../../config';
import { HEADINGS } from '../../utilityFunctions/Enums';
import { ErrorContext } from '../../contexts/ErrorContext';
import { RefreshContext } from '../../contexts/RefreshContext';
import PONotesViewportContext from '../../contexts/PONotesViewportContext';
import makeRequest from '../../utilityFunctions/makeRequest/index';
import { GET_PO_NOTES } from '../../constants/apiEndpoints';
import { PO_NOTES_TYPES, WATERMARK } from '../../constants/PONotes';
import { isMember } from '../../constants/users';
import { ProjectUserContext } from '../../contexts/ProjectUserContext';
import SkeletonPONote from '../../skeletons/poNote';
import { LoadingContext } from '../../contexts/LoadingContext';

const getApiUrlQuery = (type, query, page, limit) => {
  const apiQuery = {
    type,
    page,
    limit,
    ...(query.status && type !== PO_NOTES_TYPES.KEY_DECISION && {
      status: query.status
    }),
    ...(query.search && {
      search: query.search
    }),
    ...(query.startDate && {
      startDate: query.startDate
    }),
    ...(query.endDate && {
      endDate: query.endDate
    })

  }
  return apiQuery;
};

export default function PONotesTable(props) {
  const { setError } = useContext(ErrorContext);
  const { projectId } = useParams()
  const [poNotes, setPONotes] = useState([])
  const { refresh, setRefresh } = useContext(RefreshContext);
  const PONotesinViewPort = useContext(PONotesViewportContext);
  const { setLoading } = useContext(LoadingContext);

  const { heading, definition, accessibilityInformation, query, checkBox } = props;
  const type = HEADINGS[heading].toUpperCase();
  const [loaded, setLoaded] = useState(false);

  const limit = 10;
  const [countOfItems, setCountOfItems] = useState(0);

  const { userRole } = useContext(ProjectUserContext);

  const getPONotes = async (params) => {
    try {
      const resData = await makeRequest(GET_PO_NOTES(projectId), setLoading, { params })
      return resData;
    }
    catch (err) {
      setError(err.message);
      return { notes: [], totalCount: 0 };
    }
  }

  const fetchMorePONoteData = async (isRefresh = false) => {
    const page = isRefresh ? 1 : Math.ceil(poNotes.length / limit) + 1;

    const apiUrlQueryWithPagination = getApiUrlQuery(type, query, page, limit);
    const resData = await getPONotes(apiUrlQueryWithPagination);
    const updatePONotes = [...poNotes, ...resData.notes];

    setPONotes(isRefresh ? resData.notes : updatePONotes);
    return resData;
  }


  useEffect(() => {
    setLoaded(false);
    fetchMorePONoteData(true).then(resData => {
      setPONotes(resData.notes);
      setCountOfItems(resData.totalCount ?? 0);
      setLoaded(true);
    })
  }, [query]);

  if (refresh.poNotes) {
    setRefresh(val => ({ ...val, poNotes: false }));
    fetchMorePONoteData(true).then(resData => {
      setPONotes(resData.notes);
      setCountOfItems(resData.totalCount ?? 0);
    })
  }

  const { error, isError, isLoading } = useQuery(HEADINGS[heading], async () => {
    try {
      if (!PONotesinViewPort) {
        return [];
      }
      const apiUrlQueryWithPagination = getApiUrlQuery(type, query, 1, limit);
      const dataRes = await getPONotes(apiUrlQueryWithPagination);
      setPONotes(dataRes.notes);
      return dataRes;
    } catch (err) {
      setError(err.message);
      return [];
    }
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

  return (
    poNotes ?
      <Box
        sx={{
          width: "100%"
        }}>
        <Box component={Paper} sx={{ height: '80vh', width: "100%" }}>
          <Box aria-label='simple table'>
            <Box>
              <Box align='center' sx={{
                p: '16px',
                backgroundColor: 'poNotesHeader.main',
                color: 'poNotesHeader.contrastText'
              }}
              >
                <Box>
                  <PONotesTableHeader heading={heading}
                    definition={definition}
                    accessibilityInformation={accessibilityInformation}
                    countOfItems={countOfItems} />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                id={`scrollableDiv${heading}`}
                sx={{
                  height: 'calc(80vh - 60px)',
                  overflowY: 'auto',
                  backgroundColor: 'backgroundColor.secondary'
                }}>
                {!loaded ?
                  [...Array(10)].map(() =>
                    <SkeletonPONote />
                  )
                  :
                  (
                    poNotes.length === 0 ?
                      (<Box sx={{ height: "100%" }}>
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
                          {isMember(userRole) ? WATERMARK[type] : WATERMARK[type]}
                        </Typography>
                      </Box>)
                      :
                      (<InfiniteScroll
                        dataLength={poNotes.length}
                        next={fetchMorePONoteData}
                        hasMore={countOfItems > poNotes.length}
                        loader={
                          <Box sx={{ width: '100%' }}>
                            <SkeletonPONote />
                          </Box>
                        }
                        scrollableTarget={`scrollableDiv${heading}`}
                      >
                        {poNotes.map((item, index) => (
                          <CustomCard
                            key={item.noteId}
                            checkBox={checkBox}
                            type={type}
                            data={item}
                            previousRequestDate={index === 0 ? null : new Date(poNotes[index - 1]?.createdAt)} />
                        ))
                        }
                      </InfiniteScroll>
                      )
                  )
                }
              </Box>
            </Box>
          </Box>
        </Box>
      </Box> :
      <Box>Loading....</Box>
  )
}

PONotesTable.propTypes = {
  definition: PropTypes.string.isRequired,
  checkBox: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  accessibilityInformation: PropTypes.string.isRequired,
  query: PropTypes.shape({
    status: PropTypes.string,
    search: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
}
import React, { useContext, useEffect, useState } from 'react';
import { Box, Paper, CircularProgress, LinearProgress } from '@mui/material'
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
import { PO_NOTES_TYPES } from '../../constants/PONotes';

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

  const { heading, definition, accessibilityInformation, query, checkBox } = props;
  const type = HEADINGS[heading].toUpperCase();

  const limit = 10;
  const [countOfItems, setCountOfItems] = useState(0);

  // const breakpoint500 = useMediaQuery('(min-width:500px)');

  const getPONotes = async (params) => {
    try {
      const resData = await makeRequest(GET_PO_NOTES(projectId), { params })
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
    fetchMorePONoteData(true).then(resData => {
      setPONotes(resData.notes);
      setCountOfItems(resData.totalCount ?? 0);
    })
  }, [query]);

  if (refresh.poNotes) {
    fetchMorePONoteData(true).then(resData => {
      setPONotes(resData.notes);
      setCountOfItems(resData.totalCount ?? 0);
    })
    setRefresh(val => ({ ...val, poNotes: false }));
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

                <InfiniteScroll
                  dataLength={poNotes.length}
                  next={fetchMorePONoteData}
                  // style={{ display: 'flex', flexDirection: 'column-reverse' }} // To put endMessage and loader to the top.
                  // inverse //
                  hasMore={countOfItems > poNotes.length}
                  loader={
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                  }
                  scrollableTarget={`scrollableDiv${heading}`}
                >
                  {
                    poNotes.map((item) => (
                      <CustomCard
                        key={item.noteId}
                        checkBox={checkBox}
                        type={type}
                        data={item} />
                    ))
                  }
                </InfiniteScroll>
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
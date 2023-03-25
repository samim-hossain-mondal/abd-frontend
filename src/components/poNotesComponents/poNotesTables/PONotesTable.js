import { Paper, CircularProgress, useMediaQuery } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import PONotesTableHeader from './poNotesTablesHeader/PONotesTableHeader';
import CardLayout from '../../cards/CardLayout';
import { REFETCH_INTERVAL } from '../../../config';
import { HEADINGS } from '../../utilityFunctions/Enums';
import { ErrorContext } from '../../contexts/ErrorContext';
import { RefreshContext } from '../../contexts/RefreshContext';
import PONotesViewportContext from '../../contexts/PONotesViewportContext';
import makeRequest from '../../utilityFunctions/makeRequest/index';
import { GET_PO_NOTES } from '../../constants/apiEndpoints';
// import getAccessToken from '../../utilityFunctions/getAccessToken';

// query params for get Api call
const getStatusQuery = (type, status) => {
  if (type === 'KEY_DECISION' && status !== 'DRAFT') return '';
  return `&status=${status}`;
}
const getApiUrlQuery = (type, query, page, limit) => {
  const apiQuery = {
    type,
    page,
    limit,
    ...(query.status && {
      status: getStatusQuery(type, query.status)
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
// table for the action items
export default function PONotesTable(props) {
  const { setError } = useContext(ErrorContext);
  const { projectId } = useParams()
  const [poNotes, setPONotes] = useState([])
  const { refresh, setRefresh } = useContext(RefreshContext);
  const PONotesinViewPort = useContext(PONotesViewportContext);

  const { heading, definition, accessibilityInformation, query, checkBox } = props;

  const type = HEADINGS[heading].toUpperCase();
  const apiUrlQuery = getApiUrlQuery(type, query, 1, 100);

  const breakpoint500 = useMediaQuery('(min-width:500px)');

  const getPONotes = async () => {
    try {
      const resData = await makeRequest(GET_PO_NOTES(projectId), { params: apiUrlQuery })
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  useEffect(() => {
    getPONotes().then(resData => {
      setPONotes(resData);
    })
  }, [query]);

  if (refresh.poNotes) {
    getPONotes().then(resData => {
      setPONotes(resData);
    })
    setRefresh(val => ({ ...val, poNotes: false }));
  }

  const { error, isError, isLoading } = useQuery(HEADINGS[heading], async () => {
    try {
      if (!PONotesinViewPort) {
        return [];
      }
      const dataRes = await getPONotes();
      setPONotes(dataRes)
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
  const countOfItems = poNotes.length;
  return (
    poNotes ?
      <Box sx={{ width: (breakpoint500) ? '480px' : '280px' }}>
        <Box component={Paper} sx={{ height: '80vh' }}>
          <Box aria-label='simple table'>
            <Box>
              <Box align='center' sx={{
                p: '16px',
                backgroundColor: 'poNotesHeader.main',
                color: 'poNotesHeader.contrastText'
              }}
              >
                {/* calling the action item table header and passing count of action items in the table as props in countOfItems variable */}
                <Box>
                  {/* Information regarding each PO Notes type(Action Items, Key decisions and Agenda Items are passed as props to table header) */}
                  <PONotesTableHeader heading={heading}
                    definition={definition}
                    accessibilityInformation={accessibilityInformation}
                    countOfItems={countOfItems} />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box>
                {/* Data from get Api call using query params is passed to cardlayout for displaying it in cards */}
                <CardLayout checkBox={checkBox} type={HEADINGS[heading]} data={poNotes} /> </Box>
            </Box>
          </Box>
        </Box>
      </Box> :
      <Box>Loading....</Box>
  )
}
// props validation
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
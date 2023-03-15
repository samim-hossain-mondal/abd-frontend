import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress } from '@mui/material'
import React from 'react'
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
// import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import PONotsTableHeader from './poNotesTablesHeader/PONotesTableHeader';
import CardLayout from '../../cards/CardLayout';
import { DOMAIN } from '../../../config';
import { HEADINGS } from "../../utilityFunctions/Enums";
// import getAccessToken from '../../utilityFunctions/getAccessToken';

// query params for get Api call
const getStatusQuery = (type, status) => {
    if (type === 'KEY_DECISION' && status !== 'DRAFT') return '';
    return `&status=${status}`;
}
const getApiUrl = (type, query, page, limit) => {
    let queryParams = `type=${type}&page=${page}&limit=${limit}`;
    queryParams += query.status ? getStatusQuery(type, query.status) : '';
    queryParams += query.search ? `&search=${query.search}` : '';
    queryParams += query.startDate ? `&startDate=${query.startDate}` : '';
    queryParams += query.endDate ? `&endDate=${query.endDate}` : '';
    return `${DOMAIN}/api/po-notes?${queryParams}`;
};
// table for the action items
export default function PONotesTable(props) {
    const { heading, definition, accessibilityInformation, query, checkBox } = props;
    // const { authState } = useOktaAuth();
    // need to add page & limit to the query
    const type = HEADINGS[heading].toUpperCase();
    const apiUrl = getApiUrl(type, query, 1, 100);
    // console.log(apiUrl);

    const { data, error, isError, isLoading } = useQuery(HEADINGS[heading], async () => {
        try {
            const res = await axios.get(apiUrl);
            return res.data;
        } catch (err) {
            if (err.response) {
                return new Error(err.response.data.message);
            }
            return new Error(err.message);
        }
    },
        {
            refetchInterval: 1000,
        }
    );
    if (isLoading) {
        return <CircularProgress />
    }
    if (isError) {
        return <div>Error! {error.message}</div>
    }
    const countOfItems = data.length;
    return (
        <Box sx={{ width: '500px' }}>
            <TableContainer component={Paper} sx={{ height: '100vh' }}>
                <Table stickyHeader aria-label='simple table'>
                    <TableHead>
                        <TableRow align='center'>
                            {/* calling the action item table header and passing count of action items in the table as props in countOfItems variable */}
                            <TableCell>
                                {/* Information regarding each PO Notes type(Action Items, Key decisions and Agenda Items are passed as props to table header) */}
                                <PONotsTableHeader heading={heading}
                                    definition={definition}
                                    accessibilityInformation={accessibilityInformation}
                                    countOfItems={countOfItems} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        <TableRow>
                            {/* Data from get Api call using query params is passed to cardlayout for displaying it in cards */}
                            <CardLayout checkBox={checkBox} type={HEADINGS[heading]} data={data ?? []} /> </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
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
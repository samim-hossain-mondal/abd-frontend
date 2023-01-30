import React from 'react';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Box, Paper } from '@mui/material';

import CardLayout from '../../Cards/CardLayout';
import ActionItemsTableHeader from './PONotesTablesHeader/ActionItemsTableHeader'

function ActionItemsTable() {
  return (
    <Box sx={{ width: '600px' }}>
      <TableContainer sx={{
        background: '#EEF2F5',
        height: '725px',
        maxHeight: '1000px',
        Width: '500px',
        width: '100%',
        flexGrow: -5
      }}
        component={Paper}  >
        <Table stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow align='center'>
              <TableCell align='center' sx={{
                backgroundColor: '#051C2C',
                borderradius: '0px', color: '#FFFFFF'
              }}><ActionItemsTableHeader countOfItems={0} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            <TableRow> <CardLayout /> </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActionItemsTable;

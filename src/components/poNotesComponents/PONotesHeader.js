import React, { useState } from 'react';
import { Box, AppBar, Container, InputLabel, FormControl, Toolbar, Typography, Popover, Select } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import SearchBar from '../utilityFunctions/SearchBar';
import AddPONotes from './AddPONotes';
import QuickFilterPopover from './poNotesTables/poNotesTablesHeader/QuickFilterPopover';
import { quickFilterSanitizerPONotes } from '../utilityFunctions/filters';

export default function PONotesHeader({ query, setQuery }) {
  const [positioningReferenceElement, setPositioningReferenceElement] = useState(null);
  const handleQuickFilterClick = (event) => {
    setPositioningReferenceElement(event.currentTarget);
  };

  const handleClose = () => {
    setPositioningReferenceElement(null);
  };

  const open = Boolean(positioningReferenceElement);
  const id = open ? 'simple-popover' : undefined;
  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xl" padding='0' margin='0'>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
            <Typography
              data-testid="poNotesIdentifier"
              variant="h5"
              noWrap
              sx={{ ml: 5, fontWeight: 500, letterSpacing: '.025rem', color: 'secondary.main', textDecoration: 'none' }}
            >
              PO Notes
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0.2, display: { xs: 'none', md: 'flex' } }}>
            <Box sx={{ flexGrow: 0.5 }}>
              <SearchBar query={query} setQuery={setQuery} />
            </Box>
            <FormControl id="demo-select-small" sx={{ minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small">
                <Box display='flex' align-items='center'>
                  Quick Filters
                  &nbsp;
                  <FilterAltOutlinedIcon fontSize='small' />
                </Box>
              </InputLabel>
              <Select
                labelId="quick-filter-popover"
                aria-describedby={id}
                label="Quick Filters Icon"
                onClick={handleQuickFilterClick}
                disabled
              />
              <Popover
                id='quick-filter-popover'
                open={open}
                anchorEl={positioningReferenceElement}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <QuickFilterPopover query={query} onChange={async (filters) => {
                  const sanitizedFilters = quickFilterSanitizerPONotes(filters)
                  // sanitizedFilters is an object with the following structure
                  // {
                  //   status: ['PENDING', 'COMPLETED', 'DRAFT'] | undefined,
                  //   startDate: Date | undefined,
                  //   endDate: Date | undefined,
                  // }

                  setQuery({
                    ...query,
                    ...sanitizedFilters
                  });
                }} />
              </Popover>
            </FormControl>
          </Box>
          <Box sx={{ mr: 5, display: { xs: 'none', md: 'flex' } }}>
            <AddPONotes updateItem={false} data={{ status: "DRAT", noteType: "ACTION_ITEM", note: "hello", dueDate: "kk" }} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
}

PONotesHeader.propTypes = {
  query: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  setQuery: PropTypes.func.isRequired,
}
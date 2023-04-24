import React, { useState } from 'react';
import {
  Box,
  AppBar,
  InputLabel,
  FormControl,
  Typography,
  Popover,
  Select,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import SearchBar from '../utilityFunctions/SearchBar';
import QuickFilterPopover from './poNotesTables/poNotesTablesHeader/QuickFilterPopover';
import { quickFilterSanitizerPONotes } from '../utilityFunctions/filters';
import InformationModel from '../elements/InformationModel';
import { PONotesInfo } from '../constants/AccesibilityInfo';

export default function PONotesHeader({ query, setQuery }) {
  const [positioningReferenceElement, setPositioningReferenceElement] = useState(null);
  const handleQuickFilterClick = (event) => {
    setPositioningReferenceElement(event.currentTarget);
  };
  const handleClose = () => {
    setPositioningReferenceElement(null);
  };

  const aboveTablet = useMediaQuery('(min-width: 650px)');
  const breakPoint510 = useMediaQuery('(max-width:510px)');
  const breakpoint391 = useMediaQuery('(min-width: 391px)');
  const open = Boolean(positioningReferenceElement);
  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: breakPoint510 ? '15px 5px 15px 5px' : '25px 50px 25px 50px' }}>
          <Box
            height={aboveTablet ? "auto" : "60px"}
            sx={{ flexGrow: 2, display: { md: 'flex' } }}
          >
            <Typography
              height="100%"
              display="flex"
              alignItems="center"
              data-testid="poNotesIdentifier"
              variant={aboveTablet ? 'h5' : 'h6'}
              noWrap
              fontSize="1.5rem"
              sx={{ fontWeight: 500, letterSpacing: '.025rem', color: 'secondary.main', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              PO Notes
              <InformationModel
                heading={PONotesInfo.heading}
                definition={PONotesInfo.definition}
                accessibiltyInformation={PONotesInfo.accessibilityInformation}
              />
            </Typography>
          </Box>
          <Box
            sx={{ flexGrow: 0.2, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', marginBottom: aboveTablet ? "none" : "20px" }}
          >
            <Tooltip title='Search PO Notes' placement='top'>
              <Box sx={{ mr: 1 }}>
                <SearchBar query={query} setQuery={setQuery} />
              </Box>
            </Tooltip>
            <FormControl id="demo-select-small" sx={{ minWidth: breakpoint391 ? '200px' : "148px" }} size="small">
              <InputLabel id="demo-select-small">
                <Box display='flex' align-items='center'>
                  Quick Filters
                  &nbsp;
                  <FilterAltOutlinedIcon fontSize='small' />
                </Box>
              </InputLabel>
              <Tooltip title='Filter PO Notes' placement='top'>
                <Select
                  labelId="quick-filter-popover"
                  aria-describedby={id}
                  label="Quick Filters Icon"
                  onClick={handleQuickFilterClick}
                  value=""
                  disabled
                />
              </Tooltip>
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
                  const sanitizedFilters = quickFilterSanitizerPONotes(filters);
                  setQuery({
                    ...query,
                    ...sanitizedFilters
                  });
                }} />
              </Popover>
            </FormControl>
          </Box>
        </Box>
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
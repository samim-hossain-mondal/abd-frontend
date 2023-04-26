import * as React from 'react';
import { PropTypes } from 'prop-types'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Popover, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Box } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import IconCheckbox from '../poNotes/IconCheckbox';

export default function MultipleSelectDropdown({ filters, setFilters, anchorEl, setAnchorEl, fetchMore, isAnnouncement }) {

  const allowedRequestStatusFilters = {
    Completed: 'APPROVED',
    Pending: 'PENDING',
  }

  const allowedRequestTypeFilters = {
    Resource: "RESOURCE",
    Meeting: "MEETING"
  }

  useEffect(() => {
    fetchMore(true, filters).then(() => { })
  }, [filters]);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);
  };

  const preventParentClicks = (event) => {
    event.stopPropagation();
    event.preventDefault();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const mainBoxPadding = '16px';

  return (
    <Box sx={{ display: "flex", alignItems: "center" }} onClick={preventParentClicks} >
      <FilterAltIcon onClick={handleClick} color="primary" sx={{ aspectRatio: "1/1" }} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            borderRadius: '8px',
            width: '176px',
            p: mainBoxPadding,
            boxSizing: 'border-box',
          }}
          color="quickFilterPopover"
        >
          <Box>
            <TextField id="standard-basic" value={filters.search}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SearchIcon /> Search Filter
                </Box>
              }
              variant="standard"
              sx={{
                marginBottom: '4px',
                fontWeight: '900',
              }}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  search: e.target.value || undefined
                })
              }}
            />
            {!isAnnouncement &&
              <Box>
                <Typography
                  sx={{
                    marginTop: '16px',
                    marginBottom: '8px',
                    fontWeight: '900',
                  }}
                >
                  Type Filters
                </Typography>
                {Object.keys(allowedRequestTypeFilters).map((type) => (
                  <IconCheckbox
                    label={type}
                    isChecked={filters.type === allowedRequestTypeFilters[type]}
                    onChange={(isChecked) => {
                      setFilters({
                        ...filters,
                        type: isChecked ? allowedRequestTypeFilters[type] : undefined,
                      });
                    }}
                  />
                ))}
                <Typography
                  sx={{
                    marginTop: '16px',
                    marginBottom: '8px',
                    fontWeight: '900',
                  }}
                >
                  Status Filters
                </Typography>
                {Object.keys(allowedRequestStatusFilters).map((status) => (
                  <IconCheckbox
                    label={status}
                    isChecked={filters.status === allowedRequestStatusFilters[status]}
                    onChange={(isChecked) => {
                      setFilters({
                        ...filters,
                        status: isChecked ? allowedRequestStatusFilters[status] : undefined,
                      });
                    }}
                  />
                ))}
              </Box>
            }
          </Box>
        </Box>
      </Popover>
    </Box >
  );
}

MultipleSelectDropdown.propTypes = {
  filters: PropTypes.shape({
    type: PropTypes.string,
    status: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  fetchMore: PropTypes.func.isRequired,
  anchorEl: PropTypes.string.isRequired,
  setAnchorEl: PropTypes.func.isRequired,
  isAnnouncement: PropTypes.bool
}

MultipleSelectDropdown.defaultProps = {
  isAnnouncement: false
}
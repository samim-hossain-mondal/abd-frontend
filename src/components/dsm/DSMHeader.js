import React from 'react';
import { AppBar, Typography, Box, Container, Toolbar, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { PropTypes } from 'prop-types';

export default function DSMHeader({ handleDate }) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleDate(date);
  };

  const handleDecrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    handleDate(newDate);
  };

  const handleIncrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const currentDate = new Date();
    if (newDate > currentDate) {
      setSelectedDate(currentDate);
      handleDate(currentDate);
    } else {
      setSelectedDate(newDate);
      handleDate(newDate);
    }
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: 'primary.light', padding: '5px' }} />
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }} >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography
                data-testid="poNotesIdentifier"
                variant="h5"
                noWrap
                sx={{ ml: 5, fontWeight: 500, letterSpacing: '.025rem', color: 'secondary.main', textDecoration: 'none' }}
              >
                Daily Standup (DSM)
              </Typography>
              <Box sx={{ display: 'flex', alignContent: 'center' }}>
                <Tooltip title="Previous Date" placement="top">
                  <IconButton onClick={handleDecrementDate}>
                    <ArrowLeft />
                  </IconButton>
                </Tooltip>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    slots={{ openPickerIcon: ExpandMoreIcon }}
                    value={selectedDate}
                    format="LLLL d, yyyy"
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
                <Tooltip title="Next Date" placement="top">
                  <IconButton onClick={handleIncrementDate}>
                    <ArrowRight />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box >
  );
};

DSMHeader.propTypes = {
  handleDate: PropTypes.func.isRequired,
};
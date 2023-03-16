import { React, useState } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';

export default function ErrorSnackbar({ message, setError }) {
  const clickAway= 'clickaway';
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === clickAway) {
      return;
    }
    setOpen(val => !val);
    setError(() => '');
  };
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
    </Stack>
  );
}
ErrorSnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
};
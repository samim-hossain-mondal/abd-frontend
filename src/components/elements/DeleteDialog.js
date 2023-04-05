import React from 'react';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';
import PropTypes from 'prop-types';

export default function DeleteDialog({ open, setOpen, handleDelete, description }) {

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async (e) => {
    await handleDelete(e);
    setOpen(false);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1), 0px 24px 48px rgba(0, 0, 0, 0.2)',
          borderRadius: '2px',
          zIndex: "900"
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="error" >
            <Typography variant="button" color='primary.main'>Yes</Typography>
          </Button>
          <Button onClick={handleClose} variant="button" color='primary.main' autoFocus>
            <Typography variant="button" color='primary.main'>No</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
};
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

export default function DeleteDialog({ open, setOpen, handleDelete, description }) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async (e) => {
    await handleDelete(e);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1), 0px 24px 48px rgba(0, 0, 0, 0.2)',
          borderRadius: '2px'
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
    </div >
  );
}

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
};
import { React, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  fontFamily: 'Roboto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
export default function NestedModal(props) {
  // props destructuring
  /* props contains values for heading, definition and accessibility information of the selected
  PO notes type (Action item or Key decision or Agenda item) */
  const { heading, definition, accessibiltyInformation } = props;
  const [open, setOpen] = useState(false);
  // function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };
  // function to close the modal
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ paddingLeft: '0.5%' }}>
      {/* Icon to open the modal */}
      <InfoOutlinedIcon sx={{ fontSize: '22px' }} onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        {/* Modal content */}
        <Box sx={{ ...style }}  >

          {/** Heading of the PO notes type (Action item or Key decision or Agenda item) */}
          <h2 id="parent-modal-title">
            <b>{heading} </b>
          </h2>
          {/** Definition of the PO notes type (Action item or Key decision or Agenda item) */}
          <p id="parent-modal-description">
            <b>{heading}</b>{definition}
          </p>
          {/** Accessibility information of the (Action item or Key decision or Agenda item) */}
          <p id="parent-modal-description">
            {accessibiltyInformation}
          </p>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row-reverse'
          }}>
            {/* Button to close the modal */}
            <Button onClick={handleClose}>OK</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
// Props validation
NestedModal.propTypes = {
  heading: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
  accessibiltyInformation: PropTypes.string.isRequired
}
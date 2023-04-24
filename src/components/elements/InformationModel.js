import { React, useState } from 'react';
import { Typography, Box, Modal, Button, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 280,
  maxWidth: 450,
  fontFamily: 'Roboto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function NestedModal(props) {
  const { heading, definition, accessibiltyInformation } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = (e) => {
    setOpen(true);
    e.stopPropagation();
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Tooltip title="Click for more info" placement='top'>
      <Box sx={{ paddingLeft: '0.5%', display: 'flex', alignItems: 'center' }}>
        <InfoOutlinedIcon
          sx={{
            fontSize: 'large',
            color: 'primary.main',
            borderRadius: '50%',
            ml: '15%',
            cursor: 'pointer',
          }}
          onClick={handleOpen}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}  >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box>
                <Typography variant='h4'> {heading} </Typography>
              </Box>
              <Box>
                <Typography>
                  <Box fontWeight='bold' display='inline'>{heading}</Box>
                  {definition}
                </Typography>
                <Typography>
                  {accessibiltyInformation}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row-reverse'
            }}>
              <Button onClick={handleClose}>OK</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Tooltip>
  );
}

NestedModal.propTypes = {
  heading: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
  accessibiltyInformation: PropTypes.string.isRequired
}
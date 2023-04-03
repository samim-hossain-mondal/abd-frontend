import React, { useContext, useState } from 'react';
import { Box, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import propTypes from 'prop-types';
import { isAdmin } from '../constants/users';
import PONotesDialog from './PONotesDialog';
import { ProjectUserContext } from '../contexts/ProjectUserContext';

export default function AddPONotes({ defaultValue }) {
  const breakpoint500 = useMediaQuery('(min-width:500px)');
  const [addNote, setAddNote] = useState(false);
  const { userRole } = useContext(ProjectUserContext)

  const handleNoteOpener = () => {
    setAddNote(!addNote);
  };

  return (
    <Box sx={{ flexGrow: 0.2, display: { md: 'flex' } }}>
      {isAdmin(userRole) &&
        <Tooltip title='Add PO Notes' placement='top'>
          <IconButton data-testid="AddPONotesFormIdentifier" aria-label="Add Notes"
            component="label" sx={{ color: 'primary.main', padding: "0" }} >
            <AddRoundedIcon onClick={handleNoteOpener} fontSize={breakpoint500 ? 'medium' : 'small'}
              sx={{ backgroundColor: 'backgroundColor.secondary', borderRadius: '50%' }} />
          </IconButton>
        </Tooltip>
      }
      <PONotesDialog defaultValue={defaultValue} updateItem={false} open={addNote} handleClose={handleNoteOpener} access={isAdmin(userRole)} />
    </Box >
  );
};

AddPONotes.propTypes = {
  defaultValue: propTypes.string.isRequired,
};
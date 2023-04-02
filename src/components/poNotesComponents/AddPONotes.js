import React, { useContext, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import QueueSharpIcon from '@mui/icons-material/QueueSharp';
import PONotesDialog from './PONotesDialog';
import { ProjectUserContext } from '../contexts/ProjectUserContext';

export default function AddPONotes() {

  const [addNote, setAddNote] = useState(false);
  const { userRole } = useContext(ProjectUserContext)

  const handleNoteOpener = () => {
    setAddNote(!addNote);
  };

  return (
    <Box sx={{ flexGrow: 0.2, display: { md: 'flex' } }}>
      {userRole === "ADMIN" &&
      <Tooltip title='Add PO Notes' placement='top'>
        <IconButton data-testid="AddPONotesFormIdentifier" aria-label="Add Notes"
          component="label" sx={{ color: 'primary.main', padding: "0" }} onClick={handleNoteOpener}>
          <QueueSharpIcon fontSize='large' />
        </IconButton>
      </Tooltip>
      }
      <PONotesDialog updateItem={false} open={addNote} handleClose={handleNoteOpener} access={userRole === "ADMIN"} />
    </Box >
  );
};
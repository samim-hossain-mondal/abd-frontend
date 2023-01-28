import React from "react";

import { Box, IconButton, TextField, Button, Dialog, ListItem, List, Typography, MenuItem, FormControl, AppBar, Toolbar, InputLabel, Select } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import QueueSharpIcon from '@mui/icons-material/QueueSharp';

import Transition from '../utilityFunctions/overlayTransition';
import Timeline from "../utilityFunctions/timeline";

function AddPoNotes() {

  let noteVal = 10;
  const [addNote, setAddNote] = React.useState(false);
  const [noteType, setNoteType] = React.useState(10);
  const [addtimeline,setTimeline] = React.useState(true);

  const addNoteOpener = () => {
    setAddNote(true);
  };
  const addNoteCloser = () => {
    setAddNote(false);
  };

  const timelineHandler = ()=>{
    if(noteVal===10){
      setTimeline(true);
    }
    else{
      setTimeline(false);
    }
  };

  const noteTypeHandler = (event) => {
    noteVal=event.target.value;
    setNoteType(noteVal);
    timelineHandler(noteType);
  };

  return (
    <Box sx={{ flexGrow: 0.2, display: { xs: 'none', md: 'flex' } }}>
      <IconButton aria-label="Add Notes" component="label" sx={{ color: "#2258F5" }} onClick={addNoteOpener}>
        <QueueSharpIcon fontSize='large' />
      </IconButton>
      <Dialog
        maxWidth
        open={addNote}
        onClose={addNoteCloser}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#2258F5' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={addNoteCloser}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add a Note
            </Typography>
            <Button autoFocus color="inherit" onClick={addNoteCloser}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box>
          <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '25px' }}>PO Note Type</Typography>
          <List>
            <ListItem>
              <Box sx={{ flexGrow: 0.2, display: { xs: 'none', md: 'flex' } }}>
                <FormControl sx={{ minWidth: 350 }} size="small">
                  <InputLabel id="demo-select-small-2"> Select Note Type </InputLabel>
                  <Select
                    labelId="demo-select-small-2"
                    id="demo-select-small-2"
                    value={noteType}
                    label="note type"
                    onChange={noteTypeHandler}
                  >
                    <MenuItem value={10}>Action Item</MenuItem>
                    <MenuItem value={20}>Key Decision</MenuItem>
                    <MenuItem value={30}>Agenda Item</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </ListItem>
          </List>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '20px' }}>Statement</Typography>
          <List>
            <ListItem>
              <TextField
                sx={{ width: 350 }}
                label="Type here..."
                id="outlined-multiline-static"
                multiline
                rows={5}
                variant="outlined"
              />
            </ListItem>
          </List>
        </Box>
        {addtimeline&&<Timeline/>}
      </Dialog>
    </Box>
  );
};

export default AddPoNotes;
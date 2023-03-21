import React, { useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Box, IconButton, Dialog, ListItem, List, Typography, MenuItem, Button, FormControl, InputLabel, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Transition from '../utilityFunctions/OverlayTransition';
import Timeline from '../utilityFunctions/Timeline';
import { DOMAIN } from '../../config';
import { PLACEHOLDER } from '../utilityFunctions/Enums';
import { ErrorContext } from '../contexts/ErrorContext';
import DeleteDialog from '../elements/DeleteDialog';
import RichTextArea from '../elements/RichTextArea';

const getNextDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const dateString = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  return dateString;
};

const getISODateToTimlineFormat = (isoDate = '') => {
  try {
    const dateString = isoDate.substring(0, isoDate.indexOf('T'));
    return dateString || null;
  }
  catch (er) {
    return null
  }

};

export default function PONotesDialog({ updateItem, data, open, handleClose }) {
  const { setError, setSuccess } = useContext(ErrorContext);
  const [lock, setLock] = useState(updateItem)

  const [timeline, setTimeline] =
    useState(
      updateItem ?
        getISODateToTimlineFormat(data?.dueDate) :
        getNextDate(1)
    );
  const [type, setType] = useState(updateItem ? data?.type : 'ACTION_ITEM');
  const [statement, setStatement] = useState(updateItem ? data?.note : '');
  const [issueLink, setIssueLink] = useState(updateItem ? data?.issueLink ?? '' : '');
  const getEditColor = () => (updateItem && !lock) ? 'primary.main' : 'secondary.main'
  const handleEditIcon = () => {
    setLock(!lock);
  };

  const isPublished = () => data?.status !== 'DRAFT'

  const isSave = () => updateItem
  const isSaveDraft = () => (isPublished() || !updateItem)
  const isPublish = () => (!isPublished() || !updateItem)



  const handleSubmit = async (status) => {
    setLock(val => !val);
    try {

      let body =
      {
        'type': type,
        'note': statement,
        'status': status,
      };

      if (type === 'ACTION_ITEM' && updateItem) body.issueLink = issueLink;

      if (type === 'ACTION_ITEM') body = { ...body, ...({ 'dueDate': timeline === '' ? null : timeline }) }


      if (updateItem) {
        await axios.patch(`${DOMAIN}/api/po-notes/${data.noteId}`, body);
        const response = 'Note UPDATED successfully';
        setSuccess(() => response);
      }
      else {
        await axios.post(`${DOMAIN}/api/po-notes`, body);
        const response = 'Note ADDED successfully';
        setSuccess(() => response);
      }
    }
    catch (err) {
      setError(val => val + err);
    }
    finally {
      if (updateItem) setLock(true);
      else {
        setLock(val => !val);
        setStatement(() => '');
      }
      handleClose();
    }
  };


  const handleDraft = () => {
    handleSubmit('DRAFT');
  };

  const handleSave = () => {
    handleSubmit(type === 'KEY_DECISION' && data.status !== 'DRAFT' ? 'NONE' : data.status);
  };

  const handlePublish = () => {
    handleSubmit(type === 'KEY_DECISION' ? 'NONE' : 'PENDING');
  };

  const handleNoteType = (event) => {
    setType(event.target.value);
  };

  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleDeleteAlert = () => {
    setDeleteAlert(true);
  }
  const handleDelete = async () => {
    try {
      await axios.delete(`${DOMAIN}/api/po-notes/${data.noteId}`);
      const response = 'Note DELETED successfully';
      setSuccess(() => response);
    }
    catch (err) {
      setError(val => val + err);
    }
    finally {
      setDeleteAlert(() => false);
      handleClose();
    }
  }

  return (
    <Box>
      <DeleteDialog open={deleteAlert} setOpen={setDeleteAlert} handleDelete={handleDelete} description="Are you sure to delete this PO Note?" />
      <Dialog
        disabled
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Grid container rowSpacing={1} paddingTop="2%" textAlign="center" alignItems="center"  >
          <Grid item xs={3}>
            <IconButton
              edge="start"
              color="error"
              onClick={handleDeleteAlert}
              aria-label="close"
              disabled={!updateItem}
            >
              <DeleteForeverRoundedIcon sx={{ color: 'secondary.main', visibility: updateItem ? '' : 'hidden' }} />
            </IconButton>
          </Grid>
          <Grid item xs={5} sx={{ visibility: 'hidden' }} />
          <Grid item xs={2} >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditIcon}
              aria-label="close"
              disabled={!updateItem}
            >
              <EditRoundedIcon sx={{ color: getEditColor(), visibility: updateItem ? '' : 'hidden' }} />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon sx={{ color: 'secondary.main' }} />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ position: 'static', backgroundColor: 'primary.contrastText' }} />
        <Box>
          <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '1px' }}>PO Note Type</Typography>
          <List>
            <ListItem>
              <Box sx={{ flexGrow: 0.2, display: { md: 'flex' } }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="demo-select-small-2">Note Type</InputLabel>
                  <Select
                    data-testid="noteTypeSelect"
                    labelId="demo-select-small-2"
                    id="demo-select-small-2"
                    value={type}
                    label="note type"
                    onChange={handleNoteType}
                    disabled={lock}
                  >
                    <MenuItem value='ACTION_ITEM'>Action Item</MenuItem>
                    <MenuItem value='KEY_DECISION'>Key Decision</MenuItem>
                    <MenuItem value='AGENDA_ITEM'>Agenda Item</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </ListItem>
          </List>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '20px' }}>Smart Statement</Typography>
          <List>
            <ListItem>
              <RichTextArea
                sx={{
                  multiline: true,
                  rows: 4,
                  fontSize: '16px',
                  lineHeight: '20px',
                  width: '260px',
                  height: '150px',
                  padding: '15px 20px',
                  border: '2px solid #ccc',
                  fontFamily: 'Roboto, sans-serif',
                }}
                value={statement}
                setContent={setStatement}
                disabled={lock}
                placeholder={PLACEHOLDER[type]}
              />
            </ListItem>
          </List>
        </Box>
        { updateItem && type === 'ACTION_ITEM' && <Box>
          <Typography style={{ fontWeight: 700, marginLeft: '20px', marginTop: '20px' }} >Issue Link</Typography>
          <List>
            <ListItem>
              <TextField 
                sx={{ width: '100%' }}
                type='url' 
                value={issueLink} 
                onChange={(e) => setIssueLink(e.target.value.trim())} 
                disabled={lock} 
                placeholder={lock ? '' : 'https://example.com'}
              />
            </ListItem>
          </List>
        </Box>}
        <Box>
          {type === 'ACTION_ITEM' && <Timeline isSubmit={lock} timeline={timeline} setTimeline={setTimeline} />}
        </Box>
        {isPublish() && (<Box>
          {(statement.trim() !== '') && !lock &&
            <Link style={{ textDecoration: 'none' }} to='/po-notes'>
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color='customButton1' onClick={handlePublish} sx={{ borderRadius: '8px', width: '292px', heigth: '49px' }}>
                  Publish
                </Button>
              </Box>
            </Link>
          }
        </Box>
        )}
        {isSave() && (<Box>
          {(statement.trim() !== '') && (issueLink.trim() !== '') && !lock &&
            <Link style={{ textDecoration: 'none' }} to='/po-notes'>
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color={isPublish() ? 'customButton2' : 'customButton1'} onClick={handleSave} sx={{ borderRadius: '8px', width: '292px', heigth: '49px' }}>
                  Save
                </Button>
              </Box>
            </Link>
          }
        </Box>
        )}
        {isSaveDraft() && (<Box>
          {(statement.trim() !== '') && (issueLink.trim() !== '') && !lock &&
            <Link style={{ textDecoration: 'none' }} to='/po-notes'>
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color='customButton2' onClick={handleDraft} sx={{ borderRadius: '8px', width: '292px', heigth: '49px' }}>
                  Save as Draft
                </Button>
              </Box>
            </Link>
          }
        </Box>
        )}
      </Dialog >
    </Box>
  );
};

PONotesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  updateItem: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    noteId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    status: PropTypes.string.isRequired,
    issueLink: PropTypes.string
  }),
};

PONotesDialog.defaultProps = {
  data: undefined
}
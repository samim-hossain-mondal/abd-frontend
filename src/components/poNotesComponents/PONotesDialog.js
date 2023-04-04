/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Box,
  IconButton,
  Dialog,
  ListItem,
  List,
  Typography,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { actionItems, keyDecisions, GENERIC_NAME, noteTypes, PO_NOTES_TYPES, CHAR_COUNT } from '../constants/PONotes';
import Transition from '../utilityFunctions/OverlayTransition';
import Timeline from '../utilityFunctions/Timeline';
import { PLACEHOLDER } from '../utilityFunctions/Enums';
import { ErrorContext } from '../contexts/ErrorContext';
import DeleteDialog from '../elements/DeleteDialog';
import RichTextArea from '../elements/RichTextArea';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { CREATE_PO_NOTE, DELETE_PO_NOTE, PATCH_PO_NOTE } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { isAdmin } from '../constants/users';
import { RefreshContext } from '../contexts/RefreshContext';
import { LoadingContext } from '../contexts/LoadingContext';

// const getNextDate = (days) => {
//   const date = new Date();
//   date.setDate(date.getDate() + days);
//   const dateString = date
//     .toISOString()
//     .substring(0, date.toISOString().indexOf("T"));
//   return dateString;
// };

const getISODateToTimlineFormat = (isoDate = '') => {
  try {
    const dateString = isoDate.substring(0, isoDate.indexOf("T"));
    return dateString || null;
  } catch (er) {
    return null;
  }
};

export default function PONotesDialog({ value, defaultValue, updateItem, data, open, handleClose, access, typeOfPONote }) {
  const { setError, setSuccess } = useContext(ErrorContext);
  const [lock, setLock] = useState(updateItem)
  const { projectId } = useParams();
  const { userRole } = useContext(ProjectUserContext)
  const { setRefresh } = useContext(RefreshContext);
  const { setLoading } = useContext(LoadingContext);

  const [timeline, setTimeline] =
    useState(
      updateItem ?
        getISODateToTimlineFormat(data?.dueDate) :
        ""
    );

  const [type, setType] = useState(
    typeOfPONote ?? (
      updateItem ?
        data?.type : (
          defaultValue === actionItems.heading ? PO_NOTES_TYPES.ACTION_ITEM :
            (defaultValue === keyDecisions.heading ? PO_NOTES_TYPES.KEY_DECISION : PO_NOTES_TYPES.AGENDA_ITEM)
        )
    )
  );
  const [statement, setStatement] = useState(updateItem ? data?.note : value);
  const [issueLink, setIssueLink] = useState(
    updateItem ?
      (data?.issueLink ? data?.issueLink : '') : ''
  );

  const getEditColor = () => (updateItem && !lock) ? 'primary.main' : 'secondary.main'
  const handleEditIcon = () => {
    setLock(!lock);
  };

  const isPublished = () => data?.status !== 'DRAFT'

  const isSave = () => updateItem;
  const isSaveDraft = () => isPublished() || !updateItem;
  const isPublish = () => !isPublished() || !updateItem;

  const handleSubmit = async (status) => {
    setLock((val) => !val);
    try {

      let body =
      {
        'type': type,
        'note': statement,
        'status': status,
      };

      if (type === PO_NOTES_TYPES.ACTION_ITEM) body = {
        ...body, ...({
          'dueDate': timeline === '' ? null : timeline,
          'issueLink': issueLink === '' ? null : issueLink
        })
      }

      if (updateItem) {
        if (!isAdmin(userRole)) {
          setError("ACCESS DENIED: ADMIN's can perform this action")
          return;
        }
        await makeRequest(PATCH_PO_NOTE(projectId, data.noteId), setLoading, { data: body })
        setRefresh(refresh => ({ ...refresh, poNotes: true }));
        setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED);
      }
      else {
        await makeRequest(CREATE_PO_NOTE(projectId), setLoading, { data: body })
        setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).CREATED);
        setRefresh(refresh => ({ ...refresh, poNotes: true }));
      }
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      if (updateItem) setLock(true);
      else {
        setLock((val) => !val);
        setStatement(() => "");
      }
      handleClose();
    }
  };

  const handleDraft = () => {
    handleSubmit("DRAFT");
  };

  const handleSave = () => {
    handleSubmit(type === PO_NOTES_TYPES.KEY_DECISION && data.status !== 'DRAFT' ? 'NONE' : data.status);
  };

  const handlePublish = () => {
    handleSubmit(type === PO_NOTES_TYPES.KEY_DECISION ? 'NONE' : 'PENDING');
  };

  const handleNoteType = (event) => {
    setType(event.target.value);
  };

  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleDeleteAlert = () => {
    setDeleteAlert(true);
  };
  const handleDelete = async () => {
    try {
      if (!isAdmin(userRole)) {
        setError("ACCESS DENIED: ADMIN's can perform this action")
        return;
      }
      await makeRequest(DELETE_PO_NOTE(projectId, data?.noteId), setLoading)
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).DELETED);
      setRefresh(refresh => ({ ...refresh, poNotes: true }));
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setDeleteAlert(() => false);
      handleClose();
    }
  };

  return (
    <Box>
      <DeleteDialog open={deleteAlert} setOpen={setDeleteAlert} handleDelete={handleDelete}
        description="Are you sure to delete this PO Note?"
      />
      <Dialog
        disabled
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Grid container rowSpacing={1} paddingTop="2%" textAlign="center" alignItems="center"  >
          {access &&
            <Grid item xs={3}>
              <Tooltip title="Delete" placement="top">
                <IconButton
                  edge="start"
                  color="error"
                  onClick={handleDeleteAlert}
                  aria-label="close"
                  disabled={!updateItem}
                >
                  <DeleteForeverRoundedIcon sx={{ color: 'secondary.main', visibility: updateItem ? '' : 'hidden' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          }
          <Grid item xs={!access ? 10 : 5} sx={{ visibility: 'hidden' }} />
          {access &&
            <Grid item xs={2} >
              <Tooltip title='Edit' placement='top'>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleEditIcon}
                  aria-label="close"
                  disabled={!updateItem}
                >
                  <EditRoundedIcon sx={{ color: getEditColor(), visibility: updateItem ? '' : 'hidden' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          }
          <Grid item xs={2}>
            <Tooltip title="Close" placement="top">
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon sx={{ color: "secondary.main" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Box
          sx={{ position: "static", backgroundColor: "primary.contrastText" }}
        />
        <Box>
          <Typography
            sx={{ fontWeight: 700, ml: "15px" }}
          >
            PO Note Type
          </Typography>
          <List>
            <ListItem sx={{ display: 'flex', pt: 0 }}>
              <Box sx={{ display: { md: 'flex' }, flexGrow: 1 }}>
                <FormControl sx={{ flexGrow: 1, width: '100%' }} size="medium">
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
                    <MenuItem value="ACTION_ITEM">{noteTypes[0]}</MenuItem>
                    <MenuItem value="KEY_DECISION">{noteTypes[1]}</MenuItem>
                    <MenuItem value="AGENDA_ITEM">{noteTypes[2]}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ pb: '16px' }}>
          <Typography
            sx={{ fontWeight: 700, ml: "15px" }}
          >
            Smart Statement
          </Typography>
          <List>
            <ListItem sx={{ p: 0, ml: '8px', mr: '8px', width: 'auto' }}>
              <RichTextArea
                sx={{
                  multiline: true,
                  rows: 4,
                  fontSize: '16px',
                  lineHeight: '20px',
                  width: '260px',
                  height: '150px',
                  margin: '0px',
                  padding: '15px 20px',
                  border: '2px solid #ccc',
                  fontFamily: 'Roboto, sans-serif',
                }}
                value={statement}
                setContent={setStatement}
                disabled={lock}
                placeholder={PLACEHOLDER[type]}
                totalCharacters={CHAR_COUNT[type]}
              />
            </ListItem>
          </List>
        </Box>
        {
          type === PO_NOTES_TYPES.ACTION_ITEM && (statement.trim() !== '') &&
          <Box>
            <Typography sx={{ fontWeight: 700, ml: '15px' }} >Issue Link
              <Box sx={{ display: 'inline', fontSize: '0.75rem' }}> (optional)</Box>
            </Typography>
            <List>
              <ListItem sx={{ pt: 0, pb: 0 }}>
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
          </Box>
        }
        <Box>
          {
            type === "ACTION_ITEM" && (statement.trim() !== '') &&
            <Timeline
              isSubmit={lock}
              timeline={timeline}
              setTimeline={setTimeline}
            />
          }
        </Box>
        {isPublish() && (
          <Box>
            {(statement.trim() !== '') && !lock &&
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color='customButton1' onClick={handlePublish}
                  sx={{ borderRadius: '8px', width: '90%', ml: '16px', mr: '16px' }}
                >
                  Publish
                </Button>
              </Box>
            }
          </Box>
        )}
        {isSave() && (
          <Box>
            {(statement.trim() !== '') && !lock &&
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color={isPublish() ? 'customButton2' : 'customButton1'} onClick={handleSave}
                  sx={{ borderRadius: '8px', width: '90%', ml: '16px', mr: '16px' }} >
                  Save
                </Button>
              </Box>
            }
          </Box>
        )}
        {isSaveDraft() && (
          <Box>
            {(statement.trim() !== '') && !lock &&
              <Box textAlign='center' sx={{ marginTop: '6px', marginBottom: '6px' }}>
                <Button variant="contained" color='customButton2' onClick={handleDraft}
                  sx={{ borderRadius: '8px', width: '90%', ml: '16px', mr: '16px' }}>
                  Save as Draft
                </Button>
              </Box>
            }
          </Box>
        )}
      </Dialog >
    </Box >
  );
};

PONotesDialog.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  updateItem: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  access: PropTypes.bool.isRequired,
  typeOfPONote: PropTypes.string,
  value: PropTypes.string,
};

PONotesDialog.defaultProps = {
  typeOfPONote: undefined,
  value: '',
};
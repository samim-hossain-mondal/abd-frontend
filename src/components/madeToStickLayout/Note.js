/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-assign */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
import React, { useState, useEffect, useContext } from 'react';
import proptypes from 'prop-types';
import { useOktaAuth } from '@okta/okta-react';
import { TextareaAutosize } from "@mui/base";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from '@mui/icons-material/Done';
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NOTE_TYPES } from '../constants/MadeToStick';
import getAccessToken from '../utilityFunctions/getAccessToken';
import {DOMAIN} from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';

export default function Note({
  card, isEdit, handleCloseButton, handleEditImgLink, handleDelete, handleImageInputChange, handleCardInputChange, handleSave, isPO, handleReset
  , numberOfEdits, setNumberOfEdits
}) {
  const { authState } = useOktaAuth();
  const token = getAccessToken(authState);
  const [editButton, setEditButton] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [cardData, setCardData] = useState(null);
  const { setError } = useContext(ErrorContext);
  // Edge case need to be solved later, when we save layout from madetostick itself, then how to handle discard.
  useEffect(() => {
    setCardData(card);
  }, [editButton]);

  const handleEditButton = (value) => {
    if(value === true) {
      if(numberOfEdits !== 0) {
        setError("You have unsaved changes. Please save or discard them before editing another card.");
        return;
      }
      setEditButton(value);
      setNumberOfEdits(numberOfEdits + 1);
      return;
    }
    setNumberOfEdits(numberOfEdits - 1);
    if (value === false) {
      handleSave();
      setEditButton(value);
    }
  };
  class MyUploadAdapter {
    constructor(loader) {
      // The file loader instance to use during the upload.
      this.loader = loader;
    }

    // Starts the upload process.
    upload() {
      return this.loader.file
        .then(file => new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }));
    }

    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();

      // Note that your request may look different. It is up to you and your editor
      // integration to choose the right communication channel. This example uses
      // a POST request with JSON as a data structure but your configuration
      // could be different.
      xhr.open('POST',`${DOMAIN}/api/upload`, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      // setting auth header
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;

      xhr.addEventListener('error', () => reject(genericErrorText));
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const response = xhr.response;

        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if (!response || response.error) {
          return reject(response && response.error ? response.error.message : genericErrorText);
        }

        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        // This URL will be used to display the image in the content. Learn more in the
        // UploadAdapter#upload documentation.
        resolve({
          default: response.url?.replace('us-east-1', 'ap-south-1') ?? response.url
        });
      });

      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', evt => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
      // Prepare the form data.
      const data = new FormData();

      data.append('upload', file);

      // Important note: This is the right place to implement security mechanisms
      // like authentication and CSRF protection. For instance, you can use
      // XMLHttpRequest.setRequestHeader() to set the request headers containing
      // the CSRF token generated earlier by your application.

      // Send the request.
      this.xhr.send(data);
    }
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }
  return (
    <Box
      className="card"
      sx={{
        backgroundColor: "#EEF2F5",
        overflow: 'scroll',
        "&:hover .edit-Value": { opacity: 1 }
      }}
      style={{
        background:
          card.type === NOTE_TYPES.IMAGE
            ? `url(${card.value}) no-repeat center center/cover`
            : card.backgroundColor, height: "100%", width: "100%",
      }}
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => setShowIcons(false)}
    >
      <Box className="card-text">
        <Box sx={{ display: "flex" }}>
          <Box className="edit-Value"
            sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap" }}
          >
            {
              card.type === NOTE_TYPES.IMAGE &&
              (!isEdit) && (isPO) &&
              card.value.length !== 0 &&
              card.value !== "Enter your image url here" && (
                <Box
                  sx={{ fontFamily: "Roboto", padding: '3px' }}
                >
                  <Tooltip title="Edit Image" placement='top'>
                    <IconButton onClick={() => { handleEditImgLink(card.i) }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }

            {
              card.type === NOTE_TYPES.IMAGE && (
                (card.value.length === 0 || card.value === "Enter your image url here") && (
                  (!isEdit) && (isPO) && (
                    <Box
                      sx={{ fontFamily: "Roboto", padding: '3px' }}
                    >
                      <Tooltip title="Edit Image" placement='top'>
                        <IconButton onClick={() => { handleEditImgLink(card.i) }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                )
              )
            }

            {
              card.type === NOTE_TYPES.IMAGE && (isPO) && (
                <Box
                  sx={{ fontFamily: "Roboto", padding: '3px' }}
                  className="hover-edit-delete-pin"
                >
                  <Tooltip title="Delete" placement='top'>
                    <IconButton onClick={() => { handleDelete(card.i) }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          </Box>
          {
            card.type === NOTE_TYPES.IMAGE && isEdit === card.i && (isPO) && (
              <Box
                sx={{ fontFamily: "Roboto", padding: '3px', display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}
              >
                <Tooltip title="Save" placement='top'>
                  <IconButton onClick={handleCloseButton}>
                    <DoneIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }
        </Box>
        <Box
          sx={{ height: "auto", width: "auto", padding: "3px" }}
        >
          {
            card.type === NOTE_TYPES.TEXT && (
              <Box sx={{
                backgroundColor: "backgroundColor.secondary",
                "&:hover .hover-edit-delete-pin": { opacity: 1 }
              }}>
                <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box
                    className="hover-edit-delete-pin"
                    sx={{ display: "flex", opacity: 1, flexDirection: "row", flexWrap: "wrap" }}
                  >

                    {/* USER only needs to see edit icon if they are not editing the note */}
                    {
                      !editButton && (isPO) && (showIcons) && (
                        <Tooltip title="Edit" placement='top'>
                          <IconButton onClick={() => { handleEditButton(true) }} >
                            <EditIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    {
                      (isPO) && (showIcons) && (
                        <Tooltip title="Delete" placement='top'>
                          <IconButton onClick={() => { 
                              if(editButton) {
                                setNumberOfEdits(numberOfEdits - 1);
                              }
                              handleDelete(card.i);
                            }}
                          >
                            <DeleteIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} onClick={() => { handleDelete(card.i) }} />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  </Box>

                  {/* USER only needs to see pin icon if they are editing the note. Ii will be ALWAYS visible to remind user to save */}
                  {
                    editButton && (isPO) && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >

                        <Button 
                          onClick={() => {
                            setEditButton(false);
                            setNumberOfEdits(numberOfEdits - 1);
                            handleReset(cardData);
                          }} 
                          sx={{ padding: "3px 3px 0px 3px", cursor: 'pointer', textTransform: 'none' }}
                        >
                          Discard
                        </Button>

                        <Button
                          onClick={() => { handleEditButton(false) }}
                          sx={{ padding: "3px 3px 0px 3px", cursor: 'pointer', textTransform: 'none' }}
                        >
                          Save
                        </Button>
                      </Box>
                    )
                  }

                </Box>
                <Box onClick={(e) => e.stopPropagation()}>
                  {
                    editButton && (
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          toolbar: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'link',
                            'bulletedList',
                            'numberedList',
                            'blockQuote',
                            'insertTable',
                            'undo',
                            'redo',
                            'uploadImage'
                          ],
                          extraPlugins: [uploadPlugin],
                        }}
                        onChange={(event, editor) => handleCardInputChange(card.i, editor)}
                        data={card.value}
                      />
                    )
                  }
                  {
                    !editButton && (
                      <CKEditor
                        disabled
                        editor={ClassicEditor}
                        config={{ toolbar: [] }}
                        onChange={(event, editor) => handleCardInputChange(card.i, event, editor)}
                        data={card.value}
                      />
                    )
                  }
                </Box>
                <style>{`.ck.ck-editor__main>.ck-editor__editable {background-color: #EEF2F5; border: transparent; font-family: Roboto;}`}</style>
                <style>{`.ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-toolbar, .ck.ck-editor__top .ck-sticky-panel .ck-toolbar.ck-rounded-corners { border: none`}</style>
              </Box>
            )}
          {card.type === NOTE_TYPES.IMAGE && isEdit === card.i && (
            <TextareaAutosize
              style={{ width: "95%", overflow: "hidden", opacity: 0.5, fontFamily: "Roboto", border: "1px solid black", fontSize: "large", padding: "10px" }}
              value={card.value}
              name={card.i}
              onChange={handleImageInputChange}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

Note.propTypes = {
  card: proptypes.shape({
    i: proptypes.number,
    type: proptypes.string,
    value: proptypes.string,
    backgroundColor: proptypes.string,
  }).isRequired,
  isEdit: proptypes.number.isRequired,
  handleCloseButton: proptypes.func.isRequired,
  handleEditImgLink: proptypes.func.isRequired,
  handleDelete: proptypes.func.isRequired,
  handleImageInputChange: proptypes.func.isRequired,
  handleCardInputChange: proptypes.func.isRequired,
  handleSave: proptypes.func,
  isPO: proptypes.bool,
  handleReset: proptypes.func,
  numberOfEdits: proptypes.number,
  setNumberOfEdits: proptypes.func,
};

Note.defaultProps = {
  handleSave: () => { },
  isPO: false,
  handleReset: () => { },
  numberOfEdits: 0,
  setNumberOfEdits: () => { },
};
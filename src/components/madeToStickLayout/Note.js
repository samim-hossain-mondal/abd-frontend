/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import proptypes from 'prop-types';
import { TextareaAutosize } from "@mui/base";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from "@mui/icons-material/Edit";
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { Box, IconButton, Tooltip } from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NOTE_TYPES } from '../constants/MadeToStick';

export default function Note({
  card, isEdit, handleCloseButton, handleEditImgLink, handleDelete, handleImageInputChange, handleCardInputChange, handleSave
}) {
  const [editButton, setEditButton] = useState(false);
  const handleEditButton = (value) => {
    setEditButton(value);
    handleSave();
  };
  return (
    <Box
      className="card"
      sx={{
        backgroundColor: "#EEF2F5",
        "&:hover .edit-Value": { opacity: 1 }
      }}
      style={{
        background:
          card.type === NOTE_TYPES.IMAGE
            ? `url(${card.value}) no-repeat center center/cover`
            : card.backgroundColor, height: "100%", width: "100%",
      }}
    >
      <Box className="card-text">
        <Box sx={{ display: "flex" }}>
          <Box className="edit-Value"
            sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap" }}
          >
            {card.type === NOTE_TYPES.IMAGE &&
              (!isEdit)  &&
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

            {card.type === NOTE_TYPES.IMAGE &&
              (card.value.length === 0 || card.value === "Enter your image url here") &&
              (!isEdit)  && (
                <Box
                  sx={{ fontFamily: "Roboto", padding: '3px' }}
                >
                  <Tooltip title="Edit Image" placement='top'>
                    <IconButton onClick={() => { handleEditImgLink(card.i) }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {card.type === NOTE_TYPES.IMAGE && (
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
              )}
          </Box>
          {card.type === NOTE_TYPES.IMAGE && isEdit === card.i && (
            <Box
              sx={{ fontFamily: "Roboto", padding: '3px', display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}
            >
              <Tooltip title="Save" placement='top'>
                <IconButton onClick={handleCloseButton}>
                  <PushPinRoundedIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        <Box
          sx={{ height: "auto", width: "auto", padding: "3px" }}
        >
          {card.type === NOTE_TYPES.TEXT && (
            <Box sx={{
              backgroundColor: "#EEF2F5",
              "&:hover .hover-edit-delete-pin": { opacity: 1 }
            }}>
              <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box className="hover-edit-delete-pin" sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap"}}>

                  {/* USER only needs to see edit icon if they are not editing the note */}
                  {
                    !editButton &&(
                      <Tooltip title="Edit" placement='top'>
                        <IconButton onClick={() => { handleEditButton(true) }} >
                          <EditIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }

                  <Tooltip title="Delete" placement='top'>
                    <IconButton onClick={() => { handleDelete(card.i) }}>
                      <DeleteIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} onClick={() => { handleDelete(card.i) }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {/* USER only needs to see pin icon if they are editing the note. Ii will be ALWAYS visible to remind user to save */}
                {
                  editButton &&(
                    <Box 
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      <Tooltip title="Save" placement='top'>
                        <IconButton onClick={() => { handleEditButton(false) }}>
                          <PushPinRoundedIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                }
                
              </Box>
              <Box onClick={(e) => e.stopPropagation()}>
                {editButton &&
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
                      ]
                    }}
                    onChange={(event, editor) => handleCardInputChange(card.i, editor)}
                    data={card.value}
                  />
                }
                {!editButton &&
                  <CKEditor
                    disabled
                    editor={ClassicEditor}
                    config={{ toolbar: [] }}
                    onChange={(event, editor) => handleCardInputChange(card.i, event, editor)}
                    data={card.value}
                  />
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
};

Note.defaultProps = {
  handleSave: () => {},
};
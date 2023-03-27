/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import proptypes from 'prop-types';
import CloseIcon from "@mui/icons-material/Close";
import { TextareaAutosize } from "@mui/base";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from "@mui/icons-material/Edit";
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { Box, IconButton } from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Note({
  card, userId, isEdit, handleCloseButton, handleEditImgLink, handleDelete, handleImageInputChange, handleCardInputChange
}) {
  const [editButton, setEditButton] = useState(false);

  const handleEditButton = (value) => {
    setEditButton(value);
  };

  return (
    <Box
      className="card"
      sx={{
        backgroundColor: "#EEF2F5",
        "&:hover": { opacity: 1 },
        "&:hover .edit-Value": { opacity: 1 }
      }}
      style={{
        background:
          card.type === "IMAGE"
            ? `url(${card.value}) no-repeat center center/cover`
            : card.backgroundColor, height: "100%", width: "100%",
      }}
    >
      <Box className="card-text">
        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
          {card.type === "IMAGE" && isEdit === card.i && (
            <IconButton onClick={() => { handleDelete(card.i) }} disabled={card.memberId !== userId}>
              <DeleteIcon />
            </IconButton>
          )}
          <Box className="edit-Value"
            sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap" }}
          >
            {card.type === "IMAGE" &&
              isEdit === false &&
              card.value.length !== 0 &&
              card.value !== "Enter your image url here" && (
                <Box
                  style={{ fontFamily: "Roboto", padding: '3px' }}
                >
                  <IconButton onClick={() => { handleEditImgLink(card.i) }} disabled={card.memberId !== userId}>
                    <EditIcon />
                  </IconButton>
                </Box>
              )
            }
            {card.type === "IMAGE" &&
              (card.value.length === 0 || card.value === "Enter your image url here") &&
              isEdit === false && (
                <Box
                  style={{ fontFamily: "Roboto", padding: '3px' }}
                >
                  <IconButton onClick={() => { handleEditImgLink(card.i) }} disabled={card.memberId !== userId}>
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
          </Box>
          <Box>
            {card.type === "IMAGE" && isEdit === card.i && (
              <IconButton onClick={() => { handleCloseButton() }} disabled={card.memberId !== userId}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box
          sx={{ height: "auto", width: "auto", padding: "3px" }}
        >
          {card.type === "TEXT" && (
            <Box sx={{
              backgroundColor: "#EEF2F5",
              "&:hover .hover-edit-delete-pin": { opacity: 1 }
            }}>
              <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box className="hover-edit-delete-pin" sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap" }}>
                  <IconButton onClick={() => { handleEditButton(true) }} disabled={card.memberId !== userId} >
                    <EditIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                  </IconButton>
                  <IconButton onClick={() => { handleDelete(card.i) }} disabled={card.memberId !== userId} >
                    <DeleteIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} onClick={() => { handleDelete(card.i) }} />
                  </IconButton>
                </Box>
                <Box className="hover-edit-delete-pin" sx={{ display: "flex", opacity: 0, flexDirection: "row", flexWrap: "wrap" }}>
                  <IconButton onClick={() => { handleEditButton(false) }} disabled={card.memberId !== userId} >
                    <PushPinRoundedIcon style={{ padding: "3px 3px 0px 3px", cursor: 'pointer' }} />
                  </IconButton>
                </Box>
              </Box>
              <Box onClick={(e) => e.stopPropagation()}>
                {editButton &&
                  <CKEditor
                    editor={ClassicEditor}
                    disabled={card.memberId !== userId}
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
                      ],
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
              <style>{`.ck.ck-editor__main>.ck-editor__editable {background-color: #EEF2F5; border: transparent;}`}</style>
              <style>{`.ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-toolbar, .ck.ck-editor__top .ck-sticky-panel .ck-toolbar.ck-rounded-corners { border: none`}</style>
            </Box>
          )}
          {card.type === "IMAGE" && isEdit === card.i && (
            <TextareaAutosize
              style={{ width: "95%", overflow: "hidden", opacity: 0.5, fontFamily: "Roboto", backgroundColor: "white", border: "1px solid black", fontSize: "large", padding: "10px" }}
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
    memberId: proptypes.number
  }).isRequired,
  userId: proptypes.string.isRequired,
  isEdit: proptypes.number.isRequired,
  handleCloseButton: proptypes.func.isRequired,
  handleEditImgLink: proptypes.func.isRequired,
  handleDelete: proptypes.func.isRequired,
  handleImageInputChange: proptypes.func.isRequired,
  handleCardInputChange: proptypes.func.isRequired
};
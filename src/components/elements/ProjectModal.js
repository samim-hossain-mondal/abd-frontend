/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

function ProjectModal(props) {
  return (
    console.log(props),
    (
      <Dialog
        open={props.open.isOpen}
        onClose={() => {
          props.handleClose({ isOpen: false, id: null });
        }}
      >
        <Box display="flex" justifyContent="flex-end" pr={3} mt={2}>
          <CloseIcon
            onClick={() => {
              props.handleClose({ isOpen: false, id: null });
            }}
          />
        </Box>
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            value={props.projectInfo[props.open.id].projectTitle.label}
            onChange={(e) => {
              props.handleProjectTitle(props.open.id, e.target.value);
            }}
            onBlur={() => {
              props.handleEditProjectTitle(props.open.id);
            }}
            disabled={!props.projectInfo[props.open.id].isAdmin}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Description"
            type="text"
            fullWidth
            variant="standard"
            value={props.projectInfo[props.open.id].projectDescription}
            onChange={(e) => {
              props.handleProjectDescription(props.open.id, e.target.value);
            }}
            disabled={!props.projectInfo[props.open.id].isAdmin}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>Collaborators</Typography>
            <AddIcon
              disabled={!props.projectInfo[props.open.id].isAdmin}
              onClick={() => {
                props.addCollaborator(props.open.id);
              }}
            />
          </Box>
          {props.projectInfo[props.open.id].collaborators &&
            props.projectInfo[props.open.id].collaborators.map(
              (collaborator, index) => (
                <div>
                  <input
                    type="text"
                    placeholder="Email"
                    value={collaborator.email}
                    disabled={!props.projectInfo[props.open.id].isAdmin}
                    onChange={(event) =>
                      props.handleEmailChange(props.open.id, index, event)
                    }
                  />
                  <select
                    value={collaborator.role}
                    onChange={(event) =>
                      props.handleRoleChange(props.open.id, index, event)
                    }
                    disabled={!props.projectInfo[props.open.id].isAdmin}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    disabled={!props.projectInfo[props.open.id].isAdmin}
                    onClick={() =>
                      props.removeCollaborator(props.open.id, index)
                    }
                  >
                    Remove
                  </button>
                </div>
              )
            )}
        </DialogContent>
      </Dialog>
    )
  );
}

export default ProjectModal;

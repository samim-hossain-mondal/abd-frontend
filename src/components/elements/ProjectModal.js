import React from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Box,
  Input,
  Select,
  MenuItem,
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { PropTypes } from "prop-types";

function ProjectModal({
  handleClose,
  open,
  projectInfo,
  handleProjectTitle,
  handleProjectDescription,
  addCollaborator,
  handleEmailChange,
  handleRoleChange,
  removeCollaborator,
  handleEditProjectTitle,
}) {
  const Roles = ["Select Role", "Admin", "Leader", "Member"];
  const defaultCollaborator = "Select Role";
  return (
    <Dialog
      PaperProps={{
        sx: {
          position: "absolute",
          top: "48%",
          left: "69%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "400px",
          p: 2,
        },
      }}
      open={open.isOpen}
      onClose={() => {
        handleClose({ isOpen: false, id: null });
      }}
    >
      <Box display="flex" justifyContent="flex-end" pr={3} mt={2}>
        <CloseIcon
          onClick={() => {
            handleClose({ isOpen: false, id: null });
          }}
        />
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="text"
          fullWidth
          variant="standard"
          value={projectInfo[open.id].projectTitle.label}
          onChange={(e) => {
            handleProjectTitle(open.id, e.target.value);
          }}
          onBlur={() => {
            handleEditProjectTitle(open.id);
          }}
          disabled={!projectInfo[open.id].isAdmin}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Description"
          type="text"
          fullWidth
          variant="standard"
          value={projectInfo[open.id].projectDescription}
          onChange={(e) => {
            handleProjectDescription(open.id, e.target.value);
          }}
          disabled={!projectInfo[open.id].isAdmin}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          mt={1}
        >
          <Typography sx={{ fontSize: "20px" }}>Collaborators</Typography>
          <PersonAdd
            disabled={!projectInfo[open.id].isAdmin}
            onClick={() => {
              addCollaborator(open.id, projectInfo[open.id].isAdmin);
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="collabBody"
          mt={2}
        >
          {projectInfo[open.id].collaborators &&
            projectInfo[open.id].collaborators.map((collaborator, index) => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
                className="collabRow"
              >
                <Box sx={{ display: "flex" }} className="collabEmail">
                  <Input
                    type="text"
                    placeholder="Email"
                    value={collaborator.email}
                    disabled={!projectInfo[open.id].isAdmin}
                    onChange={(event) =>
                      handleEmailChange(open.id, index, event)
                    }
                  />
                </Box>
                <Box className="collabRole">
                  <Select
                    defaultValue={defaultCollaborator}
                    sx={{ height: "30px", width: "100px" }}
                    value={collaborator.role}
                    onChange={(event) =>
                      handleRoleChange(open.id, index, event)
                    }
                    disabled={!projectInfo[open.id].isAdmin}
                  >
                    {Roles.map((role) => (
                      <MenuItem value={role} key={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box
                  className="collabDelete"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DeleteIcon
                    disabled={!projectInfo[open.id].isAdmin}
                    onClick={() => {
                      removeCollaborator(open.id, index);
                    }}
                  />
                </Box>
              </Box>
            ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

ProjectModal.propTypes = {
  open: PropTypes.shape({
    isOpen: PropTypes.bool,
    id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  handleProjectTitle: PropTypes.func.isRequired,
  handleProjectDescription: PropTypes.func.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  addCollaborator: PropTypes.func.isRequired,
  removeCollaborator: PropTypes.func.isRequired,
  handleEditProjectTitle: PropTypes.func.isRequired,
  projectInfo: PropTypes.shape({
    ProjectId: PropTypes.string,
    projectTitle: PropTypes.shape({
      label: PropTypes.string,
      isEditable: PropTypes.bool,
    }),
    projectDescription: PropTypes.string,
    collaborators: PropTypes.arrayOf(
      PropTypes.shape({
        email: PropTypes.string,
        role: PropTypes.string,
      })
    ),
    isAdmin: PropTypes.bool,
  }).isRequired,
};

export default ProjectModal;

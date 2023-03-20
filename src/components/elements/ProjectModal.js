/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
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
  Button,
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
// import { PropTypes } from "prop-types";
// import axios from "axios";

function ProjectModal({
  handleClose,
  open,
  projectInfo,
  addCollaborator,
  handleEmailChange,
  handleRoleChange,
  handleSaveCollab,
  removeCollaborator,
  handleDeleteProject,
  editProjectDetails,
  handleCancelChanges,
  handleEditCollab,
}) {
  const [lock, setLock] = React.useState(true);
  const [name, setName] = React.useState(projectInfo.projectName);
  const [desc, setDesc] = React.useState(projectInfo.projectDescription);

  const projName = (title) => {
    setName(title);
  };

  const projDesc = (description) => {
    setDesc(description);
  };

  const handleLock = () => {
    setLock(!lock);
  };

  const Roles = ["ADMIN", "LEADER", "MEMBER"];
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
      open={open}
      onClose={() => {
        handleClose(false);
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-start" }} pr={3} mt={2}>
        {projectInfo.role === "ADMIN" || projectInfo.role === "LEADER" ? (
          <DeleteIcon
            onClick={() => {
              handleDeleteProject(projectInfo.projectId);
            }}
          />
        ) : null}
      </Box>
      <Box display="flex" justifyContent="flex-end" pr={3} mt={2}>
        {(projectInfo.role === "ADMIN" || projectInfo.role === "LEADER") &&
        lock ? (
          <EditIcon onClick={handleLock} />
        ) : null}
        <CloseIcon
          onClick={() => {
            handleClose(false);
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
          value={name}
          onChange={(e) => {
            projName(e.target.value);
          }}
          disabled={lock}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Description"
          type="text"
          fullWidth
          variant="standard"
          value={desc}
          onChange={(e) => {
            projDesc(e.target.value);
          }}
          disabled={lock}
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
            onClick={() => {
              addCollaborator(lock);
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="collabBody"
          mt={2}
        >
          {projectInfo &&
            projectInfo.projectMembers.map((collaborator, index) => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
                className="collabRow"
              >
                <Box sx={{ display: "flex" }} className="collabEmail">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={collaborator.email}
                    disabled={
                      lock ||
                      collaborator.role === "ADMIN" ||
                      !collaborator.isNew
                    }
                    onChange={(event) =>
                      handleEmailChange(event.target.value, index)
                    }
                  />
                </Box>
                <Box className="collabRole">
                  <Select
                    sx={{ height: "30px", width: "100px" }}
                    value={collaborator.role}
                    onChange={(event) =>
                      handleRoleChange(event.target.value, index)
                    }
                    disabled={lock || collaborator.role === "ADMIN"}
                  >
                    {Roles.map((role) => (
                      <MenuItem value={role} key={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {!lock ? (
                  <Box
                    className="collabIcon"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {console.log(collaborator.isNew)}
                    {!collaborator.isNew ? (
                      collaborator.role !== "ADMIN" ? (
                        <>
                          <EditIcon
                            onClick={() => {
                              handleEditCollab(index);
                            }}
                          />
                          <DeleteIcon
                            onClick={() => {
                              removeCollaborator(index);
                            }}
                          />
                        </>
                      ) : null
                    ) : (
                      <>
                        <SaveIcon
                          onClick={() => {
                            handleSaveCollab(index);
                          }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            removeCollaborator(index);
                          }}
                        />
                      </>
                    )}
                  </Box>
                ) : null}
              </Box>
            ))}
        </Box>
        {!lock ? (
          <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              onClick={() => {
                editProjectDetails(name, desc, projectInfo.projectId);
                handleLock();
              }}
            >
              Save Changes
            </Button>
            <Button variant="contained" onClick={handleCancelChanges}>
              Cancel Changes
            </Button>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ProjectModal.propTypes = {
//   open: PropTypes.shape({
//     isOpen: PropTypes.bool,
//     id: PropTypes.string,
//     isAdmin: PropTypes.bool,
//   }).isRequired,
//   handleClose: PropTypes.func.isRequired,
//   handleProjectTitle: PropTypes.func.isRequired,
//   handleProjectDescription: PropTypes.func.isRequired,
//   handleEmailChange: PropTypes.func.isRequired,
//   handleRoleChange: PropTypes.func.isRequired,
//   addCollaborator: PropTypes.func.isRequired,
//   removeCollaborator: PropTypes.func.isRequired,
//   handleEditProjectTitle: PropTypes.func.isRequired,
//   projectInfo: PropTypes.shape({
//     ProjectId: PropTypes.string,
//     projectName: PropTypes.string,
//     projectDescription: PropTypes.string,
//     // collaborators: PropTypes.arrayOf(
//     //   PropTypes.shape({
//     //     email: PropTypes.string,
//     //     role: PropTypes.string,
//     //   }))
//     ,
//     isAdmin: PropTypes.bool,
//   }).isRequired,
// };

export default ProjectModal;

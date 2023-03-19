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
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save"
import DeleteIcon from "@mui/icons-material/Delete";
// import { PropTypes } from "prop-types";
// import axios from "axios";

function ProjectModal({
  handleClose,
  open,
  projectInfo,
  // handleProjectTitle,
  handleProjectDescription,
  addCollaborator,
  handleEmailChange,
  handleRoleChange,
  handleSaveCollab,
  removeCollaborator,
  // handleEditProjectTitle,
}) {

  const Roles = ["ADMIN", "LEADER", "MEMBER"];
  // const defaultCollaborator = "Select Role";
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
      <Box display="flex" justifyContent="flex-end" pr={3} mt={2}>
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
          value={projectInfo.projectName}
          // onChange={(e) => {
          //   handleProjectTitle(open.id, e.target.value);
          // }}
          // onBlur={() => {
          //   handleEditProjectTitle(id);
          // }}
          // disabled={!projectInfo[open.id].isAdmin}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Description"
          type="text"
          fullWidth
          variant="standard"
          value={projectInfo.projectDescription}
          onChange={(e) => {
            handleProjectDescription(e.target.value);
          }}
          // disabled={!projectInfo[open.id].isAdmin}
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
            onClick={addCollaborator}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="collabBody"
          mt={2}
        >

          {
            projectInfo &&
            projectInfo.projectMembers.map((collaborator,index) => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
                className="collabRow"
              >
                <Box sx={{ display: "flex" }} className="collabEmail">
                  <Input
                    type="text"
                    placeholder="Email"
                    value={collaborator.email}
                    // disabled={!projectInfo[open.id].isAdmin}
                    onChange={(event) =>
                      handleEmailChange(event.target.value,index)
                    }
                  />
                </Box>
                <Box className="collabRole">
                  <Select
                    sx={{ height: "30px", width: "100px" }}
                    value={collaborator.role}
                    onChange={(event) =>
                      handleRoleChange(event.target.value,index)
                    }
                    // disabled={!projectInfo[open.id].isAdmin}
                  >
                    {Roles.map((role) => (
                      <MenuItem value={role} key={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  <SaveIcon onClick={()=>{handleSaveCollab(index)}}/>
                </Box>
                <Box
                  className="collabDelete"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DeleteIcon
                    // disabled={!projectInfo[open.id].isAdmin}
                    onClick={() => {
                      removeCollaborator(index);
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

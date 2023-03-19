/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Box,
  Input,
//   Select,
//   MenuItem,
  Button,
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { PropTypes } from "prop-types";
import axios from "axios";

function NewProjectModal(
    {
        open,
        setOpen,
        projects,
        setProjects,
    }
) {
    const [projectTitle, setProjectTitle] = React.useState("");
    const [projectDescription, setProjectDescription] = React.useState("");
    const handleProjectTitle = (e) => {
        setProjectTitle(e.target.value);
    };
    const handleProjectDescription = (e) => {
        setProjectDescription(e.target.value);
    };
    const addNewProject=(title,projectDesc)=>{
        axios.post("http://localhost:3001/api/management/project",{
            projectName:title,
            projectDescription:projectDesc
        }).then((response)=>{
            console.log(response);
           const {result} = response.data;
            const proj={
                projectId: result.projectId,
                projectName: result.projectName,
            }
            setProjects([...projects, proj]);
        }).catch((error)=>{
            console.log(error);
        })
    }


//   const Roles = ["Select Role", "Admin", "Leader", "Member"];
//   const defaultCollaborator = "Select Role";
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
        setOpen(false);
        }}
    >
      <Box display="flex" justifyContent="flex-end" pr={3} mt={2} />
      <CloseIcon
          onClick={() => {
            setOpen(false);
          }}
        />
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="text"
          fullWidth
          variant="standard"
            value={projectTitle}
            onChange={handleProjectTitle}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Description"
          type="text"
          fullWidth
          variant="standard"
            value={projectDescription}
            onChange={handleProjectDescription}
        />
        <Button variant="outlined" sx={{ mt: 2 }} onClick={()=>{addNewProject(projectTitle,projectDescription)}}>
          Create New Project
        </Button>
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
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="collabBody"
          mt={2}
        >
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
                className="collabRow"
              >
                <Box sx={{ display: "flex" }} className="collabEmail">
                  <Input
                    type="text"
                    placeholder="Email"
                  />
                </Box>
                <Box className="collabRole" />
                <Box
                  className="collabDelete"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DeleteIcon
                  />
                </Box>
              </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

NewProjectModal.propTypes = {

  open:PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
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

export default NewProjectModal;

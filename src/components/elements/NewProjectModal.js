import React from "react";
import { Dialog, DialogContent, TextField, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PropTypes } from "prop-types";
import axios from "axios";
import { ErrorContext } from "../contexts/ErrorContext";

function NewProjectModal({ open, setOpen, projects, setProjects }) {
  const [projectTitle, setProjectTitle] = React.useState("");
  const { setError, setSuccess } = React.useContext(ErrorContext);
  const [projectDescription, setProjectDescription] = React.useState("");
  const handleProjectTitle = (e) => {
    setProjectTitle(e.target.value);
  };
  const handleProjectDescription = (e) => {
    setProjectDescription(e.target.value);
  };
  const addNewProject = (title, projectDesc) => {
    axios
      .post("http://localhost:3001/api/management/project", {
        projectName: title,
        projectDescription: projectDesc,
      })
      .then((response) => {
        setSuccess("Project Created Successfully");
        const { result } = response.data;
        const proj = {
          projectId: result.projectId,
          projectName: result.projectName,
          role: "ADMIN",
        };
        setProjects([...projects, proj]);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
    setOpen(false);
  };

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
      <Box pr={3} mt={2} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }} pr={3}>
        <CloseIcon
          onClick={() => {
            setOpen(false);
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
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => {
            addNewProject(projectTitle, projectDescription);
          }}
        >
          Create New Project
        </Button>
      </DialogContent>
    </Dialog>
  );
}

NewProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  projects: PropTypes.shape({
    projectId: PropTypes.number.isRequired,
    projectName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  setProjects: PropTypes.func.isRequired,
};

export default NewProjectModal;

import React, { useState, useContext } from "react";
import { Dialog, DialogContent, TextField, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PropTypes } from "prop-types";
import { ErrorContext } from "../contexts/ErrorContext";
import { ProjectUserContext } from "../contexts/ProjectUserContext";

function NewProjectModal({ open, setOpen }) {
  const [projectTitle, setProjectTitle] = useState("");
  const { setError, setSuccess } = useContext(ErrorContext);
  const [projectDescription, setProjectDescription] = useState("");
  
  const { addNewProject } = useContext(ProjectUserContext);
  
  const handleProjectTitle = (e) => {
    setProjectTitle(e.target.value);
  };
  const handleProjectDescription = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleAddNewProject = (title, projectDesc) => {
    addNewProject(title, projectDesc)
      .then((response) => {
        if (response) {
          setSuccess("Project Created Successfully");
        }
      })
      .catch((error) => {
        setError(error.response.data.message)
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
            handleAddNewProject(projectTitle, projectDescription);
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
};

export default NewProjectModal;

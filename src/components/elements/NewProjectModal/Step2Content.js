/* eslint-disable react/prop-types */
import React from "react";
import { Button, Box, TextField, useMediaQuery} from "@mui/material";

function Step2Content({projectTitle, handleProjectTitle, projectDescription, handleProjectDescription, handleAddNewProject,isProjectCreated}) {
  const above600 = useMediaQuery("(min-width:600px)");
    return (
      <Box mx={2} >
      <TextField
        margin="dense"
        id="name"
        label="Project Name"
        type="text"
        fullWidth
        variant="standard"
        value={projectTitle}
        onChange={handleProjectTitle}
        disabled={isProjectCreated}
      />
      <TextField
        margin="dense"
        id="name"
        label="Project Description"
        type="text"
        fullWidth
        variant="standard"
        value={projectDescription}
        onChange={handleProjectDescription}
        disabled={isProjectCreated}
      />
      <Button
        variant="contained"
        disabled={isProjectCreated}
        sx={{
          mt: 2,
          width: above600?"auto%":"100%"
        }}
        onClick={() => {
          handleAddNewProject(projectTitle, projectDescription);
        }}
      >
        Create New Project
      </Button>
    </Box>
    );
  }

  export default Step2Content;
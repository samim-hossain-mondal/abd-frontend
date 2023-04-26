/* eslint-disable react/prop-types */
import React from "react";
import { Box, TextField, 
  InputAdornment, 
  useMediaQuery,
  Button } from "@mui/material";

function Step2Content({
  projectTitle,
  handleProjectTitle,
  projectDescription,
  handleProjectDescription,
  handleAddNewProject,
  isProjectCreated,
  onPrev,
}) {
  const above600 = useMediaQuery("(min-width:600px)");
  const above290 = useMediaQuery("(min-width:290px)");
  return (
    <>
      <Box mx={2} sx={{ width: above600?"500px":"auto" }}>
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {projectTitle.length}/{100}
              </InputAdornment>
            ),
          }}
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
          // multiline
          rows={4}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {projectDescription.length}/{250}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap-reverse",
          alignItems: "space-between",
        }}
        mx={2}
        my={4}
      >
        <Button
          variant="outlined"
          onClick={onPrev}
              sx={{width:"auto", marginBottom: above290?"10px":"0px"}}
              >
          Back
        </Button>

        <Button
          variant="contained"
          sx={{width:"auto", marginBottom: above290?"10px":"0px"}}
          disabled={
            projectTitle.trim() === "" || projectDescription.trim() === ""
          }
          onClick={handleAddNewProject}
        >
          Create Project
        </Button>
      </Box>
    </>
  );
}

export default Step2Content;

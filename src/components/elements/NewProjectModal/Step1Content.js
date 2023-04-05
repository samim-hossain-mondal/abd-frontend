/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";

function Step1Content() {
  const { user } = React.useContext(ProjectUserContext);

  return (
    <Box mx={0.5}>
      <Box pl={2}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Hi {" "}
          <Box component="span" color="primary.main" fontWeight="bold">
            {user.name}
          </Box>
          ,
          <br />
        </Typography>
        <Typography >
          Welcome to My Agile Dashboard, where collaboration and transparency come together to help your team succeed!
          <Box sx={{ mt: 1.5 }}>
            Create a new project and experience how easy it is to manage tasks and track progress.
            Our platform empowers your team to work together seamlessly towards a common goal.
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

Step1Content.prototype = {
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func.isRequired,
};

export default Step1Content;

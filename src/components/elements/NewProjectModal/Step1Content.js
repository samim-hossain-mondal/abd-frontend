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
        <Typography variant="h5">
          Hi {" "}
          <Box component="span" color="primary.main" fontWeight="bold">
            {user.name}
          </Box>
          ,
          <br />
        </Typography>
        <Typography >
          Welcome to the first step of creating a new project. Please check the box
          below to confirm that you have read and understood the information provided
          in the previous step.
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

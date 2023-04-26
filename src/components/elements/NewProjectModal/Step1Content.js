/* eslint-disable react/prop-types */
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";

function Step1Content({ onClick}) {
  const { user } = React.useContext(ProjectUserContext);

  return (
    <>
    <Box mx={0.5} sx={{width:'auto'}}>
      <Box pl={2}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Kudos to you, {" "}
          <Box component="span" color="primary.main" fontWeight="bold">
            {user.name}
          </Box>
          {" "}👍
          <br />
        </Typography>
        <Typography >
          You are about to create a Home page for your agile team to effectively manage, colloaborate with transparancy.
          <Box sx={{ mt: 1.5 }}>
            Your data is safe and it is protected within our firm ecosystem. Only you and your team can access your data based on their roles.
          </Box>
        </Typography>
      </Box>
    </Box>
    
    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "space-between" }} mx={2} my={4}>
      <div />
      <Button variant="contained" 
      disabled={false}
      onClick={onClick}>
          Next
      </Button>
    </Box>
    </>

);
}

Step1Content.prototype = {
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func.isRequired,
};

export default Step1Content;

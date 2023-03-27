import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

function CardBox({ title, description }) {
  return (
    <Box
      component="card"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxShadow: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "center",
        mb: 3,
        mt: 3,
      }}
    >
      <Box
        component="p"
        sx={{
          fontSize: { xs: 20, sm: 23},
          color: "text.primary",
          width: "100%",
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          padding: 1,
          margin: 0,
          backgroundColor: "grey.200",
          borderBottom: "5px solid #e0e0e0",
        }}
      >
        {title}
      </Box>
      <Box
        component="p"
        sx={{ 
          fontSize: { xs: 15, sm: 18}, 
          color: "text.primary", 
          width: "100%", 
          px: 2 
        }}
      >
        {description}
      </Box>
    </Box>
  );
}

CardBox.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

CardBox.defaultProps = {
  title: "Title",
  description: "Description",
};

export default CardBox;

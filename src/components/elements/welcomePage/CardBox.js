import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";

function CardBox({ title, description }) {
  const isSmallerScreen = useMediaQuery("(min-width: 600px)");
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
        textAlign: "left",
        mb: 3,
        mt: 3,
      }}
    >
      <Box
        component="p"
        sx={{
          fontSize: isSmallerScreen ? 23 : 20,
          color: "text.primary",
          width: "100%",
          padding: 2,
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

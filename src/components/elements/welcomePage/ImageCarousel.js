import React from "react";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel"; // eslint-disable-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import Image from "mui-image";
import { slides } from "../../constants/welcomePage";

function Item({ title, description, image }) {
  return (
    <Box
      component="card"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 2,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "center",
        mt: 2,
        border: "5px solid #e0e0e0",
      }}
    >
      <Box
        component="p"
        sx={{
          fontSize: 25,
          color: "text.primary",
          width: "100%",
          padding: 1,
          margin: 0,
          backgroundColor: "grey.200",
        }}
      >
        {title}
      </Box>
      <Image
        src={image}
        height="100%"
        width="100%"
        fit="cover"
        duration={3000}
        easing="cubic-bezier(0.7, 0, 0.6, 1)"
        showLoading
        errorIcon
        shift={null}
        distance="100px"
        shiftDuration={900}
        bgColor="inherit"
      />
      <Box
        component="p"
        sx={{ fontSize: 20, color: "text.primary", width: "100%", px: 2 }}
      >
        {description}
      </Box>
    </Box>
  );
}

function ImageCarousel() {
  return (
    <Carousel
      autoPlay
      animation="slide"
      indicators
      timeout={500}
      navButtonsAlwaysVisible
      cycleNavigation
      navButtonsProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          color: "#FFF",
          marginInline: 10,
          width: 30,
          height: 30,
          zIndex: 1,
        },
      }}
    >
      {slides.map((slide) => (
        <Item
          key={slide.id}
          title={slide.title}
          description={slide.description}
          image={slide.image}
        />
      ))}
    </Carousel>
  );
}

Item.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Item.defaultProps = {
  title: "Title",
  description: "Description",
  image: "",
};

export default ImageCarousel;

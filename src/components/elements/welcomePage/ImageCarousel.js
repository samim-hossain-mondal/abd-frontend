import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import PropTypes from "prop-types";
import Image from "mui-image";
import { slides } from "../../constants/welcomePage";

function Item({ title, description, image }) {
  const isLargeScreen = useMediaQuery("(min-width:600px)");

  return (
    <Box
      component="card"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "left",
        boxShadow: 1,
        position: "relative",
      }}
    >
      <Image
        src={image}
        height="100%"
        width="100%"
        fit="cover"
        duration={0}
        errorIcon
        shift={null}
        shiftDuration={900}
        showLoading
        easing="ease-in-out"
        sx={{ 
          position: isLargeScreen ? "absolute" : "relative", 
          top: 0, 
          left: 0 }}
      />
      <Box
        component="p"
        sx={{
          fontSize: isLargeScreen ? 23 : 20,
          // color: "text.primary",
          width: "100%",
          padding: 2,
          margin: 0,
          backgroundColor: "#4d4b4b",
          color: '#fefefe',
          opacity: 0.9,
          position: isLargeScreen ? "absolute" : "relative",
          top: 0,
          left: 0,
        }}
      >
        {title}
      </Box>
      { isLargeScreen && (
      <Box
        component="p"
        sx={{
          fontSize: isLargeScreen ? 20 : 18,
          color: "#fefefe",
          backgroundColor: "#4d4b4b",
          width: "100%",
          padding: 2,
          bottom: 0,
          position: "absolute",
          opacity: 0.9,
          margin: 0
        }}
      >
        {description}
      </Box>
    )}
    </Box>
  );
}

function ImageCarousel() {
  return (
    <Carousel
      autoPlay
      animation="fade"
      indicators
      timeout={500}
      navButtonsAlwaysVisible={false}
      cycleNavigation
      fullHeightHover={false}
      style={{
        position: "relative",
      }}
      navButtonsProps={{
        style: {
          borderRadius: "50%",
          marginInline: 10,
          width: 30,
          height: 30,
          zIndex: 2,
          opacity: 0.4,
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#fefefe",
          transform: "scale(1.5)",
        },
      }}
      indicatorContainerProps={{
        style: {
          position: 'absolute',
          bottom: '0.2%',
          zIndex: 2,
        }
      }}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxShadow: 1,
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

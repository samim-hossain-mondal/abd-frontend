import React from "react";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel"; 
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
        height="75%"
        width="75%"
        fit="cover"
        duration={0}
        errorIcon
        shift={null}
        shiftDuration={900}
        showLoading
        easing="ease-in-out"
        sx={{ marginTop: 2, marginBottom: 2 }}
      />
      {/* <Box
        component="img"
        sx={{
          width: "100%",
        }}
        src={image}
        alt="image"
      /> */}
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
      fullHeightHover={false}     // We want the nav buttons wrapper to only be as big as the button element is
      navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
        style: {
            borderRadius: '50%',
            marginInline: 10,
            width: 30,
            height: 30,
            zIndex: 1,
        }
      }} 
      activeIndicatorIconButtonProps={{
        style: {
          transform: 'scale(1.5)', 
        }
      }}
      indicatorIconButtonProps={{
        style: {
          marginTop: 15,
        }
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

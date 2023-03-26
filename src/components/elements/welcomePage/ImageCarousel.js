import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Carousel from "react-material-ui-carousel"; 
import PropTypes from "prop-types";
import Image from "mui-image"; 
import { slides } from "../../constants/welcomePage";

function Item({ title, description, image }) {

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box
      component="card"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "center",
        boxShadow: 1,
      }}
    >
      <Box
        component="p"
        sx={{
          fontSize: matches ? 23 : 20,
          color: "text.primary",
          width: "100%",
          padding: 1,
          margin: 0,
          backgroundColor: "grey.200",
          borderBottom: "5px solid #e0e0e0",
        }}
      >
        {title}
      </Box>
      <Image
        src={image}
        height= {matches ? "75%" : "50%"}
        width= {matches ? "75%" : "50%"}
        fit= "cover"
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
        sx={{
          fontSize: matches ? 20 : 18,
          color: "text.primary",
          width: "100%",
          px: 2,
        }}
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
      indicators={false}
      timeout={500}
      navButtonsAlwaysVisible
      cycleNavigation
      fullHeightHover={false}    
      navButtonsProps={{         
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
      sx = {{
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

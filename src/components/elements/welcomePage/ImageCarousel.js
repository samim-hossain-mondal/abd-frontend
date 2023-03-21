import React from 'react';
import { Box } from '@mui/material';
import Carousel from 'react-material-ui-carousel'; // eslint-disable-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { slides } from '../../constants/welcomePage'

function Item({title, description, image}) {
  return (
    <Box component="card" sx={{display: 'flex', flexDirection: 'column', width: '100%', boxShadow: 5, borderRadius: 2, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', textAlign: 'center'}}>
      <Box component="p" sx={{fontSize: 25, color: 'text.primary',  width: '100%', padding: 1, margin: 0, backgroundColor: 'grey.200', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>{title}</Box>
      <Box component="img" sx={{width: '100%', height: '100%', maxHeight: '1000px', maxWidth: '1000px', margin: 2}} src={image} alt="image" />
      <Box component="p" sx={{fontSize: 20, color: 'text.primary',  width: '100%', px: 2}}>{description}</Box>
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
      navButtonsAlwaysVisible
      cycleNavigation
      navButtonsProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: "50%",
          color: '#FFF',
          marginInline: 10,
          width: 30,
          height: 30,
          zIndex: 1,
        },
      }}
    >
      {slides.map((slide) => (
        <Item key={slide.id} title={slide.title} description={slide.description} image={slide.image} />
      ))}
    </Carousel>
  );
}

Item.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
};

Item.defaultProps = {
  title: 'Title',
  description: 'Description',
  image: ''
};


export default ImageCarousel;

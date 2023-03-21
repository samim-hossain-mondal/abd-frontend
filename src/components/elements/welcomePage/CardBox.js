import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

function CardBox({ title, description }) {
  return (
    <Box component="card" sx={{display: 'flex', flexDirection: 'column', width: '100%', boxShadow: 5, borderRadius: 2, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', textAlign: 'center'}}>
      <Box component="p" sx={{fontSize: 23, color: 'text.primary',  width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 1, margin: 0, backgroundColor: 'grey.200'}}>{title}</Box>
      <Box component="p" sx={{fontSize: 20, color: 'text.primary',  width: '100%', px: 2}}>{description}</Box>
    </Box>
  );
}

CardBox.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

CardBox.defaultProps = {
    title: 'Title',
    description: 'Description'
};

export default CardBox;

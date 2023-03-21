import * as React from 'react';
import { Box, Typography, Container, Tooltip, IconButton, Avatar } from '@mui/material';
import Logo from '../../../assets/images/agileLogo.png';

function StickyHeader() {
  return (
  <Box
    component="header"
    sx={{
      py: 2,
      px: 2,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      alignSelf: 'center',
      borderRadius: 12,
      boxShadow: 5,
      position: 'sticky',
      top: 5,
      zIndex: 2,
      transition: 'background-color 1.5s ease-in-out'
    }}
  >
    <Container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Box
          component="img" sx={{ height: 50, width: 50, borderRadius: '50%' }}
          alt="logo" src={Logo}
        />
        <Typography
          variant="h4" color="secondary.main"
          sx={{ marginLeft: 2, px: 0 }}
        >
          My Agile Board
        </Typography>
    </Container>
    <Tooltip title="Open settings">
        <IconButton  sx={{ paddingRight: 8 }}>
            <Avatar alt="PO" src="/static/images/avatar/2.jpg" />
        </IconButton>
    </Tooltip>
  </Box>
  );
}

export default StickyHeader;
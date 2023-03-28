import React from 'react';
import { AppBar, Typography, Box, Container, Toolbar } from '@mui/material';

export default function DSMHeader() {
  return (
    <Box>
      <Box sx={{ backgroundColor: 'primary.light', padding: '5px' }} />
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }} >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                data-testid="poNotesIdentifier"
                variant="h5"
                noWrap
                sx={{ ml: 5, fontWeight: 500, letterSpacing: '.025rem', color: 'secondary.main', textDecoration: 'none' }}
              >
                Daily Standup (DSM)
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box >
  );
};
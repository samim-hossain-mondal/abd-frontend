import React from 'react';
import { AppBar, Typography, Box, Container, Toolbar } from '@mui/material';

export default function DSMHeader() {
  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { md: 'flex' } }}>
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
  );
};
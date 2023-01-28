import React from 'react';
import { Box,Typography,List,ListItem,TextField } from '@mui/material';

function Timeline(){
    return (
        <Box>
          <Typography sx={{ fontWeight: 700, marginLeft: '20px', marginTop: '20px' }}>Timeline</Typography>
          <List>
            <ListItem>
              <TextField
                id="datetime-local"
                label="Select date, time"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                sx={{ width: 350 }}
                InputLabelProps={{ shrink: true }}
              />
            </ListItem>
          </List>
        </Box>
    );
}

export default Timeline;
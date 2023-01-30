import React from 'react'
import { Box, Card, CardContent, Typography, Avatar, Stack, Button } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { makeStyles } from "@mui/styles";

import chckBoxEmitter from './ChckBoxEmitter'

const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 4,
    "-webkit-box-orient": "vertical",
  }

});

const stringToColor = (string) => {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {

    // eslint-disable-next-line no-bitwise
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';

  for (i = 0; i < 3; i += 1) {

    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}


// eslint-disable-next-line react/prop-types
function CustomCard({ actionItemDescription, collabrators, colour, chckBox }) {
  const classes = useStyles();
  return (
    <Box m={3}>
      <Card sx={{ width: 400, height: 300, borderRadius: 7 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {chckBoxEmitter(chckBox)}
            <Brightness1Icon sx={{ color: colour, marginTop: 1.5, paddingLeft: 12 }} />
            <Typography sx={{ marginTop: 1.5, color: '#707070' }}> 23 Jan 2023 5.13 PM </Typography>
          </Box>
          <Box>
            <Typography mt={3} className={classes.multiLineEllipsis}> {actionItemDescription}</Typography>
          </Box>
          <Typography color="primary" sx={{ fontWeight: 500 }} mt={2}>Needed by 25 Feb 2023</Typography>
          <Stack direction="row" spacing={-1} mt={1} sx={{ display: 'inline-flex' }}>
            {
              // eslint-disable-next-line react/prop-types
              collabrators.map((names) => <Avatar {...stringAvatar(names)} />)
            }
          </Stack>
          <Button variant="contained" sx={{ display: 'inline-flex', marginLeft: 20 }}>JIRA LINK</Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CustomCard;

import React from "react";
import { Box, Card, CardContent, Avatar, Typography } from "@mui/material";

function ProfileCard(props) {
    // eslint-disable-next-line react/prop-types
    const { name, jobTitle, avatarUrl, bio } = props;
  
    return (
      <Card sx={{ minWidth: "40%", maxHeight: "100%" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{ width: 64, height: 64, backgroundColor: "lightblue" }}
              src={avatarUrl}
              alt={name}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h5">{name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {jobTitle}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ mt: 2 }} variant="body1">
            {bio}
          </Typography>
        </CardContent>
      </Card>
    );
  }

export default ProfileCard;
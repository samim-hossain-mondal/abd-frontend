import React from "react";
import { Box, Card, CardContent, Avatar, Typography } from "@mui/material";
import propTypes from "prop-types";

function ProfileCard({ name, email, avatarUrl, bio }) {
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
              {email}
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

ProfileCard.propTypes = {
  name: propTypes.string,
  email: propTypes.string,
  avatarUrl: propTypes.string,
  bio: propTypes.string,
};

ProfileCard.defaultProps = {
  name: "Name",
  email: "Job Title",
  avatarUrl: "",
  bio: "Bio",
};

export default ProfileCard;

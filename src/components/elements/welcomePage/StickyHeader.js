/*eslint-disable*/
import * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import Logo from "../../../assets/images/agileLogo.png";
import { useOktaAuth } from "@okta/okta-react";

const settings = ['Profile', 'Account Settings', 'Logout'];

function StickyHeader() {
  const { oktaAuth } = useOktaAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => oktaAuth.signOut('/');

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: 4,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "99%",
        alignSelf: "center",
        borderRadius: 12,
        boxShadow: 5,
        position: "sticky",
        top: 5,
        zIndex: 2,
        transition: "background-color 1.5s ease-in-out",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: 0,
        }}
      >
        <Box
          component="img"
          sx={{ height: 50, width: 50, borderRadius: "50%" }}
          alt="logo"
          src={Logo}
        />
        <Typography
          variant="h4"
          color="secondary.main"
          sx={{ marginLeft: 2, px: 0 }}
        >
          My Agile Board
        </Typography>
      </Container>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="PO" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        sx={{ mt: "45px" }}
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) =>
          setting !== "Logout" ? (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ) : (
            <MenuItem key={setting} onClick={logout}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  );
}

export default StickyHeader;

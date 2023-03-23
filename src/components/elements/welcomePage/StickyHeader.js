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
  useMediaQuery
} from "@mui/material";
import { useOktaAuth } from "@okta/okta-react";
import propTypes from "prop-types";
import Logo from "../../../assets/images/agileLogo.png";
import AccountSettingsModal from "../AccountSettingsModal";


const settings = ['Profile', 'Account Settings', 'Logout'];

function StickyHeader({ userName }) {
  const { oktaAuth } = useOktaAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const isSmallerScreen = useMediaQuery('(min-width: 600px)');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    if (event.target.innerText === "Account Settings") {
      setOpenSettings(true);
    }
    setAnchorElUser(null);
  };

  const logout = async () => oktaAuth.signOut('/');

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: isSmallerScreen ? 0 : 4,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
        boxShadow: 5,
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          {isSmallerScreen ? 'My Agile Board' : ''}
        </Typography>
      </Container>
      <Box sx={{display: 'flex'}}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ paddingRight: 2 }}>
          <Avatar alt={userName} src="/static/images/avatar/2.jpg" sx={{height: 50, width: 50}}/>
        </IconButton>
      </Tooltip>
      </Box>
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
      <AccountSettingsModal open={openSettings} setOpenSettings={setOpenSettings} />
    </Box>
  );
}

StickyHeader.propTypes = {
  userName: propTypes.string.isRequired,
}

export default StickyHeader;

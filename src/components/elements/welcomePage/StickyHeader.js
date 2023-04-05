/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from "react";
import stc from 'string-to-color';

import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  LinearProgress,
  Backdrop,
} from "@mui/material";
import { useOktaAuth } from "@okta/okta-react";
import propTypes from "prop-types";
import Logo from "../../../assets/images/agileLogo.png";
import AccountSettingsModal from "../AccountSettingsModal";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";
import { LoadingContext } from '../../contexts/LoadingContext';
import stringAvatar from '../../utilityFunctions/getStringColor';

const settings = ["Profile", "Account Settings", "Logout"];

function StickyHeader({
  userName, handleCreateProjectClick, handleLoginClick
}) {
  const { oktaAuth, authState } = useOktaAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const { user, userDetailsUpdated } = useContext(ProjectUserContext)
  const isLargeScreen = useMediaQuery("(min-width: 600px)");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    if (event.target.innerText === "Account Settings") {
      setOpenSettings(true);
    }
    setAnchorElUser(null);
  };

  const logout = async () => oktaAuth.signOut("/");
  const { loading } = useContext(LoadingContext)

  return (
    <>
      {loading &&
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
          <Backdrop
            sx={{ color: '#fff', zIndex: 10000000000 }}
            open
          // onClick={handleClose}
          />
        </Box>}
      <Box
        component="header"
        sx={{
          padding: 2,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxShadow: 5,
          position: "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Box
            component="img"
            sx={{
              height: 50,
              width: 50,
              borderRadius: "50%",
              cursor: "pointer",
            }}
            alt="logo"
            src={Logo}
          />
          <Typography
            variant="h4"
            color="secondary.main"
            fontSize="2rem"
            sx={{ marginLeft: 2, cursor: "pointer" }}
          >
            My Agile Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {!userDetailsUpdated && authState?.accessToken !== undefined ?
            <div className="stage" style={{ paddingRight: "40px" }}>
              <div className="dot-typing" />
            </div> :
            user.memberId ? (
              <>
                {isLargeScreen && (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "logoBlue.main",
                      margin: 1,
                      marginInline: 2,
                      padding: 1,
                      fontWeight: "bold"
                    }}
                    onClick={handleCreateProjectClick}
                  >
                    Create Project
                  </Button>
                )}
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ marginRight: 0, padding: 0 }}
                  >
                    <Avatar
                      {...stringAvatar(userName ?? '  ', stc)}
                      height="50px"
                      width="50px"
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: "logoBlue.main",
                  margin: 1,
                  // marginInline: 2,
                  padding: 1,
                  px: 2,
                  fontWeight: "bold",
                }}
                onClick={handleLoginClick}
              >
                Login
              </Button>
            )
          }
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
          {userDetailsUpdated && settings.map((setting) =>
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
      <AccountSettingsModal
        open={openSettings}
        setOpenSettings={setOpenSettings}
      />
    </>
  );
}

StickyHeader.propTypes = {
  userName: propTypes.string.isRequired,
  handleCreateProjectClick: propTypes.func.isRequired,
  handleLoginClick: propTypes.func.isRequired,
};

export default StickyHeader;

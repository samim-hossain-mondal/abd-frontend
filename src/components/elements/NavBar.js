import React, { useContext, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton,
  Typography, Menu,
  Container, Avatar, Tooltip, MenuItem, useMediaQuery
}
  from '@mui/material';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import { allPages, WELCOME_ROUTE } from '../constants/routes';
import getRoute from '../utilityFunctions/getRoute';
import Logo from '../../assets/images/agileLogo.png';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import AccountSettingsModal from './AccountSettingsModal';

const settings = ['Profile', 'Account Settings', 'Logout'];

export default function Navbar({ authLoaded }) {
  const pages = allPages
  const { projectId } = useContext(ProjectUserContext)
  const { oktaAuth, authState } = useOktaAuth();
  const logout = async () => oktaAuth.signOut('/');
  const aboveTablet = useMediaQuery('(min-width: 769px)');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openRoutesMenu, setOpenRoutesMenu] = useState(false);

  const handleOpenRoutesMenu = () => {
    setOpenRoutesMenu(!openRoutesMenu);
  };
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    if (event.target.innerText === "Account Settings") {
      setOpenSettings(true);
    }
    setAnchorElUser(null);
  };

  const location = useLocation();
  return (
    <AppBar
      position="static"
      sx={{ background: "transparent", boxShadow: "none" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex' }}>
          <Box
            component="img" sx={{ height: '50px' }}
            alt="logo" src={Logo}
          />

          {
            (aboveTablet) ? (
              <Box sx={{ flexBasis: '16%', textAlign: 'center' }}>
                <Typography
                  variant={(aboveTablet) ? 'h5' : 'h6'} color="secondary.main"
                >
                  My Agile Board
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flexGrow: '1', textAlign: 'left', ml: 2 }}>
                <Typography
                  variant={(aboveTablet) ? 'h4' : 'h6'} color="secondary.main"
                >
                  My Agile Board
                </Typography>
              </Box>
            )
          }

          {
            (aboveTablet) && (
              <Box sx={{ display: 'flex', flexGrow: '2', justifyContent: 'center' }}>
                {pages.map((page, index) => (
                  <Box
                    key={page}
                    sx={{ ml: 5 }}
                  >
                    <Link style={{ textDecoration: 'none', width: '100%', textAlign: 'center' }} to={getRoute(pages[index], projectId)}>
                      <Typography
                        color='secondary.main'
                        sx={{
                          ...(location.pathname !== WELCOME_ROUTE && location.pathname === getRoute(pages[index], projectId) &&
                            { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                          ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                        }}> {page}
                      </Typography>
                    </Link>
                  </Box>
                ))}
              </Box>
            )
          }

          {
            ((authLoaded) && (authState?.isAuthenticated)) && (
              <Box sx={{ textAlign: 'right', flexGrow: '1' }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="PO" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar" sx={{ mt: '45px' }}
                  anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    (setting !== 'Logout')
                      ?
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                      :
                      <MenuItem key={setting} onClick={logout}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                  ))}
                </Menu>
            <AccountSettingsModal open={openSettings} setOpenSettings={setOpenSettings} />

              </Box>
            )
          }

          {
            (!aboveTablet) && (
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  id="long-button"
                  onClick={handleOpenRoutesMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={openRoutesMenu}
                  open={openRoutesMenu}
                  onClose={() => { setOpenRoutesMenu(false) }}
                  sx={{ mt: '45px' }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {pages.map((page, index) => (
                    <MenuItem
                      key={page}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => { setOpenRoutesMenu(false) }}
                    >
                      <Link style={{ textDecoration: 'none', width: '100%', textAlign: 'center' }} to={getRoute(pages[index], projectId)}>
                        <Typography
                          color='secondary.main'
                          sx={{
                            ...(location.pathname === getRoute(pages[index], projectId) &&
                              { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                            ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                          }}> {page}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Navbar.propTypes = {
  authLoaded: PropTypes.bool.isRequired,
};

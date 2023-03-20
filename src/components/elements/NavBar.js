/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton,
  Typography, Menu,
  Container, Avatar, Tooltip, MenuItem
}
  from '@mui/material';
import PropTypes from 'prop-types';
import Logo from '../../assets/images/agileLogo.png';

const pages = ['DSM', 'PO Notes', 'Our Teams', 'Availability Calendar',
  'Announcements', 'Information Radiators', 'Reference Material'];
const routes = ['/home', '/po-notes', '/our-teams', '/availability-calendar',
  '/announcements', '/information-radiators', '/reference-material'];
const settings = ['Profile', 'Account Settings', 'Logout'];

export default function Navbar({ poNotesRef, dsmRef, availabilityCalendarRef }) {
  const { oktaAuth } = useOktaAuth();
  const logout = async () => oktaAuth.signOut('/');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleScroll=(ref)=>{
    ref.current.scrollIntoView();
  }
  const location = useLocation();
  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img" sx={{ height: 50, flexGrow: 0.1 }}
            alt="logo" src={Logo}
          />
          <Typography
            variant="h4" color="secondary.main"
            sx={{ marginLeft: 2, flexGrow: 3, mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            My Agile Board
          </Typography>
          <Box sx={{ marginRight: 5, flexGrow: 3, display: { xs: 'none', md: 'flex' } }}>
            {/* TODO: will have to similarly change code for mobile view when made responsive */}
            {pages.map((page, index) => (
              <Box
                key={page}
                sx={{ flexGrow: 1 }}
              >
                {/* when routes[index] is either po-notes, home or availability-calendar call handleScrollwith their respective refs using inline switch otherwise no onClick */}

                {
                  routes[index] === '/po-notes' ?
                    <Link style={{ textDecoration: 'none' }} to={routes[index]} onClick={()=>handleScroll(poNotesRef)}>
                      <Typography
                        color='secondary.main'
                        sx={{
                          ...(location.pathname === routes[index] &&
                            { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                          ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                        }}> {page}
                      </Typography>
                    </Link>
                    : routes[index] === '/home' ?
                      <Link style={{ textDecoration: 'none' }} to={routes[index]} onClick={()=>handleScroll(dsmRef)}>
                        <Typography

                          color='secondary.main'
                          sx={{
                            ...(location.pathname === routes[index] &&
                              { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                            ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                          }}> {page}
                        </Typography>
                      </Link>
                      : routes[index] === '/availability-calendar' ?
                        <Link style={{ textDecoration: 'none' }} to={routes[index]} onClick={()=>handleScroll(availabilityCalendarRef)}>
                          <Typography
                            color='secondary.main'
                            sx={{
                              ...(location.pathname === routes[index] &&
                                { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                              ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                            }}> {page}
                          </Typography>
                        </Link>
                        : <Link style={{ textDecoration: 'none' }} to={routes[index]}>
                          <Typography
                            color='secondary.main'
                            sx={{
                              ...(location.pathname === routes[index] &&
                                { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                              ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1rem'
                            }}> {page}
                          </Typography>
                        </Link>
                }
              </Box>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
}

Navbar.propTypes = {
  poNotesRef: PropTypes.instanceOf(Object),
  dsmRef: PropTypes.instanceOf(Object),
  availabilityCalendarRef: PropTypes.instanceOf(Object)
};

Navbar.defaultProps = {
  poNotesRef: null,
  dsmRef: null,
  availabilityCalendarRef: null
};
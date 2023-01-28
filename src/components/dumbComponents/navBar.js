import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/images/agileLogo.png';

const pages = ['Home', 'PO Notes', 'Our Teams', 'Timelines & Roadmaps', 'Announcements', 'Information Radiators', 'Reference Material'];
const routes = ['/', '/po-notes', '/our-teams', '/timelines-roadmaps', '/announcements', '/information-radiators', '/reference-material'];
const settings = ['Profile', 'Account Settings'];

function Navbar() {

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const location = useLocation();
  console.log(location.pathname);

  return (
    <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{
              height: 50,
              flexGrow: 0.1
            }}
            alt="logo"
            src={Logo}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{ marginLeft: 2, flexGrow: 3, mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 700, letterSpacing: '.025rem', color: '#3D3D3D;', textDecoration: 'none' }}
          >
            My Agile Board
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} sx={{ ':hover': { bgcolor: 'white', color: '#2258F5' }, my: 2, color: '#3D3D3D', display: 'block' }}>
                  <Link style={{ textDecoration: 'none' }} to={routes[index]}> <Typography sx={{ fontSize: 16.5, ':hover': { color: '#2258F5' }, my: 2, color: '#3D3D3D', display: 'flex' }}> {page} </Typography> </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ marginRight: 5, flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Box
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ flexGrow: 1 }}
              >
                <Link style={{ textDecoration: 'none' }} to={routes[index]}> <Typography sx={{ fontSize: 16.5, ':hover': { textDecoration: 'underline', textUnderlineOffset: '8px', color: '#2258F5' }, my: 2, color: '#3D3D3D', display: 'flex' }}> {page} </Typography> </Link>
              </Box>
            ))}

          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Samim" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
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

export default Navbar;
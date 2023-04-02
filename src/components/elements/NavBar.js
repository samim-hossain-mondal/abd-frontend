import React, { useContext, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  useMediaQuery
}
  from '@mui/material';
import stc from 'string-to-color';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore, } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { allPages, HOME_ROUTE } from '../constants/routes';
import getRoute from '../utilityFunctions/getRoute';
import Logo from '../../assets/images/agileLogo.png';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import AccountSettingsModal from './AccountSettingsModal';
import MobileTabs from './MobileTabs';

const settings = ['Profile', 'Account Settings', 'Logout'];

export default function Navbar({ 
  authLoaded,
  poNotesRef,
  dsmRef,
  availabilityCalendarRef,
  handleScroll,
}) {
  const pages = allPages
  const { projectId, user } = useContext(ProjectUserContext)
  const { oktaAuth, authState } = useOktaAuth();
  const logout = async () => oktaAuth.signOut('/');
  const aboveTablet = useMediaQuery('(min-width: 769px)');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const [openRoutesMenu, setOpenRoutesMenu] = useState(false);
  const [openPageNavMenu, setOpenPageNavMenu] = useState(false);
  const [activeOption, setActiveOption] = useState('Daily Retro');
  const sections = [
    {name: 'Daily Retro', ref: dsmRef},
    {name: 'PO Notes', ref: poNotesRef},
    {name: 'Availability Calendar', ref: availabilityCalendarRef},
  ];

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

  const handlePageNavMenu = (event) => {
    setAnchorElNavMenu(event.currentTarget);
    setOpenPageNavMenu(!openPageNavMenu);
  };

  const handleOptionClick = (sectionName, ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setActiveOption(sectionName);
    setOpenPageNavMenu(false);
  }

  const location = useLocation();
  return (
    <>
    <AppBar
      position="fixed"
      sx={{ backgroundColor: 'white', boxShadow: "none", padding: '16px 0px' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex' }}>
          <Box
            component="img" sx={{ height: '50px' }}
            alt="logo" src={Logo}
          />
          {
            (aboveTablet) ? (
              <Box sx={{ paddingLeft: '16px', textAlign: 'center' }}>
                <Typography
                  variant={(aboveTablet) ? 'h4' : 'h5'} color="secondary.main"
                >
                  My Agile Board
                </Typography>
              </Box>
            ) : (
              <Box sx={{ paddingLeft: '16px', textAlign: 'left', ml: 2 }}>
                <Typography
                  variant={(aboveTablet) ? 'h4' : 'h5'} color="secondary.main"
                >
                  My Agile Board
                </Typography>
              </Box>
            )
          }
          {
            (aboveTablet) && (
              <Box sx={{ display: 'flex', flexGrow: '2', justifyContent: 'center', alignItems: 'center' }}>
                {pages.map((page, index) => (
                  <Box
                    key={page}
                    sx={{ ml: 5 }}
                  >
                    <Box sx={{ position: 'relative' }}>
                    <Link 
                      style={{ textDecoration: 'none', width: '100%', textAlign: 'center' }} 
                      to={getRoute(pages[index], projectId)}
                      onClick={
                        page === 'DSM' ? handlePageNavMenu : null
                      }
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', }}
                      >
                        <Typography
                          color='secondary.main'
                          sx={{
                            ...(location.pathname !== HOME_ROUTE && location.pathname === getRoute(pages[index], projectId) &&
                              { textDecoration: 'underline', textUnderlineOffset: '10px', color: 'primary.main' }),
                            ':hover': { color: 'primary.main' }, display: 'flex', fontSize: '1.15rem'
                          }}> {page}
                        </Typography>
                        {page === 'DSM' && (
                        <IconButton
                          sx={{ p: 0 }}
                        >
                          {openPageNavMenu ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        )}
                      </Box>
                    </Link>
                    {openPageNavMenu && (
                      <Menu
                        id="nav-menu"
                        anchorEl={anchorElNavMenu}
                        open={openPageNavMenu}
                        PaperProps={{
                          style: {
                            maxHeight: 48 * 4.5,
                            width: '12rem',
                          },
                        }}
                        sx={{ marginTop: '0.6rem' }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        onClose={
                          (e) => {
                            e.stopPropagation();
                            setOpenPageNavMenu(false)
                          }
                        }
                        keepMounted
                      >
                        {sections.map((section) => (
                        <MenuItem 
                          key={section.name} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(section.name, section.ref);
                          }}
                          sx={{
                            ...(activeOption === section.name && { backgroundColor: 'logoBlue.main', color: 'white', ':hover': { backgroundColor: 'primary.main' } }),
                          }}
                          >
                          <Typography textAlign="center">{section.name}</Typography>
                        </MenuItem>
                        ))}
                      </Menu>
                    )}
                    </Box>
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
                  {
                    user?.name ?
                    <Avatar sx={{ bgcolor: stc(user?.name) }}>
                      {user.name[0].toUpperCase()}
                    </Avatar>
                    : <Avatar />
                  }
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
                      onClick={page === 'DSM' ? handlePageNavMenu : () => { setOpenRoutesMenu(false) }}
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
    (aboveTablet) && (
      <MobileTabs 
        sections={sections} 
      />)
    </>
  );
}

Navbar.propTypes = {
  authLoaded: PropTypes.bool.isRequired,
  poNotesRef: PropTypes.object,
  dsmRef: PropTypes.object,
  availabilityCalendarRef: PropTypes.object,
  handleScroll: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  poNotesRef: null,
  dsmRef: null,
  availabilityCalendarRef: null,
};
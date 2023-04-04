/* eslint-disable import/no-extraneous-dependencies */
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
  useMediaQuery,
  LinearProgress
}
  from '@mui/material';
import stc from 'string-to-color';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore, } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { animateScroll } from 'react-scroll';
import { allPages, DAILY_PAGE_NAME, HOME_ROUTE } from '../constants/routes';
import getRoute from '../utilityFunctions/getRoute';
import Logo from '../../assets/images/agileLogo.png';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import AccountSettingsModal from './AccountSettingsModal';
import MobileTabs from './MobileTabs';
import { LoadingContext } from '../contexts/LoadingContext';

const settings = ['Profile', 'Account Settings', 'Logout'];

export default function Navbar({
  authLoaded,
  poNotesRef,
  dsmRef,
  availabilityCalendarRef,
}) {
  const location = useLocation();
  const pages = allPages
  const { projectId, user, projectDetails, userDetailsUpdated } = useContext(ProjectUserContext)
  const { oktaAuth, authState } = useOktaAuth();
  const logout = async () => oktaAuth.signOut('/');
  const aboveTablet = useMediaQuery('(min-width: 769px)');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const [openRoutesMenu, setOpenRoutesMenu] = useState(false);
  const [openPageNavMenu, setOpenPageNavMenu] = useState(false);
  const [activeOption, setActiveOption] = useState('Daily Retro');
  const showMobileTabs = (location.pathname === getRoute(DAILY_PAGE_NAME, projectId))
  const sections = [
    { name: 'Daily Retro', ref: dsmRef },
    { name: 'PO Notes', ref: poNotesRef },
    { name: 'Availability Calendar', ref: availabilityCalendarRef },
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
    animateScroll.scrollTo(ref.current.offsetTop, {
      duration: 200,
      delay: 0,
      smooth: 'easeInOutQuint',
    });
    setActiveOption(sectionName);
    setOpenPageNavMenu(false);
  };


  const { loading } = useContext(LoadingContext)
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: 'white', boxShadow: "none" }}
    >
      {loading && <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>}
      <Container maxWidth="xl" sx={{ padding: '16px 0px' }}>
        <Toolbar disableGutters sx={{ display: 'flex', direction: 'column' }}>
          <Box
            component="img" sx={{ height: '50px' }}
            alt="logo" src={Logo}
          />
          <Box sx={{ paddingLeft: '16px', textAlign: 'left', ml: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant={(aboveTablet) ? 'h4' : 'h5'} color="secondary.main"
            >
              My Agile Board
            </Typography>
            <Typography
              variant={(aboveTablet) ? 'h4' : 'h5'} color="secondary.main"
              sx={{
                fontSize: '1.15rem',
                color: 'text.secondary',
                fontWeight: '400',
              }}
            >
              {projectDetails?.projectName}
            </Typography>
          </Box>
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
                          page === DAILY_PAGE_NAME ? handlePageNavMenu : () => {
                            setActiveOption('Daily Retro')
                          }
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
                          {page === DAILY_PAGE_NAME && (
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
                <Tooltip title={userDetailsUpdated && user?.name ? "Open settings" : "Loading..."}>
                  <IconButton onClick={userDetailsUpdated && user?.name && handleOpenUserMenu} sx={{ p: 0 }}>
                    {
                      userDetailsUpdated && user?.name ?
                        <Avatar sx={{ bgcolor: stc(user?.name) }}>
                          {user.name[0].toUpperCase()}
                        </Avatar>
                        : <div className="stage" style={{ paddingRight: "20px" }}>
                          <div className="dot-typing" />
                        </div>
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
                      onClick={page === DAILY_PAGE_NAME ? handlePageNavMenu : () => { 
                        setOpenRoutesMenu(false)
                      }}
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
          {/* </Box> */}
        </Toolbar>
        {(!aboveTablet) && (showMobileTabs) && (
          <MobileTabs
            sections={sections}
          />)}
      </Container>
    </AppBar>
  );
}

Navbar.propTypes = {
  authLoaded: PropTypes.bool.isRequired,
  poNotesRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  dsmRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  availabilityCalendarRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

Navbar.defaultProps = {
  poNotesRef: null,
  dsmRef: null,
  availabilityCalendarRef: null,
};
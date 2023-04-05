/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-named-as-default
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Badge,
  Tooltip,
  MenuItem,
  useMediaQuery,
  LinearProgress,
  Backdrop
}
  from '@mui/material';
import axios from 'axios';
import stc from 'string-to-color';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore, } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { animateScroll } from 'react-scroll';
import NotificationsIcon from '@mui/icons-material/Notifications';
import notificationSound from '../../assets/images/notification-sound.mp3';
import { DOMAIN } from "../../config";
import { allPages, DAILY_PAGE_NAME, HOME_ROUTE } from '../constants/routes';
import getRoute from '../utilityFunctions/getRoute';
import Logo from '../../assets/images/agileLogo.png';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import AccountSettingsModal from './AccountSettingsModal';
import MobileTabs from './MobileTabs';
import { LoadingContext } from '../contexts/LoadingContext';
import NotificationModal from './NotificationModal';

const settings = ['Profile', 'Account Settings', 'Logout'];
const audio = new Audio(notificationSound);

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

  const audioRef = useRef(audio);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotify, setIsNotify] = useState(false);

  const fetchNotifications = async () => {
    await axios.get(`${DOMAIN}/api/notifications/${projectId}/${user.memberId}`).then((response) => {
      const value = notificationCount;
      const notifications = response.data.map((notif) => ({
        notificationId: notif.notificationId,
        readStatus: notif.readStatus
      }));
      const unreadNotifications = notifications.filter(
        (notif) => notif.readStatus === false
      );
      if (unreadNotifications.length > value) {
        setIsNotify(true);
      } else {
        setIsNotify(false);
      }
      setNotificationCount(unreadNotifications.length);
    });
  };

  fetchNotifications();

  useEffect(() => {
    if (isNotify) {
      audioRef.current.play();
    }
    console.log('playing audio');
  }, [isNotify]);

  const [notificationModal, setNotificationModal] = useState(false);
  const handleOpenNotificationModal = () => {
    setNotificationModal(true);
  };

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
      sx={{ backgroundColor: 'white', boxShadow: "none", zIndex: 99 }}
    >
      {loading &&

        <Box sx={{ width: '100%' }}>
          <LinearProgress />
          <Backdrop
            sx={{ color: '#fff', zIndex: 10000000000 }}
            open
          // onClick={handleClose}
          />
        </Box>
      }
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 50px 25px 50px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img" sx={{ height: '50px' }}
            alt="logo" src={Logo}
          />
          <Box sx={{ pl: 2, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
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
        </Box>
        {
          (aboveTablet) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {pages.map((page, index) => (
                <Box
                  sx={{ mr: 5 }}
                  key={page}
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
            <Box sx={{ display: 'flex', textAlign: 'right', alignItems: 'center' }}>
              <Box sx={{ mr: 3 }}>
                {
                  userDetailsUpdated && user?.name ?
                    <Tooltip title="Open Notifications">
                      <Badge badgeContent={notificationCount} color='error'>
                        {/* {console.log(notificationCount)} */}
                        <NotificationsIcon sx={{ color: "primary.main", cursor: 'pointer' }} onClick={handleOpenNotificationModal} />
                      </Badge>
                    </Tooltip>
                    : null
                }
              </Box>
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
              <NotificationModal open={notificationModal} setOpenNotification={setNotificationModal} />
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
      </Box>
      {(!aboveTablet) && (showMobileTabs) && (
        <MobileTabs
          sections={sections}
        />)}
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
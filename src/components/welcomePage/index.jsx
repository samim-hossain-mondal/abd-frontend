import { React, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Paper,
  useMediaQuery,
  Fab,
  Slide,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CardBox from "../elements/welcomePage/CardBox";
// import Logo from "../../assets/images/agileLogo.png";
import { texts } from "../constants/welcomePage";
import ImageCarousel from "../elements/welcomePage/ImageCarousel";
import StickyHeader from "../elements/welcomePage/StickyHeader";
// import ProfileCard from "../elements/welcomePage/ProfileCard";
// import ProjectListItem from "../elements/welcomePage/ProjectListItem";
import NewProjectModal from "../elements/NewProjectModal/NewProjectModal";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import PaginatedCards from "../elements/welcomePage/PaginatedCards";
import { HOME_ROUTE } from "../constants/routes";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    user,
    projects: userProjects,
    updateProjectDetails,
  } = useContext(ProjectUserContext);
  const isSmallerScreen = useMediaQuery('(max-width: 600px)');
  const showProjectList = userProjects.length > 0;

  const handleProjectClick = async (projectId) => {
    updateProjectDetails(projectId)
      .then(() => {
        window.open(`/${projectId}`.concat(HOME_ROUTE), '_blank');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateProjectClick = () => {
    setShowCreateModal(true);
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  let projectCountText;
  if (userProjects.length > 0) {
    projectCountText = `${userProjects.length} projects for ${user.email}`;
  } else if (user.memberId) {
    projectCountText = 'You have no active projects';
  } else {
    projectCountText = 'Login and create a new project';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'backgroundColor.main',
      }}>
      <CssBaseline />
      <StickyHeader
        userName={user ? user.name : ''}
        handleCreateProjectClick={handleCreateProjectClick}
        handleLoginClick={handleLoginClick}
      />
      <Container
        component='main'
        sx={{
          mt: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        maxWidth='lg'>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h4'>
            {userProjects.length > 0
              ? `Welcome back, ${user.name} \u{1F44B}`
              : `${texts.welcome} ${
                  user?.name ? `, ${user.name}` : ''
                } \u{1F44B}`}
          </Typography>
          <Typography
            variant='h5'
            sx={{
              fontSize: isSmallerScreen ? 15 : 20,
              color: 'secondary.main',
            }}>
            {projectCountText}
          </Typography>
        </Box>
        {showProjectList ? (
          <Box
            component='main'
            sx={{
              mt: 3,
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: 0,
              width: '100%',
            }}>
            <PaginatedCards
              projects={userProjects.sort((a, b) => b.projectId - a.projectId)}
              handleProjectClick={handleProjectClick}
            />
          </Box>
        ) : null}
        <Stack
          direction='column'
          spacing={2}
          sx={{ alignSelf: 'center', width: '100%' }}>
          <CardBox
            title='Why use My Agile Dashboard?'
            description={texts.whyMyAgile}
          />
          <ImageCarousel />
        </Stack>
      </Container>
      {showProjectList && (
        <Container
          id='projects'
          component='main'
          sx={{
            mt: 4,
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          maxWidth='lg'>
          {!showProjectList && (
            <Paper
              sx={{
                mt: 8,
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: 'grey.200',
              }}>
              <Typography
                component='p'
                sx={{
                  fontSize: 20,
                  px: 1,
                  alignSelf: 'center',
                  textAlign: 'center',
                  width: '100%',
                }}>
                {texts.getStarted}
              </Typography>
            </Paper>
          )}
        </Container>
      )}
      {isSmallerScreen && user.memberId && (
        <Slide direction='up' in mountOnEnter unmountOnExit>
          <Tooltip title='Create a new project' arrow>
            <Fab
              color='primary'
              aria-label='add'
              sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: '9999',
                height: { xs: 50, sm: 60, md: 70 },
                width: { xs: 50, sm: 60, md: 70 },
                backgroundColor: 'logoBlue.main',
                color: 'white',
              }}
              onClick={() => handleCreateProjectClick()}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Slide>
      )}
      <Box
        component='footer'
        id='footer'
        sx={{
          padding: 4,
          backgroundColor: 'grey.200',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          boxShadow: 5,
          position: 'relative',
          zIndex: '999',
          marginTop: user.memberId ? 0 : 6, // TODO: Change this to a better solution
        }}>
        <Typography
          variant='h5'
          color='text.secondary'
          align='center'
          sx={{ fontSize: isSmallerScreen ? 15 : 20 }}>
          Created by The Firm, for The Firm
        </Typography>
        <Typography
          variant='h5'
          color='text.secondary'
          align='center'
          sx={{ fontSize: isSmallerScreen ? 15 : 20 }}>
          2023
        </Typography>
      </Box>
      <NewProjectModal open={showCreateModal} setOpen={setShowCreateModal} />
    </Box>
  );
}

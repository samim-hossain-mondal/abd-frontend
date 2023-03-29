import { React, useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Button,
  // List,
  Paper,
  useMediaQuery,
  Fab,
  Slide,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CardBox from "../elements/welcomePage/CardBox";
import Logo from "../../assets/images/agileLogo.png";
import { texts } from "../constants/welcomePage";
import ImageCarousel from "../elements/welcomePage/ImageCarousel";
import StickyHeader from "../elements/welcomePage/StickyHeader";
// import ProfileCard from "../elements/welcomePage/ProfileCard";
// import ProjectListItem from "../elements/welcomePage/ProjectListItem";
import NewProjectModal from "../elements/NewProjectModal";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import PaginatedCards from "../elements/welcomePage/PaginatedCards";
import { HOME_ROUTE } from "../constants/routes";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [stickyHeader, setStickyHeader] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const {
    user,
    projects: userProjects,
    updateProjectDetails,
  } = useContext(ProjectUserContext);
  const isSmallerScreen = useMediaQuery("(max-width: 600px)");
  // const showBio = !isSmallerScreen;
  const showProjectList = userProjects.length > 0;
  const scrollRef = useRef(0);
  const footerActionRef = useRef(null);

  const handleScroll = () => {
    scrollRef.current = window.scrollY;
    if (scrollRef.current > 350) {
      setStickyHeader(true);
    } else {
      setStickyHeader(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowAddButton(false);
        } else {
          setShowAddButton(true);
        }
      });
    });
    observer.observe(footerActionRef.current);
    return () => {
      observer.unobserve(footerActionRef.current);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProjectClick = async (projectId) => {
    console.log("Project Clicked", projectId);
    updateProjectDetails(projectId)
      .then(() => {
        window.open(`/${projectId}`.concat(HOME_ROUTE), "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateProjectClick = () => {
    setShowCreateModal(true);
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "backgroundColor.main",
      }}
    >
      <CssBaseline />
      {stickyHeader && <StickyHeader userName={user ? user.name : ""} />}
      <Container
        component="main"
        sx={{
          mt: 5,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxWidth="lg"
      >
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{
            height: isSmallerScreen ? 120 : 200,
            width: isSmallerScreen ? 120 : 200,
            borderRadius: "50%",
            boxShadow: 5,
            alignSelf: "center",
          }}
        />
        <Typography
          variant={isSmallerScreen ? "h4" : "h3"}
          component="h3"
          sx={{
            my: 2,
            alignSelf: "center",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {userProjects.length > 0
            ? `Welcome back, ${user.name} \u{1F44B}`
            : `${texts.welcome} ${
                user?.name ? `, ${user.name}` : ""
              } \u{1F44B}`}
        </Typography>
        {showProjectList ? (
          <Box
            component="main"
            sx={{
              mt: 3,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: 0,
              width: "100%",
            }}
          >
            {/* <Box
              component="p"
              sx={{
                fontSize: 20,
                py: 1,
                mt: 0,
                mb: 0,
                alignSelf: "center",
                backgroundColor: "grey.200",
                width: "100%",
                boxShadow: 2,
                display: "flex",
                flexDirection: isSmallerScreen ? "column" : "row",
                justifyContent: "space-between",
                borderBottom: "5px solid #e0e0e0",
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: isSmallerScreen ? 20 : 25,
                  px: 2,
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                Your Projects
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: 15,
                  px: 2,
                  alignSelf: "center",
                  fontWeight: 100,
                  width: "100%",
                  textAlign: isSmallerScreen ? "start" : "end",
                  color: "grey.800",
                }}
              >
                {userProjects.length
                  ? `${userProjects.length} Projects`
                  : "..."}
              </Typography>
            </Box> */}
            {/* <List
              sx={{
                width: "100%",
                overflowY: "scroll",
                maxHeight: "500px",
                padding: 0,
                scrollBehavior: "smooth",
              }}
            >
              {userProjects.map((project) => (
                <ProjectListItem
                  key={project.projectId}
                  project={project}
                  handleProjectClick={() =>
                    handleProjectClick(project.projectId)
                  }
                />
              ))}
            </List> */}
            <PaginatedCards
              projects={userProjects.sort((a, b) => b.projectId - a.projectId)}
              handleProjectClick={handleProjectClick}
            />
          </Box>
        ) : null}
        <Stack
          direction="column"
          spacing={2}
          sx={{ alignSelf: "center", width: "100%" }}
        >
          <CardBox
            title="Why use My Agile Dashboard?"
            description={texts.whyMyAgile}
          />
          <ImageCarousel />
        </Stack>
      </Container>
      {showProjectList && (
        <Container
          id="projects"
          component="main"
          sx={{
            mt: 4,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
          maxWidth="lg"
        >
          {/* <Stack
            direction={isSmallerScreen ? "column" : "row"}
            spacing={2}
            sx={{ alignSelf: "center", width: "100%" }}
          > */}
          {/* <ProfileCard
              avatarUrl="/static/images/avatar/2.jpg"
              name={user ? user.name : "Loading..."}
              email={user ? user.email : "Loading..."}
              bio={showBio ? `Part of ${userProjects.length} projects` : null}
            /> */}

          {!showProjectList && (
            <Paper
              sx={{
                mt: 8,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: "grey.200",
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: 20,
                  px: 1,
                  alignSelf: "center",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {texts.getStarted}
              </Typography>
            </Paper>
          )}
          {/* </Stack> */}
        </Container>
      )}
      {showAddButton && user.memberId && (
        <Slide
          direction={showAddButton ? "up" : "down"}
          in={showAddButton}
          mountOnEnter
          unmountOnExit
        >
          <Tooltip title="Create a new project" arrow>
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: "fixed",
                bottom: 40,
                right: 40,
                zIndex: "9999",
                height: { xs: 50, sm: 60, md: 70 },
                width: { xs: 50, sm: 60, md: 70 },
                backgroundColor: "logoBlue.main",
                color: "white",
              }}
              onClick={() => handleCreateProjectClick()}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Slide>
      )}
      <Box
        component="footer"
        id="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "grey.200",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          boxShadow: 5,
          position: "relative",
          zIndex: "999",
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Get started with your own Agile board!
        </Typography>
        {user.memberId ? (
          <Button
            variant="contained"
            sx={{ backgroundColor: "logoBlue.main", color: "white" }}
            onClick={handleCreateProjectClick}
          >
            Create New Project
          </Button>
        ) : (
          <Button
            id="footerAction"
            ref={footerActionRef}
            variant="contained"
            sx={{ backgroundColor: "logoBlue.main", color: "white" }}
            onClick={handleLoginClick}
          >
            Login to Create Project
          </Button>
        )}
      </Box>
      <NewProjectModal open={showCreateModal} setOpen={setShowCreateModal} />
    </Box>
  );
}

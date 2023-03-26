import { React, useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Button,
  List,
  Paper,
  useMediaQuery,
} from "@mui/material";
import CardBox from "../elements/welcomePage/CardBox";
import Logo from "../../assets/images/agileLogo.png";
import { texts } from "../constants/welcomePage";
import ImageCarousel from "../elements/welcomePage/ImageCarousel";
import StickyHeader from "../elements/welcomePage/StickyHeader";
import ProfileCard from "../elements/welcomePage/ProfileCard";
import ProjectListItem from "../elements/welcomePage/ProjectListItem";
import NewProjectModal from "../elements/NewProjectModal";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import { HOME_ROUTE } from "../constants/routes";

export default function WelcomePage() {
  const [stickyHeader, setStickyHeader] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    user,
    projects: userProjects,
    updateProjectDetails,
  } = useContext(ProjectUserContext);

  const isSmallerScreen = useMediaQuery("(max-width: 600px)");
  const showBio = !isSmallerScreen;
  const showProjectList = userProjects.length > 0;
  const scrollRef = useRef(0);

  console.log("User Projects", userProjects);

  const handleScroll = () => {
    scrollRef.current = window.scrollY;
    if (scrollRef.current > 350) {
      setStickyHeader(true);
    } else {
      setStickyHeader(false);
    }
  };

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
      {stickyHeader ? <StickyHeader userName={user ? user.name : ""} /> : null}
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
            height: 200,
            width: 200,
            borderRadius: "50%",
            boxShadow: 5,
            alignSelf: "center",
          }}
        />
        <Typography
          variant="h3"
          component="h3"
          sx={{
            mt: 3,
            mb: 5,
            alignSelf: "center",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {userProjects.length > 0
            ? `Welcome back, ${user.name} \u{1F44B}`
            : `${texts.welcome} ${user?.name ? `, ${user.name}` : ""} \u{1F44B}`}
        </Typography>
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
      {showProjectList && <Container
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
        <Stack
          direction={isSmallerScreen ? "column" : "row"}
          spacing={2}
          sx={{ alignSelf: "center", width: "100%" }}
        >
          <ProfileCard
            avatarUrl="/static/images/avatar/2.jpg"
            name={user ? user.name : "Loading..."}
            email={user ? user.email : "Loading..."}
            bio={showBio ? `Part of ${userProjects.length} projects` : null}
          />

          {showProjectList ? (
            <Box
              component="main"
              sx={{
                mt: 8,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: 2,
                paddingLeft: 0,
                paddingRight: 0,
                width: "100%",
              }}
            >
              <Box
                component="p"
                sx={{
                  fontSize: 20,
                  py: 1,
                  mt: 0,
                  mb: 0,
                  alignSelf: "center",
                  backgroundColor: "white",
                  width: "100%",
                  boxShadow: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "3px solid #e0e0e0",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    fontSize: 20,
                    px: 1,
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
                    px: 1,
                    alignSelf: "center",
                    fontWeight: 100,
                    width: "100%",
                    textAlign: "end",
                    color: "grey.500",
                  }}
                >
                  {userProjects.length
                    ? `${userProjects.length} PROJECTS`
                    : "..."}
                </Typography>
              </Box>

              <List
                sx={{
                  width: "100%",
                  overflowY: "scroll",
                  maxHeight: "400px",
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
              </List>
            </Box>
          ) : null}

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
        </Stack>
      </Container>}
      <Box
        component="footer"
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
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Get started with your own Agile board!
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "primary.main", color: "white" }}
          onClick={handleCreateProjectClick}
        >
          Create New Project
        </Button>
      </Box>
      <NewProjectModal
        open={showCreateModal}
        setOpen={setShowCreateModal}
      />
    </Box>
  );
}

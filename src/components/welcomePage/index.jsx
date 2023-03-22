import { React, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Button,
  List,
  Paper,
} from "@mui/material";
import axios from "axios";
import CardBox from "../elements/welcomePage/CardBox";
import Logo from "../../assets/images/agileLogo.png";
import { texts } from "../constants/welcomePage";
import ImageCarousel from "../elements/welcomePage/ImageCarousel";
import StickyHeader from "../elements/welcomePage/StickyHeader";
import ProfileCard from "../elements/welcomePage/ProfileCard";
import { DOMAIN } from "../../config";
import ProjectListItem from "../elements/welcomePage/ProjectListItem";

export default function WelcomePage() {
  const [userProjects, setUserProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [stickyHeader, setStickyHeader] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${DOMAIN}/api/management/me`);
      setUser(response.data);
    };
    const getUserProjects = async () => {
      const response = await axios.get(`${DOMAIN}/api/management/project`);
      setUserProjects(response.data);
    };
    getUser();
    getUserProjects();
  }, []);

  const scrollRef = useRef(0);

  const handleScroll = () => {
    scrollRef.current = window.scrollY;
    if (scrollRef.current > 400) {
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

  const handleProjectClick = (projectId) => {
    window.location.href = `/project/${projectId}`;
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
          sx={{ mt: 3, mb: 5, alignSelf: "center", fontWeight: "bold" }}
        >
          {userProjects.length > 0
            ? `Welcome back, ${user.name} \u{1F44B}`
            : `${texts.welcome} ${user ? `, ${user.name}` : ""} \u{1F44B}`}
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
      <Container
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
          direction="row"
          spacing={2}
          sx={{ alignSelf: "center", width: "100%" }}
        >
          <ProfileCard
            avatarUrl="/static/images/avatar/2.jpg"
            name={user ? user.name : "Loading..."}
            email={user ? user.email : "Loading..."}
            bio={`Part of ${userProjects.length} projects`}
          />
          {userProjects.length > 0 ? (
          <Box
            component="main"
            sx={{
              mt: 8,
              mb: 2,
              display: "flex",
              minWidth: "60%",
              flexDirection: "column",
              justifyContent: "center",
              border: "5px solid #e0e0e0",
              paddingLeft: 0,
              paddingRight: 0,
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
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: 18,
                  px: 1,
                  alignSelf: "center",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                  YOUR PROJECTS
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: 12,
                  px: 1,
                  alignSelf: "center",
                  fontWeight: 100,
                  width: "100%",
                }}
              >
                {userProjects.length
                  ? `Currently part of ${userProjects.length} projects`
                  : ""}
              </Typography>
            </Box>
            
            <List
              sx={{
                width: "100%",
                overflowY: "scroll",
                maxHeight: "300px",
                padding: 0,
                scrollBehavior: "smooth",
              }}
            >
              {userProjects.map((project) => (
                <ProjectListItem
                  key={project.projectId}
                  project={project}
                  handleProjectClick={handleProjectClick}
                />
              ))}
            </List>
          </Box>
          ) : (
            <Paper
              sx={{
                mt: 8,
                mb: 2,
                display: "flex",
                minWidth: "60%",
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
      </Container>
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
        >
          Create New Project
        </Button>
      </Box>
    </Box>
  );
}

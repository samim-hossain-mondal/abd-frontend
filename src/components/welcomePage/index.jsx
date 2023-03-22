/* eslint-disable import/no-unresolved */
import { React, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Button,
  List,
} from "@mui/material";
import axios from "axios";
import CardBox from "../elements/welcomePage/CardBox";
import Logo from "../../assets/images/agileLogo.png";
import { texts } from "../constants/welcomePage";
import ImageCarousel from "../elements/welcomePage/ImageCarousel";
import StickyHeader from "../elements/welcomePage/StickyHeader";
import ProfileCard from "../elements/welcomePage/ProfileCard";

export default function WelcomePage() {
  const [userProjects, setUserProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [stickyHeader, setStickyHeader] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/management/me"
      );
      console.log(response);
      setUser(response.data);
    };
    const getUserProjects = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/management/project"
      );
      console.log(response);
      setUserProjects(response.data);
    };
    getUser();
    getUserProjects();
  }, []);

  const scrollRef = useRef(0);

  const handleScroll = () => {
    scrollRef.current = window.scrollY;
    if (scrollRef.current > 475) {
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
      {stickyHeader ? <StickyHeader /> : null}
      <Container
        component="main"
        sx={{
          mt: 8,
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
            : `${texts.welcome} ${user ? `, ${user.name}` : ''} \u{1F44B}`}
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
          <CardBox
            title="Get started with My Agile Board"
            description="Create a new project or ask your PO to add you to an existing project"
          />
        </Stack>
      </Container>
      <Container
        component="main"
        sx={{
          mt: 8,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            jobTitle="Software Engineer"
            bio={`Part of ${userProjects.length} projects`}
          />
          <Container
            component="main"
            sx={{
              mt: 8,
              mb: 2,
              display: "flex",
              minWidth: "60%",
              flexDirection: "column",
              justifyContent: "center",
            }}
            maxWidth="lg"
          >
            <Box
              component="p"
              sx={{
                fontSize: 20,
                px: 1,
                py: 1,
                mt: 0,
                mb: 1,
                alignSelf: "center",
                fontWeight: 100,
                backgroundColor: "white",
                width: "100%",
                boxShadow: 1,
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: 15,
                  px: 1,
                  alignSelf: "center",
                  fontWeight: 100,
                  width: "100%",
                }}
              >
                {userProjects.length > 0
                  ? "Your projects"
                  : "You are not part of any project yet"}
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
                {userProjects.length > 0 ? `Currently part of ${userProjects.length} projects` : ''}
              </Typography>
            </Box>
            <List
              sx={{
                width: "100%",
                overflowY: "scroll",
                maxHeight: '500px',
                padding: 0,
              }}
            >
              {userProjects.map((project) => (
                <Box
                  component="card"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    textAlign: "start",
                    mb: 1,
                  }}
                >
                  <Box
                    component="p"
                    sx={{
                      fontSize: 15,
                      width: "100%",
                      padding: 1,
                      margin: 0,
                      backgroundColor: "#85B2FC",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    {project.projectName}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      fontSize: 15,
                      color: "text.primary",
                      width: "100%",
                      px: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {project.projectDescription}
                  </Box>
                </Box>
              ))}
            </List>
          </Container>
        </Stack>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
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

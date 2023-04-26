// @mui material components
import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";

import Image from "mui-image";
import LeaderIcon from '../../../assets/icons/leadership.png'
import TeamIcon from '../../../assets/icons/team.png'
import POIcon from '../../../assets/icons/po.png'

function ValueProps() {
  const isLargeScreen = useMediaQuery("(min-width:600px)");
  return (
    <Box component="section" py={{ xs: 3, md: 12 }}>
      <Container>
        <Grid container alignItems="center">
          <Grid item xs={12} lg={5}>
            <Typography variant="h3" my={1}>
            Why use My Agile Portal?
            </Typography>
            <Typography variant="body2" color="text" mb={2}>
              My Agile Portal serves as the home page for any of your Agile projects that unifies the areas unseen by other team management tools to improve team collaboration and tranparancy.
            </Typography>
            {/* <Typography
              component="a"
              href="#"
              variant="body2"
              color="info"
              fontWeight="regular"
              sx={{
                width: "max-content",
                display: "flex",
                alignItems: "center",

                "& .material-icons-round": {
                  fontSize: "1.125rem",
                  transform: "translateX(3px)",
                  transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                },

                "&:hover .material-icons-round, &:focus .material-icons-round": {
                  transform: "translateX(6px)",
                },
              }}
            >
              More about us
              <Icon sx={{ fontWeight: "bold" }}>arrow_forward</Icon>
            </Typography> */}
          </Grid>
          <Grid item xs={12} lg={6} sx={{ ml: { xs: -2, lg: "auto" }, mt: { xs: 6, lg: 0 } }}>
            <Stack>
              <Box display="flex" alignItems="center" p={2}>
                <Box
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <Icon fontSize="large" color="action">
                    <Image
                      src={LeaderIcon}
                      height="100%"
                      width="100%"
                      fit="cover"
                      duration={0}
                      errorIcon
                      shift={null}
                      shiftDuration={900}
                      showLoading
                      easing="ease-in-out"
                      sx={{
                        position: isLargeScreen ? "absolute" : "relative",
                        top: 0,
                        left: 0
                      }}
                    />
                  </Icon>
                </Box>
                <Typography variant="body2" color="text" pl={2}>
                  <b>Scrum Master / Product Owner</b>
                  <br />
                  Maintain your notes in Action Items, Key Decisions and Open Questions for better visibility.
                  Use the Team Sentiment Meter and Daily Retro Board to drive your high velocity team.
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" p={2}>
                <Box
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <Icon fontSize="large">
                    <Image
                      src={POIcon}
                      height="100%"
                      width="100%"
                      fit="cover"
                      duration={0}
                      errorIcon
                      shift={null}
                      shiftDuration={900}
                      showLoading
                      easing="ease-in-out"
                      sx={{
                        position: isLargeScreen ? "absolute" : "relative",
                        top: 0,
                        left: 0
                      }}
                    />
                  </Icon>
                </Box>
                <Typography variant="body2" color="text" pl={2}>
                  <b>Project Leadership</b>
                  <br />
                  Stay updated on your team&apos;s health and what is blocking them, amid your busy schedule.
                  Know your team members and their contributions better than before.
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" p={2}>
                <Box
                  width="3rem"
                  height="3rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  coloredShadow="info"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                >
                  <Icon fontSize="large">
                    <Image
                      src={TeamIcon}
                      height="100%"
                      width="100%"
                      fit="cover"
                      duration={0}
                      errorIcon
                      shift={null}
                      shiftDuration={900}
                      showLoading
                      easing="ease-in-out"
                      sx={{
                        position: isLargeScreen ? "absolute" : "relative",
                        top: 0,
                        left: 0
                      }}
                    />
                  </Icon>
                </Box>
                <Typography variant="body2" color="text" pl={2}>
                  <b>Team Member</b>
                  <br />
                  {/* Helps onboard new members onto the team and get to know about the team even before your first DSM in the project. 
                  Helps to share your contributions with your project team.  */}
                  Ensures a smooth onboarding process onto a new team. Get to know your new team even before your first DSM in the project.
                  Share your contributions with the team and get recognized for your efforts.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ValueProps;
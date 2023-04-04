import React from "react";
import { Grid, Box, Chip, Button } from "@mui/material";
import propTypes from "prop-types";
import { colorMap } from "../constants/Color";

export default function TeamInformationCardContainer({
  cardData,
  handleOpenModal,
  handleMessageClick,
  formatDate,
  SlackLogo,
  today,
}) {
  return (
    <Grid
      className="body"
      container
      spacing={3}
      rowGap={0}
      marginBottom="1.25%"
    >
      {cardData &&
        // eslint-disable-next-line react/prop-types
        cardData.map((item) => (
          <Grid
            item
            key={item.id}
            lg={4}
            md={4}
            sm={6}
            sx={{
              width: {
                lg: "200px",
                md: "100px",
                sm: "100%",
                xs: "100%",
              },
              height: "auto",
              overflow: "hidden",
            }}
          >
            <Box
              key={item.id}
              sx={{
                fontFamily: "Roboto",
                boxShadow: 1,
                margin: "2% 2% 2% 0",
                overflow: "hidden",
                border: "1px solid #CBD5DC",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              <Box onClick={() => handleOpenModal(item)}>
                <Box
                  fontSize="1.8rem"
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                  padding="5% 0 1.5% 4%"
                >
                  <Box
                    sx={{
                      width: "93%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {item.name ? item.name : item.emailId}
                  </Box>
                </Box>
                <Box
                  color="#545555"
                  padding="0% 0 2% 4%"
                  height="20px"
                  overflow="hidden"
                  fontSize="large"
                  width="94%"
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.name ? item.emailId : ""}
                </Box>
                <Box
                  color="#545555"
                  padding="0% 0 2% 4%"
                  fontSize="large"
                  height="20px"
                >
                  {item.projectRole && item.projectRole}
                </Box>
                <Box
                  backgroundColor="whitesmoke"
                  height="50px"
                  display="flex"
                  fontSize="large"
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    marginLeft="4%"
                    color="black"
                  >
                    {item.startDate && formatDate(item.startDate)}
                    {item.endDate &&
                      (item.endDate < today
                        ? ` - ${formatDate(item.endDate)}`
                        : " - Till Date")}
                    {!item.endDate && " - Till Date"}
                  </Box>{" "}
                  <Box
                    color="#545555"
                    padding="0% 0 2% 5%"
                    margin="1.5% 0 0% 0"
                    fontSize="large"
                  />
                  <Box margin="1.75% 4% 2% 2%" display="flex" alignItems='center'>
                    {item.message && (
                      <Button
                        href={item.message}
                        target="_blank"
                        onClick={handleMessageClick}
                        height="20px"
                        width="20px"
                      >
                        <img
                          src={SlackLogo}
                          alt="slack"
                          height="20px"
                          width="20px"
                        />{" "}
                      </Button>
                    )}
                    <Chip
                      label={item.role}
                      style={{ backgroundColor: colorMap[item.role] }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
}
TeamInformationCardContainer.propTypes = {
  cardData: propTypes.shape({
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    emailId: propTypes.string.isRequired,
    role: propTypes.string.isRequired,
    projectRole: propTypes.string.isRequired,
    startDate: propTypes.string.isRequired,
    endDate: propTypes.string.isRequired,
    message: propTypes.string.isRequired,
  }).isRequired,

  handleOpenModal: propTypes.func.isRequired,
  handleMessageClick: propTypes.func.isRequired,
  formatDate: propTypes.func.isRequired,
  SlackLogo: propTypes.string.isRequired,
  today: propTypes.string.isRequired,
};
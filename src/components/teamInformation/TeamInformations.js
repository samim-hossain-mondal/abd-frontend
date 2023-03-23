/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Typography,
  Modal,
  TextField,
  Button,
  TextareaAutosize,
} from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  BACKEND_URL,
  GET_TEAM_INFORMATION_BY_PROJECT_ID,
  POST_TEAM_INFORMATION,
  DELETE_TEAM_INFORMATION,
  PUT_TEAM_INFORMATION,
} from "../constants/apiEndpoints";
import makeRequest from "../utilityFunctions/makeRequest";
import { ErrorContext } from "../contexts/ErrorContext";

function CardList() {
  const { setError, setSuccess } = useContext(ErrorContext);
  const [today] = useState(new Date().toISOString().slice(0, 10));
  const [isMessageClicked, setIsMessageClicked] = useState(false);
  const [data, setData] = useState([]);
  const [memberId] = useState(1);
  const [isAddCard, setIsAddCard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emailId, setEmailId] = useState("");
  const [bio, setBio] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [message, setMessage] = useState("");
  const [projectId] = useState(1);
  useEffect(() => {
    makeRequest(
      BACKEND_URL,
      GET_TEAM_INFORMATION_BY_PROJECT_ID(projectId).url,
      "GET"
    )
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    const splitStartDate = item.startDate.split("T");
    setStartDate(splitStartDate[0]);
    const splitEndDate = item.endDate.split("T");
    setEndDate(splitEndDate[0]);
    setEmailId(item.emailId);
    setBio(item.bio);
    setProjectRole(item.projectRole);
    setMessage(item.message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setName("");
    setStartDate("");
    setEndDate("");
    setEmailId("");
    setProjectRole("");
    setBio("");
    setMessage("");
    if (isAddCard) setIsAddCard(false);
    setModalOpen(false);
  };

  const handleSaveChanges = () => {
    if (isAddCard) {
      makeRequest(BACKEND_URL, POST_TEAM_INFORMATION.url, "POST", {
        data: {
          name,
          projectId,
          projectRole,
          memberId,
          message,
          bio,
          startDate,
          endDate,
        },
      }).then((response) => {
        if (response.id) {
          const updatedData = [...data, response];
          setData(updatedData);
          setIsAddCard(false);
          setSuccess("Information added successfully");
          handleCloseModal();
        } else {
          setError("Error in adding information");
        }
      });
    } else {
      makeRequest(
        BACKEND_URL,
        PUT_TEAM_INFORMATION(selectedItem.id).url,
        "PUT",
        {
          data: {
            name,
            memberId,
            projectId,
            projectRole,
            message,
            bio,
            startDate,
            endDate,
          },
        }
      ).then((response) => {
        let itemFound = false;
        const updatedData = data.map((item) => {
          if (response.id === selectedItem.id) {
            setSuccess("Information updated successfully");
            itemFound = true;
            return {
              ...item,
              name,
              startDate,
              endDate,
              emailId,
              projectRole,
              bio,
              message,
            };
          }
          return item;
        });
        if (!itemFound) setError("Error in updating information");
        setData(updatedData);
        setIsAddCard(false);
        handleCloseModal();
      });
    }
  };

  const handleAddCard = () => {
    const newCard = {
      name: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      emailId: "",
      bio: "",
      projectRole: "",
      message: "",
    };
    setIsAddCard(true);
    handleOpenModal(newCard);
  };
  const formatDate = (date) => {
    const dateInengbFormat = new Date(date);
    return dateInengbFormat.toLocaleDateString("en-GB");
  };
  const handleDelete = () => {
    makeRequest(
      BACKEND_URL,
      DELETE_TEAM_INFORMATION(selectedItem.id).url,
      "DELETE"
    ).then((response) => {
      if (response.id === selectedItem.id)
        setSuccess("Information deleted successfully");
      else {
        setError("Error in deleting information");
        return;
      }
      const updatedData = data.filter((item) => item.id !== selectedItem.id);
      setData(updatedData);
      handleCloseModal();
    });
  };
  useEffect(() => {
    if (isMessageClicked) {
      setModalOpen(false);
      setIsMessageClicked(false);
    }
  }, [isMessageClicked]);
  const handleMessageClick = () => {
    setIsMessageClicked(true);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "95%",
        flexWrap: "wrap",
        justifyContent: "center",
        marginLeft: "1%",
        marginRight: "1%",
        marginTop: "5%",
        height: "83vh",
        backgroundColor: "#e6eef2",
      }}
    >
      <Box sx={{ width: "100%", paddingLeft: "18%" }}>
        <Button
          style={{ margin: "2% 2% 1% 0%" }}
          variant="contained"
          background="#7784EE"
          onClick={() => {
            handleAddCard();
          }}
          name="save"
          type="button"
        >
          Add Card
        </Button>
      </Box>
      <Box
        sx={{
          paddingLeft: "18%",
          paddingBottom: "5%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: "5%",
          rowGap: "5%",
          backgroundColor: "#e6eef2",
          width: "95%",
          overflowY: "scroll",
          height: "50vh",
        }}
      >
        {data.map((item) => (
          <Box
            key={item.id}
            sx={{
              width: 500,
              marginBottom: "1rem",
              borderRadius: "10px",
              overflow: "hidden",
              fontFamily: "Roboto",
              boxShadow: 1,
              height: 235,
            }}
          >
            <Box onClick={() => handleOpenModal(item)}>
              <Box
                sx={{
                  backgroundColor: "#CBD5DC",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "95%",
                  height: "50px",
                  padding: "0 5% 0 0",
                }}
                style={{
                  marginRight: "10px",
                }}
              >
                {formatDate(item.startDate)}-
                {item.endDate < today ? formatDate(item.endDate) : "Till Date"}
              </Box>
              <Box
                sx={{
                  fontSize: "xx-large",
                  backgroundColor: "#E6EEF2",
                  height: "60px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  padding: "4% 0% 0% 6%",
                }}
              >
                {item.name}
              </Box>
              <Box
                sx={{
                  color: "#8A9DAB",
                  backgroundColor: "#E6EEF2",
                  padding: "0% 0 7% 6%",
                  fontSize: "large",
                }}
              >
                {item.projectRole}
              </Box>
              <Box
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  height: "50px",
                  display: "flex",
                  fontSize: "large",
                }}
              >
                <Box sx={{ margin: "0.7% 5% 2% 2%" }}>
                  <Button>Bio</Button>
                </Box>
                <Box sx={{ margin: "0.7% 5% 2% 2%" }}>
                  <Button
                    href={item.message}
                    target="_blank"
                    onClick={handleMessageClick}
                  >
                    Message
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          sx={{
            overflow: "scroll",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Box
            style={{
              top: "50%",
              left: "50%",
              right: "50%",
              width: "35%",
              marginTop: "2%",
              marginBottom: "2%",
              height: "88%",
              overflow: "scroll",
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <Box
              sx={{
                justifyContent: "space-between",
                width: "100%",
                display: "flex",
                columnGap: "2%",
              }}
            >
              <Box>
                <Typography variant="h5">Details</Typography>
              </Box>
              <Box>
                <IconButton edge="end" color="inherit" aria-label="close">
                  <DeleteForeverRoundedIcon onClick={handleDelete} />
                </IconButton>
                <IconButton color="inherit" aria-label="close">
                  <CloseIcon onClick={handleCloseModal} />
                </IconButton>
              </Box>
            </Box>

            <TextField
              label="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Your start date in the project"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Your end date in the project"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box
              sx={{
                color: "grey",
                fontFamily: "Roboto",
                fontSize: "normal",
                fontWeight: "normal",
                padding: "2% 0% 1% 0%",
              }}
            >
              Enter your work in the project
            </Box>
            <TextareaAutosize
              label="Your work in the project"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Example: Front End: Login Page, Back End: Login API, Database: Login Table, etc."
              minRows={13}
              className="my-textarea"
              style={{
                fontFamily: "Roboto",
                fontSize: "large",
                width: "97%",
                padding: "1%",
              }}
            />
            <TextField
              label="Your projectRole in the project"
              value={projectRole}
              onChange={(e) => setProjectRole(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Your email id"
              value={emailId}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Your slack link"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              sx={{
                width: "100%",
                margin: "0.75% 0 0.75% 0",
                backgroundColor: "#7784EE",
                color: "white",
              }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default CardList;

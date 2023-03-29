/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Typography,
  Modal,
  TextField,
  Button,
  TextareaAutosize,
 InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { Search } from '@mui/icons-material';
import {
  GET_TEAM_INFORMATION_BY_PROJECT_ID,
  POST_TEAM_INFORMATION,
  DELETE_TEAM_INFORMATION,
  PUT_TEAM_INFORMATION,
  GET_ROLE_IN_PROJECT,
} from "../constants/apiEndpoints";
import makeRequest from "../utilityFunctions/makeRequest/index";
import SlackLogo from "../../assets/images/Slack_icon.png";
import { ErrorContext } from "../contexts/ErrorContext";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import DeleteDialog from "../elements/DeleteDialog";

function CardList() {
  const { projectId } = useParams();
  const { user } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const [today] = useState(new Date().toISOString().slice(0, 10));
  const [isMessageClicked, setIsMessageClicked] = useState(false);
  const [data, setData] = useState([]);
  const [memberId] = useState(user.memberId);
  const [isAddCard, setIsAddCard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [name, setName] = useState(user.name);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emailId, setEmailId] = useState(user.email);
  const [bio, setBio] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [message, setMessage] = useState("");
  const [showAddProfile, setShowAddProfile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchValue, setSearchValue]= useState("");
  const handleSearchValueChange =(event)=>{
    setSearchValue(event.target.value);
  }

  useEffect(() => {
    try {
      makeRequest(GET_TEAM_INFORMATION_BY_PROJECT_ID(projectId)).then(
        (response) => {
          setData(response);
          const index = response.findIndex(
            (item) => item.emailId === user.email
          );
          if (index === -1) {
            setShowAddProfile(true);
          } else {
            setShowAddProfile(false);
          }
        }
      );
    } catch (error) {
      setError("Error in making the request");
    }
    try {
      makeRequest(GET_ROLE_IN_PROJECT(projectId, memberId)).then((response) => {
        setProjectRole(response.role);
      });
    } catch (error) {
      setError("Error in making the request");
    }
  }, []);
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    if (item.startDate === null) {
      setStartDate("");
    } else {
      const splitStartDate = item.startDate && item.startDate.split("T");
      setStartDate(splitStartDate[0]);
    }
    if (item.endDate !== null) {
      const splitEndDate = item.endDate && item.endDate.split("T");
      setEndDate(splitEndDate[0]);
    } else {
      setEndDate("");
    }
    setEmailId(item.emailId);
    setBio(item.bio);
    setProjectRole(item.projectRole);
    setMessage(item.message);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedItem(null);
    setName(name);
    setStartDate("");
    setEndDate("");
    setEmailId(emailId);
    setProjectRole(projectRole);
    setBio("");
    setMessage("");
    if (isAddCard) setIsAddCard(false);
    setModalOpen(false);
  };
  const handleSaveChanges = () => {
    if (
      !name ||
      !startDate ||
      !endDate ||
      !emailId ||
      !projectRole ||
      !message ||
      !bio
    ) {
      setError("Please fill all the fields");
      return;
    }
    if (startDate > endDate) {
      setError("Start date cannot be greater than end date");
      return;
    }
    if (isAddCard) {
      try {
        makeRequest(POST_TEAM_INFORMATION, {
          data: {
            name,
            projectId: Number(projectId),
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
            setShowAddProfile(false);
            setSuccess("Information added successfully");
            handleCloseModal();
          } else {
            setError("Error in adding information");
          }
        });
      } catch (error) {
        setError("Error in making the request");
      }
    } else {
      try {
        makeRequest(PUT_TEAM_INFORMATION(selectedItem.id), {
          data: {
            name,
            memberId,
            projectId: Number(projectId),
            projectRole,
            message,
            bio,
            startDate,
            endDate,
          },
        }).then((response) => {
          response.emailId = emailId;
          const updatedData = data.map((item) => {
            if (item.id === selectedItem.id) {
              return response;
            }
            return item;
          });
          setData(updatedData);
          setSuccess("Information updated successfully");
          setIsAddCard(false);
          setShowAddProfile(false);
          handleCloseModal();
        });
      } catch (error) {
        setError("Error in making the request");
      }
    }
  };
  const handleAddCard = () => {
    const newCard = {
      name,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      emailId: user.email,
      bio: "",
      projectRole,
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
    if (emailId !== user.email) {
      setError("You can only delete your own information");
      return;
    }
    const index = data.findIndex((item) => item.emailId === user.email);
    if (index === -1) {
      setModalOpen(false);
      setDeleteDialogOpen(false);
      return;
    }
    try {
      makeRequest(DELETE_TEAM_INFORMATION(selectedItem.id), "DELETE").then(
        (response) => {
          if (response.id === selectedItem.id) {
            setSuccess("Information deleted successfully");
            setShowAddProfile(true);
          } else {
            setError("Error in deleting information");
            return;
          }
          const updatedData = data.filter(
            (item) => item.id !== selectedItem.id
          );
          setData(updatedData);
          handleCloseModal();
        }
      );
    } catch (error) {
      setError("Error in deleting information");
    } finally {
      setDeleteDialogOpen(false);
    }
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
  let filterData= data;
  if(filterData && searchValue!=="" )
  filterData = filterData.filter(
    // check item.bio contains the sercahValue
    (item) => {
    const value = item.bio;
    if(value)
    return value.includes(searchValue)
    }
  );
  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        description="Are you sure want to delete this Profile"
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#e6eef2",
        }}
        className="body"
      >
        <Box sx={{ width: "95%", height: "3%" }}>
        <TextField
        variant="outlined"
        placeholder="Search"
        value={searchValue}
        onChange={handleSearchValueChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "95%",
              flexWrap: "wrap",
              justifyContent: "center",
              backgroundColor: "#e6eef2",
              overflow: "scroll",
            }}
          >
            <Box
              sx={{
                marginTop: "0%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "85%",
              }}
            >
              {filterData &&
                filterData.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      width: 448,
                      borderRadius: "10px",
                      fontFamily: "bebas-neue",
                      boxShadow: 1,
                      height: "260px",
                      margin: "2% 2% 2% 0",
                      overflow: "hidden",
                      border: "1px solid #CBD5DC",
                    }}
                  >
                    <Box onClick={() => handleOpenModal(item)}>
                      <Box
                        sx={{
                          backgroundColor: "whitesmoke",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          width: "95%",
                          height: "50px",
                          padding: "0 5% 0 0",
                        }}
                      >
                        {(!item.startDate || !item.endDate) && "No value"}
                        {item.startDate &&
                          item.endDate &&
                          formatDate(item.startDate)}
                        {item.startDate &&
                          item.endDate &&
                          (item.endDate < today
                            ? ` - ${formatDate(item.endDate)}`
                            : " - Till Date")}
                      </Box>
                      <Box
                        sx={{
                          fontSize: "xx-large",
                          backgroundColor: "white",
                          height: "60px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          padding: "4% 0% 0% 6%",
                        }}
                      >
                        {item.name ? item.name : "Name not provided"}
                      </Box>
                      <Box
                        sx={{
                          color: "#8A9DAB",
                          backgroundColor: "white",
                          padding: "0% 0 2% 6%",
                          fontSize: "large",
                        }}
                      >
                        {item.emailId}
                      </Box>
                      <Box
                        sx={{
                          color: "#8A9DAB",
                          backgroundColor: "white",
                          padding: "0% 0 7% 6%",
                          fontSize: "large",
                        }}
                      >
                        {item.projectRole
                          ? item.projectRole
                          : "Project Role not provided"}
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: "whitesmoke",
                          color: "blue",
                          height: "50px",
                          display: "flex",
                          fontSize: "large",
                        }}
                      >
                        <Box sx={{ margin: "2% 5% 2% 2%" }}>
                          <Button
                            href={item.message}
                            target="_blank"
                            onClick={handleMessageClick}
                          >
                            <img
                              src={SlackLogo}
                              alt="slack"
                              height="20px"
                              width="20px"
                            />{" "}
                            &nbsp;MESSAGE
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
                    disabled={!(emailId === user.email)}
                  />
                  <TextField
                    label="Your start date in the project"
                    type={startDate || emailId === user.email ? "date" : "text"}
                    value={startDate || "value not provided"}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={!(emailId === user.email)}
                  />
                  <TextField
                    label="Your end date in the project"
                    type={endDate || emailId === user.email ? "date" : "text"}
                    value={endDate || "value not provided"}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={!(emailId === user.email)}
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
                    disabled={!(emailId === user.email)}
                    style={{
                      fontFamily: "Roboto",
                      fontSize: "large",
                      width: "97%",
                      padding: "1%",
                    }}
                  />
                  <TextField
                    label="Your project Role in the project"
                    value={
                      projectRole || emailId === user.email
                        ? projectRole
                        : "value not provided"
                    }
                    onChange={(e) => setProjectRole(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={!(emailId === user.email)}
                  />
                  <TextField
                    label="Your email id"
                    value={emailId}
                    fullWidth
                    disabled
                    margin="normal"
                  />
                  <TextField
                    label="Your slack link"
                    value={
                      message || emailId === user.email
                        ? message
                        : "value not provided"
                    }
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={!(emailId === user.email)}
                  />
                  {emailId === user.email ? (
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
                  ) : null}
                </Box>
              </Modal>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default CardList;
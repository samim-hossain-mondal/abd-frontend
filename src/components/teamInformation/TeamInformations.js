/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Typography,
  Modal,
  TextField,
  Button,
  InputAdornment,
  Slide,
  Grid
} from "@mui/material";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  const [filteredData, setFilteredData] = useState([]);
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
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    try {
      makeRequest(GET_TEAM_INFORMATION_BY_PROJECT_ID(projectId)).then(
        (response) => {
          setData(response);
          setFilteredData(response);
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
    setRole(item.role);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedItem(null);
    setName(name);
    setStartDate("");
    setEndDate("");
    setEmailId(emailId);
    setRole(role);
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
          console.log(response)
          const updatedData = data.map((item) => {
            if (item.id === selectedItem.id) {
              response.role= role;
              return response;
            }
            return item;
          });
          setData(updatedData);
          setSuccess("Information updated successfully");
          setIsAddCard(false);
          handleCloseModal();
        });
      } catch (error) {
        setError("Error in making the request");
      }
    }
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
  function debounce(fn, delay) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const filterContent = (inputValue) => {
    if (inputValue !== "") {
      const filterData = data.filter((item) => {
        const value = item?.bio?.toLowerCase();
        return value?.includes(inputValue?.toLowerCase());
      });
      setFilteredData(filterData);
    } else {
      setFilteredData(data);
    }
  };
  const handleSearchValueChange = (event) => {
    const inputValue = event.target.value;
    debounce(() => filterContent(inputValue), 500)();
    setSearchValue(event.target.value);
  };
useEffect(()=>{
  setFilteredData(data);
  debounce(() => filterContent(searchValue), 500)();
}
  ,[data])
  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        description="Are you sure want to delete this Profile"
      />
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        backgroundColor="#e6eef2"
        className="body"
        height="100vh"
        sx={{overflow:'scroll'}}
      >
        <Box
        sx={{marginTop:'10%'}}
          width="100%"
          height="3%"
          marginRight="23.5%"
          marginTop="2%"
          display="flex"
          justifyContent="flex-end"
        >
          <TextField
            variant="outlined"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchValueChange}
            style={{ backgroundColor: "white", color: "blue" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" color="blue">
                  <IconButton color="blue">
                    <Search color="blue" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box width="100%" display="flex" justifyContent="center" height="90vh">
          <Box
            display="flex"
            width="95%"
            flexWrap="wrap"
            justifyContent="center"
            backgroundColor="#e6eef2"
            overflow="scroll"
          >
            <Box
              marginTop="0%"
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              width="85%"
            >
              <Slide
                direction="up"
                in={filteredData !== null}
                mountOnEnter
                unmountOnExit
              >
                <Grid
                        className="body"
                        container
                        spacing={2}
                        rowGap={2}
                        // justifyContent="center"
                        alignItems="center"
                
                >
                  {filteredData.map((item) => (
                     <Grid item lg={4} md={4} sm={6} sx={{
                      width: { lg: "448px", md: "440px", sm: "100%", xs: "100%" },
                      height: 'auto',
                      marginTop: '2%',
                      overflow: 'hidden',
                      borderRadius: '10px',
                    }} ><Box
                      key={item.id}
                      sx={{
                        borderRadius: "10px",
                        fontFamily: "bebas-neue",
                        boxShadow: 1,
                        height: "290px",
                        margin: "2% 2% 2% 0",
                        overflow: "hidden",
                        border: "1px solid #CBD5DC",
                      }}
                    >
                        <Box onClick={() => handleOpenModal(item)}>
                          <Box
                            backgroundColor="whitesmoke"
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            width="95%"
                            height="50px"
                            padding="0 5% 0 0"
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
                            fontSize="xx-large"
                            backgroundColor="white"
                            height="60px"
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            padding="4% 0% 0% 6%"
                          >
                            {item.name ? item.name : "Name not provided"}
                          </Box>
                          <Box
                            color="#8A9DAB"
                            backgroundColor="white"
                            padding="0% 0 2% 6%"
                            fontSize="large"
                          >
                            {item.emailId}
                          </Box>
                          <Box
                            color="#8A9DAB"
                            backgroundColor="white"
                            padding="0% 0 2% 6%"
                            fontSize="large"
                          >
                            {item.role}
                          </Box>
                          <Box
                            color="#8A9DAB"
                            backgroundColor="white"
                            padding="0% 0 7% 6%"
                            fontSize="large"
                          >
                            {item.projectRole
                              ? item.projectRole
                              : "Project Role not provided"}
                          </Box>
                          <Box
                            backgroundColor="whitesmoke"
                            color="blue"
                            height="50px"
                            display="flex"
                            fontSize="large"
                          >
                            <Box margin="2% 5% 2% 2%">
                              <Button
                                href={item.message}
                                target="_blank"
                                onClick={handleMessageClick}
                              >
                                <img
                                  src={SlackLogo}
                                  alt="slack"
                                  height="20px"
                                  width="20px" />{" "}
                                &nbsp;MESSAGE
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                    </Box>
                    </Grid>
                  ))}
                </Grid>
              </Slide>

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
                  top="50%"
                  left="50%"
                  right="50%"
                  width="35%"
                  marginTop="2%"
                  marginBottom="2%"
                  height="88%"
                  overflow="scroll"
                  backgroundColor="#fff"
                  padding="1rem"
                  borderRadius="4px"
                >
                  <Box
                    justifyContent="space-between"
                    width="100%"
                    display="flex"
                    columnGap="2%"
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
                  <CKEditor
                    editor={ClassicEditor}
                    disabled={!(emailId === user.email)}
                    config={{
                      toolbar:
                        emailId === user.email
                          ? [
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "link",
                              "bulletedList",
                              "numberedList",
                              "blockQuote",
                              "insertTable",
                              "undo",
                              "redo",
                            ]
                          : [],
                    }}
                    onChange={(event, editor) => {
                      setBio(editor.getData());
                    }}
                    data={bio || "Value not provided"}
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

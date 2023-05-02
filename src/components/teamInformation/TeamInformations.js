import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Typography,
  Modal,
  TextField,
  Button,
  useMediaQuery,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  GET_TEAM_INFORMATION_BY_PROJECT_ID,
  PUT_TEAM_INFORMATION,
} from "../constants/apiEndpoints";
import makeRequest from "../utilityFunctions/makeRequest/index";
import SlackLogo from "../../assets/images/Slack_icon.png";
import { ErrorContext } from "../contexts/ErrorContext";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import InformationToolTip from "./InformationToolTip";
import { valueNotProvided } from "../constants/TeamInformation";
import TeamInformationCardContainer from "./TeamInformationCardContainer";
import { LoadingContext } from '../contexts/LoadingContext';

function CardList() {
  const breakpoint450 = useMediaQuery("(min-width:450px)");
  const breakPoint510 = useMediaQuery('(max-width:510px)');
  const { projectId } = useParams();
  const { user } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const [today] = useState(new Date().toISOString().slice(0, 10));
  const [isMessageClicked, setIsMessageClicked] = useState(false);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
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
  const [searchValue, setSearchValue] = useState("");
  const [adminCards, setAdminCard] = useState(null);
  const [leaderCards, setLeaderCard] = useState(null);
  const [memberCards, setMemberCard] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const [activeMembers, setActiveMembers] = useState(null);
  const [notActiveMembers,setNotActiveMembers] = useState(null);

  useEffect(() => {
    try {
      makeRequest(GET_TEAM_INFORMATION_BY_PROJECT_ID(projectId), setLoading).then(
        (response) => {
          setData(response);
          setFilteredData(response);
        }
      );
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
    if (endDate && startDate > endDate) {
      setError("Start date cannot be greater than end date");
      return;
    }

    try {
      makeRequest(PUT_TEAM_INFORMATION(selectedItem.id), setLoading, {
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
        const updatedData = data.map((item) => {
          if (item.id === selectedItem.id) {
            response.role = role;
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

  };
  const formatDate = (date) => {
    const dateInengbFormat = new Date(date);
    return dateInengbFormat.toLocaleDateString("en-GB");
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
    return function handleTimeout(...args) {
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
        const bioValue = item?.bio?.toLowerCase();
        const roleValue = item?.role?.toLowerCase();
        const nameValue = item?.name?.toLowerCase();
        const emailIdValue = item?.emailId?.toLowerCase();
        const projectRoleValue = item?.projectRole?.toLowerCase();
        return (
          bioValue?.includes(inputValue?.toLowerCase()) ||
          roleValue?.includes(inputValue?.toLowerCase()) ||
          emailIdValue?.includes(inputValue?.toLowerCase()) ||
          nameValue?.includes(inputValue?.toLowerCase()) ||
          projectRoleValue?.includes(inputValue?.toLowerCase())
        );
      });
      setFilteredData(filterData);
    } else setFilteredData(data);
  };
  const handleSearchValueChange = (event) => {
    const inputValue = event.target.value;
    debounce(() => filterContent(inputValue), 500)();
    setSearchValue(event.target.value);
  };
  useEffect(() => {
    setFilteredData(data);
    debounce(() => filterContent(searchValue), 500)();
  }, [data]);
  useEffect(() => {
    const filterDataValue = filteredData && [...filteredData];
    filterDataValue?.sort((a, b) => {
      if (a.role < b.role) {
        return -1;
      }
      if (a.role > b.role) {
        return 1;
      }
      return 0;
    });
    setFilteredData(filterDataValue);
    const adminCardValue = filterDataValue?.filter(
      (item) => item.role === "ADMIN"
    );
    const leaderCardValue = filterDataValue?.filter(
      (item) => item.role === "LEADER"
    );
    const memberCardValue = filterDataValue?.filter(
      (item) => item.role === "MEMBER"
    );
    setAdminCard(adminCardValue);
    setLeaderCard(leaderCardValue);
    setMemberCard(memberCardValue);
    const activeMembersValue = filterDataValue?.filter(
      (item) => item.isActive === true
    );
    setActiveMembers(activeMembersValue)
    const notActiveMembersValue = filterDataValue?.filter(
      (item) => item.isActive === false
    );
    setNotActiveMembers(notActiveMembersValue);
  }, [filteredData]);

  return ((adminCards)&&(memberCards)&&(leaderCards))?(
    <Box sx={{ backgroundColor: "#e6eef2", display: "flex", height: "100%" }}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        backgroundColor="#e6eef2"
        className="body"
        height="100vh"
        sx={{ overflow: "scroll"}}
        marginTop={breakpoint450 ? "2%" : "3%"}
      >
        <Box
          position="absoulte"
          width="100%"
          marginBottom={!breakpoint450 ? "0.8rem" : 0}
          display="flex"
          justifyContent="flex-end"
          sx={{ backgroundColor: 'primary.contrastText', height: '45px', padding: '8px' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: '1', padding: breakPoint510 ? '15px 5px 15px 5px' : '25px 50px 25px 50px' }}>
            < Typography variant="h6" sx={{ color: 'secondaryButton.contrastText', fontWeight: 'bold' }}> Collaborators ({adminCards.length+memberCards.length+leaderCards.length}) </Typography>
            <Box
              sx={{
                background: "white",
              }}
            >
              <TextField
                id="search-bar"
                data-testid="search-bar"
                className="text"
                label="Search"
                variant="outlined" placeholder="Search..." size="small"
                InputProps={{
                  endAdornment: (
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  ),
                }}
                value={searchValue}
                onChange={handleSearchValueChange}
                sx={{ width: breakpoint450 ? '200px' : "148px" }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{padding: breakpoint450? '0.5rem 3rem 0.5rem 2.75rem':'0.5rem 0.5rem 0.5rem 0.5rem'}}>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          marginTop="2rem"
        >
          <Box
            display="flex"
            width="100%"
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
              width="99%"
            >
              {
                activeMembers?.length!==0 && <Chip
                label="ACTIVE MEMBERS"
                style={{ backgroundColor:"white" }}
              />
              }
              {activeMembers && (
                <TeamInformationCardContainer
                  cardData={activeMembers}
                  handleOpenModal={handleOpenModal}
                  handleMessageClick={handleMessageClick}
                  formatDate={formatDate}
                  SlackLogo={SlackLogo}
                  today={today}
                />
              )}
              {
                notActiveMembers?.length!==0 && <Chip
                label="PAST MEMBERS"
                style={{ backgroundColor:"white" }}
              />
              }
              {notActiveMembers && (
                <TeamInformationCardContainer
                  cardData={notActiveMembers}
                  handleOpenModal={handleOpenModal}
                  handleMessageClick={handleMessageClick}
                  formatDate={formatDate}
                  SlackLogo={SlackLogo}
                  today={today}
                />
              )}
              <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                sx={{
                  overflow: "scroll",
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: "Roboto",
                  alignContent: "center",
                }}
              >
                <Box
                  top="50%"
                  left="50%"
                  right="50%"
                  width="35%"
                  minWidth="320px"
                  marginTop="2%"
                  marginBottom="2%"
                  height="auto"
                  overflow="scroll"
                  backgroundColor="#fff"
                  padding="1.1rem"
                  borderRadius="4px"
                >
                  <Box
                    justifyContent="space-between"
                    width="100%"
                    display="flex"
                    columnGap="2%"
                  >
                    <Box sx={{ marginBottom: "2%" }}>
                      <Typography variant="h5">Member details</Typography>
                    </Box>
                    <Box>
                      <IconButton color="inherit" aria-label="close">
                        <CloseIcon onClick={handleCloseModal} />
                      </IconButton>
                    </Box>
                  </Box>
                  {(emailId === user.email || name) && (
                    <Box>
                      <Box marginLeft="0.5%" display="flex">
                        <Box sx={{ fontSize: "1.1rem" }}>Full Name</Box>
                      </Box>
                      <TextField
                        type="text"
                        style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={!(emailId === user.email)}
                      />
                    </Box>
                  )}
                  {(emailId === user.email || startDate) && (
                    <Box>
                      <Box marginLeft="0.5%" display="flex">
                        <Box sx={{ fontSize: "1.1rem" }}>Start Date</Box>
                        <InformationToolTip
                          sx={{ marginLeft: 0 }}
                          content={"Member's start date in the project"}
                        />
                      </Box>
                      <TextField
                        type={
                          startDate || emailId === user.email ? "date" : "text"
                        }
                        style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                        value={startDate || "value not provided"}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={!(emailId === user.email)}
                      />
                    </Box>
                  )}
                  {(emailId === user.email || endDate) && (
                    <Box>
                      <Box marginLeft="0.5%" display="flex">
                        <Box sx={{ fontSize: "1.1rem" }}>End Date</Box>
                        <InformationToolTip
                          sx={{ marginLeft: 0 }}
                          content={"Member's end date in the project"}
                        />
                      </Box>
                      <TextField
                        style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                        type={
                          endDate || emailId === user.email ? "date" : "text"
                        }
                        value={endDate || "value not provided"}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={!(emailId === user.email)}
                      />
                    </Box>
                  )}

                  {(emailId === user.email || bio) && (
                    <Box sx={{ marginBottom: "2%" }}>
                      <Box sx={{ display: "flex" }}>
                        {" "}
                        <Box
                          sx={{
                            fontFamily: "Roboto",
                            fontSize: "1.1rem",
                            marginBottom: "0.75%",
                            fontWeight: "normal",
                          }}
                        >
                          Work in the project
                        </Box>
                        <InformationToolTip
                          sx={{ marginLeft: 0 }}
                          content={"Member's area of work in the project"}
                        />
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
                                "fontColor",
                              ]
                              : [],
                        }}
                        onChange={(event, editor) => {
                          setBio(editor.getData());
                        }}
                        data={
                          !(emailId === user.email) && !bio
                            ? valueNotProvided
                            : bio
                        }
                      />
                    </Box>
                  )}

                  {(emailId === user.email || projectRole) && (
                    <Box>
                      <Box marginLeft="0.5%" display="flex">
                        <Box sx={{ fontSize: "1.1rem" }}>Role</Box>
                        <InformationToolTip
                          sx={{ marginLeft: 0 }}
                          content={"Member's role in the project"}
                        />
                      </Box>
                      <TextField
                        style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                        type="text"
                        value={projectRole}
                        onChange={(e) => setProjectRole(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={!(emailId === user.email)}
                      />
                    </Box>
                  )}

                  <Box>
                    <Box marginLeft="0.5%" display="flex">
                      <Box sx={{ fontSize: "1.1rem" }}>Access role</Box>
                      <InformationToolTip
                        sx={{ marginLeft: 0 }}
                        content={"Member's access role in the project"}
                      />
                    </Box>
                    <TextField
                      style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                      type="text"
                      value={role}
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  </Box>
                  <Box>
                    <Box marginLeft="0.5%" display="flex">
                      <Box sx={{ fontSize: "1.1rem" }}>Email Id</Box>
                      <InformationToolTip
                        sx={{ marginLeft: 0 }}
                        content={"Member's email id"}
                      />
                    </Box>

                    <TextField
                      style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                      type="text"
                      value={emailId}
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  </Box>
                  {(emailId === user.email || message) && (
                    <Box>
                      <Box marginLeft="0.5%" display="flex">
                        <Box sx={{ fontSize: "1.1rem" }}>Message</Box>
                        <InformationToolTip
                          sx={{ marginLeft: 0 }}
                          content={"Member's slack link"}
                        />
                      </Box>

                      <TextField
                        style={{ marginTop: "0.75%", marginBottom: "2.5%" }}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={!(emailId === user.email)}
                      />
                    </Box>
                  )}
                  {emailId === user.email ? (
                    <Button
                      variant="contained"
                      sx={{
                        width: "100%",
                        margin: "2% 0 0.75% 0",
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
      </Box>
    </Box>
  ):(
    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <CircularProgress/>
    </Box>
  )
}
export default CardList;
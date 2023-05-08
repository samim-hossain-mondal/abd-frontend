import React,{useRef,useEffect,useContext} from "react";
import {
  Dialog,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  Avatar,
  Divider,
  useMediaQuery,
  Tooltip,
  InputAdornment
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { PropTypes } from "prop-types";
import DeleteDialog from "./DeleteDialog";
import { isAdmin, isLeader, roles } from '../constants/users';
import { ErrorContext } from "../contexts/ErrorContext";


function ProjectModal({
  handleClose,
  open,
  projectInfo,
  addCollaborator,
  handleEmailChange,
  handleRoleChange,
  handleSaveCollab,
  removeCollaborator,
  handleDeleteProject,
  editProjectDetails,
  handleCancelChanges,
}) {
  const { setError } = useContext(ErrorContext);
  const newMemberNameRef = useRef(null);
  const [lock, setLock] = React.useState(true);
  const [name, setName] = React.useState(projectInfo.projectName);
  const [desc, setDesc] = React.useState(projectInfo.projectDescription);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [deleteProjectMemberAlert, setDeleteProjectMemberAlert] =
    React.useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = React.useState(null);
  const above546 = useMediaQuery("(min-width:546px)");
  // const above390 = useMediaQuery("(min-width:390px)");


  useEffect(() => {
   // I want to focus when the new member is added
    if (newMemberNameRef.current) {
      newMemberNameRef.current.focus();
    }
  }, [projectInfo.projectMembers.length]);
  



  useEffect(() => {
   // I want to focus when the new member is added
    if (newMemberNameRef.current) {
      newMemberNameRef.current.focus();
      console.log(projectInfo.projectMembers);
    }
  }, [projectInfo.projectMembers.length]);
  


  const handelDeleteProjectMember = (index) => {
    setSelectedCollaborator(index);
    setDeleteProjectMemberAlert(true);
  };
  const handleDelete = () => {
    setDeleteAlert(true);
  };

  const renderColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "LEADER":
        return "info.main";
      case "MEMBER":
        return "success.main";
      default:
        return "grey";
    }
  };

  const emailInitals = (email) =>
    email
      .split("@")[0]
      .split("_")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const projName = (title) => {
    if(title.length <= 250)
    setName(title);
    else
    setError("Project name should be less than 100 characters");
  };

  const projDesc = (description) => {
    if(description.length <= 250)
    setDesc(description);
    else 
    setError("Description should be less than 250 characters");
  };

  const handleLock = () => {
    setLock(!lock);
  };

  return (
    <>
      <DeleteDialog
        open={deleteAlert}
        setOpen={setDeleteAlert}
        handleDelete={() => {
          handleDeleteProject(projectInfo.projectId);
        }}
        description="Are you sure want to delete this project?"
      />

      <DeleteDialog
        open={deleteProjectMemberAlert}
        setOpen={setDeleteProjectMemberAlert}
        handleDelete={() => {
          removeCollaborator(selectedCollaborator);
          setDeleteProjectMemberAlert(false);
        }}
        description="Are you sure want to remove this Collaborator?"
      />
      <Dialog
        PaperProps={{
          sx: {
            display: "flex",
            justifyContent: "center",
            p: 2,
            zIndex: "900"
          },
        }}
        sx={{ zIndex: "900" }}
        open={open}
        onClose={() => {
          handleClose(false);
        }}
      >
        <Grid
          container
          rowSpacing={1}
          ml={2}
        >
          <Grid item xs={3}>
            <IconButton
              edge="start"
              color="error"
              aria-label="close"
              onClick={handleDelete}
            >
              <Tooltip title="Delete Project">
                <DeleteForeverRoundedIcon
                  sx={{
                    color: "secondary.main",
                    visibility:
                      isAdmin(projectInfo.role) ||
                        isLeader(projectInfo.role)
                        ? ""
                        : "hidden",
                  }}
                />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item xs={5} sx={{ visibility: "hidden" }} />
          <Grid item xs={2}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleLock}
              aria-label="close"
            >
              <Tooltip title="Edit Project">
                <EditRoundedIcon
                  sx={{
                    visibility:
                      (isAdmin(projectInfo.role) ||
                        isLeader(projectInfo.role)) &&
                        lock
                        ? ""
                        : "hidden",
                  }}
                />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item xs={2} >
            <Tooltip title="Close">
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  handleClose(false);
                }}
                aria-label="close"
              >
                <CloseIcon sx={{ color: "secondary.main" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, marginLeft: "20px" }}>
            Project Details
          </Typography>
        </Box>
        <Box
          sx={{ position: "static", backgroundColor: "primary.contrastText" }}
        />
        <Box mt={2}>
          <Typography
            sx={{ fontWeight: 700, marginLeft: "20px", marginTop: "5px" }}
          >
            Project Title
            <InputAdornment 
            sx={{color: "grey", fontSize: "12px", marginTop: "6px"}}
            position="down">
                        {name.length}/{100}
                      </InputAdornment>
          </Typography>
          <List>
            <ListItem>
              <TextField
                type="text"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                value={name}
                sx={{
                  fontSize: "16px",
                  width: "100%",
                  padding: "2px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontFamily: "Roboto, sans-serif",
                  boxShadow: "2px 2px 2px 2px rgba(0.1, 0, 0.1, 0)",
                }}
                onChange={(e) => {
                  projName(e.target.value);
                }}
                disabled={lock}
              />
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography
            sx={{ fontWeight: 700, marginLeft: "20px", marginTop: "9px" }}
          >
            Project Description
            <InputAdornment 
            sx={{color: "grey", fontSize: "12px", marginTop: "6px"}}
            position="down">
                        {desc.length}/{250}
                      </InputAdornment>
          </Typography>
          <List>
            <ListItem>
              <TextField
                multiline
                rows={4}
                type="text"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  fontSize: "16px",
                  lineHeight: "20px",
                  width: "100%",
                  height: "120px",
                  padding: "15px 20px",
                  border: "2px solid #ccc",
                  fontFamily: "Roboto, sans-serif",
                }}
                variant="standard"
                value={desc}
                onChange={(e) => {
                  projDesc(e.target.value);
                }}

                disabled={lock}
              />
            </ListItem>
          </List>
        </Box>
        {!lock ? (
          <Box
            mt={1}
            pl={2}
            pr={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
             <Button
              variant="outlined"
              sx={{ width: "50%" }}
              onClick={handleCancelChanges}
            >
              Cancel
            </Button>
            <Button
              sx={{ width: "45%" }}
              variant="contained"
              onClick={() => {
                editProjectDetails(name, desc, projectInfo.projectId);
                handleLock();
              }}
            >
              Save
            </Button>
          </Box>
        ) : null}
        <br />
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "20px",
            marginRight: "20px",
          }}
          mt={1}
        >
          <Typography variant="h5">Collaborators</Typography>
          <Tooltip title="Add Collaborators">
            <PersonAdd mr={0}
            sx={{
              color: lock?"gray":"secondary.main",
            }}  
              onClick={() => {
                addCollaborator(lock);
              }}
            />
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
            marginRight: "20px",
            overflow: "auto",
          }}
          className="collabBody"
          mt={2}
        >
          {projectInfo &&
            projectInfo.projectMembers
            .map((collaborator, index) => (
              collaborator.isActive===true?
              (
              <Box  sx={{ display: "flex", flexDirection: "column",padding:"4px",boxShadow:"2px 0px 5px 0px rgba(0, 0, 0, 0.1)"}} mb={2} pt={6} className="collabRow">
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}} className="collabEssentialDetails">
                  <Box
                    className="collabAvatar"
                    mr={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: renderColor(collaborator.role),
                        color: "#fff",
                      }}
                    >
                      {emailInitals(collaborator.email)}
                    </Avatar>
                  </Box>
                  <Box sx={{ display: "flex", flexGrow:"1"}} className="collabEmail">
                    <TextField
                    inputRef={newMemberNameRef}
                      disableUnderline
                      sx={{ height: "30px", width: "100%" }}
                      type="email"
                      inputProps={{
                        style: {
                          fontSize: "16px",
                          padding:"3px 10px",
                        },
                      }}
                      placeholder="xyz@gmail.com"
                      value={collaborator.email}
                      disabled={
                        lock ||
                        isAdmin(collaborator.role) ||
                        !collaborator.isNew
                      }
                      onChange={(event) =>
                        handleEmailChange(event.target.value, index)
                      }
                    />
                  </Box>
                  <Box className="collabRole" ml={1} sx={{
                    marginLeft: !above546 ? "55px":"10px",
                    marginTop: !above546 ? "10px" : "0px",
                    display: "flex",
                    flexGrow:"1"
                  }}>
                    <Select
                      sx={{ height: "30px", width: "100%" }}
                      value={collaborator.role}
                      onChange={(event) =>
                        handleRoleChange(
                          event.target.value,
                          index,
                          projectInfo.projectMembers[index].isNew
                        )
                      }
                      disabled={lock || isAdmin(collaborator.role)}
                    >
                      {roles.map((eachRole) => (
                        <MenuItem value={eachRole} key={eachRole}>
                          {eachRole}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
                {!lock ? (
                  <Box
                    mt={1}
                    className="collabIcon"
                    sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                  >
                    {collaborator.isNew ? (
                
                        <Button variant="outlined"
                          color="success"
                          onClick={() => {
                            handleSaveCollab(index);
                          }}
                        >
                          Save
                        </Button>
                    
                    
                    ) : (
                       collaborator.role !== "ADMIN" && (
                        <Button variant="outlined"
                          color="error"
                          onClick={() => {
                            handelDeleteProjectMember(index);
                          }}
                        >
                          Delete
                        </Button>
                      )
                    )}
                
                  </Box>
                ) : null}
              </Box>
              ):null
            ))}
        </Box>
      </Dialog>
    </>
  );
}

ProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  projectInfo: PropTypes.shape({
    projectId: PropTypes.number,
    projectName: PropTypes.string,
    projectDescription: PropTypes.string,
    role: PropTypes.string,
    projectMembers: PropTypes.arrayOf(
      PropTypes.shape({
        memberId: PropTypes.number,
        email: PropTypes.string,
        role: PropTypes.string,
        isNew: PropTypes.bool,
      })
    ),
  }).isRequired,
  addCollaborator: PropTypes.func.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  handleSaveCollab: PropTypes.func.isRequired,
  removeCollaborator: PropTypes.func.isRequired,
  handleDeleteProject: PropTypes.func.isRequired,
  editProjectDetails: PropTypes.func.isRequired,
  handleCancelChanges: PropTypes.func.isRequired,
};

export default ProjectModal;

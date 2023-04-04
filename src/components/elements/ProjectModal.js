import React from "react";
import {
  Dialog,
  TextField,
  Typography,
  Box,
  Input,
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
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { PropTypes } from "prop-types";
import DeleteDialog from "./DeleteDialog";
import { isAdmin, isLeader, roles } from '../constants/users';

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
  const [lock, setLock] = React.useState(true);
  const [name, setName] = React.useState(projectInfo.projectName);
  const [desc, setDesc] = React.useState(projectInfo.projectDescription);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [deleteProjectMemberAlert, setDeleteProjectMemberAlert] =
    React.useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = React.useState(null);
  const above546 = useMediaQuery("(min-width:546px)");

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
    setName(title);
  };

  const projDesc = (description) => {
    setDesc(description);
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
        description="Are you sure want to remove this project member?"
      />
      <Dialog
        PaperProps={{
          sx: {
            display: "flex",
            justifyContent: "center",
            p: 2,
          },
        }}
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
              <CloseIcon  sx={{ color: "secondary.main" }} />
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
          </Typography>
          <List>
            <ListItem>
              <TextField
                type="text"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  multiline: true,
                  rows: 4,
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
              sx={{ width: "45%" }}
              variant="contained"
              onClick={() => {
                editProjectDetails(name, desc, projectInfo.projectId);
                handleLock();
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              onClick={handleCancelChanges}
            >
              Cancel
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
          <Tooltip title="Add Collaborator">
          <PersonAdd mr={0}
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
            projectInfo.projectMembers.map((collaborator, index) => (
              <Box sx={{ display: "flex", flexDirection:"column"}} mb={2} className="collabRow">
                <Box sx={{ display: "flex", flexDirection:"row",flexWrap:"wrap"}} className="collabEssentialDetails">
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
                  <Box sx={{ display: "flex"}} className="collabEmail">
                    <Input
                      disableUnderline
                      sx={{ height: "30px", width: above546?"100%":"200px" }}
                      type="email"
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
                    marginTop:!above546? "10px":"0px",
                  }}>
                    <Select
                      sx={{ height: "30px", width: "150px"}}
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
                        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}
                      >
                        {collaborator.isNew ? (
                          <>
                            <Button variant="outlined"
                            color="success"
                              onClick={() => {
                                handleSaveCollab(index);
                              }}
                            >
                            Save
                            </Button>
                            <Button variant="outlined"
                            color="error"
                              onClick={() => {
                                handelDeleteProjectMember(index);
                              }}
                            >
                              Delete
                            </Button>
                          </>
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

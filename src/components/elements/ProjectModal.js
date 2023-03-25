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
} from "@mui/material";

import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { PropTypes } from "prop-types";
import DeleteDialog from "./DeleteDialog";

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

  const Roles = ["ADMIN", "LEADER", "MEMBER"];
  return (
    <>
      <DeleteDialog
        open={deleteAlert}
        setOpen={setDeleteAlert}
        handleDelete={() => {
          handleDeleteProject(projectInfo.projectId);
        }}
        description="Are u sure want to delete this Project"
      />

      <DeleteDialog
        open={deleteProjectMemberAlert}
        setOpen={setDeleteProjectMemberAlert}
        handleDelete={() => {
          removeCollaborator(selectedCollaborator);
          setDeleteProjectMemberAlert(false);
        }}
        description="Are u sure want to delete this Project Member"
      />
      <Dialog
        PaperProps={{
          sx: {
            position: "absolute",
            top: "48%",
            left: "69%",
            right: "auto",
            transform: "translate(-50%, -50%)",
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
          paddingTop="2%"
          textAlign="center"
          alignItems="center"
        >
          <Grid item xs={3}>
            <IconButton
              edge="start"
              color="error"
              aria-label="close"
              onClick={handleDelete}
            >
              <DeleteForeverRoundedIcon
                sx={{
                  color: "secondary.main",
                  visibility:
                    projectInfo.role === "ADMIN" ||
                    projectInfo.role === "LEADER"
                      ? ""
                      : "hidden",
                }}
              />
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
              <EditRoundedIcon
                sx={{
                  visibility:
                    (projectInfo.role === "ADMIN" ||
                      projectInfo.role === "LEADER") &&
                    lock
                      ? ""
                      : "hidden",
                }}
              />
            </IconButton>
          </Grid>

          <Grid item xs={2}>
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
                  height: "20px",
                  width: "277px",
                  padding: "15px 20px",
                  border: "2px solid #ccc",
                  fontFamily: "Roboto, sans-serif",
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
                  width: "280px",
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
              Save Changes
            </Button>
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              onClick={handleCancelChanges}
            >
              Cancel Changes
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
          <PersonAdd
            onClick={() => {
              addCollaborator(lock);
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
            marginTop: "20px",
            overflow: "auto",
          }}
          className="collabBody"
          mt={2}
        >
          {projectInfo &&
            projectInfo.projectMembers.map((collaborator, index) => (
              <Box sx={{ display: "flex" }} mb={2} className="collabRow">
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
                <Box
                  className="collabDetails"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Box sx={{ display: "flex" }} className="collabEmail">
                    <Input
                      disableUnderline
                      sx={{ height: "30px", width: "200px" }}
                      type="email"
                      placeholder="xyz@gmail.com"
                      value={collaborator.email}
                      disabled={
                        lock ||
                        collaborator.role === "ADMIN" ||
                        !collaborator.isNew
                      }
                      onChange={(event) =>
                        handleEmailChange(event.target.value, index)
                      }
                    />

                    {!lock ? (
                      <Box
                        className="collabIcon"
                        ml={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {collaborator.isNew ? (
                          <>
                            <SaveIcon
                              onClick={() => {
                                handleSaveCollab(index);
                              }}
                            />
                            <DeleteIcon
                              onClick={() => {
                                handelDeleteProjectMember(index);
                              }}
                            />
                          </>
                        ) : (
                          collaborator.role !== "ADMIN" && (
                            <DeleteIcon
                              onClick={() => {
                                handelDeleteProjectMember(index);
                              }}
                            />
                          )
                        )}
                      </Box>
                    ) : null}
                  </Box>
                  <Box className="collabRole">
                    <Select
                      sx={{ height: "30px", width: "200px" }}
                      value={collaborator.role}
                      onChange={(event) =>
                        handleRoleChange(
                          event.target.value,
                          index,
                          projectInfo.projectMembers[index].isNew
                        )
                      }
                      disabled={lock || collaborator.role === "ADMIN"}
                    >
                      {Roles.map((role) => (
                        <MenuItem value={role} key={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
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

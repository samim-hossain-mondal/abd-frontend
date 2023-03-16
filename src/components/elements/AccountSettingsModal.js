/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
  Slide,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjectModal from "./ProjectModal";

function AccountSettingsModal(props) {
  const [openEditModel, setOpenEditModel] = useState({
    isOpen: false,
    id: null,
    isAdmin: null,
  });
  const [projectInfo, setProjectInfo] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditProjectTitle = (id) => {
    const newProjectArray = [
      ...projectInfo.slice(0, id),
      {
        ...projectInfo[id],
        projectTitle: {
          label: projectInfo[id].projectTitle.label,
          isEditable: false,
        },
      },
      ...projectInfo.slice(id + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const handleSelectedProject = (id) => {
    console.log("selected project", id);
    setSelectedProject(id);
  };

  const handleProjectTitle = (index, label) => {
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      { ...projectInfo[index], projectTitle: { label, isEditable: true } },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const addCollaborator = (index) => {
    console.log("add collaborator", index);
    const newCollaborator = { email: "", role: "" };
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      {
        ...projectInfo[index],
        collaborators: [...projectInfo[index].collaborators, newCollaborator],
      },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const handleEmailChange = (index, colabIndex, event) => {
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      {
        ...projectInfo[index],
        collaborators: [
          ...projectInfo[index].collaborators.slice(0, colabIndex),
          {
            ...projectInfo[index].collaborators[colabIndex],
            email: event.target.value,
          },
          ...projectInfo[index].collaborators.slice(colabIndex + 1),
        ],
      },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const handleRoleChange = (index, colabIndex, event) => {
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      {
        ...projectInfo[index],
        collaborators: [
          ...projectInfo[index].collaborators.slice(0, colabIndex),
          {
            ...projectInfo[index].collaborators[colabIndex],
            role: event.target.value,
          },
          ...projectInfo[index].collaborators.slice(colabIndex + 1),
        ],
      },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const removeCollaborator = (index, colabIndex) => {
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      {
        ...projectInfo[index],
        collaborators: [
          ...projectInfo[index].collaborators.slice(0, colabIndex),
          ...projectInfo[index].collaborators.slice(colabIndex + 1),
        ],
      },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };
  const handleEditModel = (id) => {
    const index = projectInfo.findIndex((project) => project.ProjectId === id);
    const { isAdmin } = projectInfo[index];
    setOpenEditModel({ isOpen: true, id: index, isAdmin });
  };

  const handleDelete = (id) => {
    const index = projectInfo.findIndex((project) => project.ProjectId === id);
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  };

  const handleAddNew = () => {
    console.log("add new");
    const id = Date.now();
    const newProject = {
      ProjectId: id,
      projectTitle: { label: "New Project", isEditable: true },
      projectDescription: "",
      collaborators: [],
      isAdmin: true,
    };
    setProjectInfo([...projectInfo, newProject]);
  };

  const handleLabelChange = (id, label) => {
    const index = projectInfo.findIndex((project) => project.ProjectId === id);
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      { ...projectInfo[index], projectTitle: { label, isEditable: true } },
      ...projectInfo.slice(index + 1),
    ];

    setProjectInfo(newProjectArray);
  };

  function handleSave(id) {
    const index = projectInfo.findIndex((project) => project.ProjectId === id);
    console.log(index);
    console.log(projectInfo[index]);
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      {
        ...projectInfo[index],
        projectTitle: {
          label: projectInfo[index].projectTitle.label,
          isEditable: false,
        },
      },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  }

  function handleProjectDescription(index, description) {
    const newProjectArray = [
      ...projectInfo.slice(0, index),
      { ...projectInfo[index], projectDescription: description },
      ...projectInfo.slice(index + 1),
    ];
    setProjectInfo(newProjectArray);
  }
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Slide}
      TransitionProps={{
        direction: "left",
      }}
      onClose={() => props.setOpenSettings(false)}
      // fullWidth
      maxWidth="md"
      style={{
        display: "flex",
        // alignItems: "stretch",
        // width: "400px",
        // justifyContent: "flex-start",
      }}
      PaperProps={{
        sx: {
          // transform: "translateX(-100%)",
          transition: "transform 0.2s ease-in-out",
          position: "fixed",
          // top: 0,
          left: 147,
          height: "100%",
          width: "25%",
          margin: 0,
          padding: 0,
          borderRadius: 0,
          borderTopRightRadius: "4px",
          borderBottomRightRadius: "4px",
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}
        >
          <Typography mb={5}>Manage Projects</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {projectInfo &&
              projectInfo.map((project) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    {selectedProject === project.ProjectId ? (
                      <DoneIcon />
                    ) : null}
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    {project.projectTitle.isEditable ? (
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent",
                            },
                            "&.MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          },
                        }}
                        value={project.projectTitle.label}
                        onChange={(event) =>
                          handleLabelChange(
                            project.ProjectId,
                            event.target.value
                          )
                        }
                        onBlur={() => handleSave(project.ProjectId)}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          // flexDirection: "row",
                          justifyItems: "flex-end",
                        }}
                      >
                        <Typography
                          onClick={() => {
                            handleSelectedProject(project.ProjectId);
                          }}
                        >
                          {project.projectTitle.label}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      onClick={() => {
                        handleEditModel(project.ProjectId);
                      }}
                    >
                      {project.isAdmin ? <EditIcon /> : <VisibilityIcon />}
                    </Typography>
                    <Typography
                      onClick={() => {
                        handleDelete(project.ProjectId);
                      }}
                    >
                      {project.isAdmin ? <DeleteIcon /> : null}
                    </Typography>
                  </Box>
                </Box>
              ))}
            {openEditModel.isOpen && (
              <ProjectModal
                open={openEditModel}
                handleClose={setOpenEditModel}
                handleProjectDescription={handleProjectDescription}
                projectInfo={projectInfo}
                addCollaborator={addCollaborator}
                handleEmailChange={handleEmailChange}
                handleRoleChange={handleRoleChange}
                removeCollaborator={removeCollaborator}
                handleProjectTitle={handleProjectTitle}
                handleEditProjectTitle={handleEditProjectTitle}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AccountSettingsModal;

import React, { useState, useContext } from "react";
import { Box, Dialog, DialogContent, Input, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { PropTypes } from "prop-types";
import ProjectModal from "./ProjectModal";
import Transition from "../utilityFunctions/OverlayTransition";
import { ErrorContext } from "../contexts/ErrorContext";

function AccountSettingsModal({ open, setOpenSettings }) {
  const { setError } = useContext(ErrorContext);
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

  const addCollaborator = (index, isAdmin) => {
    if (isAdmin) {
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
    } else {
      setError((val) => `${val}You are not authorized to add collaborators`);
    }
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
      open={open}
      TransitionComponent={Transition}
      onClose={() => setOpenSettings(false)}
      maxWidth="md"
      style={{
        display: "flex",
      }}
      PaperProps={{
        sx: {
          position: "absolute",
          top: "48%",
          left: "40%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "400px",
          height: "500px",
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" mb={5}>
              Manage Projects
            </Typography>
            <AddIcon onClick={handleAddNew} />
          </Box>
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
                  <Box
                    sx={{
                      display: "flex",
                      textAlign: "center",
                      width: "60%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      // width: "70%",
                    }}
                  >
                    {project.projectTitle.isEditable ? (
                      <Input
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

                          justifyItems: "flex-end",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "22px" }}
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
                handleProjectDescription={() => {
                  handleProjectDescription();
                }}
                projectInfo={projectInfo}
                addCollaborator={addCollaborator}
                handleEmailChange={handleEmailChange}
                handleRoleChange={handleRoleChange}
                removeCollaborator={removeCollaborator}
                handleProjectTitle={handleProjectTitle}
                handleEditProjectTitle={handleEditProjectTitle}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

AccountSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
};

export default AccountSettingsModal;

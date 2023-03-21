import React, { useState, useContext } from "react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";

import { PropTypes } from "prop-types";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import Transition from "../utilityFunctions/OverlayTransition";
import { ErrorContext } from "../contexts/ErrorContext";
import NewProjectModal from "./NewProjectModal";

function AccountSettingsModal({ open, setOpenSettings }) {
  const [projects, setProjects] = useState([]);
  const [projectInfo, setProjectInfo] = useState();
  const { setError, setSuccess } = useContext(ErrorContext);
  const [openEditModel, setOpenEditModel] = useState();
  const [openNewProjectModal, setOpenNewProjectModal] = useState();
  const [selectedProject, setSelectedProject] = useState(null);

  React.useEffect(() => {
    async function fetchProjectInfo() {
      const [firstApiCall, secondApiCall] = await Promise.all([
        axios.get("http://localhost:3001/api/management/project"),
        axios.get("http://localhost:3001/api/management/me"),
      ]);
      const { data } = firstApiCall;
      const { memberId } = secondApiCall.data;
      if (memberId !== null && data.length > 0) {
        const requests = data.map((project) =>
          axios
            .get(
              `http://localhost:3001/api/management/project/${project.projectId}/member/${memberId}`
            )
            .then((response) => {
              const projectWithRole = Object.assign(project, {
                role: response.data.role,
              });
              return projectWithRole;
            })
            .catch((error) => error)
        );

        Promise.all(requests)
          .then((updatedProjects) => {
            setProjects(updatedProjects);
          })
          .catch((error) => {
            setError(error.response.data.message);
          });
      } else {
        setProjects([]);
      }
    }
    fetchProjectInfo();
  }, []);

  const handleCancelChanges = () => {
    setOpenEditModel(false);
  };

  const editProjectDetails = (projectName, projectDescription, projectId) => {
    axios
      .patch(`http://localhost:3001/api/management/project/${projectId}`, {
        projectName,
        projectDescription,
      })
      .then(() => {
        setSuccess("Project Updated Successfully");
      })
      .catch((error) => {
        setError(error.data.message);
      });
    const index = projects.findIndex(
      (project) => project.projectId === projectId
    );
    const newProjects = [...projects];
    newProjects[index].projectName = projectName;
    setProjects(newProjects);
    setProjectInfo({
      ...projectInfo,
      projectName,
      projectDescription,
    });
  };

  const addCollaborator = (lock) => {
    if (projectInfo.role === "ADMIN" || projectInfo.role === "LEADER") {
      if (!lock) {
        const newCollaborator = { email: "", role: "", isNew: true };
        setProjectInfo({
          ...projectInfo,
          projectMembers: [...projectInfo.projectMembers, newCollaborator],
        });
      } else {
        setError("Press edit button to add collaborators");
      }
    } else {
      setError("You are not allowed to add collaborators");
    }
  };

  const handleSaveCollab = (index) => {
    const { projectId } = projectInfo;
    axios
      .post(
        `http://localhost:3001/api/management/project/${projectId}/member`,
        {
          email: projectInfo.projectMembers[index].email,
          role: projectInfo.projectMembers[index].role,
        }
      )
      .then(() => {
        setSuccess("Successfully Added Collaborator");
        setProjectInfo({
          ...projectInfo,
          projectMembers: [
            ...projectInfo.projectMembers.slice(0, index),
            {
              email: projectInfo.projectMembers[index].email,
              role: projectInfo.projectMembers[index].role,
              isNew: false,
            },
            ...projectInfo.projectMembers.slice(index + 1),
          ],
        });
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };
  const handleDeleteProject = (projectId) => {
    axios
      .delete(`http://localhost:3001/api/management/project/${projectId}`)
      .then(() => {
        setSuccess("Successfully Deleted Project");
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
    const index = projects.findIndex(
      (project) => project.projectId === projectId
    );
    const newProjectArray = [
      ...projects.slice(0, index),
      ...projects.slice(index + 1),
    ];
    setProjects(newProjectArray);
    setOpenEditModel(false);
  };

  const handleSelectedProject = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleEmailChange = (email, index) => {
    const updatedProjectInfo = { ...projectInfo };
    const updatedCollaborators = [...updatedProjectInfo.projectMembers];
    updatedCollaborators[index].email = email;
    updatedProjectInfo.projectMembers = updatedCollaborators;
    setProjectInfo(updatedProjectInfo);
  };

  const handleRoleChange = (role, index, isNew) => {
    if (projectInfo.projectMembers[index].email === "") {
      setError("Enter Some Email");
      return;
    }
    const updatedProjectInfo = {
      ...projectInfo,
      projectMembers: [
        ...projectInfo.projectMembers.slice(0, index),
        {
          ...projectInfo.projectMembers[index],
          role,
        },
        ...projectInfo.projectMembers.slice(index + 1),
      ],
    };
    setProjectInfo(updatedProjectInfo);
    if (!isNew) {
      const { projectId } = projectInfo;
      const { email } = projectInfo.projectMembers[index];
      axios
        .patch(
          `http://localhost:3001/api/management/project/${projectId}/member`,
          {
            email,
            role,
          }
        )
        .then(() => {
          setSuccess("Collaborator Updated Successfully");
        })
        .catch((error) => {
          setError(error.data.message);
        });
    }
  };

  const removeCollaborator = (index) => {
    if (projectInfo.projectMembers[index].email === "") {
      setProjectInfo({
        ...projectInfo,
        projectMembers: [
          ...projectInfo.projectMembers.slice(0, index),
          ...projectInfo.projectMembers.slice(index + 1),
        ],
      });
      return;
    }
    const { projectId } = projectInfo;
    axios
      .delete(
        `http://localhost:3001/api/management/project/${projectId}/member`,
        {
          data: {
            email: projectInfo.projectMembers[index].email,
          },
        }
      )
      .then(() => {
        setSuccess("Collaborator Deleted Successfully");
      })
      .catch((error) => {
        setError(error.data.message);
      });

    const updatedProjectInfo = {
      ...projectInfo,
      projectMembers: [
        ...projectInfo.projectMembers.slice(0, index),
        ...projectInfo.projectMembers.slice(index + 1),
      ],
    };
    setProjectInfo(updatedProjectInfo);
  };

  const handleEditModel = (id) => {
    axios
      .get(`http://localhost:3001/api/management/project/${id}`)
      .then((response) => {
        const { data } = response;
        const { projectId, projectName, projectDescription, projectMembers } =
          data;
        const findProjectObject = projects.find(
          (project) => project.projectId === id
        );
        const { role } = findProjectObject;
        const projectInfoId = {
          projectId,
          projectName,
          projectDescription,
          projectMembers,
          role,
        };
        setProjectInfo(projectInfoId);
        setOpenEditModel(true);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
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
    setOpenNewProjectModal(true);
  };

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
            {openNewProjectModal && (
              <NewProjectModal
                open={openNewProjectModal}
                projects={projects}
                setProjects={setProjects}
                setOpen={setOpenNewProjectModal}
                projectInfo={projectInfo}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {projects &&
              projects.map((project) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    {project.projectId === selectedProject ? (
                      <DoneIcon />
                    ) : (
                      <DoneIcon style={{ visibility: "hidden" }} />
                    )}
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
                    <Typography
                      onClick={() => {
                        handleSelectedProject(project.projectId);
                      }}
                    >
                      {project.projectName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      onClick={() => {
                        handleEditModel(project.projectId);
                      }}
                    >
                      <VisibilityIcon />
                    </Typography>
                  </Box>
                </Box>
              ))}
            {openEditModel && (
              <ProjectModal
                open={openEditModel}
                handleClose={setOpenEditModel}
                projectInfo={projectInfo}
                addCollaborator={addCollaborator}
                handleEmailChange={handleEmailChange}
                handleRoleChange={handleRoleChange}
                handleSaveCollab={handleSaveCollab}
                removeCollaborator={removeCollaborator}
                handleDelete={handleDelete}
                handleDeleteProject={handleDeleteProject}
                editProjectDetails={editProjectDetails}
                handleCancelChanges={handleCancelChanges}
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

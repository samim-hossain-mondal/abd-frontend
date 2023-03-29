/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useContext } from "react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
// import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";

import { PropTypes } from "prop-types";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import Transition from "../utilityFunctions/SideBarTransition";
import { ErrorContext } from "../contexts/ErrorContext";
// eslint-disable-next-line import/no-named-as-default
import NewProjectModal from "./NewProjectModal";
import { DOMAIN } from "../../config";
import { ProjectUserContext } from "../contexts/ProjectUserContext";

function AccountSettingsModal({ open, setOpenSettings }) {
  const [projectInfo, setProjectInfo] = useState();
  const { setError, setSuccess } = useContext(ErrorContext);
  const [openEditModel, setOpenEditModel] = useState();
  const [openNewProjectModal, setOpenNewProjectModal] = useState();
  const [selectedProject, setSelectedProject] = useState(null);

  const { projects, fetchProjectInfo, setProjects, deleteProject } = useContext(ProjectUserContext);

  React.useEffect(() => {
    fetchProjectInfo()
      .then((response) => {
        if (response) {
          setProjectInfo(response);
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }, []);

  const handleClose = () => {
    setOpenSettings(false);
  };

  const handleCancelChanges = () => {
    setOpenEditModel(false);
  };

  const editProjectDetails = (projectName, projectDescription, projectId) => {
    if (projectName === "" || projectDescription === "") {
      setError("Project name and description cannot be empty");
      return;
    }
    axios
      .patch(`${DOMAIN}/api/management/project/${projectId}`, {
        projectName,
        projectDescription,
      })
      .then(() => {
        setSuccess("Successfully Edited Project Details");
        const index = projects.findIndex(
          (project) => project.projectId === projectId
        );
        const newProjects = [...projects];
        newProjects[index].projectName = projectName;
        newProjects[index].projectDescription = projectDescription;
        setProjects(newProjects);
        setProjectInfo({
          ...projectInfo,
          projectName,
          projectDescription,
        });
      })
      .catch((error) => {
        setError(error.data.message);
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

  // TODO: state management for add collaborator
  const handleSaveCollab = (index) => {
    const { projectId } = projectInfo;
    axios
      .post(`${DOMAIN}/api/management/project/${projectId}/member`, {
        email: projectInfo.projectMembers[index].email,
        role: projectInfo.projectMembers[index].role,
      })
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
        const newProjectArray = projects.map((project) => {
          if (project.projectId === projectId) {
            return {
              ...project,
              projectMembers: [
                ...project.projectMembers,
                {
                  email: projectInfo.projectMembers[index].email,
                  role: projectInfo.projectMembers[index].role,
                },
              ],
              _count: {
                projectMembers: project._count.projectMembers + 1, // TODO: fix when backend changes
              }
            };
          }
          return project;
        });
        console.log('new', newProjectArray);
        setProjects(newProjectArray);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId)
      .then(() => {
        setOpenEditModel(false);
        setSuccess("Successfully Deleted Project");
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
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
        .patch(`${DOMAIN}/api/management/project/${projectId}/member`, {
          email,
          role,
        })
        .then(() => {
          setSuccess("Collaborator Updated Successfully");
        })
        .catch((error) => {
          setError(error.data.message);
        });
    }
  };

  const removeCollaborator = (index) => {
    if (
      projectInfo.projectMembers[index].email === "" ||
      projectInfo.projectMembers[index].role === ""
    ) {
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
      .delete(`${DOMAIN}/api/management/project/${projectId}/member`, {
        data: {
          email: projectInfo.projectMembers[index].email,
        },
      })
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
    setOpenSettings(false);
    axios
      .get(`${DOMAIN}/api/management/project/${id}`)
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
    setOpenSettings(false);
  };

  return (
    <Box fullHeight sx={{display:"flex",justifyContent:"flex-end"}} className="cont">
    <Dialog
    id="joiiii"
      open={open}
      TransitionComponent={Transition}
     onClose={handleClose}
     PaperProps={{ sx: { position:"absolute",right: -30,maxHeight:"100%",height:"100%",width:"50%",minWidth:"320px",background:"#F5F5F5"} }}
    >
      <DialogContent id="dd">
        <Box
        id="ff"
          sx={{ display: "flex", flexDirection: "column", textAlign: "center",justifyContent:"center",alignItems:"center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between",width:"80%",flexWrap:"wrap",minHeight:"50px",borderBottom:"2px dashed gray"}} >
            <Typography variant="h5" mb={5}>
              Manage Projects
            </Typography >
            <Box mt={0.5}>
            <AddCircleRoundedIcon  sx={{color:"blue"}}onClick={handleAddNew} />
            </Box>
          </Box>

          <Box
          mt={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Poppins",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              overflowY: "scroll",
            }}
            mb={4}
          >
            {projects &&
              projects.map((project) => (
                <Box
                  sx={{
                    display: "flex",
                    width: "80%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor:"#E6EEF2",
                    height:"50px",
                    borderRadius:"10px",
                    alignItems:"center",
                  }}
                  mx={2}
                  mb={2}
                >
                  <Box
                    sx={{
                      display: "flex",
                      textAlign: "center",
                      width: "60%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginLeft:"25px"
                    }}
                  >
                   {project.projectId === selectedProject ? (
                      <Typography sx={{ fontSize: "20px",color:"primary.main",paddingBottom: "3px",
                      "borderBottomStyle": "solid",
                      "borderBottomWidth": "2px",
                      "width": "fitContent"
                      }}>
                        {project.projectName}
                      </Typography>
                    ) : (
                    <Typography
                      sx={{ fontSize: "20px",cursor:"pointer"}}
                      onClick={() => {
                        handleSelectedProject(project.projectId);
                      }}
                    >
                      {project.projectName}
                    </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      marginRight:"25px"
                    }}
                  >
                    <Typography
                      onClick={() => {
                        handleEditModel(project.projectId);
                      }}
                      sx={{ cursor:"pointer" }}
                    >
                      <OpenInNewRoundedIcon sx={{color:"gray"}}/>
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
    {openNewProjectModal && (
      <NewProjectModal
        open={openNewProjectModal}
        projects={projects}
        setProjects={setProjects}
        setOpen={setOpenNewProjectModal}
        projectInfo={projectInfo}
      />
    )}
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
  );
}

AccountSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
};

export default AccountSettingsModal;

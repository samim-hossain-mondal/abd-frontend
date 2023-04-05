/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useContext } from "react";
import { Box, Dialog, DialogContent, Typography, TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Close from "@mui/icons-material/Close";

import { PropTypes } from "prop-types";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Search } from "@mui/icons-material";
import ProjectModal from "./ProjectModal";
import Transition from "../utilityFunctions/SideBarTransition";
import { ErrorContext } from "../contexts/ErrorContext";
// eslint-disable-next-line import/no-named-as-default
import NewProjectModal from "./NewProjectModal";
import { DOMAIN } from "../../config";
import { ProjectUserContext } from "../contexts/ProjectUserContext";
import { isAdmin, isLeader } from '../constants/users';

function AccountSettingsModal({ open, setOpenSettings }) {
  const navigate = useNavigate();
  const [projectInfo, setProjectInfo] = useState();
  const { projects, fetchProjectInfo, setProjects, deleteProject } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const [openEditModel, setOpenEditModel] = useState();
  const [openNewProjectModal, setOpenNewProjectModal] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);



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
  }, [open]);

  const handleClose = () => {
    setOpenSettings(false);
  };

  const handleCancelChanges = () => {
    setOpenEditModel(false);
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
      const filterData = projects.filter((item) => {
        const value = item?.projectName?.toLowerCase();
        return value?.includes(inputValue?.toLowerCase());
      });
      setFilteredData(filterData);
    } else {
      setFilteredData(projects);
    }
  };
  const handleSearchValueChange = (event) => {
    const inputValue = event.target.value;
    debounce(() => filterContent(inputValue), 500)();
    setSearchValue(event.target.value);
  };

  React.useEffect(() => {
    setFilteredData(projects);
    debounce(() => filterContent(searchValue), 500)();
  }
    , [projects]);

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
    if (isAdmin(projectInfo.role) || isLeader(projectInfo.role)) {
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
    navigate(`/${projectId}/daily`);
    setOpenSettings(false);
    window.location.reload();
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
    <Box sx={{ display: "flex", justifyContent: "flex-end", zIndex: 950 }} className="cont">
      <Dialog
        id="joiiii"
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        sx={{ zIndex: "900" }}
        PaperProps={{ sx: { zIndex: "900", position: "absolute", right: -30, maxHeight: "100%", height: "100%", width: "50%", minWidth: "320px", background: "#F5F5F5" } }}
      >
        <DialogContent id="dd">
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Close" placement="top">
              <Close sx={{ cursor: "pointer" }} onClick={handleClose} />
            </Tooltip>
          </Box>
          <Box
            id="ff"
            sx={{ display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "center", alignItems: "center" }}
          >
            <Box sx={{
              display: "flex", flexDirection: "column", positon: "fixed", top: 0, right: 0, bottom: 0, width: '80%',
              zIndex: 250,

            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }} >
                <Typography variant="h5" mb={2}>
                  Manage Projects
                </Typography >
                <Box mt={0.5}>
                  <Tooltip title="Add New Project" placement="top">
                    <AddCircleRoundedIcon sx={{ color: "blue", width: "50px", height: "30px" }} onClick={handleAddNew} />
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexGrow: 1 }}>
                <TextField
                  variant="outlined"
                  placeholder="Search"
                  value={searchValue}
                  fullWidth
                  onChange={handleSearchValueChange}
                  style={{ color: "blue" }}

                  InputProps={{
                    style: { height: "45px", width: "100%" },
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        color="blue"
                      >
                        <Tooltip title="Search" placement="top">
                          <IconButton color="blue">
                            <Search color="blue" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>



            <Box
              mt={3}
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
              {filteredData &&
                filteredData.map((project) => (
                  <Box
                    key={project?.projectId}
                    sx={{
                      display: "flex",
                      width: "80%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: "#E6EEF2",
                      height: "50px",
                      borderRadius: "10px",
                      alignItems: "center",
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
                        marginLeft: "25px"
                      }}
                    >
                      {project.projectId === selectedProject ? (
                        <Typography sx={{
                          fontSize: "20px", color: "primary.main", textDecoration: "underline", cursor: "pointer",
                          textUnderlineOffset: "7px"
                        }}>
                          {project.projectName}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{ fontSize: "20px", cursor: "pointer" }}
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
                        marginRight: "25px"
                      }}
                    >
                      <Typography
                        onClick={() => {
                          handleEditModel(project.projectId);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        {
                          project.role === "ADMIN" ? (
                            <Tooltip title="Edit Project" placement="top">
                              <EditOutlinedIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title="You can only view project details" placement="top">
                              <VisibilityOutlinedIcon />
                            </Tooltip>
                          )
                        }
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

/* eslint-disable react/jsx-no-bind */
import React, { useState} from "react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { PropTypes } from "prop-types";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import Transition from "../utilityFunctions/OverlayTransition";
// import { ErrorContext } from "../contexts/ErrorContext";
import NewProjectModal from "./NewProjectModal";

function AccountSettingsModal({ open, setOpenSettings }) {
  const [projects,setProjects] = useState([]);
  const [projectInfo, setProjectInfo] = useState();
  // const { setError } = useContext(ErrorContext);
  const [openEditModel, setOpenEditModel] = useState();
  const [openNewProjectModal, setOpenNewProjectModal] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  


  React.useEffect(() => {
    axios.get("http://localhost:3001/api/management/project").then((response) => {
      const {data}=response;
    setProjects(data);
    }
    ).catch((error) => {
      console.log(error);
    })
  }, [open]);


  const addCollaborator = () => { 
      const newCollaborator = { email:"", role: "" };
      setProjectInfo({
        ...projectInfo,
        projectMembers: [...projectInfo.projectMembers, newCollaborator],
      });
  };

  const handleSaveCollab=(index)=>{
    const {projectId}=projectInfo;
    console.log(projectId)
    console.log(index);
  axios.post(`http://localhost:3001/api/management/project/${projectId}/member`,{
    email:projectInfo.projectMembers[index].email,
    role:projectInfo.projectMembers[index].role,
}).then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.log(error);
})
  }


  // const handleEditProjectTitle = (id) => {
  //   const newProjectArray = [
  //     ...projectInfo.slice(0, id),
  //     {
  //       ...projectInfo[id],
  //       projectTitle: {
  //         label: projectInfo[id].projectTitle.label,
  //         isEditable: false,
  //       },
  //     },
  //     ...projectInfo.slice(id + 1),
  //   ];
  //   setProjectInfo(newProjectArray);
  // };

  const handleSelectedProject = (projectId) => {
    setSelectedProject(projectId);
  };

  // const handleProjectTitle = (index, label) => {
  //   const newProjectArray = [
  //     ...projectInfo.slice(0, index),
  //     { ...projectInfo[index], projectTitle: { label, isEditable: true } },
  //     ...projectInfo.slice(index + 1),
  //   ];
  //   setProjectInfo(newProjectArray);
  // };



    const handleEmailChange = (email,index) => {
      const updatedProjectInfo = { ...projectInfo };
      const updatedCollaborators = [...updatedProjectInfo.projectMembers];
      updatedCollaborators[index].email = email;
      updatedProjectInfo.projectMembers = updatedCollaborators;
      setProjectInfo(updatedProjectInfo);

    };

  const handleRoleChange = (role,index) => {
    const updatedProjectInfo =
      {
        ...projectInfo,
        projectMembers: [
          ...projectInfo.projectMembers.slice(0, index),
          {
            ...projectInfo.projectMembers[index],
            role,
          },
          ...projectInfo.projectMembers.slice(index + 1),
        ],
      }
   
      setProjectInfo(updatedProjectInfo)
  };

  // const removeCollaborator = (index, colabIndex) => {
  //   const newProjectArray = [
  //     ...projectInfo.slice(0, index),
  //     {
  //       ...projectInfo[index],
  //       collaborators: [
  //         ...projectInfo[index].collaborators.slice(0, colabIndex),
  //         ...projectInfo[index].collaborators.slice(colabIndex + 1),
  //       ],
  //     },
  //     ...projectInfo.slice(index + 1),
  //   ];
  //   setProjectInfo(newProjectArray);
  // };
  const handleEditModel = (id) => {
   axios.get(`http://localhost:3001/api/management/project/${id}`).then((response) => {
      const {data}=response;
      const {projectId,projectName,projectDescription,projectMembers}=data;
      const projectInfoId = {
        projectId,
        projectName,
        projectDescription,
        projectMembers,
      };
      setProjectInfo(projectInfoId);
      setOpenEditModel(true);
     
  }).catch((error) => {
    console.log(error);
  })

  };

  // const handleDelete = (id) => {
  //   const index = projectInfo.findIndex((project) => project.ProjectId === id);
  //   const newProjectArray = [
  //     ...projectInfo.slice(0, index),
  //     ...projectInfo.slice(index + 1),
  //   ];
  //   setProjectInfo(newProjectArray);
  // };

  const handleAddNew = () => {
    setOpenNewProjectModal(true);
  };


  function handleProjectDescription(projectDescription) {
    setProjectInfo({
      ...projectInfo,
      projectDescription,
    });
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
            {
              openNewProjectModal && (
                <NewProjectModal
                  open={openNewProjectModal}
                  projects={projects}
                  setProjects={setProjects}
                  setOpen={setOpenNewProjectModal}
                  projectInfo={projectInfo}
                />
              )
            }
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
                  <Box sx={{ display: "flex" }} >
                    {
                      project.projectId===selectedProject?(<DoneIcon />):(<DoneIcon style={{visibility:"hidden"}}/>)
                    }
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
                      <Typography  onClick={()=>{handleSelectedProject(project.projectId)}}> 
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
                      {project.isAdmin ? <EditIcon /> : <VisibilityIcon />}
                    </Typography>
                    <Typography
                      onClick={() => {
                        // handleDelete(project.ProjectId);
                      }}
                    >
                      {project.isAdmin ? <DeleteIcon /> : null}
                    </Typography>
                  </Box>
                </Box>
              ))}
            {openEditModel && (
              <ProjectModal
                open={openEditModel}
                handleClose={setOpenEditModel}
                handleProjectDescription={handleProjectDescription}
                projectInfo={projectInfo}
                addCollaborator={addCollaborator}
                handleEmailChange={handleEmailChange}
                handleRoleChange={handleRoleChange}
                handleSaveCollab={handleSaveCollab}
                // removeCollaborator={removeCollaborator}
                // handleProjectTitle={handleProjectTitle}
                // handleEditProjectTitle={handleEditProjectTitle}
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

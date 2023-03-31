// import axios from "axios";
import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import makeRequest from "../utilityFunctions/makeRequest/index";
import {
  GET_ME,
  GET_PROJECTS,
  GET_PROJECT_BY_ID,
  CREATE_PROJECT,
} from "../constants/apiEndpoints";
import { DOMAIN } from "../../config";

export const ProjectUserContext = createContext();

export function ProjectUserProvider({ children }) {
  const [projectId, setProjectId] = useState();
  const [projectDetails, setProjectDetails] = useState(undefined);

  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState();

  const [projects, setProjects] = useState([]);
  const [projectsUpdated, setProjectsUpdated] = useState(false);

  const updateUserDetails = async (setError, setSuccess) => {
    try {
      const userDetailsPromises = [];
      userDetailsPromises.push(makeRequest(GET_ME));
      userDetailsPromises.push(makeRequest(GET_PROJECTS));

      const userDetails = await Promise.all(userDetailsPromises);
      setUser(userDetails[0]);
      setProjects(userDetails[1]);
      setProjectsUpdated(true);
      setSuccess("User details loaded successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProjectDetails = async (projectIdParam, setError) => {
    try {
      setProjectId(projectIdParam);
      const resData = await makeRequest(GET_PROJECT_BY_ID(projectIdParam));
      const memberData = resData.projectMembers?.find(
        (member) => member.memberId === user.memberId
      );
      if (!memberData) {
        throw new Error("Failed to know the role");
      }
      setUserRole(memberData.role);
      setProjectDetails(resData);
      return resData;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const addNewProject = async (title, projectDesc) => {
    const body = {
      projectName: title,
      projectDescription: projectDesc,
    };
    const { result } = await makeRequest(CREATE_PROJECT, {
      data: body,
    });
    const project = {
      projectId: result.projectId,
      projectName: result.projectName,
      projectDescription: result.projectDescription,
      _count: {
        projectMembers: result.projectMembers.length, // TODO: once the backend is fixed, remove this and use the count from the response
      },
    };
    setProjects([...projects, project]);
  };

  const fetchProjectInfo = async () => {
    const { memberId } = user;
    console.log("memberId", memberId);
    if (memberId !== null && projects.length > 0) {
      const requests = projects.map((project) =>
        axios
          .get(
            `${DOMAIN}/api/management/project/${project.projectId}/member/${memberId}`
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
          console.log(error);
        });
    } else {
      setProjects([]);
    }
  };

  const deleteProject = async (projectIdParam) => {
    axios
      .delete(`${DOMAIN}/api/management/project/${projectIdParam}`)
      .then(() => {
        const newProjectArray = projects.filter(
          (project) => project.projectId !== projectIdParam
        );
        setProjects(newProjectArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const projectUserContextValues = useMemo(
    () => ({
      projectId,
      setProjectId,
      user,
      projects,
      updateUserDetails,
      projectsUpdated,
      projectDetails,
      setProjectDetails,
      updateProjectDetails,
      userRole,
      addNewProject,
      fetchProjectInfo,
      deleteProject,
    }),
    [
      projectId,
      user,
      projects,
      projectDetails,
      projectsUpdated,
      userRole,
      addNewProject,
      fetchProjectInfo,
      deleteProject,
    ]
  );

  return (
    <ProjectUserContext.Provider value={projectUserContextValues}>
      {children}
    </ProjectUserContext.Provider>
  );
}

ProjectUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

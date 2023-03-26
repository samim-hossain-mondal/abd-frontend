// import axios from "axios";
import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import makeRequest from '../utilityFunctions/makeRequest/index';
import { GET_ME, GET_PROJECTS, GET_PROJECT_BY_ID, CREATE_PROJECT } from '../constants/apiEndpoints';

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
      const userDetailsPromises = []
      userDetailsPromises.push(makeRequest(GET_ME))
      userDetailsPromises.push(makeRequest(GET_PROJECTS))

      const userDetails = await Promise.all(userDetailsPromises)
      setUser(userDetails[0]);
      setProjects(userDetails[1]);
      setProjectsUpdated(true);
      setSuccess('User details loaded successfully')
    }
    catch (err) {
      setError(err.message);
    }
  };

  const updateProjectDetails = async (projectIdParam, setError) => {
    try {
      setProjectId(projectIdParam);
      const resData = await makeRequest(GET_PROJECT_BY_ID(projectIdParam))
      const memberData = resData.projectMembers?.find(member => member.memberId === user.memberId);
      if (!memberData) {
        throw new Error('Failed to know the role')
      }
      setUserRole(memberData.role)
      setProjectDetails(resData);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false
    }
  }

  const addNewProject = async (title, projectDesc) => {
    const body = {
      projectName: title,
      projectDescription: projectDesc,
    }
    const { result } = await makeRequest(CREATE_PROJECT, {
      data: body
    })
    const project = {
      projectId: result.projectId,
      projectName: result.projectName,
      projectDescription: result.projectDescription,
      _count: {
        projectMembers: result.projectMembers.length, // TODO: once the backend is fixed, remove this and use the count from the response
      }
    };
    setProjects([...projects, project]);
  };

  const projectUserContextValues = useMemo(() => ({
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
    addNewProject
  }), [projectId, user, projects, projectDetails, projectsUpdated, userRole, addNewProject]);

  return (
    <ProjectUserContext.Provider value={projectUserContextValues}>
      {children}
    </ProjectUserContext.Provider>
  );
}

ProjectUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
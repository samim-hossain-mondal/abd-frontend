import React, { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import makeRequest from '../utilityFunctions/makeRequest';
import { GET_ME, GET_PROJECTS, GET_PROJECT_BY_ID } from '../constants/apiEndpoints';

export const ProjectUserContext = createContext();

export function ProjectUserProvider({ children }) {

  const [projectId, setProjectId] = useState();
  const [projectDetails, setProjectDetails] = useState(undefined);

  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectsUpdated, setProjectsUpdated] = useState(false);

  const updateUserDetails = async (setError, setSuccess) => {
    try {
      const userDetailsPromises = []
      userDetailsPromises.push(makeRequest(GET_ME))
      userDetailsPromises.push(makeRequest(GET_PROJECTS))

      const userDetails = await Promise.all(userDetailsPromises)

      console.log(userDetails);
      setUser(userDetails[0]);
      setProjects(userDetails[1]);
      setProjectsUpdated(true);
      setSuccess('User details loaded successfully')
    }
    catch (err) {
      setError(err.message);
    }
  };

  const updateProjectDetails = async (setError) => {
    try {
      const resData = await makeRequest(GET_PROJECT_BY_ID(projectId))
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false
    }
  }

  const projectUserContextValues = useMemo(() => ({
    projectId,
    setProjectId,
    user,
    projects,
    updateUserDetails,
    projectsUpdated,
    projectDetails,
    setProjectDetails,
    updateProjectDetails
  }), [projectId, user, projects, projectDetails, projectsUpdated]);

  return (
    <ProjectUserContext.Provider value={projectUserContextValues}>
      {children}
    </ProjectUserContext.Provider>
  );
}

ProjectUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
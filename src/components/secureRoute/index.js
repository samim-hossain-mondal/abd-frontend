import { useOktaAuth } from '@okta/okta-react';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { LinearProgress } from '@mui/material';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { HOME_ROUTE } from '../constants/routes';
import { ErrorContext } from '../contexts/ErrorContext';
import { UNAUTHORIZED_MSG } from '../constants/HttpMessages';

export default function SecureRoute({ children, welcome = false }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isProjectMember, setIsProjectMember] = useState(false);
  const {
    projects,
    setProjectId,
    projectsUpdated,
    user,
    updateProjectDetails,
    setProjectDetails,
  } = useContext(ProjectUserContext);

  const { setError, setSuccess } = useContext(ErrorContext);
  const { oktaAuth, authState } = useOktaAuth();

  useEffect(() => {
    if (authState?.isAuthenticated === false) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin
      );
      oktaAuth.setOriginalUri(originalUri);
      oktaAuth.signInWithRedirect();
    }
  }, [oktaAuth, authState?.isAuthenticated]);

  useEffect(() => {
    if (projectId) setProjectId(projectId);
    if (projectId && projectsUpdated) {
      if (
        projects.find(
          (project) => project.projectId === parseInt(projectId, 10)
        )
      ) {
        setIsProjectMember(true);
        updateProjectDetails(projectId, setError, setSuccess).then(
          (resData) => {
            if (resData) {
              setProjectDetails(resData);
              setSuccess('Project details loaded successfully');
            }
          }
        );
      } else {
        navigate(HOME_ROUTE);
        setProjectId(undefined);
        setIsProjectMember(false);
        if (projectId) setError(UNAUTHORIZED_MSG);
      }
    }
  }, [projects]);
  return authState?.isAuthenticated && user?.uid && (welcome || isProjectMember)
    ? children
    : <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>;
}

SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
  welcome: PropTypes.bool,
};

SecureRoute.defaultProps = {
  welcome: false,
};

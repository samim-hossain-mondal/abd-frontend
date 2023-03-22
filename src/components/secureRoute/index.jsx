import { useOktaAuth } from '@okta/okta-react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toRelativeUrl } from '@okta/okta-auth-js';

export default function SecureRoute({ children }) {

  // eslint-disable-next-line no-unused-vars
  const { oktaAuth, authState } = useOktaAuth();

  useEffect(() => {
    if (authState?.isAuthenticated === false) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin,
      )
      oktaAuth.setOriginalUri(originalUri)
      oktaAuth.signInWithRedirect()
    }
  }, [oktaAuth, authState?.isAuthenticated])


  return authState?.isAuthenticated ? children : 'loading ...';
}

SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
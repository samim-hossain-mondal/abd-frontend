import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';

import ErrorSnackbar from '../utilityFunctions/ErrorSnackbar';
import SuccessSnackbar from '../utilityFunctions/SuccessSnackbar';

export const ErrorContext = React.createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const errorContextValues = useMemo(() => ({ error, setError, success, setSuccess }), [error, success]);

  return (
    <ErrorContext.Provider value={errorContextValues}>
      {children}
      <Box>
        {error !== '' && (<Box><ErrorSnackbar message={error} setError={setError} /></Box>)}
        {success !== '' && (<Box><SuccessSnackbar message={success} setSuccess={setSuccess} /></Box>)}
      </Box>
    </ErrorContext.Provider>
  );
}

ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
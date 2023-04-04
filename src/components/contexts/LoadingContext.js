import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const LoadingContext = React.createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const errorContextValues = useMemo(() => ({ loading, setLoading }), [loading]);

  return (
    <LoadingContext.Provider value={errorContextValues}>
      {children}
    </LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
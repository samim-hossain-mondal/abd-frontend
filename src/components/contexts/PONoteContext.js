import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const PONoteContext = createContext();

export function PONoteProvider({ children }) {
  const [poNotes, setPONotes] = useState([]);
  const refreshContextValues = useMemo(() => ({ poNotes, setPONotes }), [poNotes]);
  return (
    <PONoteContext.Provider value={refreshContextValues}>
      {children}
    </PONoteContext.Provider>
  );
}

PONoteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
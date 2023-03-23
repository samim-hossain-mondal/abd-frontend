import React,{createContext,useState,useMemo} from 'react';
import PropTypes from 'prop-types';

export const RefreshContext = createContext();

export function RefreshContextProvider({children}) {
  const [refresh, setRefresh] = useState({
    poNotes: false,
    sentiment: false,
    request: false,
    announcement: false,
    celebration: false,
    availabilityCalendar: false
  });
  const refreshContextValues = useMemo(() => ({ refresh, setRefresh }), [refresh]);
  return (
    <RefreshContext.Provider value = {refreshContextValues}>
      {children}
    </RefreshContext.Provider>
  );
}

RefreshContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
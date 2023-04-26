import React, { useReducer, useMemo, createContext, useContext, useEffect } from 'react';
import {
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import { isMember } from '../constants/users';
import { ProjectUserContext } from './ProjectUserContext';

const intitalGridHeightState = (member = false) => ({
  sentiment: {
    height: member ? '25%' : "9%",
    expanded: member
  },
  celebration: {
    height: member ? '75%' : "91%",
    expanded: true,
    fullExpanded: false
  },
  request: {
    height: '50%',
    expanded: true
  },
  announcement: {
    height: '50%',
    expanded: true
  }
})

const gridHeightReducer = (state, action) => {
  switch (action.type) {
    case 'SENTIMENT': {
      if (!state.sentiment.expanded && state.celebration.fullExpanded) return intitalGridHeightState(isMember(action.userRole));
      if (state.sentiment.expanded) {
        return {
          ...state,
          sentiment: {
            ...state.sentiment,
            height: '9%',
            expanded: false
          },
          celebration: {
            ...state.celebration,
            height: '91%'
          }
        }
      }
      return {
        ...state,
        sentiment: intitalGridHeightState(isMember(action.userRole)).sentiment,
        celebration: {
          ...state.celebration,
          height: intitalGridHeightState(isMember(action.userRole)).celebration.height,
        }
      }
    }
    case 'REQUEST': {
      if (!state.request.expanded && state.celebration.fullExpanded) return intitalGridHeightState(isMember(action.userRole))
      if (state.request.expanded) {
        if (state.announcement.expanded) {
          return {
            ...state,
            request: {
              ...state.request,
              height: '9%',
              expanded: false
            },
            announcement: {
              ...state.announcement,
              height: '91%'
            }
          }
        }
        return {
          ...state,
          celebration: {
            ...state.celebration,
            height: '91%',
            fullExpanded: true
          },
          sentiment: {
            ...state.sentiment,
            height: '9%',
            expanded: false
          },
          request: {
            ...state.request,
            height: '9%',
            expanded: false
          },
          announcement: {
            ...state.announcement,
            height: '9%'
          },
        }
      }
      return {
        ...state,
        celebration: {
          ...state.celebration,
          fullExpanded: false
        },
        request: intitalGridHeightState(isMember(action.userRole)).request,
        announcement: intitalGridHeightState(isMember(action.userRole)).announcement
      }
    }
    case 'ANNOUNCEMENT': {
      if (!state.announcement.expanded && state.celebration.fullExpanded) return intitalGridHeightState(isMember(action.userRole))
      if (state.announcement.expanded) {
        if (state.request.expanded) {
          return {
            ...state,
            request: {
              ...state.request,
              height: '91%',
            },
            announcement: {
              ...state.announcement,
              height: '9%',
              expanded: false
            }
          }
        }
        return {
          ...state,
          celebration: {
            ...state.celebration,
            height: '91%',
            fullExpanded: true
          },
          sentiment: {
            ...state.sentiment,
            height: '9%',
            expanded: false
          },
          request: {
            ...state.request,
            height: '9%'
          },
          announcement: {
            ...state.announcement,
            height: '9%',
            expanded: false
          }
        }
      }
      return {
        ...state,
        celebration: {
          ...state.celebration,
          fullExpanded: false
        },
        request: intitalGridHeightState(isMember(action.userRole)).request,
        announcement: intitalGridHeightState(isMember(action.userRole)).announcement
      }
    }
    case 'CELEBRATION': {
      if (state.celebration.fullExpanded) {
        return intitalGridHeightState(isMember(action.userRole));
      }
      return {
        ...state,
        celebration: {
          ...state.celebration,
          height: '91%',
          fullExpanded: true
        },
        sentiment: {
          ...state.sentiment,
          height: '9%',
          expanded: false
        },
        request: {
          ...state.request,
          height: '9%',
          expanded: false
        },
        announcement: {
          ...state.announcement,
          height: '9%',
          expanded: false
        }
      }
    }
    default: return intitalGridHeightState(isMember(action.userRole));
  }
}

export const DSMBodyLayoutContext = createContext({ gridHeightState: {}, dispatchGridHeight: () => { } });

export function DSMBodyLayoutProvider({ children }) {

  const { userRole } = useContext(ProjectUserContext)
  const [gridHeightState, dispatchGridHeight] = useReducer(gridHeightReducer, intitalGridHeightState(isMember(userRole)))
  const dsmBodyLayoutContextValue = useMemo(() => ({ gridHeightState, dispatchGridHeight }), [gridHeightState])

  useEffect(() => {
    dispatchGridHeight({ userRole })
  }, [userRole])

  return (
    <DSMBodyLayoutContext.Provider value={dsmBodyLayoutContextValue}>
      <Grid sx={{ backgroundColor: '#e6eef2', height: '100%', paddingBottom: '2%' }}>
        {children}
      </Grid>
    </DSMBodyLayoutContext.Provider>
  );
}

DSMBodyLayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
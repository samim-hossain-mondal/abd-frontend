import React, { useReducer, useMemo } from 'react';
import {
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';

const intitalGridHeightState = {
  sentiment: {
    height: '25%',
    expanded: true
  },
  celebration: {
    height: '75%',
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
}

const gridHeightReducer = (state, action) => {
  switch (action.type) {
  case 'SENTIMENT': {
    if (!state.sentiment.expanded && state.celebration.fullExpanded) return intitalGridHeightState
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
      sentiment: intitalGridHeightState.sentiment,
      celebration: {
        ...state.celebration,
        height: '75%'
      }
    }
  }
  case 'REQUEST': {
    if (!state.request.expanded && state.celebration.fullExpanded) return intitalGridHeightState
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
      request: intitalGridHeightState.request,
      announcement: intitalGridHeightState.announcement
    }
  }
  case 'ANNOUNCEMENT': {
    if (!state.announcement.expanded && state.celebration.fullExpanded) return intitalGridHeightState
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
      request: intitalGridHeightState.request,
      announcement: intitalGridHeightState.announcement
    }
  }
  case 'CELEBRATION': {
    if (state.celebration.fullExpanded) {
      return intitalGridHeightState;
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
  default: return intitalGridHeightState;
  }
}

export const DSMBodyLayoutContext = React.createContext({ gridHeightState: intitalGridHeightState, dispatchGridHeight: () => { } });

export function DSMBodyLayoutProvider({ children }) {

  const [gridHeightState, dispatchGridHeight] = useReducer(gridHeightReducer, intitalGridHeightState)
  const dsmBodyLayoutContextValue = useMemo(() => ({ gridHeightState, dispatchGridHeight }), [gridHeightState])

  return (
    <DSMBodyLayoutContext.Provider value={dsmBodyLayoutContextValue}>
      <Grid backgroundColor='#e6eef2' height="100%">
        {children}
      </Grid>
    </DSMBodyLayoutContext.Provider>
  );
}

DSMBodyLayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
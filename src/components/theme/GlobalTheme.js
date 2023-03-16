import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/400.css';

// Theme for the PO Notes Tables Header
const theme = createTheme({
  palette: {
    primary: {
      main: '#2258F5',
      light: '#E6EEF2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3D3D3D',
      light: '#F5F5F5',
      contrastText: '#FFFFFF',
    },
    custom: {
      draft: '#FF6E00',
      published: '#40A737',
    },
    customButton1: {
      main: '#7784EE',
      contrastText: '#FFFFFF',
    },
    customButton2: {
      main: '#FFFFFF',
      contrastText: '#044ED7',
    },
    quickFilterPopover: {
      main: '#FFFFFF',
      contrastText: '#121212',
    },
    iconCheckbox: {
      main: '#323232'
    },
    backgroundColor: {
      main: '#e6eef2',
    },
    secondaryButton: {
      main: '#EEF2F5',
      contrastText: '#000',
    }
  },
  components: {
    MuiTypography: {
      variants: [{
        props: { variant: 'h6' },
        style: {
          color: 'white',
          display: 'flow',
          lineHeight: '22px',
          fontFamily: 'Roboto',
        },
      },
      ],
    },
    // theme for the PO Notes tables header
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: '#051C2C',
          borderradius: '0px',
          color: '#FFFFFF'
        },
      },
    },
    //  theme for the PO Notes tables container
    MuiTableContainer: {
      styleOverrides: {
        root:
        {
          background: '#EEF2F5',
          height: '725px',
          maxHeight: '1000px',
          Width: '500px',
          width: '100%',
          flexGrow: -5
        },
      },
    },
    jiraButton: {
      palette: {
        backgroundColor: '#E6EEF2'
      }
    },
  }
});

theme.typography.dsmMain = {
  ...theme.typography.button,
  color: '#051C2C',
  display: 'flow',
  fontFamily: 'Roboto',
  fontSize: '25px',
  fontWeight: '400'
}

theme.typography.dsmSubMain = {
  ...theme.typography.button,
  color: '#051C2C',
  display: 'flow',
  fontFamily: 'Roboto',
  fontSize: '17px',
  fontWeight: '400'
}

export default theme;
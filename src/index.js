import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import App from './App';
import { ErrorProvider } from './components/contexts/ErrorContext';
import theme from './components/theme/GlobalTheme';
import { ProjectUserProvider } from './components/contexts/ProjectUserContext';
import { LoadingProvider } from './components/contexts/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoadingProvider>
    <ProjectUserProvider>
      <ThemeProvider theme={theme}>
        <ErrorProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorProvider>
      </ThemeProvider>
    </ProjectUserProvider>
  </LoadingProvider>

);
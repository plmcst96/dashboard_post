import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './app/queryClient';
import { CssBaseline } from '@mui/material';
import { App } from './App';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'MyFont, Arial, sans-serif', // usa il font definito nel CSS globale
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 300 },
    button: { fontWeight: 500, textTransform: 'none' },
    caption: { fontWeight: 300 },
  },
   palette: {
    primary: {
      main: '#F4D55D', // colore reale
      contrastText: '#191810',
    },
    secondary: {
      main: '#FFACA0',
      light: '#b1e89b',
      contrastText: '#cccefd',
    },
    background: {
      default: '#FFFFFF',
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

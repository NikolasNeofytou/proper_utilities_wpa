import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import { utilityProTheme } from './theme/mantine-theme.ts';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './theme/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={utilityProTheme}>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
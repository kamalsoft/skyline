import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import baseTheme from './theme'; // Import the base theme
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

const ThemedApp = () => {
  const { settings } = useSettings();
  // Extend the theme with the current settings, so it's available in `props.theme`
  const theme = extendTheme({ ...baseTheme, settings });
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SettingsProvider>
    <ThemedApp />
  </SettingsProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
reportWebVitals();

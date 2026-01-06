import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/css/app.css'
import { msalInitPromise } from './configs/msalConfig.js'

// Render the app - we'll initialize MSAL but won't block on it
const renderApp = () => {
  console.log('[Main] Rendering app');
  ReactDOM.createRoot(document.getElementById('root')).render(
    <>
      <App />
    </>
  );
};

// Wait for MSAL with a timeout (5 seconds max)
const MSAL_TIMEOUT = 5000;
const timeoutPromise = new Promise((resolve) => {
  setTimeout(() => {
    console.warn('[Main] MSAL initialization timed out, rendering anyway');
    resolve(null);
  }, MSAL_TIMEOUT);
});

// Race MSAL init against timeout
Promise.race([msalInitPromise, timeoutPromise])
  .then(() => {
    console.log('[Main] MSAL ready or timed out, rendering app');
    renderApp();
  })
  .catch((error) => {
    console.error('[Main] Error during initialization:', error);
    renderApp(); // Render anyway
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

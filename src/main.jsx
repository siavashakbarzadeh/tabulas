import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/css/app.css'
import { msalInstance } from './configs/msalConfig.js'

// Initialize MSAL before rendering the app
msalInstance.initialize().then(() => {
  console.log('[MSAL] Initialized successfully');
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <>
      <App />
    </>
  );
}).catch((error) => {
  console.error('[MSAL] Initialization error:', error);
  // Render app anyway, MSAL features won't work
  ReactDOM.createRoot(document.getElementById('root')).render(
    <>
      <App />
    </>
  );
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

import { PublicClientApplication, EventType } from "@azure/msal-browser";

// Detect if running in a native app (Cordova or React Native WebView)
const isCordova = typeof window !== "undefined" && window.cordova;
const isReactNativeWebView = typeof window !== "undefined" && (
  window.ReactNativeWebView !== undefined ||
  (navigator.userAgent && navigator.userAgent.includes('ReactNative'))
);
const isNativeApp = isCordova || isReactNativeWebView;

console.log('[MSAL Config] isCordova:', isCordova, 'isReactNativeWebView:', isReactNativeWebView);

const msalConfig = {
  auth: {
    clientId: "aa825561-377d-4414-8acc-2905cd587e98",
    authority: "https://login.microsoftonline.com/16c24428-0bd3-4bc1-a192-d315f43f5bb4",
    // Use base URL - must match what's registered in Azure AD
    redirectUri: "https://tabulas.vercel.app",
    navigateToLoginRequestUrl: false, // Prevent redirect loops
  },
  cache: {
    cacheLocation: isNativeApp ? "localStorage" : "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: 3, // Error only
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL - required for newer versions
msalInstance.initialize().then(() => {
  console.log('[MSAL] Initialized successfully');
  
  // Handle redirect after initialization
  msalInstance.handleRedirectPromise().catch((error) => {
    console.error('[MSAL] Redirect error:', error);
  });
}).catch((error) => {
  console.error('[MSAL] Initialization error:', error);
});

export { isNativeApp };
import { PublicClientApplication } from "@azure/msal-browser";

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
    redirectUri: "https://tabulas.vercel.app",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: isNativeApp ? "localStorage" : "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Export initialization promise for async flows
export const msalInitPromise = msalInstance.initialize().catch((error) => {
  console.error('[MSAL Config] Initialization error:', error);
  // Don't throw - let the app continue without MSAL
  return null;
});

export { isNativeApp };
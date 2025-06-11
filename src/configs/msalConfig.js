import { PublicClientApplication } from "@azure/msal-browser";

const isCordova = typeof window !== "undefined" && window.cordova;

const msalConfig = {
  auth: {
    clientId: "aa825561-377d-4414-8acc-2905cd587e98",
    authority: "https://login.microsoftonline.com/16c24428-0bd3-4bc1-a192-d315f43f5bb4",
    redirectUri: isCordova ? "http://localhost" : "https://tabulas.vercel.app",
  },
  cache: {
    cacheLocation: isCordova ? "localStorage" : "sessionStorage",
    storeAuthStateInCookie: false,
  },
};
export const msalInstance = new PublicClientApplication(msalConfig);
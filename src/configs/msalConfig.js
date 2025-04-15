import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "16c24428-0bd3-4bc1-a192-d315f43f5bb4",
    authority: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    redirectUri: "https://tabulas.vercel.app/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};


export const msalInstance = new PublicClientApplication(msalConfig);

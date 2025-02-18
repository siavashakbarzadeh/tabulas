import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "a7009f2b-e0fc-41a7-8fa2-4841ad7af1e2",
    authority: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    redirectUri: "http://localhost:5173/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

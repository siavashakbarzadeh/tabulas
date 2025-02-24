import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "8023f59d-baeb-4507-9a07-e3efc4a54a1a",
    authority: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    redirectUri: "http://localhost:5173/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

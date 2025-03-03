import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "2fa579a2-b924-4da7-b20e-98c74751c617",
    authority: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize", 
    redirectUri: "https://tabulas.vercel.app/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

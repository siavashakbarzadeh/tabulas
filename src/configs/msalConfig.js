import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "aa825561-377d-4414-8acc-2905cd587e98", // from user
    authority: "https://login.microsoftonline.com/16c24428-0bd3-4bc1-a192-d315f43f5bb4",
    redirectUri: "https://tabulas.vercel.app",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

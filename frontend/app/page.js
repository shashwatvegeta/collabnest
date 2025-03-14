"use client";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import Home from "./home";

export const msalInstance = new PublicClientApplication(msalConfig);
export default function MSAuthWrapper() {
  return (
    <MsalProvider instance={msalInstance}>
      <Home></Home>
    </MsalProvider>
  );
}

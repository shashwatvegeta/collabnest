"use client";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
const font = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Collabnest",
//   description: "Bridge the Gap Between Learning & Implementation",
// };
export const msalInstance = new PublicClientApplication(msalConfig);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        <MsalProvider instance={msalInstance}>
          {/* <Navbar /> */}
          {children}
        </MsalProvider>
      </body>
    </html>
  );
}

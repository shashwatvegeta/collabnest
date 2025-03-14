import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const font = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Collabnest",
  description: "Bridge the Gap Between Learning & Implementation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}

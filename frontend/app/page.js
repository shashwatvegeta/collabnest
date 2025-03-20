"use client";
import CollabNestApp from "../components/landing";
import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/navbar";
import HowItWorks from "../components/HowItWorks";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { getEmail, getName, getRollNumber } from "@/lib/auth_utility";

const Home = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const initializeSignIn = (url) => {
    instance.loginRedirect();
  };
  const createNewUser = () => {
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: getName(),
        password: "_",
        email: getEmail(),
        isVerified: true,
        roll_number: getRollNumber(),
        user_type: "student",
      }),
    }).then((response) => {
      if (response.status == 200) {
        alert("user created");
      }
    });
  };
  useEffect(() => {
    if (isAuthenticated) {
      // alert(isAuthenticated);
      // alert(redirectURL);
      fetch("http://localhost:3001/users/" + getEmail(), {
        method: "GET",
      }).then((response) => {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          // For JSON responses
          response.json().then((data) => {
            if (!data) {
              //create new user

              createNewUser();
            }
          });
        } else {
          // For text or other responses
          response.text().then((data) => {
            if (data.trim() == "") {
              //create new user;
              createNewUser();
            }
          });
        }
      });
    }
  }, [isAuthenticated]);
  return (
    <div>
      <div
        className="relative h-screen bg-cover bg-center p-4 flex flex-col items-center"
        style={{ backgroundImage: "url(/landingpage_bg.png)" }}
      >
        <Navbar />

        <div className="text-center text-white mt-16 px-6">
          <h1 className="text-4xl md:text-6xl font-bold">COLLABNEST</h1>
          <p className="mt-4 text-lg">
            Bridge the Gap Between Learning & Implementation
          </p>

          {isAuthenticated && (
            <div className="mt-6 space-x-4 flex flex-wrap justify-center items-center">
              <button
                className="px-6 py-3 border border-white rounded-full"
                onClick={() => {
                  redirect("/student_dashboard");
                }}
              >
                Student Dashboard
              </button>
              <button
                className="px-6 py-3 border border-white rounded-full"
                onClick={() => {
                  redirect("/mentor");
                }}
              >
                Mentor Dashboard
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <div className="mt-6 space-x-4 flex justify-center items-center">
              <button
                onClick={() => {
                  initializeSignIn("/student_dashboard");
                }}
                className=" flex items-center justify-center font-segoe-ui font-normal text-[15px] bg-[white] text-[#2f2f2f] h-[45px] px-4 rounded-sm hover:scale-110 transition duration-300"
              >
                <img
                  src="/ms_logo.svg"
                  className="w-5 h-5 mr-3"
                  alt="Microsoft"
                />
                Sign In with Microsoft
              </button>
            </div>
          )}

          <div className="flex justify-center mt-16">
            <Image
              src="/laptop_image.png"
              alt="Featured Image"
              width={500}
              height={500}
              className="rounded-lg w-full max-w-md md:max-w-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="mt-8 flex justify-center">
          <HowItWorks />
        </div>
        <div className="mt-16">
          <CollabNestApp />
        </div>
      </div>
    </div>
  );
};
export default Home;
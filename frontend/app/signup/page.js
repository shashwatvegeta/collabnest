"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "../../components/navbar";
import Link from "next/link";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col"
            style={{ backgroundImage: "url('/landingpage_bg.png')" }}
        >
            <Navbar className="mt-10" />

            <div className="flex flex-1 justify-center items-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-black">
                    <h1 className="text-3xl font-semibold mb-6">Sign in</h1>

                    <Tabs defaultValue="student">
                        <TabsList className="flex space-x-4 mb-4">
                            <TabsTrigger
                                value="student"
                                className="px-6 py-2 border-b-2 font-medium bg-black text-white"
                            >
                                Login As A Student
                            </TabsTrigger>
                            <TabsTrigger
                                value="mentor"
                                className="px-6 py-2 border-b-2 font-medium text-gray-600"
                            >
                                Login As A Mentor
                            </TabsTrigger>
                            <TabsTrigger
                                value="admin"
                                className="px-6 py-2 border-b-2 font-medium text-gray-600"
                            >
                                Login As A Mentor
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="student">
                            <div className="mb-4 w-full">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Email or phone number
                                </label>
                                <Input id="email" />
                            </div>

                            <div className="relative mb-4 w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-600"
                                    >
                                        Password
                                    </label>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-sm text-gray-600"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                />
                            </div>

                            <Link href="/student_dashboard">
                                <Button
                                    className="w-full mb-4"
                                    style={{
                                        backgroundColor: "black",
                                        color: "white",
                                        borderRadius: "20px",
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Link>

                            <p className="text-center mb-4 text-black">or</p>
                            <Button
                                className="w-full mb-4"
                                style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    borderRadius: "20px",
                                    border: "1px solid black",
                                }}
                            >
                                Sign in with Microsoft
                            </Button>
                            <div className="flex items-center mt-4">
                                <Checkbox id="remember" />
                                <label htmlFor="remember" className="ml-2 text-sm text-black">
                                    Remember me
                                </label>
                                <a href="#" className="ml-auto text-sm text-black-600">
                                    Need help?
                                </a>
                            </div>
                            <p className="mt-4 text-sm text-left text-black">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-black-600">
                                    <u>Sign up</u>
                                </Link>
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="text-white max-w-md ml-40">
                    <h2 className="text-6xl font-bold mb-6">Empower Your Learning</h2>
                    <p className="text-lg">
                        Join our vibrant community where students, mentors, and professors
                        collaborate to enhance educational experiences. Sign in to access a
                        wealth of resources tailored to your role.
                    </p>
                </div>
            </div>
        </div>
    );
}

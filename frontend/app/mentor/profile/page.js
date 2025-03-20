"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getEmail, getName } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { fetchUserData } from "@/lib/api";

const Profile = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const userEmail = getEmail();
                
                // Fetch user data
                const userData = await fetchUserData(userEmail).catch(err => {
                    console.error('Error fetching user data:', err);
                    return {}; // Default empty object if fetch fails
                });
                
                if (userData && userData._id) {
                    setUser({
                        ...userData,
                        name: getName() || 'User',
                        type: "Mentor",
                        email: userEmail || 'No email available',
                        tel: userData?.phone || "N/A",
                        pfp_src: userData?.profilePicture || "/user_placeholder.png",
                    });
                } else {
                    console.error("Failed to get valid user ID:", userData);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-6xl">
            <div className="text-3xl text-violet-400 p-4 font-light">Profile</div>
            
            {/* Profile Header */}
            <div className="flex items-center space-x-6 p-6 bg-[#2a2a38] rounded-lg mb-6">
                <div className="relative">
                    {user.pfp_src ? (
                        <Image
                            src={user.pfp_src}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-violet-500"
                        />
                    ) : (
                        <Image
                            src="/user_placeholder.png"
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-violet-500"
                        />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    <p className="text-violet-300">{user.email}</p>
                    <p className="text-purple-200">Mentor</p>
                </div>
            </div>

            {/* Mentor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2a2a38] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Projects</h2>
                    <div className="text-3xl text-violet-400">{user.projects_count || 0}</div>
                    <p className="text-gray-400 text-sm">Total projects managed</p>
                </div>
                
                <div className="bg-[#2a2a38] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Students</h2>
                    <div className="text-3xl text-violet-400">{user.students_count || 0}</div>
                    <p className="text-gray-400 text-sm">Students mentored</p>
                </div>
                
                <div className="bg-[#2a2a38] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Active</h2>
                    <div className="text-3xl text-violet-400">{user.active_projects_count || 0}</div>
                    <p className="text-gray-400 text-sm">Currently active projects</p>
                </div>
            </div>

            {/* Bio Section */}
            <div className="bg-[#2a2a38] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-gray-200">
                    {user.bio || "No bio available. Add a bio to let students know about your expertise and interests."}
                </p>
            </div>

            {/* Expertise Section */}
            <div className="bg-[#2a2a38] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                    {user.expertise && user.expertise.length > 0 ? (
                        user.expertise.map((skill, index) => (
                            <Badge key={index} className="bg-violet-600 hover:bg-violet-700 text-white py-1 px-3">
                                {skill}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-gray-400">No expertise areas specified yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

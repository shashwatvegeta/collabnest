"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getEmail, getName, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { fetchUserData, fetchUserCertificates } from "@/lib/api";
import XpLevelDisplay from "@/components/XpLevelDisplay";
import Link from "next/link";

const Profile = () => {
    const [user, setUser] = useState({});
    const [certificates, setCertificates] = useState([]);
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
                        type: "Student",
                        email: userEmail || 'No email available',
                        tel: userData?.phone || "1010101",
                        pfp_src: userData?.profilePicture || "/user_placeholder.png",
                    });

                    // Fetch certificates
                    try {
                        const certs = await fetchUserCertificates(userData._id);
                        setCertificates(certs || []);
                    } catch (certErr) {
                        console.error('Error fetching certificates:', certErr);
                    }
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
        <div className="p-8 h-screen">
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
                    <p className="text-purple-200">Roll Number: {getRollNumber()}</p>
                </div>
            </div>

            {/* Experience Level */}
            {user._id && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Experience Level</h2>
                        <Link href="/student_dashboard/leaderboard">
                            <button className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 6L21 6"></path>
                                    <path d="M8 12L21 12"></path>
                                    <path d="M8 18L21 18"></path>
                                    <path d="M3 6L3.01 6"></path>
                                    <path d="M3 12L3.01 12"></path>
                                    <path d="M3 18L3.01 18"></path>
                                </svg>
                                View Leaderboard
                            </button>
                        </Link>
                    </div>
                    <XpLevelDisplay userId={user._id} />
                </div>
            )}

            {/* Certificates Section */}
            <div className="bg-[#2a2a38] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.length > 0 ? (
                        certificates.map((cert, index) => (
                            <div key={index} className="bg-[#222131] rounded-lg p-4 border border-violet-500/20 hover:border-violet-500/40 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-white">Project Certificate</h3>
                                    <span className="text-sm text-violet-300">
                                        {new Date(cert.generated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-purple-200 text-sm mb-4">Certificate ID: {cert.certificate_id}</p>
                                <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                                >
                                    View Certificate
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No certificates earned yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 
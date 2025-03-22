"use client";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch all users
            const usersResponse = await axios.get("http://localhost:3001/users");
            const users = usersResponse.data;

            // Fetch level data for each user
            const leaderboardUsers = await Promise.all(
                users
                    .filter(user => user.user_type === "student") // Only include students
                    .map(async (user) => {
                        try {
                            // Get level data for this user
                            const levelResponse = await axios.get(`http://localhost:3001/users/${user._id}/gamification/level`);
                            const levelData = levelResponse.data;

                            // Calculate total score: level*600 + current_xp
                            const totalScore = ((levelData.level-1) * 600) + levelData.xp;

                            return {
                                userId: user._id,
                                username: user.username,
                                rollNumber: user.roll_number,
                                level: levelData.level,
                                xp: levelData.xp,
                                nextLevelXp: levelData.nextLevelXp,
                                totalScore: totalScore,
                                // Attach any profile image if available
                                profileImage: user.profilePicture || "/user_placeholder.png"
                            };
                        } catch (error) {
                            console.error(`Error fetching level for user ${user._id}:`, error);
                            // Return user with default level data
                            return {
                                userId: user._id,
                                username: user.username,
                                rollNumber: user.roll_number,
                                level: 1,
                                xp: 0,
                                nextLevelXp: 600,
                                totalScore: 0,
                                profileImage: user.profilePicture || "/user_placeholder.png"
                            };
                        }
                    })
            );

            // Sort users by total score (descending)
            const sortedLeaderboard = leaderboardUsers.sort((a, b) => b.totalScore - a.totalScore);

            // Add rank to each user
            const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
                ...user,
                rank: index + 1
            }));

            setLeaderboardData(rankedLeaderboard);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            setError("Failed to load leaderboard data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to get medal emoji or rank based on position
    const getRankDisplay = (rank) => {
        switch (rank) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return `#${rank}`;
        }
    };

    // Function to get appropriate background color for rank
    const getRowBackgroundColor = (rank) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/40";
            case 2:
                return "bg-gradient-to-r from-slate-400/20 to-gray-500/20 border border-slate-400/40";
            case 3:
                return "bg-gradient-to-r from-amber-700/20 to-yellow-700/20 border border-amber-700/40";
            default:
                return "bg-[#2a2a38] border border-violet-500/10";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading Leaderboard...</div>
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
        <div className="p-8 h-screen overflow-y-auto">
            <div className="text-3xl text-violet-400 p-4 font-light mb-2">Student Leaderboard</div>
            <p className="text-purple-200 px-4 mb-6">Compete with other students and climb the ranks!</p>

            {/* Leaderboard Table */}
            <div className="w-full overflow-hidden rounded-lg">
                {/* Table Header */}
                <div className="bg-[#1f1e37] text-white p-4 rounded-t-lg grid grid-cols-12 gap-4">
                    <div className="col-span-1 font-bold">Rank</div>
                    <div className="col-span-5 font-bold">Student</div>
                    <div className="col-span-2 font-bold text-center">Level</div>
                    <div className="col-span-2 font-bold text-center">XP</div>
                    <div className="col-span-2 font-bold text-center">Score</div>
                </div>

                {/* Table Body */}
                <div className="space-y-2 mt-2">
                    {leaderboardData.map((user) => (
                        <div
                            key={user.userId}
                            className={`${getRowBackgroundColor(user.rank)} p-4 rounded-lg grid grid-cols-12 gap-4 items-center transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/5`}
                        >
                            {/* Rank */}
                            <div className="col-span-1 font-bold text-lg">
                                <span className={user.rank <= 3 ? "text-2xl" : "text-white"}>
                                    {getRankDisplay(user.rank)}
                                </span>
                            </div>

                            {/* Student Info */}
                            <div className="col-span-5 flex items-center space-x-3">
                                <div className="relative w-10 h-10">
                                    <Image
                                        src={user.profileImage}
                                        alt={user.username}
                                        layout="fill"
                                        className="rounded-full object-cover border-2 border-violet-500"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{user.username}</div>
                                    <div className="text-xs text-gray-400">{user.rollNumber}</div>
                                </div>
                            </div>

                            {/* Level */}
                            <div className="col-span-2 text-center">
                                <div className="bg-violet-500/30 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                                    <span className="text-white font-bold">{user.level}</span>
                                </div>
                            </div>

                            {/* XP */}
                            <div className="col-span-2 text-center">
                                <div className="text-white">
                                    {user.xp} / {user.nextLevelXp}
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                                    <div
                                        className="bg-gradient-to-r from-violet-600 to-indigo-500 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(100, (user.xp / user.nextLevelXp) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Total Score */}
                            <div className="col-span-2 text-center">
                                <div className="text-white font-semibold">{user.totalScore.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {leaderboardData.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No students found in the leaderboard.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard; 
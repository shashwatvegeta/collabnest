"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ui/project_card";
import Link from "next/link";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { fetchUserData, fetchUserProjects, fetchRecommendedProjects, fetchUserAchievements } from "@/lib/api";

const SDashboard = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const [recommendedProjects, setRecommendedProjects] = useState([]);
	const [ongoingProjects, setOngoingProjects] = useState([]);
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
				
				const rollNumber = getRollNumber();
				const userName = getName();
				const userEmail = getEmail();
				
				setName(userName);
				setEmail(userEmail);

				// Fetch user data
				const userData = await fetchUserData(userEmail);
				
				// Fetch projects and achievements in parallel
				const [projects, achievements] = await Promise.all([
					fetchUserProjects(userData.projects),
					// fetchRecommendedProjects(rollNumber),
					fetchUserAchievements(userData._id)
				]);

				setUser({
					...userData,
					name: userName,
					type: "Student",
					email: userEmail,
					tel: userData.phone || "Not provided",
					pfp_src: userData.profilePicture || "/user_placeholder.png",
					level: userData.level || 1,
					level_progression: userData.levelProgress || 0,
					badges: achievements.map(a => a.name) || [],
				});

				setOngoingProjects(projects);
				setRecommendedProjects(projects);
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
			<div className="text-3xl text-violet-400 p-4 font-light">Dashboard</div>
			<div className="text-2xl text-white font-bold p-4">
				Welcome Back, {user.name}!
			</div>
			<div className="grid grid-cols-2 gap-4" style={{ width: "85vw" }}>
				<div className="flex col-span-2">
					{user.pfp_src ? (
						<Image
							className="mx-8 object-contain"
							src={user.pfp_src}
							alt="User Profile"
							width={75}
							height={75}
						/>
					) : (
						<Image
							className="mx-8 object-contain"
							src="/logo.png"
							alt="User Profile"
							width={75}
							height={75}
						/>
					)}
					<div className="place-content-center">
						<div className="font-semibold text-xl text-white">
							{user.name} ·{" "}
							<p className="inline uppercase text-teal-400">{user.type}</p>
						</div>
						<div className="text-sm text-purple-200">
							{user.email} - {user.tel}
						</div>
					</div>
				</div>
				<div className="border-0 rounded-lg border-violet-300 text-white bg-[#2a2a38] row-span-2 p-4">
					<div className="font-semibold flex">
						<div className="flex-1 text-xl">Recommended Projects</div>
						<Link href="/student_dashboard/find_projects">
							<button className="px-4 py-2 bg-indigo-500 text-sm rounded-lg">
								View All
							</button>
						</Link>
					</div>
					<div className="grid gap-2 p-2">
						{recommendedProjects.length > 0 ? (
							recommendedProjects.map((p, index) => (
								<ProjectCard key={index} project={p} />
							))
						) : (
							<div className="text-center text-gray-400 py-4">No recommended projects available</div>
						)}
					</div>
				</div>

				<div className="row-span-4 col-span-1 ">
					<div className="border-0 p-4 rounded-lg border-violet-300 text-white bg-gradient-to-r from-[#2a2a38] to-[#222131]">
						<div className="text-2xl font-semibold">Your Progress</div>
						<div className="text-xs text-violet-300 py-2">
							Track your Achievements and Level
						</div>
						<div>
							<div className="flex py-2 gap-4">
								<div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl p-2 bg-indigo-500">
									{user.level}
								</div>
								<div className="font-bold text-lg flex-1">
									Level {user.level}
								</div>
								<div className="text-xs translate-y-[8px]">
									{Math.round(user.level_progression * 100)}%
								</div>
							</div>
							<div>
								<span
									role="progressbar"
									aria-labelledby="ProgressLabel"
									aria-valuenow={user.level_progression * 100}
									className="relative block rounded-full bg-gray-400"
								>
									<span
										className="block h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-center"
										style={{ width: `${user.level_progression * 100}%` }}
									></span>
								</span>
							</div>
						</div>
						<div className="flex">
							<div className="text-lg font-semibold py-2 flex-1">
								Badges Earned
							</div>
							<Link href="/student_dashboard/badges">
								<div className="py-2 text-sm underline">View all</div>
							</Link>
						</div>
						<div className="grid grid-cols-5 gap-4">
							{user.badges.length > 0 ? (
								user.badges.map((b, index) => <Badge key={`badge-${index}`}>{b}</Badge>)
							) : (
								<div className="text-center text-gray-400 col-span-5">No badges earned yet</div>
							)}
						</div>
					</div>
					<div className="border-0 rounded-lg border-violet-300 text-white bg-[#2a2a38] row-span-2 my-4 p-4">
						<div className="font-semibold flex">
							<div className="flex-1 text-xl">Ongoing Projects</div>
							<Link href="/student_dashboard/ongoing_projects">
								<button className="px-4 py-2 bg-indigo-500 text-sm rounded-lg">
									View All
								</button>
							</Link>
						</div>
						<div className="grid gap-2 p-2">
							{ongoingProjects.length > 0 ? (
								ongoingProjects.map((p, index) => (
									<ProjectCard key={index} project={p} />
								))
							) : (
								<div className="text-center text-gray-400 py-4">No ongoing projects</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SDashboard;

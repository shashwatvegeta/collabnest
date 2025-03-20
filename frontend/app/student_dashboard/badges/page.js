"use client";
import { Badge } from "@/components/ui/badge";
import { fetchUserData } from "@/lib/api";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Badges() {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
	const isAuthenticated = useIsAuthenticated();

	const badges = [
		{ id: 1, name: "First Project", image: "/badges/first-project.png" },
		{ id: 2, name: "Fast Learner", image: "/badges/fast-learner.png" },
		{ id: 3, name: "Team Player", image: "/badges/team-player.png" },
	];

	useEffect(() => {
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);



	useEffect(() => {
		async function loadUserData() {
			try {
				const userName = getName();
				const userEmail = getEmail();
				setName(userName);
				setEmail(userEmail);
				const userData = await fetchUserData(userEmail);
				console.log(userData);
				setUser({
					...userData,
					name: userName,
					type: "Student",
					email: userEmail,
					tel: userData.phone || "Not provided",
					pfp_src: userData.profilePicture || "/user_placeholder.png",
					level: userData.level || 1,
					level_progression: userData.levelProgress || 0.5,
					badges: userData.achievements.map(a => a.title) || [],
				});
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}
		loadUserData();
	}, [isAuthenticated]);
	return (
		<div className="p-8 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				Badges and Achievements
			</div>
			<div className="text-xl text-white font-light px-4">
				Track Your Progress and Unlock New Achievements
			</div>
			<div className="grid grid-cols-5 gap-16 p-8">
				{user.badges
					? user.badges.map((b) => (
						<Badge className="scale-150 hover:scale-125 p-4" key={b}>
							{b}
						</Badge>
					))
					: ""}
				{badges.map(badge => (
					<Badge className="scale-150 hover:scale-125 p-4" key={badge.id}>
						{badge.name}
					</Badge>
				))}
			</div>
		</div>
	);
}

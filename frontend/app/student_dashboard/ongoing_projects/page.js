"use client";
import { ProjectCard } from "@/components/ui/project_card";
import { fetchUserData, fetchUserProjects } from "@/lib/api";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function OngoingProjects() {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
	const [ongoingProjects, setOngoingProjects] = useState([]);
	const isAuthenticated = useIsAuthenticated();
	useEffect(() => {
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);

	useEffect(() => {
		async function loadUserData() {
			const userEmail = getEmail();

			const userData = await fetchUserData(userEmail).catch(err => {
								console.error('Error fetching user data:', err);
								return {}; // Default empty object if fetch fails
							});
			const projects = await fetchUserProjects(userData?.projects || []).catch(err => {
									console.error('Error fetching user projects:', err);
									return []; // Return empty array if projects fetch fails
							});

			setOngoingProjects(projects);			
		}
		loadUserData();
		
	}, []);

	// useEffect(() => {
	// 	setOngoingProjects([
	// 		{
	// 			name: "Web Development Portfolio",
	// 			desc: "Create a personal portfolio showcasing your projects",
	// 			level: "Intermediate",
	// 			logo: "PanelTop",
	// 		},
	// 		{
	// 			name: "API Integration Project",
	// 			desc: "Build an Application that integrates external APIs",
	// 			level: "Advanced",
	// 			logo: "PanelTop",
	// 		},
	// 	]);
	// }, [user]);
	return (
		<div className="p-8 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				Ongoing Projects
			</div>
			<div className="text-xl text-white font-light px-4">
				Track Your Current Projects
			</div>
			<div className="grid grid-cols-3 gap-8 text-white p-8">
				{ongoingProjects.length > 0
					? ongoingProjects.map((p, index) => (
							<ProjectCard id={index} project={p} />
						))
					: <h1>No Ongoing Projects</h1>}
			</div>
		</div>
	);
}

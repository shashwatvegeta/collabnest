"use client";
import { fetchUserData } from "@/lib/api";
import { getEmail } from "@/lib/auth_utility";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectApplication() {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const name = searchParams.get("name") || "Project";
	const desc = searchParams.get("desc") || "No description available";
	const level = searchParams.get("level") || "Beginner"; 
	const mentor = searchParams.get("mentor") || "Unknown";
	const [project, setProject] = useState({});
	
	useEffect(() => {
		// Set project from URL parameters
		setProject({
			id,
			name,
			desc,
			level,
			mentor,
			tags: [] // We could pass tags as a comma-separated string and split here
		});
		
		// Optional: Fetch additional project details if needed
		// async function fetchProjectDetails() {
		//   const response = await fetch(`http://localhost:3001/project/${id}`);
		//   if (response.ok) {
		//     const projectData = await response.json();
		//     setProject(projectData);
		//   }
		// }
		// fetchProjectDetails();
	}, [id, name, desc, level, mentor]);

	async function applyHandle(id) {
		console.log("Applying for project", id);
		// Fetch user ID from session or context
		const email =  getEmail();
		const userData = await fetchUserData(email);
		const response = await fetch(`http://localhost:3001/projects/${id}/apply`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user_id: userData._id || "67cecb790e6ac619876a8116",
				resume_link: "google.com"
			})
		});
		
		if(response.ok)
			alert("You have successfully applied for this project!");
		else
			alert("your project application failed. Please try again later.");
	}
	
	return (
		<div className="p-16 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				{project.name}
			</div>
			<div className="text-md text-gray-200 font-semibold p-4">
				Mentor: {project.mentor}
			</div>
			<div className="text-xl text-white font-light p-4">{project.desc}</div>
			<div className="text-lg text-gray-300 p-4">
				Difficulty: {project.level}
			</div>
			<div className="py-8 px-4">
				<button className="text-white font-semibold p-4 rounded-md shadow-lg bg-violet-500" onClick={() => applyHandle(project.id)}>
					Apply For this Project
				</button>
			</div>
		</div>
	);
}

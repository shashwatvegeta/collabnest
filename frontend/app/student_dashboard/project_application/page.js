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
	const tagsParam = searchParams.get("tags");
	const tags = tagsParam ? JSON.parse(decodeURIComponent(tagsParam)) : [];
	const [project, setProject] = useState({
		id,
		name,
		desc,
		level,
		mentor,
		tags
	});

	function isValidURL(str) {
		try {
			new URL(str);
			return true;
		} catch (error) {
			return false;
		}
	}

	const [isSubmitting, setIsSubmitting] = useState(false);

	async function applyHandle(id) {
		// Prevent duplicate submissions
		if (isSubmitting) return;
		
		try {
			setIsSubmitting(true);
			// console.log("Applying for project", id);
			// Fetch user ID from session or context
			const email = getEmail();
			const userData = await fetchUserData(email);
			const resumeLink = document.getElementById("resumeLink").value;
			
			if (isValidURL(resumeLink)) {
				const response = await fetch(`http://localhost:3001/projects/${id}/apply`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						user_id: userData._id || "67cecb790e6ac619876a8116",
						resume_link: resumeLink
					})
				});

				if (response.ok)
					alert("You have successfully applied for this project!");
				else
					alert("Your project application failed. Please try again later.");
			} else {
				alert("Please enter a valid URL");
			}
		} catch (error) {
			console.error("Error applying for project:", error);
			alert("An error occurred while submitting your application. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
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
			<div className="flex flex-wrap gap-2 p-4">
				{project.tags && project.tags.length > 0 ? (
					project.tags.map((tag, index) => (
						<span 
							key={index} 
							className="inline-block bg-violet-900/60 text-violet-200 px-3 py-1 rounded-full text-sm"
						>
							{tag}
						</span>
					))
				) : (
					<span className="text-gray-400 text-sm">No tags available</span>
				)}
			</div>
			<div className="text-lg text-gray-300 p-4">
				<textarea id="resumeLink"
					className="w-full p-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200 min-h-[65px]"
					placeholder="Resume Link"></textarea>
			</div>
			<div className="py-8 px-4">
				<button 
					className={`text-white font-semibold p-4 rounded-md shadow-lg ${isSubmitting ? 'bg-violet-700 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600'}`} 
					onClick={() => applyHandle(project.id)}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Submitting...' : 'Apply For this Project'}
				</button>
			</div>
		</div>
	);
}

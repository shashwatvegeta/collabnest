"use client";
import { ProjectDisplayCard } from "@/components/ui/project_display_card";
import Link from "next/link";
import { useState, useEffect } from "react";

const find_projects = () => {
	const [projects, setProjects] = useState([]);
	const [filteredProjects, setFilteredProjects] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchQuery(value);

		const filteredData = projects.filter((item) => {
			const searchableFields = [
				item.name,
				item.desc,
				...(item.tags || [])
			];
			return searchableFields.some(field => 
				field.toLowerCase().includes(value)
			);
		});

		setFilteredProjects(filteredData);
	};

	useEffect(() => {
		async function fetchProjectData() {
			const response = await fetch("http://localhost:3001/project");
			if (response.ok) {
				const projects = await response.json();
				const formattedProjects = projects.map((project) => ({
					id: project._id,
					name: project.project_name || "Untitled Project",
					desc: project.description || "No description available",
					level: project.level || "Beginner",
					logo: project.logo || "PanelTop",
					tags: project.tags || [],
					mentor: project.project_owner || "Rajiv Mishra"
				}));
				setProjects(formattedProjects);
				setFilteredProjects(formattedProjects);
			}
		}
		fetchProjectData();
	}, []);

	// Update filtered projects when search query changes
	useEffect(() => {
		const value = searchQuery.toLowerCase();
		const filteredData = projects.filter((item) => {
			const searchableFields = [
				item.name,
				item.desc,
				...(item.tags || [])
			];
			return searchableFields.some(field => 
				field.toLowerCase().includes(value)
			);
		});
		setFilteredProjects(filteredData);
	}, [searchQuery, projects]);

	return (
		<div className="p-6 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">Projects</div>
			<div className="text-2xl text-white p-4 font-light">
				Browse and Find Projects Relevant For You
			</div>
			<div className="grid grid-cols-4 gap-8">
				<div className="col-span-4">
					<input
						value={searchQuery}
						onChange={handleSearch}
						placeholder="Search for Projects"
						className="bg-[#2a2a38] border-violet-300 text-white rounded-full outline-none p-4 focus:border"
						style={{ width: "40vw" }}
					/>
				</div>
				{filteredProjects.map((p) => (
					<Link
						href={`/student_dashboard/project_application?id=${p.id}&name=${encodeURIComponent(p.name)}&desc=${encodeURIComponent(p.desc)}&level=${encodeURIComponent(p.level)}&mentor=${encodeURIComponent(p.mentor)}&tags=${encodeURIComponent(JSON.stringify(p.tags))}`}
						key={p.id}
					>
						<ProjectDisplayCard {...p} />
					</Link>
				))}
			</div>
		</div>
	);
};
export default find_projects;

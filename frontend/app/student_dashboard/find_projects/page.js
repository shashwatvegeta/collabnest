"use client";
import { ProjectDisplayCard } from "@/components/ui/project_display_card";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

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
					ownerName: typeof project.project_owner === 'object' ? project.project_owner.name || 'Unknown' : project.project_owner || 'Unknown',
					ownerEmail: typeof project.project_owner === 'object' ? project.project_owner.email || '' : ''
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
					<div key={p.id} className="flex flex-col h-[370px] overflow-hidden border-2 rounded-lg border-violet-400 bg-gradient-to-r from-[#2a283c] to-[#222131]">
						<div className="relative w-full h-36">
							<Image
								alt="Project Cover Image"
								src={p.image || "/project-placeholder.png"}
								layout="fill"
								objectFit="cover"
								className="rounded-t-lg"
							/>
							<div className="absolute top-2 right-2">
								<span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
									{p.level}
								</span>
							</div>
						</div>
						
						<div className="p-4 flex flex-col flex-1">
							<Link href={`/student_dashboard/projects/${p.id}`} className="hover:text-violet-300 transition-colors">
								<h3 className="text-lg text-white font-bold mb-2">{p.name}</h3>
							</Link>
							
							<p className="text-sm text-violet-300 line-clamp-2 mb-2 flex-grow-0">
								{p.desc}
							</p>
							
							<div className="flex flex-wrap gap-1 my-2">
								{(p.tags || []).slice(0, 3).map((tag, index) => (
									<span 
										key={index} 
										className="inline-block bg-violet-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs"
									>
										{tag}
									</span>
								))}
								{(p.tags || []).length > 3 && (
									<span className="inline-block bg-violet-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs">
										+{p.tags.length - 3} more
									</span>
								)}
							</div>
							
							<div className="flex justify-between items-center mt-auto pt-2 border-t border-violet-900/30">
								<p className="font-medium text-xs text-violet-300">
									Owner: {p.ownerName}
									{p.ownerEmail && (
										<span className="block text-xs text-violet-400/70 mt-1">{p.ownerEmail}</span>
									)}
								</p>
								<Link href={`/student_dashboard/projects/${p.id}`} className="text-xs text-violet-300 hover:text-violet-200">
									Details →
								</Link>
							</div>
						</div>
						
						<div className="px-4 pb-4 mt-auto">
							<Link
								href={`/student_dashboard/project_application?id=${p.id}&name=${encodeURIComponent(p.name)}&desc=${encodeURIComponent(p.desc)}&level=${encodeURIComponent(p.level)}&mentor=${encodeURIComponent(p.ownerName)}&tags=${encodeURIComponent(JSON.stringify(p.tags))}`}
								className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-xl"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								<span>Apply Now</span>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default find_projects;

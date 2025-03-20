"use client";
import { useEffect, useState } from "react";
import { getEmail } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect, useRouter } from "next/navigation";
import { fetchUserData, fetchUserProjects } from "@/lib/api";

export default function OngoingProjects() {
	const [projects, setProjects] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [email, setEmail] = useState("");
	const isAuthenticated = useIsAuthenticated();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);

	useEffect(() => {
		setEmail(getEmail());
	}, []);

	useEffect(() => {
		if (email) {
			fetchProjects();
			
			// Set up polling to refresh projects data every 30 seconds
			const intervalId = setInterval(() => {
				fetchProjects(false); // Pass false to not show loading state during refresh
			}, 30000);
			
			return () => clearInterval(intervalId); // Clean up interval on component unmount
		}
	}, [email]);

	const fetchProjects = async (showLoading = true) => {
		if (!email) return;
		
		if (showLoading) {
			setIsLoading(true);
		}
		
		try {
			const userData = await fetchUserData(email);
			if (userData && userData._id) {
				const userProjects = await fetchUserProjects(userData.projects || []);
				setProjects(userProjects);
			}
		} catch (error) {
			console.error("Error fetching projects:", error);
		} finally {
			// Add a small delay to simulate loading and then trigger animations
			setTimeout(() => {
				setIsLoaded(true);
				setIsLoading(false);
			}, showLoading ? 300 : 0);
		}
	};

	const handleRefresh = () => {
		fetchProjects();
	};

	return (
		<div className="p-4 sm:p-6 md:p-8 pl-24 md:pl-28 min-h-screen">
			<div className="flex justify-between items-center p-2 sm:p-4">
				<div className={`text-xl sm:text-2xl text-violet-400 font-semibold transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
					Ongoing Projects
				</div>
				<div className={`flex space-x-3 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-200`}>
					<button 
						onClick={handleRefresh}
						disabled={isLoading}
						className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{isLoading ? 'Refreshing...' : 'Refresh'}
					</button>
				</div>
			</div>
			
			<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6`}>
				{isLoading && projects.length === 0 ? (
					<div className="col-span-full text-center p-8">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
						<div className="mt-4 text-violet-300">Loading projects...</div>
					</div>
				) : projects.length > 0 ? (
					projects.map((project, index) => (
						<div
							key={project._id}
							className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
							style={{ transitionDelay: `${index * 100}ms` }}
						>
							<div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 overflow-hidden hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300">
								<div className="p-4">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-white">{project.project_name}</h3>
										<div className={`text-xs font-medium px-2 py-1 rounded-full ${
											project.is_approved === 'approved' 
												? 'bg-green-500/20 text-green-300 border border-green-500/30' 
												: project.is_approved === 'rejected'
												? 'bg-red-500/20 text-red-300 border border-red-500/30'
												: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
										}`}>
											{project.is_approved === 'approved' 
												? 'Approved' 
												: project.is_approved === 'rejected'
												? 'Rejected'
												: 'Pending'}
										</div>
									</div>
									
									<p className="text-purple-200 text-sm mb-3 line-clamp-2">{project.description}</p>
									
									<div className="grid grid-cols-2 gap-2 text-xs text-purple-300 mb-3">
										<div>
											<span className="block text-violet-400">Capacity</span>
											{project.cap} Students
										</div>
										<div>
											<span className="block text-violet-400">Timeline</span>
											{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
										</div>
									</div>
									
									{/* Display project tags */}
									{project.tags && project.tags.length > 0 && (
										<div className="mb-3">
											<span className="block text-xs text-violet-400 mb-1">Technologies</span>
											<div className="flex flex-wrap gap-1">
												{project.tags.slice(0, 3).map((tag, idx) => (
													<span key={idx} className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full">
														{tag}
													</span>
												))}
												{project.tags.length > 3 && (
													<span className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-full">
														+{project.tags.length - 3} more
													</span>
												)}
											</div>
										</div>
									)}
									
									<div className="flex space-x-2">
										<button 
											onClick={() => router.push(`/student_dashboard/projects/${project._id}`)}
											className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300"
										>
											View Details
										</button>
										<button 
											onClick={() => router.push(`/student_dashboard/projects/${project._id}/tasks`)}
											className="flex-1 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-colors duration-300"
										>
											Tasks
										</button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full text-center p-8 bg-[#2a2a38] rounded-lg border-2 border-violet-300/30">
						<div className="text-gray-400 text-lg">No ongoing projects</div>
						<div className="text-purple-300 text-sm mt-2">You haven't been enrolled in any projects yet.</div>
						<button 
							onClick={() => router.push('/student_dashboard/find_projects')}
							className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg shadow-md hover:bg-violet-600 transition-all duration-300"
						>
							Find Projects
						</button>
					</div>
				)}
			</div>

			{/* Add global CSS for custom animations */}
			<style jsx global>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				
				.animate-fadeIn {
					animation: fadeIn 0.5s ease-in-out;
				}
			`}</style>
		</div>
	);
}

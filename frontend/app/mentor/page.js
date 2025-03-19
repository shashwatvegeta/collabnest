"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEmail, getName } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { ProjectCard } from "@/components/ui/project_card";

const NotificationItem = ({ title, message, isImportant }) => {
	return (
		<div className="bg-indigo-900/40 p-4 rounded-lg mb-2 hover:bg-indigo-900/60 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
			<div className="flex">
				<div className="flex-1">
					<div className="font-semibold text-white flex">
						{title}{" "}
						{isImportant && (
							<span className="text-pink-400 ml-1 animate-pulse">•</span>
						)}
					</div>
					<div className="text-sm text-purple-200">{message}</div>
				</div>
			</div>
		</div>
	);
};

const RequestItem = ({ name, projectName, projectType }) => {
	return (
		<div className="bg-indigo-900/40 p-4 rounded-lg mb-2 hover:bg-indigo-900/60 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
			<div className="flex">
				<div className="flex-1">
					<div className="font-semibold text-white flex">
						{name} <span className="text-pink-400 ml-1 animate-pulse">•</span>
					</div>
					<div className="text-sm text-purple-200">
						Project Name: {projectType}
					</div>
				</div>
			</div>
		</div>
	);
};

const MDashboard = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
	const [ongoingProjects, setOngoingProjects] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [requests, setRequests] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const isAuthenticated = useIsAuthenticated();

	useEffect(() => {
		setName(getName());
		setEmail(getEmail());
	}, []);

	useEffect(() => {
		setUser({
			name: name,
			type: "MENTOR",
			email: email,
			tel: "1234567",
			pfp_src: "/user_placeholder.png",
		});
	}, [email, name]);

	useEffect(() => {
		const fetchProjectsTasksAndApplications = async () => {
			try {
				// Fetch projects
				const projectResponse = await fetch("http://localhost:3001/project");
				if (!projectResponse.ok) {
					throw new Error("Failed to fetch projects");
				}
				const allProjects = await projectResponse.json();
				console.log("Fetched Projects:", allProjects);
				
				// Filter projects where the current mentor is the project_owner
				const mentorProjects = allProjects.filter(project => 
					project.project_owner === email || project.mentor_email === email
				);
				
				setOngoingProjects(mentorProjects);

				// Fetch tasks for each project
				const taskPromises = mentorProjects.map(async (project) => {
					const taskResponse = await fetch(
						`http://localhost:3001/projects/${project._id}/tasks`,
					);
					if (!taskResponse.ok) {
						throw new Error(`Failed to fetch tasks for project ${project._id}`);
					}
					return taskResponse.json();
				});

				const tasksArray = await Promise.all(taskPromises);
				const allTasks = tasksArray.flat(); // Flatten array of task arrays

				// Map tasks into notifications
				const taskNotifications = allTasks.map((task) => ({
					title: `Task: ${task.title}`,
					message: task.description || "No description provided",
					isImportant: task.status === "urgent", // Example condition
				}));

				// Mock notifications until the backend is implemented
				setNotifications([
					...taskNotifications,
					{
						title: "Project Progress Update",
						message: "The Project progress has been updated as per the latest sprint review.",
						isImportant: true,
					},
					{
						title: "New Application",
						message: "A new student has applied to join your project team.",
						isImportant: true,
					},
					{
						title: "Request for Access",
						message: "A student has requested access to the project repository.",
						isImportant: false,
					},
				]);

				// Fetch applications for each project
				const applicationPromises = mentorProjects.map(async (project) => {
					const appResponse = await fetch(
						`http://localhost:3001/projects/${project._id}/applications`,
					);
					if (!appResponse.ok) {
						throw new Error(
							`Failed to fetch applications for project ${project._id}`,
						);
					}
					return appResponse.json();
				});

				const applicationsArray = await Promise.all(applicationPromises);
				const allApplications = applicationsArray.flat(); // Flatten array of applications

				// Map applications into requests
				const applicationRequests = allApplications.map((app) => ({
					name: app.applicantName || "Unknown Applicant", // Assuming applicant name is available in response
					projectName: app.projectName || "Unknown Project",
					projectType: app.projectType || "General",
				}));

				setRequests(applicationRequests); // Set requests based on fetched applications
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchProjectsTasksAndApplications();

		// Add a small delay to simulate loading and then trigger animations
		setTimeout(() => {
			setIsLoaded(true);
		}, 300);
	}, [user]);

	return (
		<div className="p-4 sm:p-6 md:p-8 pl-24 md:pl-28 h-screen">
			<div
				className={`text-xl sm:text-2xl text-violet-400 p-2 sm:p-4 font-semibold transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
			>
				Dashboard
			</div>
			<div
				className={`text-xl sm:text-2xl text-white font-bold p-2 sm:p-4 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-100`}
			>
				Welcome Back, {user.name}!
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
				<div
					className={`flex flex-col sm:flex-row col-span-1 md:col-span-2 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-200`}
				>
					{user.pfp_src ? (
						<div className="relative mx-auto sm:mx-4 md:mx-8 w-[85px] h-[85px] rounded-full overflow-hidden shadow-lg shadow-violet-500/30 ring-2 ring-purple-400 transform hover:scale-105 transition-all duration-300">
							<Image
								className="object-cover"
								src={user.pfp_src}
								alt="User Profile"
								fill
								sizes="85px"
								priority
							/>
						</div>
					) : (
						<div className="relative mx-auto sm:mx-4 md:mx-8 w-[85px] h-[85px] rounded-full overflow-hidden shadow-lg shadow-violet-500/30 ring-2 ring-purple-400 transform hover:scale-105 transition-all duration-300">
							<Image
								className="object-cover"
								src="/logo.png"
								alt="User Profile"
								fill
								sizes="85px"
								priority
							/>
						</div>
					)}
					<div className="place-content-center mt-4 sm:mt-0 text-center sm:text-left">
						<div className="font-semibold text-lg sm:text-xl text-white">
							{user.name} ·{" "}
							<p className="inline uppercase text-teal-400 hover:text-teal-300 transition-colors duration-300">
								{user.type}
							</p>
						</div>
						<div className="text-sm text-purple-200">
							{user.email} - {user.tel}
						</div>
					</div>
				</div>

				{/* Ongoing Projects Section */}
				<div
					className={`border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38] md:row-span-2 shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-300`}
				>
					<div className="font-semibold bg-violet-400 p-3 sm:p-4 flex flex-col sm:flex-row items-center rounded-t-lg">
						<div className="flex-1 text-xl sm:text-2xl mb-2 sm:mb-0">Ongoing Projects</div>
						<Link href="/mentor/projects">
							<button className="px-4 py-2 bg-indigo-950 text-sm rounded-lg hover:bg-indigo-800 transition-colors duration-300 transform hover:scale-105 w-full sm:w-auto">
								View All
							</button>
						</Link>
					</div>
					<div className="grid gap-2 p-2">
						{ongoingProjects.length > 0 ? (
							ongoingProjects.map((project, index) => (
								<div
									key={index}
									className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
									style={{ transitionDelay: `${400 + index * 100}ms` }}
								>
									<ProjectCard project={project} id={project._id} />
								</div>
							))
						) : (
							<div className="text-center p-4 text-gray-400">No projects found</div>
						)}
					</div>
				</div>

				{/* Notifications Section */}
				<div
					className={`border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38] shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-400`}
				>
					<div className="font-semibold p-3 sm:p-4 bg-white text-black rounded-t-lg">
						<div className="text-xl">Notifications</div>
					</div>
					<div className="p-3 sm:p-4">
						{notifications.length > 0 ? (
							notifications.map((notification, index) => (
								<div
									key={index}
									className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
									style={{ transitionDelay: `${800 + index * 100}ms` }}
								>
									<NotificationItem {...notification} />
								</div>
							))
						) : (
							<div className="text-center p-4 text-gray-400">No notifications found</div>
						)}
						<div
							className={`text-center mt-4 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
							style={{ transitionDelay: "1000ms" }}
						>
							<Link href="/mentor/notifications">
								<button className="w-full px-4 py-2 bg-indigo-600 text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
									View All
								</button>
							</Link>
						</div>
					</div>
				</div>

				{/* Requests Section */}
				<div
					className={`border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38] shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-500`}
				>
					<div className="font-semibold p-3 sm:p-4 bg-white text-black rounded-t-lg">
						<div className="text-xl">Requests</div>
					</div>
					<div className="p-3 sm:p-4">
						{requests.length > 0 ? (
							requests.map((request, index) => (
								<div
									key={index}
									className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
									style={{ transitionDelay: `${1100 + index * 100}ms` }}
								>
									<RequestItem {...request} />
								</div>
							))
						) : (
							<div className="text-center p-4 text-gray-400">No requests found</div>
						)}
						<div
							className={`text-center mt-4 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
							style={{ transitionDelay: "1300ms" }}
						>
							<button className="w-full px-4 py-2 bg-indigo-600 text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
								View All
							</button>
						</div>
					</div>
				</div>
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
};

export default MDashboard;

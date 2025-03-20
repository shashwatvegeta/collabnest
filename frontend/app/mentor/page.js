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
						Project Name: {projectName}
					</div>
					<div className="text-xs text-purple-300 mt-1">
						Type: {projectType}
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
				
				// Filter projects where the current mentor is the project_owner
				const mentorProjects = allProjects.filter(project => 
					project.project_owner === email || project.mentor_email === email
				);
				
				// Create a map of project IDs to project names for quick lookup
				const projectMap = {};
				allProjects.forEach(project => {
					projectMap[project._id] = project.project_name;
				});
				
				// Limit to 5 projects for the dashboard
				setOngoingProjects(mentorProjects.slice(0, 5));

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
					const applications = await appResponse.json();
					
					// Add project name to each application for reference
					return applications.map(app => ({
						...app,
						projectName: project.project_name
					}));
				});

				const applicationsArray = await Promise.all(applicationPromises);
				const allApplications = applicationsArray.flat();
				
				console.log("Fetched applications:", allApplications);

				// Filter pending applications
				const pendingApplications = allApplications.filter(app => app.status === 'pending');

				// Create notifications from pending applications
				const applicationNotifications = pendingApplications.map(app => {
					const userName = app.user_id?.username || "A student";
					const projectName = app.projectName || 
									  (app.project_id && typeof app.project_id === 'object' 
									   ? app.project_id.project_name 
									   : projectMap[app.project_id] || "a project");
					
					return {
						title: "New Application",
						message: `${userName} has applied to join ${projectName}`,
						isImportant: true
					};
				});

				// Create requests from pending applications
				const applicationRequests = pendingApplications.map(app => {
					const userName = app.user_id?.username || "A student";
					const projectName = app.projectName || 
									  (app.project_id && typeof app.project_id === 'object' 
									   ? app.project_id.project_name 
									   : projectMap[app.project_id] || "a project");
					
					return {
						name: userName,
						projectName: projectName,
						projectType: app.project_id?.tags ? app.project_id.tags.join(', ') : "General"
					};
				});

				// Fetch real notifications from the backend
				try {
					const notificationResponse = await fetch(`http://localhost:3001/notifications/received/${email}`);
					if (notificationResponse.ok) {
						const notificationData = await notificationResponse.json();
						if (notificationData.notifications && notificationData.notifications.length > 0) {
							// Transform backend notifications to the format expected by the UI
							const formattedNotifications = notificationData.notifications.map(notification => ({
								title: "Notification",
								message: notification.message,
								isImportant: !notification.readBy || notification.readBy.length === 0
							}));
							
							// Combine application notifications with system notifications
							const allNotifications = [...formattedNotifications, ...applicationNotifications];
							
							// Get only two notifications for the dashboard
							setNotifications(allNotifications.slice(0, 2));
						} else {
							// If no system notifications, use application notifications
							setNotifications(applicationNotifications.slice(0, 2));
						}
					} else {
						throw new Error("Failed to fetch notifications");
					}
				} catch (notificationError) {
					console.error("Error fetching notifications:", notificationError);
					// Use application notifications as fallback
					setNotifications(applicationNotifications.slice(0, 2));
				}

				// Set requests (limit to 2)
				const limitedRequests = applicationRequests.length > 0 
					? applicationRequests.slice(0, 2) 
					: [
						{
							name: "No pending requests",
							projectName: "No projects",
							projectType: "N/A"
						}
					];

				setRequests(limitedRequests);

			} catch (error) {
				console.error("Error fetching data:", error);
				// Set fallback data for notifications and requests
				setNotifications([
					{
						title: "System Error",
						message: "Failed to load notifications",
						isImportant: true
					}
				]);
				setRequests([
					{
						name: "Error",
						projectName: "Failed to load requests",
						projectType: "N/A"
					}
				]);
			}
		};

		fetchProjectsTasksAndApplications();

		// Add a small delay to simulate loading and then trigger animations
		setTimeout(() => {
			setIsLoaded(true);
		}, 300);
	}, [user]);

	return (
		<div className="p-2 sm:p-4 md:p-6 pl-4 sm:pl-8 md:pl-16 lg:pl-28 h-screen">
			<div
				className={`text-lg sm:text-xl text-violet-400 p-1 sm:p-2 font-semibold transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
			>
				Dashboard
			</div>
			<div
				className={`text-lg sm:text-xl text-white font-bold p-1 sm:p-2 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-100`}
			>
				Welcome Back, {user.name}!
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
				<div
					className={`flex flex-col sm:flex-row col-span-1 md:col-span-2 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-700 delay-200`}
				>
					{user.pfp_src ? (
						<div className="relative mx-auto sm:mx-2 md:mx-4 w-[70px] h-[70px] rounded-full overflow-hidden shadow-lg shadow-violet-500/30 ring-2 ring-purple-400 transform hover:scale-105 transition-all duration-300">
							<Image
								className="object-cover"
								src={user.pfp_src}
								alt="User Profile"
								fill
								sizes="70px"
								priority
							/>
						</div>
					) : (
						<div className="relative mx-auto sm:mx-2 md:mx-4 w-[70px] h-[70px] rounded-full overflow-hidden shadow-lg shadow-violet-500/30 ring-2 ring-purple-400 transform hover:scale-105 transition-all duration-300">
							<Image
								className="object-cover"
								src="/logo.png"
								alt="User Profile"
								fill
								sizes="70px"
								priority
							/>
						</div>
					)}
					<div className="place-content-center mt-2 sm:mt-0 text-center sm:text-left">
						<div className="font-semibold text-base sm:text-lg text-white">
							{user.name} ·{" "}
							<p className="inline uppercase text-teal-400 hover:text-teal-300 transition-colors duration-300">
								{user.type}
							</p>
						</div>
						<div className="text-xs sm:text-sm text-purple-200">
							{user.email} - {user.tel}
						</div>
					</div>
				</div>

				{/* Ongoing Projects Section */}
				<div
					className={`border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38] md:row-span-2 shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-300`}
				>
					<div className="font-semibold bg-violet-400 p-2 sm:p-3 flex flex-col sm:flex-row items-center rounded-t-lg">
						<div className="flex-1 text-lg sm:text-xl mb-1 sm:mb-0">Ongoing Projects</div>
						<Link href="/mentor/projects">
							<button className="px-3 py-1.5 bg-indigo-950 text-xs sm:text-sm rounded-lg hover:bg-indigo-800 transition-colors duration-300 transform hover:scale-105 w-full sm:w-auto">
								View All
							</button>
						</Link>
					</div>
					<div className="grid gap-1 p-1">
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
							<div className="text-center p-2 text-gray-400 text-sm">No projects found</div>
						)}
					</div>
				</div>

				{/* Notifications Section */}
				<div
					className={`border-2 rounded-lg border-violet-300 text-white bg-[#2a2a38] shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-400`}
				>
					<div className="font-semibold p-2 sm:p-3 bg-white text-black rounded-t-lg">
						<div className="text-lg">Notifications</div>
					</div>
					<div className="p-2 sm:p-3">
						{notifications.length > 0 ? (
							notifications.slice(0, 2).map((notification, index) => (
								<div
									key={index}
									className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
									style={{ transitionDelay: `${800 + index * 100}ms` }}
								>
									<NotificationItem {...notification} />
								</div>
							))
						) : (
							<div className="text-center p-2 text-gray-400 text-sm">No notifications found</div>
						)}
						<div
							className={`text-center mt-2 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
							style={{ transitionDelay: "1000ms" }}
						>
							<Link href="/mentor/notifications">
								<button className="w-full px-3 py-1.5 bg-indigo-600 text-xs sm:text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
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
					<div className="font-semibold p-2 sm:p-3 bg-white text-black rounded-t-lg">
						<div className="text-lg">Requests</div>
					</div>
					<div className="p-2 sm:p-3">
						{requests.length > 0 ? (
							requests.slice(0, 2).map((request, index) => (
								<div
									key={index}
									className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
									style={{ transitionDelay: `${1100 + index * 100}ms` }}
								>
									<RequestItem {...request} />
								</div>
							))
						) : (
							<div className="text-center p-2 text-gray-400 text-sm">No requests found</div>
						)}
						<div
							className={`text-center mt-2 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
							style={{ transitionDelay: "1300ms" }}
						>
							<button className="w-full px-3 py-1.5 bg-indigo-600 text-xs sm:text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
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

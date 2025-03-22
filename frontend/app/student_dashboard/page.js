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
import XpLevelDisplay from "@/components/XpLevelDisplay";

const SDashboard = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
	const [userId, setUserId] = useState(null);
	const [allProjects, setAllProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [levelData, setLevelData] = useState(null);

	const [recommendedProjects, setRecommendedProjects] = useState([]);
	const [ongoingProjects, setOngoingProjects] = useState([]);
	const isAuthenticated = useIsAuthenticated();

	const availableBadges = [
		{ id: 1, name: "First Project", image: "/badges/cup.png", description: "Complete your first project" },
		{ id: 2, name: "Fast Learner", image: "/badges/star.png", description: "Complete 3 projects" },
		{ id: 3, name: "Team Player", image: "/badges/team.png", description: "Collaborate in 2 projects" },
		{ id: 4, name: "Code Master", image: "/badges/code.png", description: "Complete 5 projects" },
		{ id: 5, name: "Mentor's Choice", image: "/badges/mentor.png", description: "Get recognized by a mentor" }
	];

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
				const userData = await fetchUserData(userEmail).catch(err => {
					console.error('Error fetching user data:', err);
					return {}; // Default empty object if fetch fails
				});
        
				// Fetch projects and achievements in parallel
				const [projects, achievements] = await Promise.all([
					fetchUserProjects(userData?.projects || []).catch(err => {
						console.error('Error fetching user projects:', err);
						return []; // Return empty array if projects fetch fails
					}),
					fetchUserAchievements(userData?._id || '').catch(err => {
						console.error('Error fetching user achievements:', err);
						return []; // Return empty array if achievements fetch fails
					})
				]);

				setUser({
					...userData,
					name: userName || 'User',
					type: "Student",
					email: userEmail || 'No email available',
					tel: userData?.phone || "1010101",
					pfp_src: userData?.profilePicture || "/user_placeholder.png",
					level: userData?.level || 1,
					level_progression: userData?.levelProgress || 0.5,
					badges: (achievements || []).map(a => a?.title || 'Unnamed Badge'),
				});

				setOngoingProjects(projects || []);
				const allProj=await fetchProjectData();
				const recommendations = getRecommendations(projects, allProj)
				console.log(recommendations)
				setRecommendedProjects(recommendations || []);

				if (userData && userData._id) {
					console.log("User ID from API:", userData._id);
					setUserId(userData._id);
					
					// Fetch user level data from gamification service
					let levelInfo = null;
					try {
						const levelResponse = await fetch(`http://localhost:3001/users/${userData._id}/gamification/level`);
						if (levelResponse.ok) {
							levelInfo = await levelResponse.json();
							console.log("Fetched level data:", levelInfo);
							setLevelData(levelInfo);
						} else {
							console.error("Failed to fetch level data:", await levelResponse.text());
						}
					} catch (levelErr) {
						console.error("Error fetching level data:", levelErr);
					}

					// Fetch projects and achievements in parallel
					const [projects, achievements] = await Promise.all([
						fetchUserProjects(userData?.projects || []).catch(err => {
							console.error('Error fetching user projects:', err);
							return []; // Return empty array if projects fetch fails
						}),
						fetchUserAchievements(userData?._id || '').catch(err => {
							console.error('Error fetching user achievements:', err);
							return []; // Return empty array if achievements fetch fails
						})
					]);

					// Calculate level progression based on XP and nextLevelXP
					const level = levelInfo?.level || 1;
					const xp = levelInfo?.xp || 0;
					const nextLevelXp = levelInfo?.nextLevelXp || 600;
					const levelProgression = nextLevelXp > 0 ? xp / nextLevelXp : 0;

					setUser({
						...userData,
						name: userName || 'User',
						type: "Student",
						email: userEmail || 'No email available',
						tel: userData?.phone || "1010101",
						pfp_src: userData?.profilePicture || "/user_placeholder.png",
						level: level,
						level_progression: levelProgression,
						xp: xp,
						nextLevelXp: nextLevelXp,
						badges: (achievements || []).map(a => a?.title || 'Unnamed Badge'),
					});

					setOngoingProjects(projects || []);
				} else {
					console.error("Failed to get valid user ID:", userData);
				}
			} catch (err) {
				setError(err.message);
				console.error('Error loading user data:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadUserData();
	}, [isAuthenticated]);
	const getRecommendations = (userProjects, allProjectsLocal) => {
		// console.log(userProjects);
		// console.log(allProjectsLocal);
		let userTags = [];
		let userProjIds = [];
	
		for (let proj of userProjects) {
		  // console.log(proj.tags);
		  userTags = userTags.concat(proj.tags);
		  userProjIds.push(proj._id);
		}
		for (let i = 0; i < userTags.length; i++) {
		  userTags[i] = userTags[i].toLowerCase();
		}
		for (let i = 0; i < allProjectsLocal.length; i++) {
		  let proj = allProjectsLocal[i];
		  // console.log(userProjIds, proj, proj.id, userProjIds.includes(proj.id));
		  if (userProjIds.includes(proj.id)) {
			allProjectsLocal[i].similarity = -100;
			continue;
		  }
		  proj.similarity = 0;
		  for (let tag of proj.tags) {
			let tagLower = tag.toLowerCase();
			// console.log(userTags.includes(tagLower), "saala", tagLower, userTags);
			if (userTags.includes(tagLower)) {
			  // console.log(allProjectsLocal[i]);
			  allProjectsLocal[i].similarity++;
			  // console.log(allProjectsLocal[i]);
			}
		  }
		}
		allProjectsLocal.sort((a, b) => {
		  return b.similarity - a.similarity;
		});
		console.log(allProjectsLocal, userTags);
		return allProjectsLocal.slice(0, 5);
	  };
	
	  async function fetchProjectData() {
		const response = await fetch("http://localhost:3001/project");
		if (response.ok) {
		  const projects = await response.json();
		  // console.log(projects)
		  const formattedProjects = projects.map((project) => ({
			id: project._id,
			name: project.project_name || "Untitled Project",
			desc: project.description || "No description available",
			level: project.level || "Beginner",
			logo: project.logo || "PanelTop",
			tags: project.tags || [],
			mentor: project.project_owner || "Rajiv Mishra",
		  }));
		  console.log("am i being too arrogant?", formattedProjects);
		  setAllProjects(formattedProjects);
		  return formattedProjects;
		}
	  }
	// When levelData changes, update the user object with new level info
	useEffect(() => {
		if (levelData && userId) {
			const level = levelData.level || 1;
			const xp = levelData.xp || 0;
			const nextLevelXp = levelData.nextLevelXp || 600;
			const levelProgression = nextLevelXp > 0 ? xp / nextLevelXp : 0;
			
			setUser(prevUser => ({
				...prevUser,
				level: level,
				level_progression: levelProgression,
				xp: xp,
				nextLevelXp: nextLevelXp
			}));
		}
	}, [levelData, userId]);

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
		<div className="p-8 pb-24 h-screen overflow-y-auto">
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
						{(recommendedProjects || []).length > 0 ? (
							recommendedProjects.map((p, index) => (
								<Link
									key={index}
									href={`/student_dashboard/projects/${p.id}`}
									className="block cursor-pointer"
								>
									<div className="bg-[#222131] p-3 rounded-lg hover:bg-[#2d2c40] transition-all duration-300 transform hover:-translate-y-1">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-semibold text-violet-300">{p.name}</h3>
												<p className="text-sm text-gray-300 mt-1 line-clamp-2">{p.desc}</p>
												
												{/* Tags Section */}
												<div className="flex flex-wrap gap-1 mt-2">
													{(p.tags || []).map((tag, tagIndex) => (
														<span 
															key={tagIndex} 
															className="inline-block bg-violet-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs"
														>
															{tag}
														</span>
													))}
												</div>
											</div>
											<div className="ml-2 flex flex-col items-end">
												<span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">{p.level}</span>
												{p.similarity > 0 && (
													<div className="mt-1 text-xs text-green-400 flex items-center">
														<span className="mr-1">+{p.similarity}</span>
														<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
															<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
														</svg>
													</div>
												)}
												<div className="text-xs text-violet-300 mt-2">View Details →</div>
											</div>
										</div>
									</div>
								</Link>
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
									{user.level || 1}
								</div>
								<div className="font-bold text-lg flex-1">
									Level {user.level || 1}
								</div>
								<div className="text-xs translate-y-[8px]">
									{user.xp || 0} / {user.nextLevelXp || 600} XP
								</div>
							</div>
							<div>
								<span
									role="progressbar"
									aria-labelledby="ProgressLabel"
									aria-valuenow={Math.round((user.level_progression || 0) * 100)}
									className="relative block rounded-full bg-gray-400"
								>
									<span
										className="block h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-center"
										style={{ width: `${Math.min(100, Math.round((user.level_progression || 0) * 100))}%` }}
									></span>
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center mb-4">
							<div className="text-lg font-semibold">
								Badges Earned
							</div>
							<Link href="/student_dashboard/badges">
								<button className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-200">
									View all →
								</button>
							</Link>
						</div>
					</div>
					<div className="space-y-6">
						<div>
							<h3 className="text-sm font-medium text-violet-300 mb-3">Your Achievements</h3>
							<div className="grid grid-cols-3 gap-4">
								{user.badges && user.badges.length > 0 ? (
									user.badges.map((badge, index) => (
										<div key={`earned-${index}`} className="relative group">
											<div className="bg-indigo-900/40 rounded-xl p-3 hover:bg-indigo-900/60 transition-all duration-300 transform hover:-translate-y-1">
												<div className="flex flex-col items-center">
													<div className="relative w-16 h-16 mb-2">
														<Image
															src={availableBadges.find(b => b.name === badge)?.image || "/badges/cup.png"}
															alt={badge}
															fill
															className="object-contain"
															onError={(e) => {
																e.target.src = "/badges/cup.png";
															}}
														/>
														<div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse"></div>
													</div>
													<span className="text-xs font-medium text-center text-white">{badge}</span>
												</div>
											</div>
											<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
												{availableBadges.find(b => b.name === badge)?.description || "Achievement badge"}
											</div>
										</div>
									))
								) : (
									<div className="col-span-3 text-center text-gray-400 py-4 bg-gray-800/20 rounded-lg">
										No badges earned yet
									</div>
								)}
							</div>
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
							{(ongoingProjects || []).length > 0 ? (
								ongoingProjects.slice(0, 2).map((p, index) => (
									<Link 
										key={index} 
										href={`/student_dashboard/projects/${p._id}`}
										className="block cursor-pointer"
									>
										<div className="rounded-lg overflow-hidden flex bg-[#222131] mb-2 h-full shadow-md hover:bg-[#2a2a38] transition-all duration-300 transform hover:-translate-y-1">
											<div className="bg-violet-400 w-12 flex items-center justify-center">
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect width="24" height="24" rx="4" fill="white" fillOpacity="0.2" />
													<path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" stroke="white" strokeWidth="2" />
													<path d="M4 13a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" stroke="white" strokeWidth="2" />
												</svg>
											</div>
											<div className="p-2 flex flex-col justify-between flex-1">
												<div>
													<div className="font-medium text-white text-sm mb-1">{p.project_name}</div>
													<div className="text-xs text-gray-300 line-clamp-2">{p.description}</div>
													
													{/* Tags Section */}
													<div className="flex flex-wrap gap-1 mt-2">
														{(p.tags || []).slice(0, 3).map((tag, tagIndex) => (
															<span 
																key={tagIndex} 
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
												</div>
												<div className="flex justify-between items-center mt-2">
													<button className="text-xs py-0.5 px-3 rounded-md bg-blue-600 text-white">
														{p.is_approved === 'approved' 
															? 'Approved' 
															: p.is_approved === 'rejected' 
															? 'Rejected' 
															: 'Pending'
														}
													</button>
													<span className="text-xs text-violet-300 mr-2">View Details →</span>
												</div>
											</div>
										</div>
									</Link>
								))
							) : (
								<div className="text-center text-gray-400 py-4">No ongoing projects</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{userId && (
				<div className="mt-4">
					<h2 className="text-lg font-semibold text-white mb-2">Experience Level</h2>
					<XpLevelDisplay userId={userId} />
				</div>
			)}
		</div>
	);
};

export default SDashboard;

"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ui/project_card";
import Link from "next/link";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";

const SDashboard = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");

	const [recommendedProjects, setRecommendedProjects] = useState([]);
	const [ongoingProjects, setOngoingProjects] = useState([]);
	const isAuthenticated = useIsAuthenticated();

	useEffect(() => {
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);

	useEffect(() => {
		setName(getName());
	}, []);
	useEffect(() => {
		setEmail(getEmail());
	}, []);
	useEffect(() => {
		setUser({
			name: name,
			type: "Student",
			email: email,
			tel: "987654321",
			pfp_src: "/user_placeholder.png",
			level: 5,
			level_progression: 0.72,
			badges: ["First Badge", "Quick Learner", "Team Player"],
		});
	}, [email, name]);
	useEffect(() => {
		setRecommendedProjects([
			{
				id: 1,
				name: "Web Development Portfolio",
				desc: "Create a personal portfolio showcasing your projects",
				level: "Intermediate",
				logo: "PanelTop",
			},
			{
				id: 2,
				name: "API Integration Project",
				desc: "Build an Application that integrates external APIs",
				level: "Advanced",
				logo: "PanelTop",
			},
			{
				id: 3,
				name: "API Integration Project",
				desc: "Build an Application that integrates external APIs",
				level: "Advanced",
				logo: "PanelTop",
			},
			{
				id: 4,
				name: "API Integration Project",
				desc: "Build an Application that integrates external APIs",
				level: "Advanced",
				logo: "PanelTop",
			},
		]);
	}, [user]);
	useEffect(() => {
		setOngoingProjects([
			{
				id: 5,
				name: "Web Development Portfolio",
				desc: "Create a personal portfolio showcasing your projects",
				level: "Intermediate",
				logo: "PanelTop",
			},
			{
				id: 6,
				name: "API Integration Project",
				desc: "Build an Application that integrates external APIs",
				level: "Advanced",
				logo: "PanelTop",
			},
		]);
	}, [user]);
	return (
		<div className="p-8 h-screen">
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
					<div className="grid gap-2 p-4">
						{recommendedProjects
							? recommendedProjects
									.slice(0, 4)
									.map((p, index) => <ProjectCard key={index} {...p} />)
							: ""}
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
									{user.level}
								</div>
								<div className="font-bold text-lg flex-1">
									Level {user.level}
								</div>
								<div className="text-xs translate-y-[8px]">
									{user.level_progression * 100}%
								</div>
							</div>
							<div>
								<span
									role="progressbar"
									aria-labelledby="ProgressLabel"
									aria-valuenow="75"
									className="relative block rounded-full bg-gray-400"
								>
									<span
										className="block h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-center"
										style={{ width: user.level_progression * 100 + "%" }}
									></span>
								</span>
							</div>
						</div>
						<div className="flex">
							<div className="text-lg font-semibold py-2 flex-1">
								Badges Earned
							</div>
							<Link href="/student_dashboard/badges">
								<div className="py-2 text-sm underline">View all</div>
							</Link>
						</div>
						<div className="grid grid-cols-5 gap-4">
							{user.badges
								? user.badges.slice(0, 5).map((b) => <Badge key={b}>{b}</Badge>)
								: ""}
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
						<div className="grid gap-2 pt-4">
							{ongoingProjects
								? ongoingProjects
										.slice(0, 2)
										.map((p, index) => <ProjectCard key={index} {...p} />)
								: ""}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SDashboard;

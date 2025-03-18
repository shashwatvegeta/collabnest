"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";

export default function ProjectThread() {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");

	const isAuthenticated = useIsAuthenticated();

	useEffect(() => {
		setName(getName());
	}, []);
	useEffect(() => {
		setEmail(getEmail());
	}, []);
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const [project, setProject] = useState({});
	useEffect(() => {
		//Fetch project details
		setProject({
			id: id,
			name: "Building a Rest API",
			desc: "Building a rest api with a Django Server",
			tags: ["Development", "Networks", "API", "Python"],
			mentor: "Prof. Rajiv Mishra",
		});
	}, [id]);
	useEffect(() => {
		// TODO: Check if user is part of current project
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);
	return (
		<div className="p-8 my-16 pl-36 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				{project.name}
			</div>
			<div className="text-md text-gray-200 font-semibold p-4">
				Mentor: {project.mentor}
			</div>
			<div className="text-xl text-white font-semibold p-4">{project.desc}</div>
			<div className="py-8 px-4">Threads</div>
		</div>
	);
}

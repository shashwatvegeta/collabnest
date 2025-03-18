"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectApplication() {
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
	return (
		<div className="p-16 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				{project.name}
			</div>
			<div className="text-md text-gray-200 font-semibold p-4">
				Mentor: {project.mentor}
			</div>
			<div className="text-xl text-white font-light p-4">{project.desc}</div>
			<div className="py-8 px-4">
				<button className="text-white font-semibold p-4 rounded-md shadow-lg bg-violet-500">
					Apply For this Project
				</button>
			</div>
		</div>
	);
}

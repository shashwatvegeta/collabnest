"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { Check, Circle } from "lucide-react";

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
	const [subtasks, setSubtaks] = useState([]);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
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
		setSubtaks([
			{
				id: 1,
				name: "Bootstrap project",
				status: "Done",
			},
			{
				id: 2,
				name: "Integrate DB",
				status: "Done",
			},
			{
				id: 3,
				name: "Create endpoints",
				status: "Pending",
			},
		]);
	}, []);
	useEffect(() => {
		setMessages([
			{
				id: 1,
				username: "Abhinav",
				content:
					"Voluptatem porro molestiae dicta qui explicabo. Quia voluptas quae qui. Dolor magnam eveniet aspernatur officiis et placeat. Expedita voluptate sapiente earum quae illo rerum repellat sed. Deserunt fugit nesciunt aspernatur eum. Quam omnis et quia facere.…",
			},
			{
				id: 2,
				username: "Mentor",
				content:
					"Voluptatem porro molestiae dicta qui explicabo. Quia voluptas quae qui. Dolor magnam eveniet aspernatur officiis et placeat. Expedita voluptate sapiente earum quae illo rerum repellat sed. Deserunt fugit nesciunt aspernatur eum. Quam omnis et quia facere.…",
			},
		]);
	}, []);
	useEffect(() => {
		// TODO: Check if user is part of current project
		if (!isAuthenticated) {
			redirect("/");
		}
	}, [isAuthenticated]);
	const sendMessage = (e) => {
		e.preventDefault();
		// Send message to server
		// Retrieve new messages

		setMessage("");
	};
	return (
		<div className="p-16 pl-36 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				{project.name}
			</div>
			<div className="text-md text-gray-200 font-semibold p-4">
				Mentor: {project.mentor}
			</div>
			<div className="text-xl text-white font-semibold p-4">{project.desc}</div>
			<div className="py-8 px-4 flex" style={{ width: "85vw" }}>
				<div>
					<div className="text-white text-2xl font-light">Subtasks</div>
					{subtasks.map((s) => (
						<div
							className="p-4 my-4 text-white rounded-lg bg-gradient-to-r from-[#2a283c] to-[#222131] hover:scale-[105%] flex"
							key={s.id}
						>
							<div className="flex-1">{s.name} &nbsp;</div>
							{s.status == "Done" ? <Check size={20} /> : <Circle size={20} />}
						</div>
					))}
				</div>
				<div
					className="mx-16 bg-gradient-to-r from-[#2a283c] to-[#222131] p-4 rounded-lg text-white flex-1 overflow-y-auto flex flex-col"
					style={{ height: "30vw" }}
				>
					<div className="text-2xl">Discussion</div>
					<div className="py-4 flex-1">
						{messages.map((m) => (
							<div className="pb-4 flex" key={m.id}>
								<div className="font-bold">{m.username}: </div>
								&nbsp;{m.content}
							</div>
						))}
					</div>
					<div>
						<form onSubmit={sendMessage}>
							<input
								className="bg-[#222131] rounded-full border-2 border-violet-400 px-4 py-2 w-full outline-none"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Send a message..."
							/>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

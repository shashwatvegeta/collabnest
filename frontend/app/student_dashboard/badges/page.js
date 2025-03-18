"use client";
import { Badge } from "@/components/ui/badge";
import { getEmail, getName, getBatch, getRollNumber } from "@/lib/auth_utility";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Badges() {
	const [user, setUser] = useState({});
	const [name, setName] = useState("Loading...");
	const [email, setEmail] = useState("Loading...");
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
	return (
		<div className="p-8 h-screen">
			<div className="text-4xl text-violet-400 p-4 font-light">
				Badges and Achievements
			</div>
			<div className="text-xl text-white font-light px-4">
				Track Your Progress and Unlock New Achievements
			</div>
			<div className="grid grid-cols-5 gap-16 p-8">
				{user.badges
					? user.badges.map((b) => (
							<Badge className="scale-150 hover:scale-125 p-4" key={b}>
								{b}
							</Badge>
						))
					: ""}
			</div>
		</div>
	);
}

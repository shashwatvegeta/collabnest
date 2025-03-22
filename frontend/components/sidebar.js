"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMsal } from "@azure/msal-react";
import { usePathname } from "next/navigation";
import {
	Bell,
	LayoutDashboard,
	LogOut,
	Medal,
	MessageCircle,
	Search,
	SquareChartGantt,
	User,
} from "lucide-react";

const Sidebar = () => {
	const { instance } = useMsal();
	const pathname = usePathname();

	const logout = () => {
		instance.logoutRedirect();
	};

	return (
		<div className="fixed left-0 top-0 h-full flex items-center z-20 px-4">
			<div className="w-[60px] bg-gradient-to-b from-[#1F1D38] to-[#252244] flex flex-col items-center py-8 rounded-2xl shadow-xl border border-violet-800/30 transition-all duration-300 h-[90vh] my-auto">
				{/* Logo */}
				<div className="p-2 mb-10 flex justify-center w-full transition-transform duration-300 hover:scale-110">
					<Image 
						src="/logo.png" 
						alt="Logo" 
						width={40} 
						height={40} 
						className="drop-shadow-[0_0_15px_rgba(138,43,226,0.5)] animate-pulse-slow" 
						priority
					/>
				</div>

				{/* Navigation */}
				<div className="flex flex-col items-center w-full px-2 space-y-8 flex-grow">
					{/* Dashboard */}
					<Link href="/student_dashboard" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<LayoutDashboard size={24} className={pathname === "/student_dashboard" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>

					{/* Badges */}
					<Link href="/student_dashboard/badges" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard/badges" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<Medal size={24} className={pathname === "/student_dashboard/badges" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>

					{/* Chats */}
					<Link href="/student_dashboard/chats" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard/chats" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<MessageCircle size={24} className={pathname === "/student_dashboard/chats" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>

					{/* Ongoing Projects */}
					<Link href="/student_dashboard/ongoing_projects" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard/ongoing_projects" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<SquareChartGantt size={24} className={pathname === "/student_dashboard/ongoing_projects" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>

					{/* Find Projects */}
					<Link href="/student_dashboard/find_projects" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard/find_projects" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<Search size={24} className={pathname === "/student_dashboard/find_projects" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>
                    
                    {/* Profile */}
					<Link href="/student_dashboard/profile" className="w-full">
						<div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 ${pathname === "/student_dashboard/profile" ? "bg-[#18172E]" : "hover:bg-[#25243A]"}`}>
							<User size={24} className={pathname === "/student_dashboard/profile" ? "text-teal-400" : "text-gray-400"} />
						</div>
					</Link>
				</div>

				{/* Logout */}
				<div className="mt-auto w-full px-2">
					<button onClick={logout} className="w-full p-3 hover:bg-[#3A1D1D] rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-1 mt-6">
						<LogOut size={24} className="text-red-500" />
					</button>
				</div>

				{/* Add custom animation */}
				<style jsx global>{`
					@keyframes pulse-slow {
						0% { transform: scale(1); }
						50% { transform: scale(1.05); }
						100% { transform: scale(1); }
					}
					.animate-pulse-slow {
						animation: pulse-slow 3s infinite ease-in-out;
					}
				`}</style>
			</div>
		</div>
	);
};

export default Sidebar;

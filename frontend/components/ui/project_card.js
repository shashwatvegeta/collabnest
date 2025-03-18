import { PanelTop } from "lucide-react";
import Link from "next/link";

export function ProjectCard({ name, desc, level, logo, id }) {
	return (
		<Link href={`/project_thread?id=${id}`}>
			<div className="border-2 rounded-lg border-violet-400 flex bg-gradient-to-r from-[#2a283c] to-[#222131] hover:scale-[105%]">
				<div className="bg-violet-400 w-24 place-content-center place-items-center">
					<PanelTop size={40} strokeWidth={3} className="" />
				</div>
				<div className="px-4 py-2">
					<div className="text-xl text-purple-50 py-2">{name}</div>
					<div className="text-sm text-gray-400">{desc}</div>
					<div className="text-xs p-2 my-2 rounded-lg bg-blue-700 w-28 text-center">
						{level}
					</div>
				</div>
			</div>
		</Link>
	);
}

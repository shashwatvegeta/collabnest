import { PanelTop } from "lucide-react";
import Link from "next/link";

export function ProjectCard({ project, id }) {
  // Check if project exists before destructuring
  if (!project) {
    return null; // Or a fallback UI for when project is undefined
  }
  
  // Destructure the project object
  const { name, description } = project;
  
  // Determine project level based on status or other attributes
  const level = project.status?.approved ? "Approved" : "Pending";
  
  return (
    <Link href={`/project_thread?id=${id || project._id}`}>
      <div className="rounded-lg overflow-hidden flex bg-[#222131] mb-4 h-[100px] shadow-md">
        <div className="bg-violet-400 w-16 flex items-center justify-center">
          <PanelTop size={24} color="white" className="text-white" />
        </div>
        <div className="p-4 flex flex-col justify-between flex-1">
          <div className="text-sm text-gray-300">{description}</div>
          <div>
            <button className="text-xs py-1 px-4 rounded-md bg-blue-600 text-white">
              {level}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
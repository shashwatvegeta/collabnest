import { PanelTop } from "lucide-react";
import Link from "next/link";

export function ProjectCard({ project, id }) {
  // Check if project exists before destructuring
  if (!project) {
    return null; // Or a fallback UI for when project is undefined
  }
  
  // Destructure the project object
  const { description } = project;
  
  // Handle different property names (project_name or name)
  const projectName = project.project_name || project.name || "Unnamed Project";
  
  // Determine project level based on status or other attributes
  const level = project.status?.approved ? "Approved" : "Pending";
  
  // Determine the correct link based on the available ID
  const projectId = id || project._id;
  const linkPath = projectId ? 
    (typeof window !== 'undefined' && window.location.pathname.includes('/mentor') 
      ? `/mentor/projects/${projectId}` 
      : `/project_thread?id=${projectId}`) 
    : '#';
  
  return (
    <Link href={linkPath}>
      <div className="rounded-lg overflow-hidden flex bg-[#222131] mb-2 h-[90px] shadow-md hover:bg-[#2a2a38] transition-all duration-300">
        <div className="bg-violet-400 w-12 flex items-center justify-center">
          <PanelTop size={20} color="white" className="text-white" />
        </div>
        <div className="p-2 flex flex-col justify-between flex-1">
          <div>
            <div className="font-medium text-white text-sm mb-1">{projectName}</div>
            <div className="text-xs text-gray-300 line-clamp-2">{description}</div>
          </div>
          <div>
            <button className="text-xs py-0.5 px-3 rounded-md bg-blue-600 text-white mt-1">
              {level}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
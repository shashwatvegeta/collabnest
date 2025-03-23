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
  
  // Get project tags (ensure it's an array)
  const tags = Array.isArray(project.tags) ? project.tags : [];
  
  // Determine the correct link based on the available ID and user role
  const projectId = id || project._id;
  
  // Determine the correct path based on the current page
  const getLinkPath = () => {
    if (typeof window === 'undefined') return '#'; // SSR safety check
    
    const path = window.location.pathname;
    
    if (path.includes('/mentor')) {
      return `/mentor/projects/${projectId}`;
    } else if (path.includes('/student_dashboard')) {
      return `/student_dashboard/projects/${projectId}`; 
    } else if (path.includes('/professor')) {
      return `/professor/projects/${projectId}`;
    } else {
      return `/project_thread?id=${projectId}`;
    }
  };
  
  const linkPath = projectId ? getLinkPath() : '#';
  
  // Get the approval status for display if needed
  const approvalStatus = project.is_approved || project.status?.approved ? "Approved" : "Pending";
  
  return (
    <Link href={linkPath}>
      <div className="rounded-lg overflow-hidden flex bg-[#222131] mb-2 h-[90px] shadow-md hover:bg-[#2a2a38] transition-all duration-300 cursor-pointer">
        <div className="bg-violet-400 w-12 flex items-center justify-center">
          <PanelTop size={20} color="white" className="text-white" />
        </div>
        <div className="p-2 flex flex-col justify-between flex-1">
          <div>
            <div className="font-medium text-white text-sm mb-1">{projectName}</div>
            <div className="text-xs text-gray-300 line-clamp-2">{description}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.length > 0 ? (
                tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-indigo-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="inline-block bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  No tags
                </span>
              )}
              {tags.length > 2 && (
                <span className="inline-block bg-indigo-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs">
                  +{tags.length - 2}
                </span>
              )}
            </div>
            <span className="text-xs text-violet-300 mr-2">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
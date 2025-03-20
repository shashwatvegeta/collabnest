"use client";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect, useRouter } from "next/navigation";
import { use } from "react";

export default function ProjectDetails({ params }) {
    // Unwrap params using React.use()
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.id;
    
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/project/${projectId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching project details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Project not found</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 pl-24 md:pl-28 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-violet-400">{project.project_name}</h1>
                    <p className="text-purple-200 mt-1">Project Details</p>
                </div>
                <button
                    onClick={() => router.push(`/student_dashboard/projects/${projectId}/tasks`)}
                    className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                    View Tasks
                </button>
            </div>

            <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Status */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-300 mb-2">Project Status</h2>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                            project.is_approved === 'approved' 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                : project.is_approved === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                            {project.is_approved === 'approved' 
                                ? 'Approved' 
                                : project.is_approved === 'rejected'
                                ? 'Rejected'
                                : 'Pending'}
                        </div>
                    </div>

                    {/* Project Timeline */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-300 mb-2">Timeline</h2>
                        <div className="text-purple-200">
                            <p>Start Date: {new Date(project.start_date).toLocaleDateString()}</p>
                            <p>End Date: {new Date(project.end_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold text-violet-300 mb-2">Description</h2>
                        <p className="text-purple-200">{project.description}</p>
                    </div>

                    {/* Technologies */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold text-violet-300 mb-2">Technologies</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Capacity */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-300 mb-2">Capacity</h2>
                        <p className="text-purple-200">Maximum Students: {project.cap}</p>
                    </div>

                    {/* Mentor Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-300 mb-2">Mentor</h2>
                        <p className="text-purple-200">{project.mentor_email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
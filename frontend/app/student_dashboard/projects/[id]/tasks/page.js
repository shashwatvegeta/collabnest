"use client";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect, useRouter } from "next/navigation";
import { use } from "react";

export default function ProjectTasks({ params }) {
    // Unwrap params using React.use()
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.id;
    
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                // Fetch project details
                console.log("Fetching project details for ID:", projectId);
                const projectResponse = await fetch(`http://localhost:3001/project/${projectId}`);
                if (!projectResponse.ok) {
                    const errorText = await projectResponse.text();
                    console.error("Project API error:", errorText);
                    throw new Error(`Failed to fetch project details: ${projectResponse.status} ${errorText}`);
                }
                const projectData = await projectResponse.json();
                console.log("Project data fetched:", projectData);
                setProject(projectData);

                try {
                    // Fetch tasks using the correct endpoint
                    console.log("Fetching tasks for project:", projectId);
                    const tasksResponse = await fetch(`http://localhost:3001/projects/${projectId}/tasks`);
                    
                    if (tasksResponse.ok) {
                        const tasksData = await tasksResponse.json();
                        console.log("Tasks fetched successfully:", tasksData);
                        
                        // Limit to only show 4-5 tasks if there are more
                        if (tasksData.length > 5) {
                            setTasks(tasksData.slice(0, 5));
                        } else {
                            setTasks(tasksData);
                        }
                    } else {
                        const errorText = await tasksResponse.text();
                        console.error("Tasks API error:", errorText);
                        throw new Error("Tasks could not be retrieved. The feature may not be available yet.");
                    }
                } catch (taskError) {
                    console.error("Error fetching tasks:", taskError);
                    // Continue showing the page with an empty tasks list
                    setTasks([]);
                    // Set a user-friendly error message
                    setError("Tasks could not be loaded. They may not be available for this project yet.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
                
                // Add a small delay to simulate loading and then trigger animations
                setTimeout(() => {
                    setIsLoaded(true);
                }, 300);
            }
        };

        fetchProjectAndTasks();
    }, [projectId]);

    // Function to group tasks by status
    const groupTasksByStatus = () => {
        const grouped = {
            'Completed': [],
            'In Progress': [],
            'Pending': []
        };

        tasks.forEach(task => {
            const status = task.status || 'Pending';
            if (!grouped[status]) {
                grouped[status] = [];
            }
            grouped[status].push(task);
        });

        return grouped;
    };

    // Get color class based on status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/30',
                    text: 'text-green-400',
                    icon: '✓'
                };
            case 'In Progress':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-400',
                    icon: '→'
                };
            default:
                return {
                    bg: 'bg-gray-500/10',
                    border: 'border-gray-500/30',
                    text: 'text-gray-400',
                    icon: '○'
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <div className="text-violet-300 text-lg">Loading project tasks...</div>
                </div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-6 rounded-lg max-w-md">
                    <div className="text-xl font-bold mb-2">Error</div>
                    <div>{error}</div>
                    <button
                        onClick={() => router.push('/student_dashboard/ongoing_projects')}
                        className="mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-white rounded-lg transition-all"
                    >
                        Return to Projects
                    </button>
                </div>
            </div>
        );
    }

    const groupedTasks = groupTasksByStatus();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-2 sm:p-4 md:p-6 lg:p-8 pl-4 sm:pl-8 md:pl-16 lg:pl-28">
            {/* Header */}
            <div className={`bg-[#202040]/50 backdrop-blur-sm border border-violet-500/20 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 shadow-lg transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                            <span className="text-violet-400">{project?.project_name}</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs ${
                                project?.approval_status === 'approved' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}>
                                {project?.approval_status === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                            <span className="text-purple-200">•</span>
                            <span className="text-purple-200 text-sm">
                                Tasks: {tasks.length}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => router.push(`/student_dashboard/projects/${projectId}`)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600/40 hover:bg-indigo-600/60 text-white rounded-lg transition-all border border-indigo-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <span>Project Details</span>
                        </button>
                        <button
                            onClick={() => router.push('/student_dashboard/ongoing_projects')}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-violet-500/40 hover:bg-violet-500/60 text-white rounded-lg transition-all border border-violet-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <span>All Projects</span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className={`bg-red-500/10 border border-red-500/30 text-red-300 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500 delay-100`}>
                    {error}
                </div>
            )}

            {/* Task Overview Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                {Object.entries(groupedTasks).map(([status, statusTasks], index) => {
                    const { bg, border, text, icon } = getStatusColor(status);
                    return (
                        <div 
                            key={status} 
                            className={`${bg} rounded-xl ${border} border p-3 sm:p-4 shadow-lg transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
                            style={{ transitionDelay: `${200 + index * 100}ms` }}
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <span className={`${text} text-base sm:text-lg font-semibold flex items-center gap-2`}>
                                    <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10">
                                        {icon}
                                    </span>
                                    {status}
                                </span>
                                <span className="ml-auto bg-white/10 rounded-full px-2 py-1 text-xs text-white">
                                    {statusTasks.length}
                                </span>
                            </div>
                            <div className="text-xs text-white/60">
                                {status === 'Completed' ? 
                                    'Tasks you have completed.' : 
                                    status === 'In Progress' ? 
                                        'Tasks currently in progress.' : 
                                        'Tasks waiting to be started.'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Task List */}
            <div className={`bg-[#2a2a38]/70 backdrop-blur-sm rounded-xl border-2 border-violet-300/20 shadow-xl p-3 sm:p-4 md:p-6 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} transition-all duration-700 delay-300`}>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                    <span className="bg-violet-500/20 p-2 rounded-lg mr-2 sm:mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Project Tasks
                </h2>
                
                {tasks.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                        {Object.entries(groupedTasks).map(([status, statusTasks], groupIndex) => (
                            statusTasks.length > 0 && (
                                <div key={status} className="mb-6 sm:mb-8">
                                    <h3 className="text-base sm:text-lg font-medium text-violet-300 mb-2 sm:mb-3">{status} Tasks</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {statusTasks.map((task, index) => {
                                            const { bg, border, text } = getStatusColor(task.status || 'Pending');
                                            return (
                                                <div
                                                    key={task._id || index}
                                                    className={`${bg} rounded-lg ${border} border p-3 sm:p-4 hover:border-violet-500/40 transition-all transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} hover:-translate-y-1`}
                                                    style={{ transitionDelay: `${500 + (groupIndex * 100) + (index * 70)}ms` }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 break-words">{task.title}</h3>
                                                            <p className="text-purple-200 text-sm mb-3 sm:mb-4 break-words">{task.description}</p>
                                                            
                                                            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs ${
                                                                    task.status === 'Completed'
                                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                        : task.status === 'In Progress'
                                                                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                                                }`}>
                                                                    {task.status || 'Pending'}
                                                                </span>
                                                                {task.deadline && (
                                                                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Due: {new Date(task.deadline).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {task.assigned_to && task.assigned_to.length > 0 && (
                                                                <div className="text-xs sm:text-sm text-purple-200 flex items-center gap-1.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span className="truncate">{task.assigned_to.join(', ')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        ))}
                        
                        {tasks.length > 5 && (
                            <div className="text-center mt-6">
                                <button 
                                    className="px-4 py-2 bg-violet-500/30 hover:bg-violet-500/50 text-white rounded-lg transition-all border border-violet-500/30 transform hover:scale-105"
                                    onClick={() => router.push(`/student_dashboard/projects/${projectId}/all-tasks`)}
                                >
                                    View All Tasks
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 sm:py-12 bg-[#222131]/70 rounded-lg border border-violet-500/10">
                        <div className="inline-block p-2 sm:p-3 rounded-full bg-violet-500/10 mb-3 sm:mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-purple-200 text-base sm:text-lg mb-2">No tasks available for this project yet.</p>
                        <p className="text-xs sm:text-sm text-violet-300 mb-4 sm:mb-6">Check back later as your mentor adds tasks.</p>
                        <button
                            onClick={() => router.push(`/student_dashboard/projects/${projectId}`)}
                            className="px-3 sm:px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-white rounded-lg transition-all border border-violet-500/30 text-sm sm:text-base transform hover:scale-105"
                        >
                            Return to Project Details
                        </button>
                    </div>
                )}
            </div>
            
            {/* Add global CSS for custom animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
} 
"use client";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { getEmail } from "@/lib/auth_utility";

const ApplicationItem = ({ application, onApprove, onReject }) => {
    return (
        <div className="bg-indigo-900/40 p-3 rounded-lg mb-1 hover:bg-indigo-900/60 transition-all duration-300 transform hover:-translate-y-1 border-l-2 border-yellow-400">
            <div className="flex flex-col">
                <div className="font-semibold text-white flex items-center gap-1 text-sm sm:text-base">
                    <span className="text-yellow-400 mr-1">●</span>
                    {application.userName} has applied to join "{application.projectName}"
                </div>
                <div className="text-xs sm:text-sm text-purple-200 mt-0.5">
                    {application.submissionDate ? new Date(application.submissionDate).toLocaleString() : 'Recently'}
                </div>
                {application.applicationText && (
                    <div className="text-sm text-purple-200 mt-2 p-2 bg-indigo-950/40 rounded-md">
                        "{application.applicationText}"
                    </div>
                )}
                <div className="flex gap-2 mt-3">
                    <button 
                        onClick={() => onApprove(application.applicationId, application.projectId)} 
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex-1 transition-colors"
                    >
                        Approve
                    </button>
                    <button 
                        onClick={() => onReject(application.applicationId, application.projectId)} 
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex-1 transition-colors"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const [email, setEmail] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
        setEmail(getEmail());
    }, [isAuthenticated]);

    // Fetch mentor's projects
    useEffect(() => {
        if (!email) return;

        const fetchProjects = async () => {
            try {
                console.log("Fetching projects for mentor:", email);
                const response = await fetch("http://localhost:3001/project");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                const allProjects = await response.json();
                
                // Filter projects where the current mentor is the project_owner
                // Handle different formats of project_owner (string ID, object with ID, object with email)
                const mentorProjects = allProjects.filter(project => {
                    console.log("Checking project:", project.project_name, "Owner:", project.project_owner);
                    
                    // If project_owner is an object
                    if (typeof project.project_owner === 'object' && project.project_owner !== null) {
                        // Check for _id field
                        if (project.project_owner._id && project.project_owner.email === email) {
                            return true;
                        }
                        // Check for id field
                        if (project.project_owner.id && project.project_owner.email === email) {
                            return true;
                        }
                        // Check email directly
                        if (project.project_owner.email === email) {
                            return true;
                        }
                    }
                    
                    // If project_owner is a string (ID)
                    if (typeof project.project_owner === 'string' && project.project_owner === email) {
                        return true;
                    }
                    
                    // Check mentor_email field
                    return project.mentor_email === email;
                });
                
                console.log("Found mentor projects:", mentorProjects.length);
                setProjects(mentorProjects);
                return mentorProjects;
            } catch (error) {
                console.error("Error fetching projects:", error);
                return [];
            }
        };

        fetchProjects().then(mentorProjects => {
            if (mentorProjects.length > 0) {
                fetchApplications(mentorProjects);
            } else {
                // Still mark as loaded even if no projects found
                setIsLoading(false);
                setTimeout(() => {
                    setIsLoaded(true);
                }, 300);
            }
        });
    }, [email]);

    // Fetch applications for mentor's projects
    const fetchApplications = async (mentorProjects) => {
        try {
            console.log("Fetching applications for projects:", mentorProjects.map(p => p.project_name));
            const applicationPromises = mentorProjects.map(async (project) => {
                try {
                    const response = await fetch(
                        `http://localhost:3001/projects/${project._id}/applications`
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch applications for project ${project._id}`);
                    }
                    const applications = await response.json();
                    console.log(`Found ${applications.length} applications for project ${project.project_name}`);
                    
                    // Add project details to each application
                    return applications.map(app => ({
                        ...app,
                        projectId: project._id,
                        projectName: project.project_name,
                        userName: app.user_id?.username || "A student",
                        applicationId: app._id,
                        submissionDate: app.submission_date,
                        applicationText: app.application_text
                    }));
                } catch (error) {
                    console.error(`Error fetching applications for project ${project._id}:`, error);
                    return [];
                }
            });

            const applicationsArrays = await Promise.all(applicationPromises);
            const allApplications = applicationsArrays.flat();
            console.log("All applications:", allApplications.length);
            
            // Filter only pending applications
            const pendingApplications = allApplications.filter(app => app.status === 'pending');
            console.log("Pending applications:", pendingApplications.length);
            setApplications(pendingApplications);
            
            // Update displayed items
            updateDisplayedItems(pendingApplications);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            // Always mark loading as complete, even if there was an error
            setIsLoading(false);
            setTimeout(() => {
                setIsLoaded(true);
            }, 300);
        }
    };

    // Update displayed items
    const updateDisplayedItems = (apps) => {
        console.log(`Updating displayed items: ${apps.length} applications`);
        
        // Create an array with applications and type markers
        const items = apps.map(app => ({ type: 'application', data: app }));

        // Sort by date (newest first)
        items.sort((a, b) => {
            const dateA = new Date(a.data.submissionDate || Date.now());
            const dateB = new Date(b.data.submissionDate || Date.now());
            return dateB - dateA;
        });

        // Limit displayed items if not showing all
        const itemsToDisplay = showAll ? items : items.slice(0, 10);
        setDisplayedItems(itemsToDisplay);
    };

    // Handle showing all applications
    const handleShowMore = () => {
        setShowAll(true);
        updateDisplayedItems(applications);
    };

    const handleApproveApplication = async (applicationId, projectId) => {
        try {
            const response = await fetch(`http://localhost:3001/projects/${projectId}/applications/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approval_notes: "Approved by mentor",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to approve application');
            }

            // Remove the approved application from the list
            const updatedApplications = applications.filter(app => app.applicationId !== applicationId);
            setApplications(updatedApplications);
            updateDisplayedItems(updatedApplications);

            // Show success message
            alert("Application approved successfully!");
        } catch (err) {
            console.error('Error approving application:', err);
            alert("Failed to approve application. Please try again.");
        }
    };

    const handleRejectApplication = async (applicationId, projectId) => {
        try {
            const response = await fetch(`http://localhost:3001/projects/${projectId}/applications/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rejection_reason: "Rejected by mentor",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject application');
            }

            // Remove the rejected application from the list
            const updatedApplications = applications.filter(app => app.applicationId !== applicationId);
            setApplications(updatedApplications);
            updateDisplayedItems(updatedApplications);

            // Show success message
            alert("Application rejected successfully!");
        } catch (err) {
            console.error('Error rejecting application:', err);
            alert("Failed to reject application. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <div className="text-violet-300 text-lg">Loading applications...</div>
                </div>
            </div>
        );
    }

    const pendingApplicationsCount = applications.length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-2 sm:p-4 md:p-6 pl-4 sm:pl-8 md:pl-16 lg:pl-28">
            <div className={`transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Project Applications</h1>
                        {pendingApplicationsCount > 0 && (
                            <p className="text-yellow-400 text-sm mt-1">
                                {pendingApplicationsCount} pending application{pendingApplicationsCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2 sm:p-3 rounded-lg text-sm">
                        {error}
                    </div>
                ) : displayedItems.length > 0 ? (
                    <div className="space-y-2">
                        {displayedItems.map((item, index) => (
                            <div
                                key={`app-${item.data.applicationId}`}
                                className={`transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <ApplicationItem
                                    application={item.data}
                                    onApprove={handleApproveApplication}
                                    onReject={handleRejectApplication}
                                />
                            </div>
                        ))}
                        
                        {!showAll && applications.length > 10 && (
                            <div className="text-center mt-4">
                                <button 
                                    onClick={handleShowMore}
                                    className="px-3 py-1.5 bg-violet-500/30 hover:bg-violet-500/50 text-white rounded-lg transition-all border border-violet-500/30 transform hover:scale-105 text-xs sm:text-sm"
                                >
                                    Show More ({applications.length - 10} more)
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-[#222131]/70 rounded-lg border border-violet-500/10">
                        <div className="inline-block p-2 rounded-full bg-violet-500/10 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-purple-200 text-base mb-1">No pending applications</p>
                        <p className="text-xs sm:text-sm text-violet-300">You'll see applications here when students apply to your projects.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 
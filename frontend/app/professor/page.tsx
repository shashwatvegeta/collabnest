'use client'

import { useState, useEffect } from 'react';
import ProfessorLayout from './components/ProfessorLayout';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

const ADMIN_INFO = {
    name: 'Shashwat Kumar Singh',
    role: 'PROFESSOR',
    email: 'jyotishikha2007@gmail.com',
    id: '67d43bbaa0d1c77b0fb4aed6'
};

interface Project {
    _id: string;
    project_name: string;
    description: string;
    is_approved: boolean;
    is_completed: boolean;
    project_owner: any;
    cap: number;
    start_date: string;
    end_date: string;
    tags: any[];
}

interface Notification {
    _id: string;
    message: string;
    created_at: string;
    sender_id: string;
    receiver_ids: string[];
    readBy: Array<{
        readerId: string;
        readAt: string;
        _id: string;
    }>;
    title?: string;
    isImportant?: boolean;
    metadata?: { applicationId: string };
}

interface Application {
    _id: string;
    project_id: any;
    user_id: any;
    status: string;
    projectName?: string;
}

const RequestItem = ({ name, projectName, projectType, applicationId, onApprove, onReject }) => {
    return (
        <div className="bg-slate-700 p-4 rounded-lg mb-2 hover:bg-slate-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <div className="flex">
                <div className="flex-1">
                    <div className="font-semibold text-white flex">
                        {name} <span className="text-pink-400 ml-1 animate-pulse">•</span>
                    </div>
                    <div className="text-sm text-gray-300">
                        Project Name: {projectName}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Type: {projectType}
                    </div>
                </div>
            </div>
            <div className="flex mt-3 space-x-2">
                <button 
                    onClick={() => onApprove(applicationId)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs flex-1"
                >
                    Approve
                </button>
                <button 
                    onClick={() => onReject(applicationId)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs flex-1"
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

const NotificationItem = ({ title, message, isImportant }) => {
    return (
        <div className="bg-slate-700 p-4 rounded-lg mb-2 hover:bg-slate-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <div className="flex">
                <div className="flex-1">
                    <div className="font-semibold text-white flex">
                        {title}{" "}
                        {isImportant && (
                            <span className="text-pink-400 ml-1 animate-pulse">•</span>
                        )}
                    </div>
                    <div className="text-sm text-gray-300">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default function ProfessorDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [processedAppIds, setProcessedAppIds] = useState<Set<string>>(new Set());
    const [stats, setStats] = useState({
        satisfactionRate: 95,
        activeUsers: 2600,
        otherUsers: 1200
    });

    useEffect(() => {
        fetchProjects();
        fetchNotifications();
        
        // Add a small delay to simulate loading and then trigger animations
        setTimeout(() => {
            setIsLoaded(true);
        }, 300);
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/project');
            setProjects(response.data);
            
            // After fetching projects, fetch applications
            fetchApplications(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const fetchApplications = async (projectsData) => {
        try {
            // Create a map of project IDs to project names for quick lookup
            const projectMap = {};
            projectsData.forEach(project => {
                projectMap[project._id] = project;
            });
            
            // Filter projects where the current professor is the project_owner
            const professorProjects = projectsData.filter(project => {
                if (typeof project.project_owner === 'object' && project.project_owner !== null) {
                    // If project_owner is an object with _id property
                    if (project.project_owner._id) {
                        return project.project_owner._id === ADMIN_INFO.id;
                    }
                    // If project_owner is an object with id property
                    if (project.project_owner.id) {
                        return project.project_owner.id === ADMIN_INFO.id;
                    }
                    // Check by email if id is not available
                    if (project.project_owner.email) {
                        return project.project_owner.email === ADMIN_INFO.email;
                    }
                }
                // If project_owner is just an ID string
                return project.project_owner === ADMIN_INFO.id;
            });
            
            console.log("Professor projects:", professorProjects);
            
            // Fetch applications for each project
            const applicationPromises = professorProjects.map(async (project) => {
                try {
                    const appResponse = await axios.get(
                        `http://localhost:3001/projects/${project._id}/applications`,
                    );
                    if (appResponse.status !== 200) {
                        throw new Error(
                            `Failed to fetch applications for project ${project._id}`,
                        );
                    }
                    const applications = appResponse.data;
                    
                    // Add project name to each application for reference
                    return applications.map(app => ({
                        ...app,
                        projectName: project.project_name,
                        projectType: project.tags ? project.tags.join(', ') : "General"
                    }));
                } catch (error) {
                    console.error(`Error fetching applications for project ${project._id}:`, error);
                    return []; // Return empty array on error to avoid breaking Promise.all
                }
            });

            const applicationsArray = await Promise.all(applicationPromises);
            const allApplications = applicationsArray.flat();
            
            console.log("Fetched applications:", allApplications);
            setApplications(allApplications);

            // Filter pending applications
            const pendingApplications = allApplications.filter(app => app.status === 'pending');
            console.log("Pending applications:", pendingApplications);

            // Create a new Set of processed IDs to update
            const newProcessedIds = new Set(processedAppIds);
            
            // Create requests from pending applications
            const applicationRequests = pendingApplications.map(app => {
                const userName = app.user_id?.username || "A student";
                const projectName = app.projectName || "a project";
                
                return {
                    name: userName,
                    projectName: projectName,
                    projectType: app.projectType || "General",
                    applicationId: app._id
                };
            });

            // Set requests (limit to 2)
            const limitedRequests = applicationRequests.length > 0 
                ? applicationRequests.slice(0, 2) 
                : [
                    {
                        name: "No pending requests",
                        projectName: "No projects",
                        projectType: "N/A",
                        applicationId: null
                    }
                ];

            setRequests(limitedRequests);
            
            // Generate notifications from pending applications
            // that we haven't processed yet and don't already have notifications for
            const newNotifications = pendingApplications
                .filter(app => !processedAppIds.has(app._id) && 
                    !notifications.some(n => 
                        (n.metadata && n.metadata.applicationId === app._id) ||
                        n._id.includes(app._id) ||
                        (n.message && n.message.includes(`applied to join`) && 
                         n.message.includes(app.projectName))
                    )
                )
                .map((app, index) => {
                    // Mark this app as processed
                    newProcessedIds.add(app._id);
                    
                    const userName = app.user_id?.username || "A student";
                    const projectName = app.projectName || "a project";
                    
                    // Make sure submission_date is a valid date string
                    let createdAt = new Date().toISOString();
                    if (app.submission_date) {
                        try {
                            // Ensure submission_date is a valid date
                            const submissionDate = new Date(app.submission_date);
                            if (!isNaN(submissionDate.getTime())) {
                                createdAt = submissionDate.toISOString();
                            }
                        } catch (e) {
                            console.error("Invalid submission date:", app.submission_date);
                        }
                    }
                    
                    console.log(`Creating notification for application ${app._id}, project ${projectName}`);
                    
                    return {
                        _id: `app-${app._id}-${Date.now()}-${index}`,
                        message: `${userName} has applied to join ${projectName}`,
                        created_at: createdAt,
                        sender_id: app.user_id?._id || "",
                        receiver_ids: [ADMIN_INFO.id],
                        readBy: [],
                        title: "New Application",
                        isImportant: true,
                        metadata: { applicationId: app._id }
                    } as Notification;
                });
            
            // Update processed IDs
            setProcessedAppIds(newProcessedIds);
            
            // Only update notifications if we have new ones to add
            if (newNotifications.length > 0) {
                console.log("Adding new notifications:", newNotifications);
                setNotifications(prevNotifications => {
                    // Combine with existing notifications, avoiding duplicates
                    const combinedNotifications = [...newNotifications];
                    
                    prevNotifications.forEach(existing => {
                        // Skip if this notification is a duplicate of one in newNotifications
                        const isDuplicate = newNotifications.some(newNotif => 
                            existing._id.includes(newNotif.metadata?.applicationId) ||
                            (existing.message && newNotif.message && 
                             existing.message === newNotif.message)
                        );
                        
                        if (!isDuplicate) {
                            combinedNotifications.push(existing);
                        }
                    });
                    
                    // Return combined notifications (limit to reasonable number)
                    return combinedNotifications.slice(0, 5);
                });
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/notifications/received/${ADMIN_INFO.id}`);
            const serverNotifications = response.data.notifications.slice(0, 3);
            console.log("Server notifications:", serverNotifications);
            
            // Process and merge with application notifications
            setNotifications(currentNotifications => {
                // Get application notifications we've generated
                const appNotifications = currentNotifications.filter(n => n._id.startsWith('app-'));
                
                // Filter out server notifications that duplicate our application notifications
                const filteredServerNotifications = serverNotifications.filter(serverNotification => {
                    // Skip if this server notification duplicates one of our app notifications
                    return !appNotifications.some(appNotif => 
                        // Check if messages are similar
                        serverNotification.message === appNotif.message ||
                        // Check if this is about the same application
                        (serverNotification.message.includes('applied to join') && 
                         appNotif.message.includes('applied to join'))
                    );
                });
                
                // Combine and limit
                return [...appNotifications, ...filteredServerNotifications].slice(0, 5);
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([{
                _id: '0',
                message: "Error loading notifications",
                created_at: new Date().toISOString(),
                sender_id: '',
                receiver_ids: [ADMIN_INFO.id],
                readBy: []
            }]);
        }
    }

    const handleApproveApplication = async (applicationId) => {
        try {
            // Find the application to get its project_id
            const application = applications.find(app => app._id === applicationId);
            if (!application) {
                alert("Application not found.");
                return;
            }

            // Use the correct endpoint structure from the controller
            const response = await axios.put(
                `http://localhost:3001/projects/${application.project_id}/applications/${applicationId}`, 
                {
                    approval_notes: "Approved by professor",
                    // The controller will set status to "approved" when approval_notes is provided
                }
            );
            
            if (response.status === 200) {
                // Update the local state
                const updatedApplications = applications.map(app => 
                    app._id === applicationId ? {...app, status: 'approved'} : app
                );
                setApplications(updatedApplications);
                
                // Update requests list
                setRequests(prevRequests => 
                    prevRequests.filter(request => request.applicationId !== applicationId)
                );
                
                // Show success message
                alert("Application approved successfully!");
                
                // Remove any notifications for this application
                setNotifications(prevNotifications => 
                    prevNotifications.filter(n => !n._id.includes(applicationId))
                );
                
                // Refresh projects without immediately re-fetching
                setTimeout(() => {
                    fetchProjects();
                }, 500);
            }
        } catch (error) {
            console.error('Error approving application:', error);
            // Log more details about the error to debug
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            }
            alert("Failed to approve application. Please try again.");
        }
    };

    const handleRejectApplication = async (applicationId) => {
        try {
            // Find the application to get its project_id
            const application = applications.find(app => app._id === applicationId);
            if (!application) {
                alert("Application not found.");
                return;
            }

            // Use the correct endpoint structure from the controller
            const response = await axios.put(
                `http://localhost:3001/projects/${application.project_id}/applications/${applicationId}`, 
                {
                    rejection_reason: "Rejected by professor",
                    // The controller will set status to "rejected" when rejection_reason is provided
                }
            );
            
            if (response.status === 200) {
                // Update the local state
                const updatedApplications = applications.map(app => 
                    app._id === applicationId ? {...app, status: 'rejected'} : app
                );
                setApplications(updatedApplications);
                
                // Update requests list
                setRequests(prevRequests => 
                    prevRequests.filter(request => request.applicationId !== applicationId)
                );
                
                // Show success message
                alert("Application rejected successfully!");
                
                // Remove any notifications for this application
                setNotifications(prevNotifications => 
                    prevNotifications.filter(n => !n._id.includes(applicationId))
                );
                
                // Refresh projects without immediately re-fetching
                setTimeout(() => {
                    fetchProjects();
                }, 500);
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            // Log more details about the error to debug
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
            }
            alert("Failed to reject application. Please try again.");
        }
    };

    const ongoingProjects = projects.filter((project) => project.project_owner === ADMIN_INFO.id);

    // Get only unread notifications
    const getUnreadNotifications = () => {
        return notifications.filter(notification => {
            // Check if readBy exists and is an array
            if (!notification.readBy || !Array.isArray(notification.readBy)) {
                return true; // Consider as unread if no readBy array
            }

            // Check if current user's ID is in the readBy array
            return !notification.readBy.some(reader => reader.readerId === ADMIN_INFO.id);
        });
    }

    const markAsRead = async (notificationId: string) => {
        try {
            await axios.patch(`http://localhost:3001/notifications/read`, {
                notificationId,
                readerId: ADMIN_INFO.id
            });

            // Update the local state to reflect the change
            setNotifications(notifications.map(notification => {
                if (notification._id === notificationId) {
                    const newReadBy = [...(notification.readBy || [])];
                    // Only add if not already present
                    if (!newReadBy.some(reader => reader.readerId === ADMIN_INFO.id)) {
                        newReadBy.push({
                            readerId: ADMIN_INFO.id,
                            readAt: new Date().toISOString(),
                            _id: `temp-${Date.now()}` // Temporary ID until server response
                        });
                    }
                    return { ...notification, readBy: newReadBy };
                }
                return notification;
            }));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.patch(`http://localhost:3001/notifications/${ADMIN_INFO.id}/read-all`);

            // Update all notifications in the local state
            setNotifications(notifications.map(notification => {
                const newReadBy = [...(notification.readBy || [])];
                // Only add if not already present
                if (!newReadBy.some(reader => reader.readerId === ADMIN_INFO.id)) {
                    newReadBy.push({
                        readerId: ADMIN_INFO.id,
                        readAt: new Date().toISOString(),
                        _id: `temp-${Date.now()}` // Temporary ID until server response
                    });
                }
                return { ...notification, readBy: newReadBy };
            }));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }

    return (
        <ProfessorLayout>
            <div className="p-6 bg-slate-900 min-h-screen">
                <div 
                    className={`mb-6 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
                >
                    <h1 className="text-white text-3xl font-bold mb-2">Welcome Back, {ADMIN_INFO.name.split(' ')[0]}!</h1>
                    <div className="flex items-center">
                        <div className="bg-indigo-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                            <span className="text-indigo-700">{ADMIN_INFO.name.charAt(0)}</span>
                        </div>
                        <div>
                            <p className="text-white">{ADMIN_INFO.name} • <span className="text-indigo-400">{ADMIN_INFO.role}</span></p>
                            <p className="text-gray-400 text-sm">{ADMIN_INFO.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ongoing Projects */}
                    <div 
                        className={`bg-indigo-500 bg-opacity-20 p-6 rounded-lg md:row-span-2 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-300`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl font-semibold">Ongoing Projects</h2>
                            <Link href="/professor/projects">
                                <button className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-md text-sm">
                                    View all →
                                </button>
                            </Link>
                        </div>

                        {ongoingProjects.length > 0 ? (
                            <div className="space-y-4">
                                {ongoingProjects.slice(0, 4).map((project, index) => (
                                    <div 
                                        key={project._id} 
                                        className={`bg-slate-800 p-4 rounded-lg transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                                        style={{ transitionDelay: `${400 + index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <div className="bg-slate-700 p-2 rounded-lg mr-3">
                                                    {project.project_name.includes('Web') ? (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="24" rx="4" fill="#6B7280" />
                                                            <path d="M6 8H18M6 12H18M6 16H18" stroke="white" strokeWidth="2" />
                                                        </svg>
                                                    ) : project.project_name.includes('API') ? (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="24" rx="4" fill="#6B7280" />
                                                            <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="24" rx="4" fill="#6B7280" />
                                                            <path d="M8 16L16 8M8 8L16 16" stroke="white" strokeWidth="2" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{project.project_name}</h3>
                                                    <p className="text-gray-400 text-sm">{project.description}</p>
                                                </div>
                                            </div>
                                            <Link href={`/professor/projects/${project._id}`}>
                                                <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md text-xs">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.random() * 50 + 50}%` }}></div>
                                        </div>
                                        <div className="text-white text-xs font-medium mt-1 text-right">
                                            {project.is_completed ? "Completed" : "In Progress"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800 p-4 rounded-lg text-white">
                                No ongoing projects found.
                            </div>
                        )}
                    </div>

                    {/* Notifications Section */}
                    <div
                        className={`bg-slate-800 p-6 rounded-lg mb-6 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-400`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl font-semibold">Notifications</h2>
                            <div className="flex gap-2">
                                <button
                                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {getUnreadNotifications().length > 0 ? (
                                getUnreadNotifications().slice(0, 3).map((notification, index) => (
                                    <div
                                        key={notification._id}
                                        className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                                        style={{ transitionDelay: `${500 + index * 100}ms` }}
                                    >
                                        {notification.title ? (
                                            <NotificationItem 
                                                title={notification.title}
                                                message={notification.message}
                                                isImportant={true}
                                            />
                                        ) : (
                                            <div
                                                className="p-4 rounded-lg border-l-4 border-indigo-500 bg-slate-700 hover:bg-slate-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                onClick={() => markAsRead(notification._id)}
                                            >
                                                <div className="flex justify-between">
                                                    <p className="text-white font-medium">
                                                        {notification.message}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification._id);
                                                        }}
                                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                                    >
                                                        Mark as read
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {notification._id.startsWith('app-')
                                                        ? (() => {
                                                            try {
                                                                const date = new Date(notification.created_at);
                                                                if (isNaN(date.getTime())) {
                                                                    return 'Just now';
                                                                }
                                                                return date.toLocaleString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                });
                                                            } catch (e) {
                                                                return 'Just now';
                                                            }
                                                        })()
                                                        : (() => {
                                                            try {
                                                                const date = new Date(notification.created_at);
                                                                if (isNaN(date.getTime())) {
                                                                    return 'Just now';
                                                                }
                                                                return date.toLocaleString();
                                                            } catch (e) {
                                                                return 'Just now';
                                                            }
                                                        })()
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 rounded-lg bg-slate-700 text-center">
                                    <p className="text-gray-300">No new notifications</p>
                                </div>
                            )}
                        </div>
                        
                        <div
                            className={`text-center mt-4 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                            style={{ transitionDelay: "700ms" }}
                        >
                            <Link href="/professor/notifications">
                                <button className="w-full px-3 py-1.5 bg-indigo-600 text-xs sm:text-sm rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
                                    View All
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Requests Section */}
                    <div
                        className={`bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} delay-500`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl font-semibold">Requests</h2>
                        </div>

                        <div className="space-y-4">
                            {requests.length > 0 && requests[0].applicationId ? (
                                requests.map((request, index) => (
                                    <div
                                        key={index}
                                        className={`transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                                        style={{ transitionDelay: `${800 + index * 100}ms` }}
                                    >
                                        <RequestItem 
                                            name={request.name}
                                            projectName={request.projectName}
                                            projectType={request.projectType}
                                            applicationId={request.applicationId}
                                            onApprove={handleApproveApplication}
                                            onReject={handleRejectApplication}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 rounded-lg bg-slate-700 text-center">
                                    <p className="text-gray-300">No pending requests</p>
                                </div>
                            )}
                        </div>
                    </div>
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
        </ProfessorLayout>
    );
}
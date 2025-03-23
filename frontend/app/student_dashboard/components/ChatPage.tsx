// ProjectDiscussionPage.jsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getEmail, getName } from "@/lib/auth_utility";
import { fetchUserData } from "@/lib/api";
import { useRouter } from 'next/navigation';

// Enable debug mode to show detailed error information
const DEBUG_MODE = true;

// Helper function to validate MongoDB ObjectIDs
const isValidObjectId = (id) => {
    return id && /^[0-9a-fA-F]{24}$/.test(id);
};

interface Project {
    _id: string;
    project_name: string;
    description: string;
    is_approved: string;
    is_completed: boolean;
    project_owner: string;
    cap: number;
    start_date: string;
    end_date: string;
    tags: any[];
    students_enrolled: any[];
}

interface DiscussionThread {
    _id: string;
    discussion_id: string;
    project_id: string;
    title: string;
    description?: string;
    created_by: string;
    replies: Array<{
        _id: string;
        content: string;
        created_by: string;
        created_at: Date;
        created_by_username: string;
    }>;
}

interface Discussion {
    _id: string;
    Post_Id: string;
    discussion_id: string;
    posted_by: string;
    reply_message: string;
    posted_at: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const [newMessage, setNewMessage] = useState('');
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState('');
    const [activeThreadId, setActiveThreadId] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [discussionThreads, setDiscussionThreads] = useState<DiscussionThread[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data on initial load
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const email = getEmail();
                const userName = getName();
                
                console.log("Fetching user data for email:", email);
                const user = await fetchUserData(email);
                
                if (!user || !user._id) {
                    console.error("Failed to get valid user data:", user);
                    setError("Your user profile could not be found. Please ensure you're properly logged in.");
                    setLoading(false);
                    return;
                }
                
                console.log("User data retrieved:", {
                    id: user._id,
                    name: userName,
                    email: email
                });
                
                setUserData({
                    id: user._id,
                    name: userName || 'Student',
                    email: email
                });
                
                await fetchProjects(user._id);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // When projects change, set the active project
    useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            setActiveProjectId(projects[0]._id);
        }
    }, [projects, activeProjectId]);

    // When active project changes, fetch its threads
    useEffect(() => {
        if (activeProjectId && isValidObjectId(activeProjectId)) {
            fetchDiscussionThreads(activeProjectId);
        } else if (activeProjectId) {
            console.error("Invalid project ID format:", activeProjectId);
            setError("Invalid project ID format. Cannot load discussions.");
        }
    }, [activeProjectId]);

    // When active thread changes, fetch its discussions
    useEffect(() => {
        if (activeThreadId && isValidObjectId(activeThreadId)) {
            fetchDiscussions(activeThreadId);
        } else if (activeThreadId) {
            console.error("Invalid thread ID format:", activeThreadId);
            setError("Invalid thread ID format. Cannot load messages.");
        }
    }, [activeThreadId]);

    const fetchProjects = async (userId) => {
        if (!userId || !isValidObjectId(userId)) {
            console.error("Invalid user ID:", userId);
            setError("Invalid user ID. Cannot load projects.");
            setLoading(false);
            return;
        }

        try {
            console.log('Fetching projects for user ID:', userId);
            const response = await axios.get('http://localhost:3001/project');
            console.log('All projects:', response.data);
            
            // Filter projects to those where the student is enrolled or is the owner
            const filteredProjects = response.data.filter(project => {
                // Check if students_enrolled field exists and is an array
                const isEnrolled = project.students_enrolled && 
                                  Array.isArray(project.students_enrolled) && 
                                  project.students_enrolled.some(studentId => {
                                      // Handle both string and object IDs
                                      if (typeof studentId === 'string') {
                                          return studentId === userId;
                                      } else if (studentId && typeof studentId === 'object' && studentId._id) {
                                          return studentId._id === userId;
                                      }
                                      return false;
                                  });
                
                // Check if user is the project owner (handle both string and object IDs)
                const isOwner = project.project_owner === userId || 
                               (project.project_owner && typeof project.project_owner === 'object' && 
                                project.project_owner._id === userId);
                
                // Debug logging for project enrollment
                if (DEBUG_MODE) {
                    console.log(`Project ${project._id} (${project.project_name}):`);
                    console.log(`- students_enrolled: ${JSON.stringify(project.students_enrolled)}`);
                    console.log(`- userId: ${userId}`);
                    console.log(`- isEnrolled: ${isEnrolled}`);
                    console.log(`- isOwner: ${isOwner}`);
                    
                    // Log each student ID for detailed debugging
                    if (project.students_enrolled && Array.isArray(project.students_enrolled)) {
                        project.students_enrolled.forEach((studentId, index) => {
                            const idToCheck = typeof studentId === 'string' ? studentId : 
                                             (studentId && typeof studentId === 'object' && studentId._id) ? 
                                             studentId._id : 'invalid';
                            console.log(`- student[${index}]: ${idToCheck} matches userId: ${idToCheck === userId}`);
                        });
                    }
                }
                
                return isEnrolled || isOwner;
            });
            
            console.log('Filtered projects for student:', filteredProjects);
            setProjects(filteredProjects);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            
            // If API is down, retry after a delay
            if (!error.response || error.response.status >= 500) {
                console.log('API might be down, retrying in 3 seconds...');
                setTimeout(() => {
                    fetchProjects(userId);
                }, 3000);
                return;
            }
            
            setError("Failed to load your projects. Please try again later.");
            setLoading(false);
        }
    };

    const fetchDiscussionThreads = async (projectId) => {
        try {
            console.log(`Fetching discussion threads for project ID: ${projectId}`);
            const endpoint = `http://localhost:3001/projects/${projectId}/discussion`;
            console.log('Calling endpoint:', endpoint);
            
            const response = await axios.get(endpoint);
            console.log('Discussion threads:', response.data);
            setDiscussionThreads(response.data);

            // Set the first thread as active if available and no active thread
            if (response.data.length > 0 && !activeThreadId) {
                setActiveThreadId(response.data[0]._id);
            } else if (response.data.length === 0) {
                // Clear active thread if no threads are available
                setActiveThreadId('');
                setDiscussions([]);
                
                // If project exists but has no threads, offer to create a default thread
                if (activeProject && userData) {
                    const createDefaultThread = window.confirm(
                        `Project "${activeProject.project_name}" doesn't have any discussion threads yet. Would you like to create one?`
                    );
                    
                    if (createDefaultThread) {
                        try {
                            console.log('Creating default discussion thread for project:', projectId);
                            const defaultThreadResponse = await axios.post(`http://localhost:3001/projects/${projectId}/discussion`, {
                                title: `${activeProject.project_name} Discussion`,
                                project_id: projectId,
                                created_by: userData.id,
                                discussion_id: projectId
                            });
                            
                            console.log('Default thread created:', defaultThreadResponse.data);
                            
                            // Refresh threads and set the new one as active
                            const updatedThreadsResponse = await axios.get(endpoint);
                            setDiscussionThreads(updatedThreadsResponse.data);
                            
                            if (updatedThreadsResponse.data.length > 0) {
                                setActiveThreadId(updatedThreadsResponse.data[0]._id);
                            }
                        } catch (createError) {
                            console.error('Error creating default thread:', createError);
                            alert('Failed to create a default discussion thread. You can create one manually.');
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error fetching discussion threads:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            setError(`Failed to load discussion threads for project ${projectId}. Please try again later.`);
        }
    };

    const fetchDiscussions = async (threadId) => {
        try {
            if (!threadId) return;
            console.log('Fetching discussions for thread ID:', threadId);
            
            // Fix: The correct endpoint should be using the project ID and thread ID
            // Find the current thread to get its project ID
            const thread = discussionThreads.find(t => t._id === threadId);
            if (!thread) {
                console.error('Thread not found:', threadId);
                setError('Thread information not available. Cannot load messages.');
                return;
            }
            
            const projectId = thread.project_id;
            // Use the correct endpoint structure that matches the backend controller
            const endpoint = `http://localhost:3001/projects/${projectId}/discussion/${threadId}`;
            console.log('Calling endpoint:', endpoint);
            
            const response = await axios.get(endpoint);
            console.log('Discussions:', response.data);
            
            // If the response has replies field, use that as our discussions
            if (response.data && response.data.replies) {
                setDiscussions(response.data.replies);
            } else {
                setDiscussions([]);
            }
        }
        catch (error) {
            console.error('Error fetching discussions:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            setError(`Failed to load messages for thread ${threadId}. Please try again later.`);
        }
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!newThreadTitle.trim() || !activeProjectId || !userData) return;

        try {
            // Create a new discussion thread
            const response = await axios.post(`http://localhost:3001/projects/${activeProjectId}/discussion`, {
                title: newThreadTitle,
                project_id: activeProjectId,
                created_by: userData.id, 
                discussion_id: activeProjectId // Initially set to project ID, will be updated by backend
            });

            console.log('Thread created:', response.data);
            await fetchDiscussionThreads(activeProjectId);
            setNewThreadTitle('');
            setIsCreatingThread(false);
            setActiveThreadId(response.data._id);
        } catch (error) {
            console.error('Error creating discussion thread:', error);
            alert('Failed to create thread. Please try again.');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThreadId || !activeThread || !userData) return;

        try {
            console.log('Active Thread:', activeThread);
            console.log('Sending message to thread:', activeThreadId);
            console.log('Message content:', newMessage);
            console.log('User data:', userData);

            // Update the thread with the new reply
            const updatedThread = await axios.put(`http://localhost:3001/projects/${activeProjectId}/discussion/${activeThreadId}`, {
                replies: [
                    ...(activeThread?.replies || []),
                    {
                        content: newMessage,
                        created_by: userData.id,
                        created_at: new Date(),
                        created_by_username: userData.name
                    }
                ]
            });

            console.log('Thread updated:', updatedThread.data);

            // Refresh the discussions
            await fetchDiscussions(activeThreadId);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            setError('Failed to send message. Please try again later.');
        }
    };

    const handleUpdateThread = async (threadId, updates) => {
        if (!userData) return;
        
        try {
            await axios.put(`http://localhost:3001/projects/${activeProjectId}/discussion/${threadId}`, updates);
            fetchDiscussionThreads(activeProjectId);
        } catch (error) {
            console.error('Error updating thread:', error);
            alert('Failed to update thread. Please try again.');
        }
    };

    const handleDeleteThread = async (threadId) => {
        try {
            // Delete the thread directly - no need to delete individual posts
            await axios.delete(`http://localhost:3001/projects/${activeProjectId}/discussion/${threadId}`);
            fetchDiscussionThreads(activeProjectId);
            if (activeThreadId === threadId) {
                setActiveThreadId('');
                setDiscussions([]);
            }
        } catch (error) {
            console.error('Error deleting thread:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            setError('Failed to delete thread. Please try again later.');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!userData) return;
        
        try {
            // Delete message by updating the thread and removing the message from replies
            const thread = discussionThreads.find(t => t._id === activeThreadId);
            if (thread) {
                await handleUpdateThread(activeThreadId, {
                    replies: thread.replies.filter(r => r._id !== messageId)
                });
                
                // Refresh the discussions
                await fetchDiscussions(activeThreadId);
            } else {
                setError('Thread not found. Cannot delete message.');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error URL:', error.config.url);
                console.error('Error method:', error.config.method);
            }
            setError('Failed to delete message. Please try again later.');
        }
    };

    const activeProject = projects.find(project => project._id === activeProjectId);
    const activeThread = discussionThreads.find(thread => thread._id === activeThreadId);
    const threadsForActiveProject = discussionThreads.filter(thread => thread.project_id === activeProjectId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: date.toLocaleDateString()
        };
    };

    // Add a function to test the API connection
    const testApiConnection = async () => {
        try {
            const projectsEndpoint = 'http://localhost:3001/project';
            console.log('Testing API connection to:', projectsEndpoint);
            const response = await axios.get(projectsEndpoint);
            console.log('API connection successful:', response.status);
            return true;
        } catch (error) {
            console.error('API connection test failed:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
            } else if (error.request) {
                console.error('No response received. Backend might be down.');
            } else {
                console.error('Error setting up request:', error.message);
            }
            return false;
        }
    };

    // When component loads, test API connection
    useEffect(() => {
        testApiConnection();
    }, []);

    // Navigation to project details page
    const handleViewProjectDetails = (projectId, e) => {
        e.stopPropagation(); // Prevent triggering the parent onClick
        router.push(`/student_dashboard/projects/${projectId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-white text-xl">Loading chats...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-red-500 text-xl p-8 bg-gray-800 rounded-lg shadow-lg max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Error Loading Chat</h2>
                    <p className="mb-4">{error}</p>
                    
                    {DEBUG_MODE && (
                        <div className="mt-4 p-4 bg-gray-900 rounded text-xs overflow-auto max-h-60">
                            <h3 className="text-white font-semibold mb-2">Debug Information</h3>
                            <p className="text-gray-300 mb-2">If you're seeing a 404 error, check the following:</p>
                            <ul className="list-disc pl-5 text-gray-300 space-y-1">
                                <li>Verify that the <code className="bg-gray-800 px-1 rounded">discussion</code> and <code className="bg-gray-800 px-1 rounded">project</code> backend services are running</li>
                                <li>Check that you're using the correct endpoint URLs (singular vs plural)</li>
                                <li>Ensure your user ID is correct and you're enrolled in the projects you're trying to access</li>
                                <li>Verify thread IDs and project IDs are valid MongoDB ObjectIds</li>
                            </ul>
                            <p className="text-gray-300 mt-4">Check browser console for detailed error logs</p>
                        </div>
                    )}
                    
                    <div className="flex space-x-4 mt-6">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                        <a 
                            href="/student_dashboard"
                            className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-white text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-2xl mb-4">No Project Chats Available</h2>
                    <p className="mb-6">You aren't enrolled in any projects yet. Join a project to start chatting with your team.</p>
                    <div className="space-y-4">
                        <a href="/student_dashboard/find_projects" className="block w-full px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 text-center">
                            Browse Projects
                        </a>
                        <a href="/student_dashboard" className="block w-full px-4 py-2 bg-gray-700 rounded-md text-white hover:bg-gray-600 text-center">
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-[calc(100vw-64px)] bg-gray-900 text-gray-100 fixed inset-y-0 left-16 right-4 overflow-hidden">
            {/* Projects list section - fixed width with hidden scrollbar */}
            <div className="w-[240px] flex-shrink-0 border-r border-gray-800 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center p-5">
                    <h2 className="text-xl font-semibold">Projects</h2>
                </div>
                <ul className="space-y-1 px-3 pb-5">
                    {projects.map(project => (
                        <li
                            key={project._id}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${activeProjectId === project._id
                                ? 'bg-indigo-900/40 text-white'
                                : 'hover:bg-gray-800'
                                }`}
                            onClick={() => setActiveProjectId(project._id)}
                        >
                            <h3 className="font-medium truncate">{project.project_name}</h3>
                            <p className="text-xs text-gray-400 truncate mt-1">{project.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xs">
                                    {project.is_approved === 'approved' ?
                                        <span className="text-green-400">Approved</span> :
                                        <span className="text-yellow-400">Pending</span>
                                    }
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(project.start_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-3 text-center">
                                <button
                                    className="w-full text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                                    onClick={(e) => handleViewProjectDetails(project._id, e)}
                                >
                                    View Project Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat threads section - fixed width with hidden scrollbar */}
            <div className="w-[240px] flex-shrink-0 border-r border-gray-800 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center p-5">
                    <h2 className="text-xl font-semibold">Threads</h2>
                    <button
                        onClick={() => setIsCreatingThread(!isCreatingThread)}
                        className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        title="Create new thread"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>

                {isCreatingThread && (
                    <form onSubmit={handleCreateThread} className="p-4 bg-gray-800 m-3 rounded-md">
                        <input
                            type="text"
                            placeholder="Thread title"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2"
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsCreatingThread(false)}
                                className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                )}

                <ul className="space-y-1 px-3 pb-5">
                    {threadsForActiveProject.length > 0 ? (
                        threadsForActiveProject.map((thread) => (
                            <li
                                key={thread._id}
                                className={`p-3 rounded-md cursor-pointer transition-colors ${activeThreadId === thread._id
                                    ? 'bg-indigo-900 text-white'
                                    : 'hover:bg-gray-800'
                                    }`}
                                onClick={() => setActiveThreadId(thread._id)}
                            >
                                <h3 className="font-medium truncate">{thread.title}</h3>
                                <p className="text-xs text-gray-400">{thread.replies?.length || 0} replies</p>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-400">
                            No threads yet. Create one to start discussing!
                        </li>
                    )}
                </ul>
            </div>

            {/* Messages section */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-gray-800 bg-gray-800 sticky top-0 z-10">
                    <h2 className="text-xl font-semibold">
                        {activeThread ? activeThread.title : "Select a thread"}
                    </h2>
                    {activeProject && (
                        <p className="text-sm text-gray-400">
                            Project: {activeProject.project_name}
                        </p>
                    )}
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-4">
                    {activeThread && activeThread.replies && activeThread.replies.length > 0 ? (
                        activeThread.replies.map((reply, index) => {
                            const isCurrentUser = reply.created_by === userData?.id;
                            const formattedDate = formatDate(reply.created_at);

                            return (
                                <div
                                    key={reply._id || index}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${isCurrentUser
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-gray-800 text-white rounded-tl-none'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm">{reply.created_by_username}</span>
                                            <div className="text-xs opacity-70">
                                                {formattedDate.time}
                                            </div>
                                        </div>
                                        <p className="text-sm">{reply.content}</p>
                                        <div className="text-xs opacity-70 text-right mt-1">
                                            {formattedDate.date}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            {activeThread
                                ? "No messages yet. Be the first to reply!"
                                : "Select a thread to view messages."}
                        </div>
                    )}
                </div>

                {/* Message input */}
                {activeThread && (
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex gap-2 sticky bottom-0 bg-gray-900">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            disabled={!activeThreadId}
                        />
                        <button
                            type="submit"
                            className="p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!activeThreadId || !newMessage.trim()}
                            title="Send message"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
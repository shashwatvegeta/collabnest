// ProjectDiscussionPage.jsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    project_owner: string;
    cap: number;
    start_date: string;
    end_date: string;
    tags: any[];
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
    const [newMessage, setNewMessage] = useState('');
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState('');
    const [activeThreadId, setActiveThreadId] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [discussionThreads, setDiscussionThreads] = useState<DiscussionThread[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            setActiveProjectId(projects[0]._id);
        }
    }, [projects, activeProjectId]);

    useEffect(() => {
        if (activeProjectId) {
            fetchDiscussionThreads(activeProjectId);
        }
    }, [activeProjectId]);

    useEffect(() => {
        if (activeThreadId) {
            fetchDiscussions(activeThreadId);
        }
    }, [activeThreadId]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/project');
            console.log('All projects:', response.data);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Filter projects where the owner ID matches ADMIN_INFO.id
    const ongoingProjects = projects.filter((project) => {
        return project.project_owner === ADMIN_INFO.id;
    });

    const fetchDiscussionThreads = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:3001/projects/${projectId}/discussion`);
            console.log('Discussion threads:', response.data);
            setDiscussionThreads(response.data);

            // Set the first thread as active if available and no active thread
            if (response.data.length > 0 && !activeThreadId) {
                setActiveThreadId(response.data[0]._id);
            }
        }
        catch (error) {
            console.error('Error fetching discussion threads:', error);
        }
    };

    const fetchDiscussions = async (threadId) => {
        try {
            if (!threadId) return;
            console.log('Fetching discussions for thread:', threadId);

            const response = await axios.get(`http://localhost:3001/discussions/${threadId}/discussion_post`);
            console.log('Discussions:', response.data);
            setDiscussions(response.data);
        }
        catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!newThreadTitle.trim() || !activeProjectId) return;

        try {
            // Create a new discussion thread
            const response = await axios.post(`http://localhost:3001/projects/${activeProjectId}/discussion`, {
                title: newThreadTitle,
                project_id: activeProjectId,
                created_by: ADMIN_INFO.id,
                discussion_id: activeProjectId // Initially set to project ID, will be updated by backend
            });

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
        if (!newMessage.trim() || !activeThreadId || !activeThread) return;

        try {
            console.log('Active Thread:', activeThread);
            console.log('Sending message to thread:', activeThreadId);

            // Update the thread with the new reply
            const updatedThread = await axios.put(`http://localhost:3001/projects/${activeProjectId}/discussion/${activeThreadId}`, {
                replies: [
                    ...(activeThread?.replies || []),
                    {
                        content: newMessage,
                        created_by: ADMIN_INFO.id,
                        created_at: new Date(),
                        created_by_username: ADMIN_INFO.name
                    }
                ]
            });

            console.log('Thread updated:', updatedThread.data);

            // Refresh the data
            await fetchDiscussionThreads(activeProjectId);
            await fetchDiscussions(activeThreadId);
            setNewMessage('');


        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        }
    };

    const handleUpdateThread = async (threadId, updates) => {
        try {
            await axios.put(`http://localhost:3001/projects/${activeProjectId}/discussion/${threadId}`, updates);
            fetchDiscussionThreads(activeProjectId);
        } catch (error) {
            console.error('Error updating thread:', error);
        }
    };

    const handleDeleteThread = async (threadId) => {
        try {
            // First delete all discussion posts
            const discussions = await axios.get(`http://localhost:3001/discussions/${threadId}/discussion_post`);
            for (const post of discussions.data) {
                await axios.delete(`http://localhost:3001/discussions/${threadId}/discussion_post/${post._id}`);
            }

            // Then delete the thread
            await axios.delete(`http://localhost:3001/projects/${activeProjectId}/discussion/${threadId}`);
            fetchDiscussionThreads(activeProjectId);
            if (activeThreadId === threadId) {
                setActiveThreadId('');
            }
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            // Delete from both the thread replies and discussion posts
            const thread = discussionThreads.find(t => t._id === activeThreadId);
            if (thread) {
                await handleUpdateThread(activeThreadId, {
                    replies: thread.replies.filter(r => r._id !== messageId)
                });
            }

            await axios.delete(`http://localhost:3001/discussions/${activeThreadId}/discussion_post/${messageId}`);
            fetchDiscussions(activeThreadId);
        } catch (error) {
            console.error('Error deleting message:', error);
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

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Projects list section - adjusted to position after the main sidebar */}
            <div className="w-80 border-r border-gray-800 overflow-y-auto fixed left-64 top-0 bottom-0 z-10">
                <div className="flex justify-between items-center p-5">
                    <h2 className="text-xl font-semibold">Projects</h2>
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                <div className="px-3">
                    {ongoingProjects.map(project => (
                        <div
                            key={project._id}
                            className={`p-3 my-1 rounded-lg cursor-pointer transition-colors ${project._id === activeProjectId ? 'bg-indigo-900/40' : 'hover:bg-gray-800'}`}
                            onClick={() => setActiveProjectId(project._id)}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">{project.project_name}</span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">{project.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xs">
                                    {project.is_approved ?
                                        <span className="text-green-400">Approved</span> :
                                        <span className="text-yellow-400">Pending</span>
                                    }
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(project.start_date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discussion content section - adjusted margin to account for both sidebars */}
            <div className="flex flex-col flex-1 ml-[36rem]">
                {/* Project header */}
                {activeProject && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div>
                            <h3 className="font-semibold text-lg">{activeProject.project_name}</h3>
                            <p className="text-xs text-gray-400">
                                {activeProject.is_completed ? 'Completed' : 'Ongoing'} •
                                Cap: {activeProject.cap}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Discussion threads selection */}
                {activeProject && (
                    <div className="border-b border-gray-800 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Discussion Threads</h4>
                            <button
                                className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                                onClick={() => setIsCreatingThread(!isCreatingThread)}
                            >
                                {isCreatingThread ? 'Cancel' : 'New Thread'}
                            </button>
                        </div>

                        {isCreatingThread && (
                            <form onSubmit={handleCreateThread} className="mb-3">
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="flex-1 bg-gray-800 text-white p-2 rounded-l-md focus:outline-none text-sm"
                                        placeholder="Thread title..."
                                        value={newThreadTitle}
                                        onChange={(e) => setNewThreadTitle(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-r-md transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {threadsForActiveProject.map(thread => (
                                <button
                                    key={thread._id}
                                    className={`px-3 py-1 text-sm rounded whitespace-nowrap ${thread._id === activeThreadId ? 'bg-indigo-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                                    onClick={() => setActiveThreadId(thread._id)}
                                >
                                    {thread.title}
                                </button>
                            ))}
                            {threadsForActiveProject.length === 0 && !isCreatingThread && (
                                <div className="text-sm text-gray-400">No discussion threads yet. Create one to start the conversation.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Discussion messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {activeThread ? (
                        <div>
                            <div className="mb-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">{activeThread.title}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDeleteThread(activeThread._id)}
                                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                            title="Delete thread"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {activeThread.description && (
                                    <p className="text-sm text-gray-400 mt-1">{activeThread.description}</p>
                                )}
                            </div>

                            {/* Thread replies (embedded in the thread document) */}
                            {activeThread.replies && activeThread.replies.length > 0 && (
                                <div className="space-y-4 mb-6">
                                    {activeThread.replies.map((reply, index) => {
                                        const formattedDate = formatDate(reply.created_at);
                                        return (
                                            <div key={`thread-reply-${index}`} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                    {reply.created_by_username ? reply.created_by_username.charAt(0) : 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center">
                                                            <span className="font-semibold mr-2">
                                                                {reply.created_by_username || 'User'}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {formattedDate.time} • {formattedDate.date}
                                                            </span>
                                                        </div>
                                                        {reply.created_by === ADMIN_INFO.id && (
                                                            <div className="flex space-x-1">
                                                                <button
                                                                    onClick={() => handleDeleteMessage(reply._id)}
                                                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                                    title="Delete message"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-gray-800 rounded-lg">
                                                        {reply.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Separate discussion messages */}
                            {discussions.length > 0 ? (
                                <div className="space-y-4">
                                    {discussions.map(message => {
                                        const formattedDate = formatDate(message.posted_at);
                                        return (
                                            <div key={message._id} className="flex items-start space-x-3">
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.posted_by === ADMIN_INFO.id ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                                                    {message.posted_by === ADMIN_INFO.id ? ADMIN_INFO.name.charAt(0) : 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center">
                                                            <span className="font-semibold mr-2">
                                                                {message.posted_by === ADMIN_INFO.id ? ADMIN_INFO.name : 'User'}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {formattedDate.time} • {formattedDate.date}
                                                            </span>
                                                        </div>
                                                        {message.posted_by === ADMIN_INFO.id && (
                                                            <div className="flex space-x-1">
                                                                <button
                                                                    onClick={() => handleDeleteMessage(message._id)}
                                                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                                    title="Delete message"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-gray-800 rounded-lg">
                                                        {message.reply_message}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 my-8">
                                    No messages in this discussion yet. Start the conversation!
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No discussion selected</h3>
                            <p className="text-sm text-gray-400">
                                {threadsForActiveProject.length > 0
                                    ? "Select a discussion thread to view messages"
                                    : "Create a new discussion thread to start a conversation"}
                            </p>
                        </div>
                    )}
                </div>

                {/* New message input */}
                {activeThread && (
                    <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-800">
                        <input
                            type="text"
                            className="flex-1 bg-gray-800 text-white p-3 rounded-l-md focus:outline-none"
                            placeholder="Add to the discussion..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-r-md transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
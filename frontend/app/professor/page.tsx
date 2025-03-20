'use client'

import { useState, useEffect } from 'react';
import ProfessorLayout from './components/ProfessorLayout';
import Link from 'next/link';
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
}

export default function ProfessorDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState({
        satisfactionRate: 95,
        activeUsers: 2600,
        otherUsers: 1200
    });

    useEffect(() => {
        fetchProjects();
        fetchNotifications();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/project');
            setProjects(response.data);

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/notifications/received/${ADMIN_INFO.id}`);
            setNotifications(response.data.notifications);
            console.log(response.data.notifications);

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
                <div className="mb-6">
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
                    <div className="bg-indigo-500 bg-opacity-20 p-6 rounded-lg">
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
                                {ongoingProjects.slice(0, 4).map((project) => (
                                    <div key={project._id} className="bg-slate-800 p-4 rounded-lg">
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
                    <div>
                        <div className="bg-slate-800 p-6 rounded-lg mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-white text-xl font-semibold">Notifications</h2>
                                <div className="flex gap-2">
                                    <button
                                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                                        onClick={markAllAsRead}
                                    >
                                        Mark all as read
                                    </button>
                                    <button
                                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                                        onClick={fetchNotifications}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {getUnreadNotifications().length > 0 ? (
                                    getUnreadNotifications().slice(0, 3).map((notification) => (
                                        <div
                                            key={notification._id}
                                            className="p-4 rounded-lg border-l-4 border-indigo-500 bg-slate-700"
                                        >
                                            <div className="flex justify-between">
                                                <p className="text-white font-medium">
                                                    {notification.message}
                                                </p>
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                                >
                                                    Mark as read
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-lg bg-slate-700 text-center">
                                        <p className="text-gray-300">No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Statistics */}
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <h2 className="text-white text-xl font-semibold mb-4">Project Statistics</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <h3 className="text-sm text-gray-400 mb-1">Satisfaction Rate</h3>
                                    <div className="flex items-center justify-center h-32 relative">
                                        <div className="absolute text-center">
                                            <span className="text-indigo-400 text-3xl font-bold">{stats.satisfactionRate}%</span>
                                        </div>
                                        <svg width="120" height="120" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="#374151" strokeWidth="12" />
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="#6366f1" strokeWidth="12"
                                                strokeDasharray="339.5" strokeDashoffset={339.5 - (339.5 * stats.satisfactionRate / 100)}
                                                transform="rotate(-90 60 60)" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <h3 className="text-sm text-gray-400 mb-2">Active Users</h3>
                                    <div className="flex items-center justify-center h-32">
                                        <div className="w-full">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-indigo-400 font-medium">Users</span>
                                                <span className="text-gray-400">Others</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-bold text-white">{(stats.activeUsers / 1000).toFixed(1)}K</div>
                                                <div className="text-lg text-gray-400">{(stats.otherUsers / 1000).toFixed(1)}K</div>
                                            </div>
                                            <div className="bg-gray-700 rounded-full h-2 mt-2">
                                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(stats.activeUsers / (stats.activeUsers + stats.otherUsers)) * 100}%` }}></div>
                                            </div>
                                            <p className="text-xs text-green-400 mt-2">+2% than last week</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProfessorLayout>
    );
}
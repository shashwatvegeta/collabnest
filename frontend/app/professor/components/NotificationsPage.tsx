'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, Trash, RefreshCw, UserPlus, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

// Admin info constant (same as in your dashboard)
const ADMIN_INFO = {
    name: 'Shashwat Kumar Singh',
    role: 'PROFESSOR',
    email: 'jyotishikha2007@gmail.com',
    id: '67d43bbaa0d1c77b0fb4aed6'
};

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

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [processingIds, setProcessingIds] = useState<string[]>([]);

    useEffect(() => {
        fetchNotifications();
        fetchProjects();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/notifications/received/${ADMIN_INFO.id}`);
            setNotifications(response.data.notifications);
            console.log('Fetched notifications:', response.data.notifications);
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
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/project');
            setProjects(response.data);
            console.log('Fetched projects:', response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await axios.patch(`http://localhost:3001/notifications/read`, {
                notificationId,
                readerId: ADMIN_INFO.id
            });

            // Update local state
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
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(`http://localhost:3001/notifications/${ADMIN_INFO.id}/read-all`);

            // Update all notifications in local state
            setNotifications(notifications.map(notification => {
                const newReadBy = [...(notification.readBy || [])];
                // Only add if not already present
                if (!newReadBy.some(reader => reader.readerId === ADMIN_INFO.id)) {
                    newReadBy.push({
                        readerId: ADMIN_INFO.id,
                        readAt: new Date().toISOString(),
                        _id: `temp-${Date.now()}`
                    });
                }
                return { ...notification, readBy: newReadBy };
            }));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Extract student ID and project ID from join request message
    const extractIdsFromMessage = (message: string) => {
        // Expected format: "student.id requested to join project.id"
        const regex = /(.+) requested to join (.+)/;
        const match = message.match(regex);

        if (match && match.length === 3) {
            return {
                studentId: match[1],
                projectId: match[2]
            };
        }

        return null;
    };

    // Handle approval of join request
    const handleApprove = async (notificationId: string, message: string) => {
        const ids = extractIdsFromMessage(message);
        if (!ids) {
            console.error('Could not extract IDs from message:', message);
            return;
        }

        setProcessingIds(prev => [...prev, notificationId]);

        try {
            console.log('Approving join request:', ids.studentId, ids.projectId);
            // Make API call to approve the join request
            await axios.post(`http://localhost:3001/project/${ids.projectId}/students/${ids.studentId}`);

            // Mark the notification as read
            await markAsRead(notificationId);

            // Optionally, remove the notification or update its status
            setNotifications(notifications.filter(n => n._id !== notificationId));

            // Refresh projects to get updated data
            await fetchProjects();
        } catch (error) {
            console.error('Error approving join request:', error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== notificationId));
        }
    };

    // Handle decline of join request
    const handleDecline = async (notificationId: string, message: string) => {
        const ids = extractIdsFromMessage(message);
        if (!ids) {
            console.error('Could not extract IDs from message:', message);
            return;
        }

        setProcessingIds(prev => [...prev, notificationId]);

        try {
            // Make API call to decline the join request


            // Mark the notification as read
            await markAsRead(notificationId);

            // Optionally, remove the notification or update its status
            setNotifications(notifications.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Error declining join request:', error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== notificationId));
        }
    };

    // Check if a notification is a join request
    const isJoinRequest = (message: string) => {
        return message.includes('requested to join');
    };

    // Filter notifications based on read status
    const getFilteredNotifications = () => {
        const allNotifications = [...notifications];

        if (activeTab === 'unread') {
            return allNotifications.filter(notification => {
                if (!notification.readBy || !Array.isArray(notification.readBy)) {
                    return true; // Consider as unread if no readBy array
                }
                return !notification.readBy.some(reader => reader.readerId === ADMIN_INFO.id);
            });
        } else if (activeTab === 'read') {
            return allNotifications.filter(notification => {
                if (!notification.readBy || !Array.isArray(notification.readBy)) {
                    return false;
                }
                return notification.readBy.some(reader => reader.readerId === ADMIN_INFO.id);
            });
        }

        return allNotifications;
    };

    // Get notification type from message content
    const getNotificationType = (message: string) => {
        if (message.includes('Error')) return 'error';
        if (message.includes('deadline') || message.includes('approaching')) return 'warning';
        if (message.includes('completed') || message.includes('approved')) return 'success';
        if (message.includes('requested to join')) return 'request';
        return 'info';
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'request':
                return <UserPlus className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5 text-indigo-400" />;
        }
    };

    // Format date to relative time
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 24 * 60) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInMinutes / (24 * 60));
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={markAllAsRead}
                        className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
                    >
                        Mark all as read
                    </button>
                    <button
                        onClick={fetchNotifications}
                        className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors flex items-center gap-1"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'all' ? 'bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'unread' ? 'bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                >
                    Unread
                </button>
                <button
                    onClick={() => setActiveTab('read')}
                    className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'read' ? 'bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                >
                    Read
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <RefreshCw className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-gray-400">Loading notifications...</p>
                    </div>
                ) : getFilteredNotifications().length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Bell className="h-12 w-12 text-gray-600 mb-4" />
                        <p className="text-gray-400">No notifications to display</p>
                    </div>
                ) : (
                    getFilteredNotifications().map((notification) => {
                        const isRead = notification.readBy?.some(reader => reader.readerId === ADMIN_INFO.id);
                        const notificationType = getNotificationType(notification.message);
                        const isJoinReq = isJoinRequest(notification.message);
                        const isProcessing = processingIds.includes(notification._id);

                        return (
                            <div
                                key={notification._id}
                                className={`flex items-start p-4 border-b border-gray-700 hover:bg-slate-800 transition-colors ${!isRead ? 'bg-slate-800/50' : ''
                                    }`}
                            >
                                <div className="mr-3 mt-1">
                                    {getNotificationIcon(notificationType)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-white">
                                            {notification.message}
                                            {!isRead && (
                                                <span className="ml-2 bg-indigo-500 px-1.5 py-0.5 rounded-full text-xs">
                                                    New
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatRelativeTime(notification.created_at)}
                                    </p>

                                    {/* Join request approval buttons */}
                                    {isJoinReq && (
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                onClick={() => handleApprove(notification._id, notification.message)}
                                                disabled={isProcessing}
                                                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1"
                                            >
                                                {isProcessing ? (
                                                    <RefreshCw size={12} className="animate-spin" />
                                                ) : (
                                                    <ThumbsUp size={12} />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleDecline(notification._id, notification.message)}
                                                disabled={isProcessing}
                                                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-1"
                                            >
                                                {isProcessing ? (
                                                    <RefreshCw size={12} className="animate-spin" />
                                                ) : (
                                                    <ThumbsDown size={12} />
                                                )}
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex ml-2">
                                    {!isRead && !isJoinReq && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notification._id);
                                            }}
                                            className="text-gray-400 hover:text-white p-1 transition-colors"
                                            title="Mark as read"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
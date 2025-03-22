'use client';

import React, { useEffect, useState } from 'react';
import ProfessorLayout from '../components/ProfessorLayout';
import axios from 'axios';

// Admin info constant
const ADMIN_INFO = {
    name: 'Shashwat Kumar Singh',
    role: 'PROFESSOR',
    email: 'jyotishikha2007@gmail.com',
    id: '67d43bbaa0d1c77b0fb4aed6'
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const isUnread = !notification.readBy || notification.readBy.length === 0 || 
                    !notification.readBy.some(reader => reader.readerId === ADMIN_INFO.id);
    
    // Format date with better error handling and logging
    const formatDate = (dateString) => {
        // Debug log to see what date values we're getting
        console.log("Date value received:", dateString, typeof dateString);
        
        if (!dateString) {
            return 'Just now';
        }

        try {
            // Try to parse using multiple approaches
            let date;
            
            // If it's already a Date object
            if (dateString instanceof Date) {
                date = dateString;
            } 
            // Try direct parsing
            else {
                date = new Date(dateString);
            }

            // Validate the date
            if (isNaN(date.getTime())) {
                console.warn("Invalid date parsed:", dateString);
                return 'Just now'; // Fallback for invalid dates
            }
            
            // Format the date
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Error formatting date:", e, dateString);
            return 'Just now';
        }
    };
    
    return (
        <div 
            className={`bg-slate-700 p-3 rounded-lg mb-2 hover:bg-slate-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${isUnread ? 'border-l-4 border-indigo-500' : ''}`}
            onClick={() => isUnread && onMarkAsRead(notification._id)}
        >
            <div className="flex">
                <div className="flex-1">
                    <div className="font-semibold text-white flex items-center gap-1">
                        {notification.message}
                        {isUnread && (
                            <span className="text-pink-400 animate-pulse">•</span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [displayedNotifications, setDisplayedNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:3001/notifications/received/${ADMIN_INFO.id}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch notifications');
            }
            
            console.log("Fetched notifications:", response.data.notifications);
            
            // Process notifications to add appropriate dates
            const processedNotifications = await Promise.all(response.data.notifications.map(async notification => {
                // Check if this notification is related to an application
                const isApplicationNotification = notification.message && 
                    (notification.message.includes('applied to join') || 
                     notification.message.includes('application'));
                
                if (isApplicationNotification) {
                    console.log("Found application notification:", notification.message);
                    
                    // Try to extract project ID and/or application ID from the notification content
                    // This is a fallback approach in case direct reference is not available
                    let applicationData = null;
                    
                    try {
                        // First, fetch all projects where the current user is the owner
                        const projectsResponse = await axios.get('http://localhost:3001/project');
                        const professorProjects = projectsResponse.data.filter(
                            project => project.project_owner === ADMIN_INFO.id
                        );
                        
                        // For each project, try to find pending applications
                        for (const project of professorProjects) {
                            try {
                                const applicationsResponse = await axios.get(
                                    `http://localhost:3001/projects/${project._id}/applications`
                                );
                                
                                // Find applications that might match this notification
                                const matchingApp = applicationsResponse.data.find(app => 
                                    app.user_id && 
                                    notification.message.includes(app.user_id.username || '')
                                );
                                
                                if (matchingApp) {
                                    applicationData = matchingApp;
                                    console.log("Found matching application:", applicationData);
                                    break;
                                }
                            } catch (e) {
                                console.error("Error fetching applications for project:", project._id, e);
                            }
                        }
                    } catch (e) {
                        console.error("Error fetching projects:", e);
                    }
                    
                    // If we found a matching application with a submission date, use it
                    if (applicationData && applicationData.submission_date) {
                        console.log("Using application submission date:", applicationData.submission_date);
                        notification.created_at = applicationData.submission_date;
                    } else if (!notification.created_at) {
                        // No application found or no submission_date, but still no created_at
                        notification.created_at = new Date().toISOString();
                    }
                }
                
                // For non-application notifications or if application matching failed
                if (!notification.created_at) {
                    notification.created_at = new Date().toISOString();
                }
                
                return notification;
            }));
            
            setNotifications(processedNotifications);
            // Initially display only 5 notifications
            setDisplayedNotifications(processedNotifications.slice(0, 5));
        } catch (err) {
            setError(err.message);
            console.error('Error fetching notifications:', err);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setIsLoaded(true);
            }, 300);
        }
    };

    // Handle showing all notifications
    const handleShowMore = () => {
        setShowAll(true);
        setDisplayedNotifications(notifications);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await axios.patch('http://localhost:3001/notifications/read', {
                notificationId,
                readerId: ADMIN_INFO.id
            });

            if (response.status !== 200) {
                throw new Error('Failed to mark notification as read');
            }

            // Update the local state to reflect the change
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId
                    ? { 
                        ...notification, 
                        readBy: [
                            ...(notification.readBy || []),
                            { 
                                readerId: ADMIN_INFO.id, 
                                readAt: new Date().toISOString(),
                                _id: `temp-${Date.now()}`
                            }
                        ] 
                    }
                    : notification
            );
            
            setNotifications(updatedNotifications);
            setDisplayedNotifications(showAll ? updatedNotifications : updatedNotifications.slice(0, 5));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await axios.patch(`http://localhost:3001/notifications/${ADMIN_INFO.id}/read-all`);

            if (response.status !== 200) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update the local state to reflect the change
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                readBy: [
                    ...(notification.readBy || []),
                    { 
                        readerId: ADMIN_INFO.id, 
                        readAt: new Date().toISOString(),
                        _id: `temp-${Date.now()}`
                    }
                ]
            }));
            
            setNotifications(updatedNotifications);
            setDisplayedNotifications(showAll ? updatedNotifications : updatedNotifications.slice(0, 5));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    if (isLoading) {
        return (
            <ProfessorLayout>
                <div className="flex items-center justify-center min-h-screen bg-slate-900">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                        <div className="text-indigo-300 text-lg">Loading notifications...</div>
                    </div>
                </div>
            </ProfessorLayout>
        );
    }

    const unreadCount = notifications.filter(n => !n.readBy || n.readBy.length === 0 || 
                                               !n.readBy.some(reader => reader.readerId === ADMIN_INFO.id)).length;

    return (
        <ProfessorLayout>
            <div className="min-h-screen bg-slate-900 p-6">
                <div className={`transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all text-sm"
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {error ? (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
                            {error}
                        </div>
                    ) : displayedNotifications.length > 0 ? (
                        <div className="space-y-2">
                            {displayedNotifications.map((notification, index) => (
                                <div
                                    key={notification._id}
                                    className={`transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <NotificationItem
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                </div>
                            ))}
                            
                            {!showAll && notifications.length > 5 && (
                                <div className="text-center mt-4">
                                    <button 
                                        onClick={handleShowMore}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all transform hover:scale-105 text-sm"
                                    >
                                        Show More ({notifications.length - 5} more)
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-800 rounded-lg border border-indigo-500/10">
                            <div className="inline-block p-2 rounded-full bg-indigo-500/10 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <p className="text-white text-base mb-1">No notifications yet</p>
                            <p className="text-sm text-gray-400">You'll see notifications here when you receive them.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProfessorLayout>
    );
}
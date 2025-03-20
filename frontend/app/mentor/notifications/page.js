"use client";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { redirect } from "next/navigation";
import { getEmail } from "@/lib/auth_utility";

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const isUnread = !notification.readBy || notification.readBy.length === 0;
    
    return (
        <div 
            className={`bg-indigo-900/40 p-2 sm:p-3 rounded-lg mb-1 hover:bg-indigo-900/60 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${isUnread ? 'border-l-2 border-violet-400' : ''}`}
            onClick={() => isUnread && onMarkAsRead(notification._id)}
        >
            <div className="flex">
                <div className="flex-1">
                    <div className="font-semibold text-white flex items-center gap-1 text-sm sm:text-base">
                        {notification.message}
                        {isUnread && (
                            <span className="text-pink-400 animate-pulse">•</span>
                        )}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-200 mt-0.5">
                        {new Date(notification.createdAt).toLocaleString()}
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
    const isAuthenticated = useIsAuthenticated();
    const [email, setEmail] = useState("");
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/");
        }
        setEmail(getEmail());
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3001/notifications/received/${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }
                const data = await response.json();
                setNotifications(data.notifications);
                // Initially display only 5 notifications
                setDisplayedNotifications(data.notifications.slice(0, 5));
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

        if (email) {
            fetchNotifications();
        }
    }, [email]);

    // Handle showing all notifications
    const handleShowMore = () => {
        setShowAll(true);
        setDisplayedNotifications(notifications);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch('http://localhost:3001/notifications/read', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notificationId,
                    readerId: email
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update the local state to reflect the change
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId
                    ? { ...notification, readBy: [{ readerId: email, readAt: new Date() }] }
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
            const response = await fetch(`http://localhost:3001/notifications/${email}/read-all`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update the local state to reflect the change
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                readBy: [{ readerId: email, readAt: new Date() }]
            }));
            
            setNotifications(updatedNotifications);
            setDisplayedNotifications(showAll ? updatedNotifications : updatedNotifications.slice(0, 5));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <div className="text-violet-300 text-lg">Loading notifications...</div>
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.readBy || n.readBy.length === 0).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-2 sm:p-4 md:p-6 pl-4 sm:pl-8 md:pl-16 lg:pl-28">
            <div className={`transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-500`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-3 py-1.5 bg-violet-500/30 hover:bg-violet-500/50 text-white rounded-lg transition-all border border-violet-500/30 text-xs sm:text-sm"
                        >
                            Mark All as Read
                        </button>
                    )}
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2 sm:p-3 rounded-lg text-sm">
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
                                    className="px-3 py-1.5 bg-violet-500/30 hover:bg-violet-500/50 text-white rounded-lg transition-all border border-violet-500/30 transform hover:scale-105 text-xs sm:text-sm"
                                >
                                    Show More ({notifications.length - 5} more)
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
                        <p className="text-purple-200 text-base mb-1">No notifications yet</p>
                        <p className="text-xs sm:text-sm text-violet-300">You'll see notifications here when you receive them.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEmail, getName } from "@/lib/auth_utility";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [isReadingMore, setIsReadingMore] = useState(false);
  const isTruncated = notification.message && notification.message.length > 150;
  
  let senderName = "System";
  if (notification.sender && notification.sender.username) {
    senderName = notification.sender.username;
  }
  
  // Format the date
  const formattedDate = notification.createdAt 
    ? new Date(notification.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown date';
  
  // Check if notification is read by this user
  const isRead = notification.readBy && notification.readBy.some(read => 
    read.readerId === notification.currentUserId);
    
  return (
    <div className={`bg-indigo-900/40 p-4 rounded-lg mb-4 border-l-4 ${isRead ? 'border-gray-600' : 'border-violet-500'} transition-all duration-300 hover:bg-indigo-900/60`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div className="font-semibold text-white flex items-center">
              <span className="text-violet-300 mr-2">{senderName}</span>
              {!isRead && <span className="w-2 h-2 bg-violet-500 rounded-full ml-1"></span>}
            </div>
            <div className="text-xs text-gray-400 ml-auto">{formattedDate}</div>
          </div>
          
          <div className="text-sm text-purple-200 mb-2">
            {isReadingMore || !isTruncated 
              ? notification.message 
              : `${notification.message.substring(0, 150)}...`}
          </div>
          
          {isTruncated && (
            <button 
              onClick={() => setIsReadingMore(!isReadingMore)}
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              {isReadingMore ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
      
      {!isRead && (
        <div className="mt-3 text-right">
          <button 
            onClick={() => onMarkAsRead(notification._id)}
            className="px-2 py-1 bg-violet-600/30 text-violet-300 text-xs rounded hover:bg-violet-600/50 transition-colors"
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default function MentorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  // Get the current user's email and name
  useEffect(() => {
    setUserId("67cde2e83c0958c938ef6210"); // Replace with actual user ID lookup logic
  }, []);
  
  // Fetch notifications when userId is available
  useEffect(() => {
    if (!userId) return;
    
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let endpoint = `/notifications/received/${userId}`;
        if (filter === 'unread') {
          endpoint = `/notifications/${userId}/unread`;
        }
        
        const response = await fetch(`http://localhost:3001${endpoint}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        
        // Add currentUserId to each notification to simplify read status checking
        const enhancedNotifications = data.notifications.map(notification => ({
          ...notification,
          currentUserId: userId
        }));
        
        setNotifications(enhancedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [userId, filter]);
  
  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:3001/notifications/read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          readerId: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update the local state to show the notification as read
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? {
              ...notification,
              readBy: [...(notification.readBy || []), { readerId: userId, readAt: new Date() }]
            }
          : notification
      ));
      
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Failed to mark notification as read');
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`http://localhost:3001/notifications/${userId}/read-all`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      // Update all notifications in the local state as read
      setNotifications(notifications.map(notification => ({
        ...notification,
        readBy: [...(notification.readBy || []), { readerId: userId, readAt: new Date() }]
      })));
      
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      alert('Failed to mark all notifications as read');
    }
  };
  
  // Filter notifications based on read status
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    
    const isRead = notification.readBy && notification.readBy.some(read => 
      read.readerId === userId);
      
    return filter === 'read' ? isRead : !isRead;
  });
  
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 pl-24 md:pl-28">
      <div className="flex items-center mb-6">
        <Link href="/mentor" className="text-violet-400 hover:text-violet-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white ml-4">Notifications</h1>
        
        <div className="ml-auto">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-3 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors"
            disabled={isLoading || filteredNotifications.every(n => n.readBy?.some(r => r.readerId === userId))}
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div className="mb-6 flex gap-4">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-violet-600 text-white' : 'bg-indigo-900/40 text-gray-300 hover:bg-indigo-900/60'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('unread')} 
          className={`px-4 py-2 rounded ${filter === 'unread' ? 'bg-violet-600 text-white' : 'bg-indigo-900/40 text-gray-300 hover:bg-indigo-900/60'}`}
        >
          Unread
        </button>
        <button 
          onClick={() => setFilter('read')} 
          className={`px-4 py-2 rounded ${filter === 'read' ? 'bg-violet-600 text-white' : 'bg-indigo-900/40 text-gray-300 hover:bg-indigo-900/60'}`}
        >
          Read
        </button>
      </div>
      
      <div className="bg-[#2a2a38] rounded-lg border-2 border-violet-300/30 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <div className="ml-3 text-violet-300">Loading notifications...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4">📬</div>
            <p>No notifications to display</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')} 
                className="mt-3 text-violet-400 hover:text-violet-300"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <NotificationItem 
                key={notification._id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
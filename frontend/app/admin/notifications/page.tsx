'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import NotificationCard from '../components/NotificationCard';
import ProjectStatistics from '../components/ProjectStatistics';

// Hardcoded admin ID for demo purposes
const ADMIN_ID = 1;

interface Notification {
  _id: string;
  sender_id: number;
  message: string;
  project_id: string;
  isApproved: boolean;
  created_at: string;
}

interface Project {
  _id: string;
  project_name: string;
  description: string;
  is_approved: boolean;
  project_owner: number;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    fetchPendingProjects();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/admin/${ADMIN_ID}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchPendingProjects = async () => {
    try {
      const response = await axios.get('/api/project/pending');
      setPendingProjects(response.data);
    } catch (error) {
      console.error('Error fetching pending projects:', error);
    }
  };

  const handleApprove = async (notificationId: string, projectId: string) => {
    try {
      // Approve the notification
      await axios.put(`/api/notifications/${notificationId}/approve/${ADMIN_ID}`);
      
      // Approve the project
      await axios.put(`/api/project/${projectId}/approve`);
      
      // Refresh data
      fetchNotifications();
      fetchPendingProjects();
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      // Just mark the notification as seen/removed
      await axios.put(`/api/notifications/${notificationId}/approve/${ADMIN_ID}`);
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#151929] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Welcome Back, Admin!</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[#7c68ee33] rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Project Approvals</h3>
                  <button className="bg-[#1e233a] text-white px-4 py-1 rounded-full text-sm">
                    View all &gt;
                  </button>
                </div>
                
                {pendingProjects.length === 0 ? (
                  <p className="text-gray-400">No pending projects to approve</p>
                ) : (
                  pendingProjects.map((project) => (
                    <NotificationCard
                      key={project._id}
                      title={project.project_name}
                      message={project.description}
                      onApprove={() => {
                        const notification = notifications.find(n => n.project_id === project._id);
                        if (notification) {
                          handleApprove(notification._id, project._id);
                        }
                      }}
                      onDelete={() => {
                        const notification = notifications.find(n => n.project_id === project._id);
                        if (notification) {
                          handleDelete(notification._id);
                        }
                      }}
                    />
                  ))
                )}
                
                <div className="mt-4 text-center">
                  <button className="bg-[#7c68ee] text-white px-6 py-2 rounded-md">
                    View All
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#1e233a] rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Project Statistics</h3>
                <ProjectStatistics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
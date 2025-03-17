'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import Link from 'next/link';
import axios from 'axios';

// Hardcoded admin info
const ADMIN_INFO = {
  name: 'Jyoti Shikha',
  role: 'ADMIN',
  email: 'jyotishikha2007@gmail.com',
  id: '12345678'
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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchNotifications();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/project');
      setProjects(response.data);
      
      // Count pending approvals
      const pending = response.data.filter(
        (project: Project) => !project.is_approved
      ).length;
      setPendingCount(pending);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Assuming admin ID is 1 for demo
      const response = await axios.get('http://localhost:3001/notifications/admin/12345678');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Group projects by their status
  const ongoingProjects = projects.filter(
    project => project.is_approved && !project.is_completed
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#151929] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold">Welcome Back, {ADMIN_INFO.name}!</h2>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold">{ADMIN_INFO.name}</h3>
                  <span className="ml-2 bg-purple-500 bg-opacity-20 text-purple-300 text-xs px-2 py-1 rounded">
                    {ADMIN_INFO.role}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{ADMIN_INFO.email} • {ADMIN_INFO.id}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[#7c68ee33] rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Ongoing Projects</h3>
                  <Link 
                    href="/admin/projects" 
                    className="bg-[#1e233a] text-white px-4 py-1 rounded-full text-sm"
                  >
                    View all &gt;
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {ongoingProjects.slice(0, 3).map((project) => (
                    <div key={project._id} className="bg-[#1e233a] rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                            <path d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.project_name}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{project.description}</p>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>60%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/admin/projects/${project._id}`}
                          className="bg-[#272b3f] hover:bg-[#2e3348] px-3 py-1 rounded text-xs ml-4"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {ongoingProjects.length === 0 && (
                    <p className="text-gray-400">No ongoing projects at the moment</p>
                  )}
                </div>
              </div>
              
              <div className="bg-[#7c68ee33] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Recent Activity</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-400">Project</span>
                    <span className="mx-2 font-medium">Web Development Portfolio</span>
                    <span className="text-gray-400">was approved</span>
                    <span className="ml-auto text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-400">New project</span>
                    <span className="mx-2 font-medium">API Integration</span>
                    <span className="text-gray-400">was created</span>
                    <span className="ml-auto text-gray-500">5 hours ago</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-400">Project</span>
                    <span className="mx-2 font-medium">Mobile App</span>
                    <span className="text-gray-400">was deleted</span>
                    <span className="ml-auto text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#1e233a] rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Project Approvals</h3>
                  <Link 
                    href="/admin/notifications" 
                    className="bg-[#272b3f] px-2 py-1 rounded-full text-sm"
                  >
                    View all
                  </Link>
                </div>
                
                {pendingCount > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-[#272b3f] rounded-lg p-3 border-l-4 border-purple-500">
                      <h4 className="font-medium text-purple-300">Pending Approvals</h4>
                      <p className="text-sm text-gray-400 mt-1">You have {pendingCount} projects awaiting approval</p>
                      <Link 
                        href="/admin/notifications"
                        className="mt-2 inline-block text-xs text-purple-400 hover:text-purple-300"
                      >
                        View all requests &rarr;
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No pending approvals</p>
                )}
              </div>
              
              <div className="bg-[#1e233a] rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Project Statistics</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-sm text-gray-400 mb-2">Satisfaction Rate</h4>
                    <div className="relative h-32 w-32 inline-block">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-700 stroke-current"
                          strokeWidth="8"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-purple-500 stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray="251.2"
                          strokeDashoffset="38"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">95%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">From all projects</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Active Users</span>
                      <div>
                        <span className="text-green-500">+23%</span>
                        <span className="text-xs text-gray-500 ml-1">than last week</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold">2.8k</p>
                        <p className="text-xs text-gray-500">Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">1.2k</p>
                        <p className="text-xs text-gray-500">Clicks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
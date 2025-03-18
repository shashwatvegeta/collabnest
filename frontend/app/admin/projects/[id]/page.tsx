'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  _id: string;
  project_name: string;
  description: string;
  is_approved: boolean;
  is_completed: boolean;
  project_owner: {
    _id: string;
    username: string;
    email: string;
  };
  members?: any[];
  students?: any[];
  cap: number;
  start_date: string;
  end_date: string;
  tags: any[];
  tech_stack?: string[];
  documentation?: string;
  github_repo?: string;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetchProjectDetails();
    fetchProjectStudents();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${id}`);
      setProject(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to fetch project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/project/${id}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching project students:', error);
      // Don't set error state here to avoid overriding project fetch errors
    }
  };

  const handleApproveProject = async () => {
    if (!project) return;
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:3001/project/${id}/approve`);
      // Refresh project data
      fetchProjectDetails();
    } catch (error) {
      console.error('Error approving project:', error);
      setError('Failed to approve project. Please try again later.');
      setLoading(false);
    }
  };

  const handleRejectProject = async () => {
    if (!project) return;
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:3001/project/${id}/reject`);
      // Navigate back to projects page after rejection
      router.push('/admin/projects?filter=pending');
    } catch (error) {
      console.error('Error rejecting project:', error);
      setError('Failed to reject project. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#151929] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/projects" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Project Details</h1>
          </div>
          <Link href="/admin" className="bg-[#272b3f] hover:bg-[#2e3348] px-4 py-2 rounded text-sm">
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : !project ? (
          <div className="bg-[#1e233a] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Project Not Found</h2>
            <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/admin/projects" className="bg-[#6B56E3] text-white px-4 py-2 rounded-md">
              Go Back to Projects
            </Link>
          </div>
        ) : (
          <div className="bg-[#1e233a] rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{project.project_name}</h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.is_approved 
                      ? 'bg-green-500 bg-opacity-20 text-green-300'
                      : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                  }`}>
                    {project.is_approved ? 'Approved' : 'Pending Approval'}
                  </span>
                  {project.is_completed && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-300">
                      Completed
                    </span>
                  )}
                </div>
              </div>
              
              {!project.is_approved && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleRejectProject}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Reject Project
                  </button>
                  <button
                    onClick={handleApproveProject}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Approve Project
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-[#272b3f] rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
                </div>
                
                <div className="bg-[#272b3f] rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white">{formatDate(project.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">End Date</p>
                      <p className="text-white">{formatDate(project.end_date)}</p>
                    </div>
                  </div>
                </div>
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="bg-[#272b3f] rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, index) => (
                        <span key={index} className="bg-[#6B56E3] bg-opacity-30 text-[#a899ff] px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <div className="bg-[#272b3f] rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="bg-[#1e233a] text-gray-300 px-3 py-1 rounded-full text-sm">
                          {tag.name || tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#272b3f] rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-3">Project Owner</h3>
                  {project.project_owner ? (
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#6B56E3] h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                        {project.project_owner.username?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{project.project_owner.username || 'Unknown'}</p>
                        <p className="text-sm text-gray-400">{project.project_owner.email || 'No email'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No owner information available</p>
                  )}
                </div>
                
                <div className="bg-[#272b3f] rounded-lg p-5">
                  <h3 className="text-lg font-semibold mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Capacity</p>
                      <p className="text-white">{project.cap || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Current Members</p>
                      <p className="text-white">{students.length} / {project.cap || '∞'}</p>
                    </div>
                  </div>
                </div>
                
                {project.github_repo && (
                  <div className="bg-[#272b3f] rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3">GitHub Repository</h3>
                    <a 
                      href={project.github_repo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#6B56E3] hover:underline break-all"
                    >
                      {project.github_repo}
                    </a>
                  </div>
                )}
                
                {students.length > 0 && (
                  <div className="bg-[#272b3f] rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3">Project Members</h3>
                    <div className="space-y-3">
                      {students.map((student, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="bg-[#1e233a] h-8 w-8 rounded-full flex items-center justify-center text-white text-sm">
                            {student.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{student.username || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">{student.email || 'No email'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
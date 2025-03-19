'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function AdminProjects() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams?.get('filter') as 'all' | 'pending' | 'approved' || 'all';
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>(initialFilter);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filter when projects or filter changes
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else if (filter === 'pending') {
      setFilteredProjects(projects.filter(project => !project.is_approved));
    } else if (filter === 'approved') {
      setFilteredProjects(projects.filter(project => project.is_approved && !project.is_completed));
    }
  }, [projects, filter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/project');
      console.log('Projects response:', response.data);
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3001/project/${projectId}/approve`);
      console.log('Project approval response:', response.data);
      
      // Update the local state
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId 
            ? { ...project, is_approved: true } 
            : project
        )
      );
      
      setError(null);
    } catch (error) {
      console.error('Error approving project:', error);
      setError('Failed to approve project. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#151929] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <Link href="/admin" className="bg-[#272b3f] hover:bg-[#2e3348] px-4 py-2 rounded text-sm">
            Back to Dashboard
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-[#1e233a] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-[#7c68ee] text-white' : 'bg-[#272b3f] text-gray-300'}`}
              >
                All Projects
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm ${filter === 'pending' ? 'bg-[#7c68ee] text-white' : 'bg-[#272b3f] text-gray-300'}`}
              >
                Pending Approval
              </button>
              <button 
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-md text-sm ${filter === 'approved' ? 'bg-[#7c68ee] text-white' : 'bg-[#272b3f] text-gray-300'}`}
              >
                Ongoing Projects
              </button>
            </div>
            <button 
              onClick={fetchProjects}
              className="bg-[#272b3f] hover:bg-[#2e3348] px-3 py-1 rounded text-sm"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No projects found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#272b3f] rounded-lg overflow-hidden">
                <thead className="bg-[#1c1f2e]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d435a]">
                  {filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-[#2a2f45]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{project.project_name}</div>
                        <div className="text-xs text-gray-400">ID: {project._id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.is_approved ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-300">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 bg-opacity-20 text-yellow-300">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-400">
                          Start: {formatDate(project.start_date)}
                        </div>
                        <div className="text-xs text-gray-400">
                          End: {formatDate(project.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!project.is_approved && (
                            <button
                              onClick={() => handleApproveProject(project._id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => router.push(`/admin/projects/${project._id}`)}
                            className="px-3 py-1 bg-[#272b3f] hover:bg-[#32364f] rounded text-white text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
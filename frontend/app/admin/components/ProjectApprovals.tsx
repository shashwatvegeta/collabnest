'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ProjectApprovals() {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  async function fetchPendingProjects() {
    try {
      const response = await axios.get('http://localhost:3001/project/pending');
      // Limit to only 3 projects
      setPendingProjects(response.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending projects:', error);
      setLoading(false);
    }
  }

  async function handleApprove(projectId) {
    try {
      await axios.put(`http://localhost:3001/project/${projectId}/approve`);
      // Refresh the list after approval
      fetchPendingProjects();
    } catch (error) {
      console.error('Error approving project:', error);
    }
  }

  async function handleReject(projectId) {
    try {
      await axios.put(`http://localhost:3001/project/${projectId}/reject`);
      // Refresh the list after rejection
      fetchPendingProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  }

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Project Approvals</h2>
        <Link
          href="/admin/projects?filter=pending"
          className="bg-[#1F1D38] hover:bg-[#272b3f] text-white px-3 py-1 rounded-md text-xs"
        >
          View all &gt;
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading pending approvals...</div>
      ) : pendingProjects.length === 0 ? (
        <div className="text-center py-8">No pending approvals</div>
      ) : (
        <div className="space-y-4">
          {pendingProjects.map((project) => (
            <div key={project._id} className="bg-[#6B56E3] bg-opacity-20 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReject(project._id)}
                    className="bg-red-500 bg-opacity-20 text-red-500 px-3 py-1 rounded text-xs"
                  >
                    DELETE
                  </button>
                  <button
                    onClick={() => handleApprove(project._id)}
                    className="bg-green-500 bg-opacity-20 text-green-500 px-3 py-1 rounded text-xs"
                  >
                    APPROVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/admin/projects?filter=pending"
        className="bg-[#6B56E3] text-white w-full py-2 rounded-md mt-4 block text-center"
      >
        View All Pending Projects
      </Link>
    </div>
  );
}
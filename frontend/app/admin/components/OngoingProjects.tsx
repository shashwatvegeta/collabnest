'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedProjects() {
      try {
        const response = await axios.get('http://localhost:3001/project/approved');
        // Limit to only 5 projects
        setProjects(response.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching approved projects:', error);
        setLoading(false);
      }
    }

    fetchApprovedProjects();
  }, []);

  return (
    <div className="bg-[#3A3693] bg-opacity-20 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ongoing Projects</h2>
        <Link href="/admin/projects?filter=approved" className="bg-[#1F1D38] text-white px-4 py-1 rounded-md text-sm flex items-center">
          View all
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8">No approved projects found.</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-[#2A2559] bg-opacity-40 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#3A3693] p-3 rounded-md">
                  {project.type === 'web' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="3" width="20" height="18" rx="2" stroke="#8A8AFF" strokeWidth="2"/>
                      <path d="M2 7H22" stroke="#8A8AFF" strokeWidth="2"/>
                      <circle cx="5" cy="5" r="1" fill="#8A8AFF"/>
                      <circle cx="8" cy="5" r="1" fill="#8A8AFF"/>
                    </svg>
                  ) : project.type === 'api' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" stroke="#8A8AFF" strokeWidth="2"/>
                      <path d="M12 4V20" stroke="#8A8AFF" strokeWidth="2"/>
                      <path d="M4 12H20" stroke="#8A8AFF" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8A8AFF" strokeWidth="2"/>
                      <path d="M2 17L12 22L22 17" stroke="#8A8AFF" strokeWidth="2"/>
                      <path d="M2 12L12 17L22 12" stroke="#8A8AFF" strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-400">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.description}</p>
                  <div className="mt-2">
                    <div className="text-xs text-[#8A8AFF] font-medium mb-1">
                      {project.difficulty || 'Intermediate'}
                    </div>
                    <div className="bg-gray-600 h-1 rounded-full w-full">
                      <div 
                        className="bg-gradient-to-r from-[#8A8AFF] to-[#A66AFF] h-1 rounded-full" 
                        style={{ width: `${project.progress || 60}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/admin/projects/${project._id}`}
                  className="bg-[#1F1D38] text-white px-3 py-1 rounded-md text-xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
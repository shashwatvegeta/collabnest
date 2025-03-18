'use client';

import { useState, useEffect } from 'react';

export default function ProjectStatistics() {
  // Mock data for demonstration
  const [stats, setStats] = useState({
    satisfactionRate: 95,
    activeUsers: 2600,
    userGrowth: +23,
    clicks: 1200
  });

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Project Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1F1D38] bg-opacity-60 rounded-lg p-4">
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-400 mb-2">Satisfaction Rate</div>
            <div className="text-xs text-gray-500 mb-4">From all projects</div>
            
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold">{stats.satisfactionRate}%</div>
              </div>
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#2A2559"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#6B56E3"
                  strokeWidth="10"
                  strokeDasharray={`${stats.satisfactionRate * 2.83} 283`}
                />
              </svg>
            </div>
            
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-[#2A2559] h-1 rounded-full mt-1">
                <div 
                  className="bg-[#6B56E3] h-1 rounded-full" 
                  style={{ width: `${stats.satisfactionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1F1D38] bg-opacity-60 rounded-lg p-4">
          <div className="flex flex-col">
            <div className="text-sm mb-6">Active Users</div>
            
            <div className="flex-1 flex items-end">
              <div className="w-full h-32">
                {/* Mock chart bars */}
                <div className="flex justify-between items-end h-full">
                  {[70, 90, 50, 80, 95, 85, 75].map((height, index) => (
                    <div key={index} className="w-3 bg-[#6B56E3] rounded-t-sm mx-1" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className="text-green-500 text-sm">
                (+{stats.userGrowth}) than last week
              </div>
              <div className="ml-auto flex items-center">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <div className="text-sm">Users</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <div className="text-sm">Clicks</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="text-sm font-medium">2.6K</div>
              <div className="text-sm font-medium">1.2K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
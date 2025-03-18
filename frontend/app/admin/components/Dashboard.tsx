'use client';

import { useState, useEffect } from 'react';
import OngoingProjects from './OngoingProjects';
import ProjectApprovals from './ProjectApprovals';
import ProjectStatistics from './ProjectStatistics';

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'Jyoti Shikha',
    role: 'ADMIN',
    email: 'shashwat_2301cs50@iitp.ac.in',
    id: 'shashwat_2301cs50@iitp.ac.in'
  });

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#B7B7C9]">Dashboard</h2>
          <h1 className="text-4xl font-bold mt-2">Welcome Back, Jyoti !</h1>
        </div>
        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
          <img src="/placeholder-avatar.png" alt="Avatar" className="rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <img src="/placeholder-avatar.png" alt="Avatar" className="rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{user.name}</h3>
            <span className="text-xs text-[#49E9C1]">{user.role}</span>
          </div>
          <p className="text-sm text-gray-400">{user.email} • {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OngoingProjects />
        </div>
        <div className="lg:col-span-1">
          <ProjectApprovals />
        </div>
      </div>

      <div className="mt-6">
        <ProjectStatistics />
      </div>
    </div>
  );
}
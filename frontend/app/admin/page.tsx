'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

export default function AdminPage() {
  return (
    <div className="flex bg-[#18172E] min-h-screen text-white">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidebar';
import Dashboard from './components/Dashboard';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="flex bg-[#18172E] min-h-screen text-white">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function MentorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="fixed left-0 top-0 h-full flex items-center z-20">
      <div className={`w-[60px] bg-gradient-to-b from-[#1F1D38] to-[#252244] flex flex-col items-center py-8 rounded-2xl shadow-xl border border-violet-800/30 transition-all duration-300 h-[90vh] my-auto mx-4`}>

        {/* Logo */}
        <div className="p-2 mb-10 flex justify-center w-full transition-transform duration-300 hover:scale-110">
          <Image
            src="/logo.png"
            alt="CollabNest"
            width={40}
            height={40}
            className="drop-shadow-[0_0_15px_rgba(138,43,226,0.5)] animate-pulse-slow"
            priority
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center w-full px-2 space-y-8 flex-grow">

          {/* Dashboard */}
          <Link href="/mentor" className="w-full">
            <div className="p-3 bg-[#18172E] rounded-xl hover:bg-[#25243A] transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#49E9C1" strokeWidth="2" />
              </svg>
            </div>
          </Link>

          {/* Mentees */}
          <Link href="/mentor/profile" className="w-full">
            <div className="p-3 hover:bg-[#25243A] rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#8A8A8A" />
              </svg>
            </div>
          </Link>

          {/* Sessions */}
          <Link href="/mentor/chats" className="w-full">
            <div className="p-3 hover:bg-[#25243A] rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#8A8A8A" />
              </svg>
            </div>
          </Link>

          {/* Notifications */}
          <Link href="/mentor/notifications" className="w-full">
            <div className="p-3 hover:bg-[#25243A] rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#8A8A8A" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">3</span>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="mt-auto w-full px-2">
          <Link href="/logout" className="w-full">
            <div className="p-3 hover:bg-[#3A1D1D] rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-1 mt-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#FF5C5C" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Add custom animation */}
        <style jsx global>{`
          @keyframes pulse-slow {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s infinite ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}
'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfessorLayoutProps {
    children: ReactNode;
}

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#151929]">
            {/* Sidebar */}
            <div className="w-16 border-r border-gray-700 flex flex-col items-center py-8">
                <div className="w-10 h-10 bg-[#7c68ee33] rounded-lg flex items-center justify-center mb-12">
                    <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={24} 
                        height={24}
                    />
                </div>

                <div className="flex flex-col items-center space-y-8">
                    <Link href="/professor" className="text-white p-2 rounded hover:bg-[#7c68ee33]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                    </Link>

                    <Link href="/professor/notifications" className="text-white p-2 rounded hover:bg-[#7c68ee33] relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </svg>
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                            2
                        </span>
                    </Link>

                    <Link href="/professor/chats" className="text-white p-2 rounded hover:bg-[#7c68ee33]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                        </svg>
                    </Link>

                    <Link href="/professor/projects" className="text-white p-2 rounded hover:bg-[#7c68ee33]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </Link>
                </div>

                <div className="mt-auto">
                    <Link href="/logout" className="text-white p-2 rounded hover:bg-[#7c68ee33]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
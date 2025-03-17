'use client';

import React from 'react';

interface NotificationCardProps {
  title: string;
  message: string;
  onApprove: () => void;
  onDelete: () => void;
}

export default function NotificationCard({ title, message, onApprove, onDelete }: NotificationCardProps) {
  return (
    <div className="bg-[#1e233a] rounded-lg p-4 mb-4">
      <h4 className="text-lg font-semibold text-purple-300">{title}</h4>
      <p className="text-sm text-gray-300 mt-1 mb-3">{message}</p>
      <div className="flex justify-end space-x-2">
        <button 
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
        >
          <span className="text-xs">DELETE</span>
        </button>
        <button 
          onClick={onApprove}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
        >
          <span className="text-xs">APPROVE</span>
        </button>
      </div>
    </div>
  );
} 
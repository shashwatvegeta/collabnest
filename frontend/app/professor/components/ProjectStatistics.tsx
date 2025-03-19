'use client';

import React from 'react';

interface StatProps {
    percentage: number;
    label: string;
}

const CircularProgressBar = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * (1 - percentage / 100);

    return (
        <div className="relative h-32 w-32 mx-auto">
            <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                    className="stroke-gray-700 fill-none"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r={radius}
                />
                <circle
                    className="stroke-purple-500 fill-none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    cx="50"
                    cy="50"
                    r={radius}
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
            </div>
        </div>
    );
};

const BarChart = () => {
    const data = [70, 85, 60, 90, 55, 75, 65, 80, 50, 70];

    return (
        <div className="h-32 flex items-end justify-between">
            {data.map((value, index) => (
                <div key={index} className="h-full flex flex-col justify-end items-center">
                    <div
                        className="w-2 bg-purple-500 rounded-t-sm"
                        style={{ height: `${value}%` }}
                    />
                </div>
            ))}
        </div>
    );
};

const StatItem = ({ percentage, label }: StatProps) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
        </div>
    );
};

export default function ProjectStatistics() {
    // Hardcoded statistics for demonstration
    const satisfactionRate = 95;
    const activeUsers = 2800;
    const clicks = 1200;
    const growth = 23;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h4 className="text-sm text-gray-400 mb-2">Satisfaction Rate</h4>
                <CircularProgressBar percentage={satisfactionRate} />
                <p className="text-xs text-gray-500 mt-2">From all projects</p>
            </div>

            <div>
                <h4 className="text-sm text-gray-400 mb-2">Monthly Activity</h4>
                <BarChart />
            </div>

            <div className="mt-4">
                <h4 className="text-sm text-gray-400 mb-2">Active Users</h4>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-green-500 font-medium">+{growth}%</span>
                        <p className="text-xs text-gray-500">than last week</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="text-center">
                            <p className="text-lg font-bold">{(activeUsers / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-gray-500">Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold">{(clicks / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-gray-500">Clicks</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
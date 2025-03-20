import React, { useState, useEffect } from 'react';

export default function XpLevelDisplay({ userId }) {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchLevelData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching XP data for user ID: ${userId}`);
        
        const response = await fetch(`http://localhost:3001/users/${userId}/gamification/level`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch level data: ${response.status} - ${errorText}`);
          throw new Error(`Failed to fetch level data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received level data:", data);
        setLevelData(data);
      } catch (err) {
        console.error('Error fetching level data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [userId]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 p-4 rounded-lg border-2 border-violet-500/30 animate-pulse">
        <div className="h-4 bg-violet-500/20 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-violet-500/20 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-violet-500/20 rounded w-3/4"></div>
      </div>
    );
  }

  // Show default UI for new users or when there's an error
  if (error || !levelData) {
    // Default values for new users
    const defaultLevel = {
      level: 1,
      xp: 0,
      nextLevelXp: 600
    };
    
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 p-4 rounded-lg border-2 border-violet-500/30">
        <h3 className="text-lg font-semibold text-violet-400 mb-2">Level {defaultLevel.level}</h3>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div className="bg-violet-500 h-4 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{defaultLevel.xp} XP</span>
          <span>{defaultLevel.xp} / {defaultLevel.nextLevelXp} XP</span>
        </div>
      </div>
    );
  }

  // Calculate percentage for progress bar
  const progressPercentage = Math.min(100, (levelData.xp / levelData.nextLevelXp) * 100);

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 p-4 rounded-lg border-2 border-violet-500/30">
      <h3 className="text-lg font-semibold text-violet-400 mb-2">Level {levelData.level}</h3>
      <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
        <div 
          className="bg-gradient-to-r from-violet-600 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{levelData.xp} XP</span>
        <span>{levelData.xp} / {levelData.nextLevelXp} XP</span>
      </div>
    </div>
  );
} 
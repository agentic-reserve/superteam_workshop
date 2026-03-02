'use client';

import { useEffect, useState } from 'react';
import MaterialIcon from './MaterialIcon';
import { getProgress, getCompletionPercentage, getCompletedModulesCount } from '@/lib/progress';

export default function ProgressTracker() {
  const [percentage, setPercentage] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      setPercentage(getCompletionPercentage());
      setCompletedCount(getCompletedModulesCount());
    };

    updateProgress();
    
    // Update every 5 seconds to catch changes
    const interval = setInterval(updateProgress, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (percentage === 0) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-dark-card border border-dark-lighter rounded-xl shadow-lg hover:shadow-xl transition-all p-4 flex items-center gap-3 group"
      >
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-dark-lighter"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentage / 100)}`}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{percentage}%</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="text-left">
            <div className="font-semibold text-sm">Your Progress</div>
            <div className="text-xs text-gray-400">
              {completedCount} of 10 modules completed
            </div>
          </div>
        )}
        
        <MaterialIcon 
          icon={isExpanded ? "expand_more" : "expand_less"} 
          size={20} 
          className="text-gray-400 group-hover:text-primary transition-colors"
        />
      </button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import MaterialIcon from './MaterialIcon';

export default function LearningStreak() {
  const [streak, setStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState<Date | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak');
    if (stored) {
      const data = JSON.parse(stored);
      setStreak(data.streak || 0);
      setLastVisit(data.lastVisit ? new Date(data.lastVisit) : null);
    }

    updateStreak();
  }, []);

  const updateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stored = localStorage.getItem('learning-streak');
    let currentStreak = 0;
    let lastVisitDate: Date | null = null;

    if (stored) {
      const data = JSON.parse(stored);
      currentStreak = data.streak || 0;
      lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null;
      
      if (lastVisitDate) {
        lastVisitDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
          // Same day, keep streak
          return;
        } else if (daysDiff === 1) {
          // Next day, increment streak
          currentStreak++;
        } else {
          // Streak broken
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    const newData = {
      streak: currentStreak,
      lastVisit: today.toISOString(),
    };

    localStorage.setItem('learning-streak', JSON.stringify(newData));
    setStreak(currentStreak);
    setLastVisit(today);
  };

  if (streak === 0) return null;

  return (
    <div className="fixed top-24 left-6 z-40">
      <div className="bg-dark-card border border-dark-lighter rounded-xl shadow-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
          <MaterialIcon icon="local_fire_department" size={24} className="text-dark-bg" />
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-gray-400">Day Streak 🔥</div>
        </div>
      </div>
    </div>
  );
}

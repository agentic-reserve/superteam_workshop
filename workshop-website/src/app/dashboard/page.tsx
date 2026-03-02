'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { getProgress, getCompletionPercentage, resetProgress, exportProgress } from '@/lib/progress';
import { getAnalyticsSummary } from '@/lib/analytics';
import { modules } from '@/lib/modules';

export default function DashboardPage() {
  const [progress, setProgress] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
    setAnalytics(getAnalyticsSummary());
    setPercentage(getCompletionPercentage());
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!progress) return <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <MaterialIcon icon="hourglass_empty" size={48} className="text-primary animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading dashboard...</p>
    </div>
  </div>;

  const completedModules = Object.values(progress.modules).filter((m: any) => m.completed);
  const inProgressModules = Object.values(progress.modules).filter((m: any) => !m.completed);

  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-primary hover:text-primary-accent flex items-center gap-2 mb-6">
            <MaterialIcon icon="arrow_back" size={20} />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Your Dashboard</h1>
          <p className="text-xl text-gray-400">
            Track your progress through the Solana workshop
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <MaterialIcon icon="emoji_events" size={32} className="text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{percentage}%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>
            <div className="w-full bg-dark-lighter rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center">
                <MaterialIcon icon="check_circle" size={32} className="text-green-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">{completedModules.length}</div>
                <div className="text-sm text-gray-400">Modules Completed</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-accent/20 rounded-xl flex items-center justify-center">
                <MaterialIcon icon="schedule" size={32} className="text-primary-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-accent">
                  {Math.round(progress.totalTimeSpent / 60)}m
                </div>
                <div className="text-sm text-gray-400">Time Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Completed Modules */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MaterialIcon icon="check_circle" size={24} className="text-green-500" />
              Completed Modules
            </h2>
            {completedModules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No modules completed yet</p>
            ) : (
              <div className="space-y-3">
                {completedModules.map((mod: any) => {
                  const module = modules.find(m => m.id === mod.moduleId);
                  if (!module) return null;
                  return (
                    <Link
                      key={mod.moduleId}
                      href={`/modules/${mod.moduleId}`}
                      className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-dark-lighter transition-colors"
                    >
                      <MaterialIcon icon={module.icon} size={20} className="text-green-500" />
                      <div className="flex-1">
                        <div className="font-semibold">{module.title}</div>
                        <div className="text-xs text-gray-500">
                          Completed {new Date(mod.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <MaterialIcon icon="arrow_forward" size={16} className="text-gray-500" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* In Progress */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MaterialIcon icon="pending" size={24} className="text-primary" />
              In Progress
            </h2>
            {inProgressModules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No modules in progress</p>
            ) : (
              <div className="space-y-3">
                {inProgressModules.map((mod: any) => {
                  const module = modules.find(m => m.id === mod.moduleId);
                  if (!module) return null;
                  return (
                    <Link
                      key={mod.moduleId}
                      href={`/modules/${mod.moduleId}`}
                      className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-dark-lighter transition-colors"
                    >
                      <MaterialIcon icon={module.icon} size={20} className="text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold">{module.title}</div>
                        <div className="text-xs text-gray-500">
                          Started {new Date(mod.startedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <MaterialIcon icon="arrow_forward" size={16} className="text-gray-500" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="card mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MaterialIcon icon="analytics" size={24} className="text-primary" />
              Activity Summary
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{analytics.totalEvents}</div>
                <div className="text-sm text-gray-400">Total Events</div>
              </div>
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {analytics.eventsByType['ai_message_sent'] || 0}
                </div>
                <div className="text-sm text-gray-400">AI Messages</div>
              </div>
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {analytics.eventsByType['page_view'] || 0}
                </div>
                <div className="text-sm text-gray-400">Page Views</div>
              </div>
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {analytics.eventsByType['module_completed'] || 0}
                </div>
                <div className="text-sm text-gray-400">Completions</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Manage Progress</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <MaterialIcon icon="download" size={20} />
              Export Progress
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500/20 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <MaterialIcon icon="restart_alt" size={20} />
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

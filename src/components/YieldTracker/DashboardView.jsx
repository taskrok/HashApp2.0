import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { GlassCard } from '../ui/GlassCard';
import { ProjectDetailCard } from './ProjectDetailCard';
import { AIInsightsPanel } from './AIInsightsPanel.jsx';
import { DollarSign, Activity, TrendingUp, Target, Database, BarChart3, Plus, MoreHorizontal, Menu, ChevronRight, Trophy } from 'lucide-react';

export const DashboardView = ({ 
  projects, 
  viewMode, 
  setViewMode, 
  setView, 
  theme, 
  isDarkMode, 
  achievementData, 
  totalEarned, 
  recentAchievements 
}) => {
      
    const metrics = [
    { title: 'Total Revenue', value: '$47,280', change: '+18% from last month', icon: DollarSign, trend: 18, color: 'green', sparkline: [20, 35, 25, 40, 35, 50, 45, 55], target: 50000 },
    { title: 'Active Projects', value: '12', change: '5 completed this week', icon: Activity, trend: 25, color: 'blue', sparkline: [8, 10, 9, 12, 11, 14, 12, 12], target: 15 },
    { title: 'Avg Yield', value: '7.2%', change: '+0.5% improvement', icon: TrendingUp, trend: 7, color: 'purple', sparkline: [6.5, 6.8, 7.0, 6.9, 7.1, 7.3, 7.2, 7.2], target: 8 },
    { title: 'Efficiency Score', value: '96%', change: 'Above industry average', icon: Target, trend: 12, color: 'orange', sparkline: [85, 88, 92, 94, 95, 96, 96, 96], target: 100 }
  ];

  // Use theme colors
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  return (
    <div className="space-y-8">
      <div className="relative">
        <GlassCard className="text-center py-16" glow gradient>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back, Extract Master
            </h1>
            <p style={{ color: textSecondaryColor }} className="text-xl mb-8">
              Your cannabis extraction empire is thriving with precision and innovation
            </p>
            <div className="flex justify-center space-x-6">
              <button onClick={() => setView('tracker')} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-2xl flex items-center space-x-3">
                <Plus size={24} />
                <span>New Extraction</span>
              </button>
              <button onClick={() => setView('analytics')} style={{ color: textColor }} className="px-8 py-4 bg-white/5 border border-slate-700/50 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-3">
                <BarChart3 size={24} />
                <span>Deep Analytics</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} onClick={() => setView('analytics')} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AIInsightsPanel theme={theme} isDarkMode={isDarkMode} />
        </div>
        <div className="space-y-6">
  <GlassCard className="text-center" glow>
    <div className="text-4xl mb-2">🏆</div>
    <h3 style={{ color: textColor }} className="font-bold mb-2">
      {achievementData?.currentTitle || 'Achievement Hunter'}
    </h3>
    <div className="flex items-center justify-center space-x-4 mb-2">
      <span className="text-purple-400 font-bold">Level {achievementData?.level || 1}</span>
      <span className="text-slate-400">•</span>
      <span className="text-blue-400 text-sm">{achievementData?.totalXP || 0} XP</span>
    </div>
    <p style={{ color: textSecondaryColor }} className="text-sm">
      {totalEarned} achievements unlocked
    </p>
    {achievementData?.xpToNextLevel && (
      <div className="mt-3">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ 
              width: `${Math.max(0, 100 - (achievementData.xpToNextLevel / (Math.pow(achievementData.level, 2) * 100)) * 100)}%` 
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {achievementData.xpToNextLevel} XP to next level
        </p>
      </div>
    )}
  </GlassCard>

  {recentAchievements?.length > 0 && (
    <GlassCard>
      <h4 style={{ color: textColor }} className="font-semibold mb-3 flex items-center">
        <Trophy size={16} className="mr-2 text-yellow-400" />
        Recent Achievement
      </h4>
      {(() => {
        const recent = recentAchievements[0];
        const achievement = recent.achievement;
        if (!achievement) return null;
        
        return (
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="font-medium  style={{ color: textColor }} text-sm">
                {achievement.name}
                {recent.tier && ` - ${recent.tier.name}`}
              </div>
              <div className="text-xs text-slate-400">
                {new Date(recent.earnedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })()}
    </GlassCard>
  )}

  <GlassCard>
    <h4 style={{ color: textColor }} className="font-semibold mb-3 flex items-center">
      <Activity size={16} className="mr-2 text-blue-400" />
      Market Pulse
    </h4>
        <div className="space-y-2">
             <div className="flex justify-between items-center">
                <span style={{ color: textSecondaryColor }} className="text-sm">Live Resin</span>
                <span className="text-emerald-400 text-sm font-medium">↗ $280/oz</span>
             </div>
              <div className="flex justify-between items-center">
                <span style={{ color: textSecondaryColor }} className="text-sm">Hash Rosin</span>
                <span className="text-blue-400 text-sm font-medium">→ $320/oz</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: textSecondaryColor }} className="text-sm">Shatter</span>
                <span className="text-red-400 text-sm font-medium">↘ $180/oz</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ color: textColor }} className="text-2xl font-bold flex items-center space-x-3">
            <Database size={24} className="text-blue-400" />
            <span>Recent Projects</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'hover: style={{ color: textColor }}'}`} style={{ color: viewMode === 'grid' ? undefined : textSecondaryColor }}>
                <MoreHorizontal size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'hover: style={{ color: textColor }}'}`} style={{ color: viewMode === 'list' ? undefined : textSecondaryColor }}>
                <Menu size={16} />
              </button>
            </div>
            <button onClick={() => setView('projects')} className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-xl transition-all duration-200 hover:bg-blue-500/20">
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {projects.slice(0, viewMode === 'grid' ? 6 : 5).map((project) => (
            <ProjectDetailCard key={project.id} project={project} viewMode={viewMode} theme={theme} isDarkMode={isDarkMode} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
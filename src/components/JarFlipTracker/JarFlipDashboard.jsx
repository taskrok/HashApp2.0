// components/JarFlipTracker/JarFlipDashboard.jsx
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { MetricCard } from '../ui/MetricCard';
import { DollarSign, TrendingUp, Package, Clock, Plus, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor } from '../../utils/jarFlipCalculations';

export const JarFlipDashboard = ({ 
  projects, 
  portfolioMetrics, 
  setView, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const metrics = [
    {
      title: 'Total Profit',
      value: formatCurrency(portfolioMetrics.totalProfit),
      change: `${portfolioMetrics.successRate.toFixed(1)}% success rate`,
      icon: DollarSign,
      trend: portfolioMetrics.totalProfit > 0 ? 10 : -5,
      color: portfolioMetrics.totalProfit > 0 ? 'green' : 'red',
      sparkline: [0, 10, 5, 15, 20, 25, 30, 35]
    },
    {
      title: 'Average ROI',
      value: formatPercentage(portfolioMetrics.averageROI),
      change: `${portfolioMetrics.totalFlips} total flips`,
      icon: TrendingUp,
      trend: portfolioMetrics.averageROI > 0 ? 15 : -8,
      color: portfolioMetrics.averageROI > 20 ? 'green' : portfolioMetrics.averageROI > 0 ? 'yellow' : 'red',
      sparkline: [5, 8, 12, 18, 25, 22, 28, 30]
    },
    {
      title: 'Active Projects',
      value: portfolioMetrics.totalFlips.toString(),
      change: `${portfolioMetrics.profitableFlips} profitable`,
      icon: Package,
      trend: 5,
      color: 'blue',
      sparkline: [1, 2, 3, 5, 8, 10, 12, portfolioMetrics.totalFlips]
    },
    {
      title: 'Avg Flip Time',
      value: `${portfolioMetrics.averageFlipDays.toFixed(0)} days`,
      change: 'Time to market',
      icon: Clock,
      trend: -2,
      color: 'purple',
      sparkline: [45, 42, 38, 35, 32, 30, 28, portfolioMetrics.averageFlipDays]
    }
  ];

  const recentProjects = projects.slice(0, 5);

  const viewTitles = {
    dashboard: { title: "Dashboard", subtitle: "Project Overview" },
    form: { title: "New Project", subtitle: "Create Flip Project" },
    history: { title: "Project History", subtitle: "View Past Flips" },
    analytics: { title: "Analytics", subtitle: "Performance Insights" },
    settings: { title: "Settings", subtitle: "Configure Preferences" },
    insights: { title: "AI Insights", subtitle: "Smart Recommendations" },
    achievements: { title: "Achievements", subtitle: "Track Progress" }
  };

  return (
    <div className="space-y-8 pt-[50px]">
      {/* Welcome Header */}
      <div className="relative">
        <GlassCard className="text-center py-16" glow gradient>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Flip Tracker
            </h1>
            <p style={{ color: textSecondaryColor }} className="text-xl mb-8">
              Your cannabis investment portfolio is performing at {formatPercentage(portfolioMetrics.averageROI)} average ROI
            </p>
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => setView('form')} 
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-xl font-medium hover:scale-105 transition-all duration-200"
              >
                <Plus size={24} />
                <span>New Flip</span>
              </button>
              <button 
                onClick={() => setView('analytics')} 
                style={{ color: textColor }} 
                className="px-8 py-4 bg-white/5 border border-slate-700/50 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-3"
              >
                <BarChart3 size={24} />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} onClick={() => setView('analytics')} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard>
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Package size={24} className="text-blue-400" />
            <span>Recent Flips</span>
          </h3>
          
          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-500 mb-4" />
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-2">No flips yet</h4>
              <p style={{ color: textSecondaryColor }} className="mb-4">Start tracking your cannabis investments</p>
              <button 
                onClick={() => setView('tracker')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-200"
              >
                Create First Flip
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                  <div className="flex-1">
                    <h4 style={{ color: textColor }} className="font-semibold">{project.projectName}</h4>
                    <p style={{ color: textSecondaryColor }} className="text-sm">
                      {project.strain} • {project.materialType}
                    </p>
                  </div>
                  <div className="text-right">
                    <div 
                      className="font-bold text-lg"
                      style={{ color: getPerformanceColor(project.profit) }}
                    >
                      {formatCurrency(project.profit)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-sm">
                      {formatPercentage(project.roi)} ROI
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setView('history')}
                className="w-full py-3 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                View All Flips →
              </button>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <TrendingUp size={24} className="text-emerald-400" />
            <span>Performance Insights</span>
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Portfolio Health</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm mb-3">
                {portfolioMetrics.successRate > 70 
                  ? "Excellent performance! Your success rate is above 70%."
                  : portfolioMetrics.successRate > 50
                  ? "Good performance. Consider optimizing your strategy."
                  : "Focus on improving profitability and reducing risks."
                }
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(portfolioMetrics.successRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(portfolioMetrics.totalRevenue)}
                </div>
                <div style={{ color: textSecondaryColor }} className="text-sm">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {formatPercentage(portfolioMetrics.averageMargin)}
                </div>
                <div style={{ color: textSecondaryColor }} className="text-sm">Avg Margin</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
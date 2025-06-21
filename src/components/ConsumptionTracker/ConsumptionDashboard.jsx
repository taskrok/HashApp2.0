// components/ConsumptionTracker/ConsumptionDashboard.jsx
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { MetricCard } from '../ui/MetricCard';
import { DollarSign, TrendingUp, Package, Clock, Plus, BarChart3, Hash, Leaf, Zap, Target } from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor } from '../../utils/consumptionCalculations';

export const ConsumptionDashboard = ({ 
  entries, 
  consumptionMetrics, 
  setView, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const metrics = [
    {
      title: 'Daily Hash Avg',
      value: `${consumptionMetrics.avgHashPerDay.toFixed(2)}g`,
      change: `${consumptionMetrics.totalHashConsumed.toFixed(1)}g total`,
      icon: Hash,
      trend: consumptionMetrics.hashTrend || 0,
      color: 'blue',
      sparkline: [0, 10, 5, 15, 20, 25, 30, 35]
    },
    {
      title: 'Daily Flower Avg',
      value: `${consumptionMetrics.avgFlowerPerDay.toFixed(2)}g`,
      change: `${consumptionMetrics.totalFlowerConsumed.toFixed(1)}g total`,
      icon: Leaf,
      trend: consumptionMetrics.flowerTrend || 0,
      color: 'green',
      sparkline: [5, 8, 12, 18, 25, 22, 28, 30]
    },
    {
      title: 'Daily Cost Avg',
      value: formatCurrency(consumptionMetrics.avgDailyCost),
      change: `${formatCurrency(consumptionMetrics.totalCost)} total spent`,
      icon: DollarSign,
      trend: consumptionMetrics.costTrend || 0,
      color: 'yellow',
      sparkline: [20, 25, 22, 28, 35, 32, 38, 40]
    },
    {
      title: 'Avg Session Days',
      value: `${consumptionMetrics.avgSessionDays.toFixed(1)} days`,
      change: `${consumptionMetrics.totalEntries} total sessions`,
      icon: Clock,
      trend: 2,
      color: 'purple',
      sparkline: [3, 4, 2, 5, 3, 4, 6, 4]
    }
  ];

  const recentEntries = entries.slice(0, 5);

  return (
    <div className="space-y-8 pt-[50px]">
      {/* Welcome Header */}
      <div className="relative">
        <GlassCard className="text-center py-16" glow gradient>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Consumption Tracker
            </h1>
            <p style={{ color: textSecondaryColor }} className="text-xl mb-8">
              Your daily consumption averages {consumptionMetrics.avgHashPerDay.toFixed(1)}g hash and {consumptionMetrics.avgFlowerPerDay.toFixed(1)}g flower
            </p>
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => setView('form')} 
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-200 flex items-center space-x-3"
              >
                <Plus size={24} />
                <span>New Session</span>
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
            <span>Recent Sessions</span>
          </h3>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-500 mb-4" />
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-2">No sessions yet</h4>
              <p style={{ color: textSecondaryColor }} className="mb-4">Start tracking your cannabis consumption</p>
              <button 
                onClick={() => setView('form')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-200"
              >
                Add First Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => {
                const totalConsumption = (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
                const sessionCost = entry.totalCost || 0;
                const days = entry.sessionDays || 1;

                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <div className="flex-1">
                      <h4 style={{ color: textColor }} className="font-semibold">{entry.sessionName}</h4>
                      <p style={{ color: textSecondaryColor }} className="text-sm">
                        {entry.strain} • {entry.sessionType} • {days} {days > 1 ? 'days' : 'day'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        {entry.hashAmount > 0 && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                            {entry.hashAmount}g Hash
                          </span>
                        )}
                        {entry.flowerAmount > 0 && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            {entry.flowerAmount}g Flower
                          </span>
                        )}
                        {entry.edibleAmount > 0 && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            {entry.edibleAmount} Edibles
                          </span>
                        )}
                        {entry.vapeAmount > 0 && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                            {entry.vapeAmount}g Vape
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="font-bold text-lg"
                        style={{ color: getPerformanceColor(sessionCost, 'cost') }}
                      >
                        {formatCurrency(sessionCost)}
                      </div>
                      <div style={{ color: textSecondaryColor }} className="text-sm">
                        {totalConsumption.toFixed(1)}g total
                      </div>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={() => setView('history')}
                className="w-full py-3 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                View All Sessions →
              </button>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <TrendingUp size={24} className="text-emerald-400" />
            <span>Usage Insights</span>
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Consumption Balance</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm mb-3">
                {consumptionMetrics.avgHashPerDay > consumptionMetrics.avgFlowerPerDay 
                  ? `You prefer hash over flower (${(consumptionMetrics.avgHashPerDay / (consumptionMetrics.avgFlowerPerDay || 1)).toFixed(1)}:1 ratio)`
                  : consumptionMetrics.avgFlowerPerDay > consumptionMetrics.avgHashPerDay
                  ? `You prefer flower over hash (${(consumptionMetrics.avgFlowerPerDay / (consumptionMetrics.avgHashPerDay || 1)).toFixed(1)}:1 ratio)`
                  : "You have a balanced hash/flower consumption pattern"
                }
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((consumptionMetrics.totalEntries / 10) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(consumptionMetrics.avgDailyCost * 30)}
                </div>
                <div style={{ color: textSecondaryColor }} className="text-sm">Monthly Projection</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {consumptionMetrics.avgSessionDays.toFixed(1)}
                </div>
                <div style={{ color: textSecondaryColor }} className="text-sm">Avg Session Length</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => setView('insights')} 
                className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Zap size={16} />
                <span>View AI Insights</span>
              </button>
              <button 
                onClick={() => setView('achievements')} 
                className="w-full p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Target size={16} />
                <span>Check Achievements</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="text-center p-4">
          <div className="text-lg font-bold text-blue-400">
            {consumptionMetrics.totalHashConsumed.toFixed(1)}g
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Total Hash</div>
        </GlassCard>
        
        <GlassCard className="text-center p-4">
          <div className="text-lg font-bold text-green-400">
            {consumptionMetrics.totalFlowerConsumed.toFixed(1)}g
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Total Flower</div>
        </GlassCard>
        
        <GlassCard className="text-center p-4">
          <div className="text-lg font-bold text-purple-400">
            {consumptionMetrics.totalEdiblesConsumed || 0}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Total Edibles</div>
        </GlassCard>
        
        <GlassCard className="text-center p-4">
          <div className="text-lg font-bold text-orange-400">
            {consumptionMetrics.totalDaysTracked || 0}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Days Tracked</div>
        </GlassCard>
      </div>

      {/* Recent Trends Preview */}
      {entries.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: textColor }} className="text-xl font-semibold flex items-center space-x-2">
              <BarChart3 size={20} className="text-blue-400" />
              <span>Recent Trends</span>
            </h3>
            <button 
              onClick={() => setView('analytics')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View Full Analytics →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold text-sm mb-2">This Week</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Avg Daily:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {((consumptionMetrics.avgHashPerDay + consumptionMetrics.avgFlowerPerDay)).toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Cost:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {formatCurrency(consumptionMetrics.avgDailyCost * 7)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold text-sm mb-2">Preferred Type</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Primary:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {consumptionMetrics.avgHashPerDay > consumptionMetrics.avgFlowerPerDay ? 'Hash' : 'Flower'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Ratio:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {consumptionMetrics.avgHashPerDay > 0 && consumptionMetrics.avgFlowerPerDay > 0 
                      ? `${(Math.max(consumptionMetrics.avgHashPerDay, consumptionMetrics.avgFlowerPerDay) / Math.min(consumptionMetrics.avgHashPerDay, consumptionMetrics.avgFlowerPerDay)).toFixed(1)}:1`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold text-sm mb-2">Efficiency</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Cost/gram:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {formatCurrency(consumptionMetrics.avgDailyCost / ((consumptionMetrics.avgHashPerDay + consumptionMetrics.avgFlowerPerDay) || 1))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Sessions:</span>
                  <span style={{ color: textColor }} className="text-xs font-medium">
                    {consumptionMetrics.totalEntries}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
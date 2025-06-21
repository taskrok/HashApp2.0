// components/JarFlipTracker/JarFlipAnalytics.jsx
import React, { useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/jarFlipCalculations';

export const JarFlipAnalytics = ({ 
  projects, 
  portfolioMetrics, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    const sortedProjects = [...projects].sort((a, b) => 
      new Date(a.selloutDate) - new Date(b.selloutDate)
    );

    return sortedProjects.map((project, index) => ({
      ...project,
      index: index + 1,
      formattedDate: new Date(project.selloutDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      cumulativeProfit: sortedProjects
        .slice(0, index + 1)
        .reduce((sum, p) => sum + (p.profit || 0), 0)
    }));
  }, [projects]);

  // Strain performance data
  const strainData = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    const strainMap = {};
    projects.forEach(project => {
      const strain = project.strain || 'Unknown';
      if (!strainMap[strain]) {
        strainMap[strain] = {
          strain,
          totalProfit: 0,
          totalProjects: 0,
          avgROI: 0,
          profits: []
        };
      }
      strainMap[strain].totalProfit += project.profit || 0;
      strainMap[strain].totalProjects += 1;
      strainMap[strain].profits.push(project.roi || 0);
    });

    return Object.values(strainMap)
      .map(strain => ({
        ...strain,
        avgROI: strain.profits.reduce((sum, roi) => sum + roi, 0) / strain.profits.length
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 8);
  }, [projects]);

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <p className="font-semibold mb-2" style={{ color: textColor }}>{data.projectName}</p>
          <p className="text-blue-300 text-sm">Date: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('%') ? formatPercentage(entry.value) : formatCurrency(entry.value)}
            </p>
          ))}
          <p className="text-purple-300 text-sm">Strain: {data.strain}</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <p className="font-semibold mb-2" style={{ color: textColor }}>Strain: {label}</p>
          <p className="text-emerald-300 text-sm">Total Profit: {formatCurrency(payload[0].value)}</p>
          <p className="text-blue-300 text-sm">Projects: {payload[0].payload.totalProjects}</p>
          <p className="text-purple-300 text-sm">Avg ROI: {formatPercentage(payload[0].payload.avgROI)}</p>
        </div>
      );
    }
    return null;
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-8 pt-4">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <BarChart3 size={32} className="text-blue-400" />
          <span>Analytics</span>
        </h2>
        <GlassCard className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-4">No Data Available</h3>
          <p style={{ color: textSecondaryColor }} className="text-lg">
            Complete some flip projects to see detailed analytics and insights here.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <BarChart3 size={32} className="text-blue-400" />
          <span>Flip Analytics</span>
        </h2>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {formatCurrency(portfolioMetrics.totalProfit)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Total Profit</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {portfolioMetrics.totalFlips} flips
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {formatPercentage(portfolioMetrics.averageROI)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Average ROI</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {formatPercentage(portfolioMetrics.successRate)} success rate
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {portfolioMetrics.averageFlipDays.toFixed(0)} days
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Avg Flip Time</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            Time to market
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {formatCurrency(portfolioMetrics.totalRevenue)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Total Revenue</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {formatPercentage(portfolioMetrics.averageMargin)} avg margin
          </div>
        </GlassCard>
      </div>

      {/* Performance Charts */}
      {chartData.length > 1 && (
        <div className="space-y-8">
          {/* Profit & ROI Over Time */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>Performance Over Time</h3>
                  <p className="text-gray-400 text-sm">Track your profit and ROI trends</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-300">Profit ($)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">ROI (%)</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="profit"
                  stroke="#10b981"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="roi"
                  orientation="right"
                  stroke="#3b82f6"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="profit"
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 3, fill: '#fff' }}
                />
                <Line
                  yAxisId="roi"
                  type="monotone"
                  dataKey="roi"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 3, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Cumulative Profit */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <DollarSign size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>Cumulative Profit</h3>
                  <p className="text-gray-400 text-sm">Your profit growth over time</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cumulativeProfit"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="rgba(139, 92, 246, 0.1)"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 3, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Flip Duration Trend */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Clock size={24} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>Flip Duration Trends</h3>
                  <p className="text-gray-400 text-sm">How quickly you're moving inventory</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="flipDurationDays"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* Strain Performance */}
      {strainData.length > 0 && (
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <BarChart3 size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold  style={{ color: textColor }}">Strain Performance</h3>
                <p className="text-gray-400 text-sm">Total profit by strain</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={strainData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="strain" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar 
                dataKey="totalProfit" 
                fill="url(#strainGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="strainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4">
            Key Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Best Performing Strain</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {strainData.length > 0 
                  ? `${strainData[0].strain} generated ${formatCurrency(strainData[0].totalProfit)} across ${strainData[0].totalProjects} projects`
                  : "Not enough data yet"
                }
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Portfolio Health</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {portfolioMetrics.successRate > 70 
                  ? "Excellent! Your success rate is above 70%"
                  : portfolioMetrics.successRate > 50
                  ? "Good performance, consider optimizing strategy"
                  : "Focus on improving profitability"
                }
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Most Profitable Flip', value: formatCurrency(Math.max(...projects.map(p => p.profit || 0))) },
              { label: 'Fastest Flip', value: `${Math.min(...projects.map(p => p.flipDurationDays || 999))} days` },
              { label: 'Best ROI', value: formatPercentage(Math.max(...projects.map(p => p.roi || 0))) },
              { label: 'Average Investment', value: formatCurrency(portfolioMetrics.totalCost / portfolioMetrics.totalFlips) }
            ].map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span style={{ color: textSecondaryColor }} className="text-sm">{stat.label}</span>
                <span style={{ color: textColor }} className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
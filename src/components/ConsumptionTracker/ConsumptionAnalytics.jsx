// components/ConsumptionTracker/ConsumptionAnalytics.jsx
import React, { useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Clock, Hash, Leaf, Pill, Zap, Target, Calendar } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/consumptionCalculations';

export const ConsumptionAnalytics = ({ 
  entries, 
  consumptionMetrics, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.endDate) - new Date(b.endDate)
    );

    return sortedEntries.map((entry, index) => ({
      ...entry,
      index: index + 1,
      formattedDate: new Date(entry.endDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      cumulativeCost: sortedEntries
        .slice(0, index + 1)
        .reduce((sum, e) => sum + (e.totalCost || 0), 0),
      dailyHashAmount: (entry.hashAmount || 0) / Math.max(1, entry.sessionDays || 1),
      dailyFlowerAmount: (entry.flowerAmount || 0) / Math.max(1, entry.sessionDays || 1),
      dailyEdibleAmount: (entry.edibleAmount || 0) / Math.max(1, entry.sessionDays || 1),
      dailyVapeAmount: (entry.vapeAmount || 0) / Math.max(1, entry.sessionDays || 1),
      totalDailyAmount: ((entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0)) / Math.max(1, entry.sessionDays || 1)
    }));
  }, [entries]);

  // Consumption type breakdown data
  const consumptionTypeData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    const totals = entries.reduce((acc, entry) => {
      acc.hash += entry.hashAmount || 0;
      acc.flower += entry.flowerAmount || 0;
      acc.edibles += entry.edibleAmount || 0;
      acc.vape += entry.vapeAmount || 0;
      return acc;
    }, { hash: 0, flower: 0, edibles: 0, vape: 0 });

    return [
      { name: 'Hash', value: totals.hash, color: '#3b82f6', icon: Hash },
      { name: 'Flower', value: totals.flower, color: '#10b981', icon: Leaf },
      { name: 'Edibles', value: totals.edibles, color: '#8b5cf6', icon: Pill },
      { name: 'Vape', value: totals.vape, color: '#f97316', icon: Zap }
    ].filter(item => item.value > 0);
  }, [entries]);

  // Monthly spending data
  const monthlySpendingData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    const monthlyData = {};
    entries.forEach(entry => {
      const month = new Date(entry.endDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          totalCost: 0,
          hashCost: 0,
          flowerCost: 0,
          edibleCost: 0,
          vapeCost: 0,
          sessions: 0
        };
      }
      monthlyData[month].totalCost += entry.totalCost || 0;
      monthlyData[month].hashCost += (entry.hashAmount || 0) * parseFloat(entry.hashCostPerGram || 0);
      monthlyData[month].flowerCost += (entry.flowerAmount || 0) * parseFloat(entry.flowerCostPerGram || 0);
      monthlyData[month].edibleCost += (entry.edibleAmount || 0) * parseFloat(entry.edibleCostPerUnit || 0);
      monthlyData[month].vapeCost += (entry.vapeAmount || 0) * parseFloat(entry.vapeCostPerGram || 0);
      monthlyData[month].sessions += 1;
    });

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month + ' 1, 2024') - new Date(b.month + ' 1, 2024')
    );
  }, [entries]);

  // Session duration trends
  const sessionDurationData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    return chartData.map(entry => ({
      date: entry.formattedDate,
      duration: entry.sessionDays || 1,
      cost: entry.totalCost || 0,
      amount: entry.totalDailyAmount
    }));
  }, [chartData]);

  // Mood correlation data
  const moodCorrelationData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    
    const moodData = {};
    entries.forEach(entry => {
      if (entry.moodBefore && entry.moodAfter) {
        const key = `${entry.moodBefore} → ${entry.moodAfter}`;
        if (!moodData[key]) {
          moodData[key] = { 
            transition: key, 
            count: 0, 
            avgCost: 0, 
            totalCost: 0,
            avgAmount: 0,
            totalAmount: 0
          };
        }
        moodData[key].count += 1;
        moodData[key].totalCost += entry.totalCost || 0;
        moodData[key].totalAmount += (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
      }
    });

    return Object.values(moodData)
      .map(item => ({
        ...item,
        avgCost: item.totalCost / item.count,
        avgAmount: item.totalAmount / item.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [entries]);

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <p className="font-semibold mb-2" style={{ color: textColor }}>{data.sessionName || label}</p>
          <p className="text-blue-300 text-sm">Date: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Cost') ? formatCurrency(entry.value) : `${entry.value.toFixed(2)}${entry.name.includes('Amount') ? 'g' : ''}`}
            </p>
          ))}
          {data.strain && <p className="text-purple-300 text-sm">Strain: {data.strain}</p>}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <p className="font-semibold mb-2" style={{ color: textColor }}>{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Amount: {data.value.toFixed(2)}{data.name === 'Edibles' ? ' units' : 'g'}
          </p>
          <p className="text-sm text-gray-300">
            Percentage: {((data.value / consumptionTypeData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!entries || entries.length === 0) {
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
            Complete some consumption sessions to see detailed analytics and insights here.
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
          <span>Consumption Analytics</span>
        </h2>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {formatCurrency(consumptionMetrics.totalCost)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Total Spent</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {consumptionMetrics.totalEntries} sessions
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {consumptionMetrics.avgDailyCost ? formatCurrency(consumptionMetrics.avgDailyCost) : '$0.00'}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Avg Daily Cost</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {formatCurrency(consumptionMetrics.avgDailyCost * 30)} monthly
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {consumptionMetrics.avgSessionDays.toFixed(1)} days
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Avg Session Length</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            Duration per session
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {((consumptionMetrics.totalHashConsumed + consumptionMetrics.totalFlowerConsumed + consumptionMetrics.totalEdiblesConsumed + (consumptionMetrics.totalVapeConsumed || 0)) / Math.max(1, consumptionMetrics.totalDaysTracked)).toFixed(2)}g
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Daily Average</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            All consumption types
          </div>
        </GlassCard>
      </div>

      {/* Consumption Trends Chart */}
      {chartData.length > 1 && (
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: textColor }}>Daily Consumption Trends</h3>
                <p className="text-gray-400 text-sm">Track your consumption patterns over time</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Hash</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Flower</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Edibles</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">Vape</span>
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
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="dailyHashAmount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="dailyFlowerAmount"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="dailyEdibleAmount"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="dailyVapeAmount"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Cost Analysis */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <DollarSign size={24} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: textColor }}>Cumulative Spending</h3>
              <p className="text-gray-400 text-sm">Your spending growth over time</p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Area
              type="monotone"
              dataKey="cumulativeCost"
              stroke="#fbbf24"
              fill="rgba(251, 191, 36, 0.1)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Consumption Type Breakdown and Monthly Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consumption Type Pie Chart */}
        {consumptionTypeData.length > 0 && (
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Target size={20} className="text-purple-400" />
              <span style={{ color: textColor }}>Consumption Breakdown</span>
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consumptionTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {consumptionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {consumptionTypeData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon size={16} style={{ color: item.color }} />
                      <span style={{ color: textColor }} className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span style={{ color: textColor }} className="text-sm">
                      {item.value.toFixed(1)}{item.name === 'Edibles' ? '' : 'g'}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Monthly Spending */}
        {monthlySpendingData.length > 0 && (
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Calendar size={20} className="text-green-400" />
              <span style={{ color: textColor }}>Monthly Spending</span>
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
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
                <Bar dataKey="totalCost" fill="url(#monthlyGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {formatCurrency(monthlySpendingData.reduce((sum, month) => sum + month.totalCost, 0) / monthlySpendingData.length)}
              </div>
              <div style={{ color: textSecondaryColor }} className="text-sm">Average Monthly Spending</div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Session Duration Trends */}
      {sessionDurationData.length > 1 && (
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <Clock size={24} className="text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: textColor }}>Session Duration & Amount Trends</h3>
                <p className="text-gray-400 text-sm">How session length relates to consumption</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionDurationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                yAxisId="duration"
                stroke="#f97316"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                yAxisId="amount"
                orientation="right"
                stroke="#3b82f6"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="duration"
                type="monotone"
                dataKey="duration"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
              />
              <Line
                yAxisId="amount"
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 3, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Mood Correlation Analysis */}
      {moodCorrelationData.length > 0 && (
        <GlassCard className="p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Target size={20} className="text-pink-400" />
            <span style={{ color: textColor }}>Mood Correlation Analysis</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodCorrelationData.slice(0, 6).map((item, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl">
                  <div className="text-sm font-medium text-pink-400 mb-2">{item.transition}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span style={{ color: textSecondaryColor }}>Sessions:</span>
                      <span style={{ color: textColor }} className="ml-1 font-medium">{item.count}</span>
                    </div>
                    <div>
                      <span style={{ color: textSecondaryColor }}>Avg Cost:</span>
                      <span style={{ color: textColor }} className="ml-1 font-medium">{formatCurrency(item.avgCost)}</span>
                    </div>
                    <div className="col-span-2">
                      <span style={{ color: textSecondaryColor }}>Avg Amount:</span>
                      <span style={{ color: textColor }} className="ml-1 font-medium">{item.avgAmount.toFixed(1)}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Preferred Consumption Type</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {consumptionTypeData.length > 0 
                  ? `${consumptionTypeData[0].name} is your most consumed type with ${consumptionTypeData[0].value.toFixed(1)}${consumptionTypeData[0].name === 'Edibles' ? ' units' : 'g'} total`
                  : "Not enough data yet"
                }
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
              <h4 style={{ color: textColor }} className="font-semibold mb-2">Spending Pattern</h4>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {consumptionMetrics.avgDailyCost > 0
                  ? `You spend an average of ${formatCurrency(consumptionMetrics.avgDailyCost)} per day, projecting to ${formatCurrency(consumptionMetrics.avgDailyCost * 365)} annually`
                  : "Start tracking costs to see spending patterns"
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
              { label: 'Most Expensive Session', value: formatCurrency(Math.max(...entries.map(e => e.totalCost || 0))) },
              { label: 'Longest Session', value: `${Math.max(...entries.map(e => e.sessionDays || 1))} days` },
              { label: 'Most Consumed (Single Session)', value: `${Math.max(...entries.map(e => ((e.hashAmount || 0) + (e.flowerAmount || 0) + (e.edibleAmount || 0) + (e.vapeAmount || 0)))).toFixed(1)}g` },
              { label: 'Average Cost per Gram', value: formatCurrency((consumptionMetrics.totalCost || 0) / Math.max(1, (consumptionMetrics.totalHashConsumed + consumptionMetrics.totalFlowerConsumed + (consumptionMetrics.totalVapeConsumed || 0)))) }
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
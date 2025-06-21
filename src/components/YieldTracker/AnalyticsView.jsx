import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Leaf, Settings, Brain, Filter, Download, ArrowUp, ArrowDown, Minus, Clock, ChevronDown, Activity, Target } from 'lucide-react';

export const AnalyticsView = ({ theme, isDarkMode, projects = [], calculateProjectMetrics, averageYieldTarget = 85 }) => {
  // Use theme colors
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Chart state
  const [activeChartTab, setActiveChartTab] = useState('yield');
  const [selectedStrain, setSelectedStrain] = useState('all');
  const [selectedProcessor, setSelectedProcessor] = useState('all');

  // Calculate analytics from actual project data
  const analytics = React.useMemo(() => {
    if (!projects.length) return null;

    // Process projects with metrics
    const projectsWithMetrics = projects.map(calculateProjectMetrics);
    
    // Calculate strain analytics
    const strainData = {};
    projectsWithMetrics.forEach(project => {
      const strain = project.strain || 'Unknown';
      if (!strainData[strain]) {
        strainData[strain] = { yields: [], profits: [], count: 0 };
      }
      strainData[strain].yields.push(parseFloat(project.actualYieldPercent));
      strainData[strain].profits.push(parseFloat(project.profit));
      strainData[strain].count++;
    });

    // Calculate averages for strains
    const strainAnalytics = Object.entries(strainData)
      .map(([strain, data]) => ({
        strain,
        avgYield: (data.yields.reduce((a, b) => a + b, 0) / data.yields.length).toFixed(1),
        avgProfit: (data.profits.reduce((a, b) => a + b, 0) / data.profits.length).toFixed(0),
        projectCount: data.count
      }))
      .sort((a, b) => parseFloat(b.avgYield) - parseFloat(a.avgYield))
      .slice(0, 5);

    // Calculate material path analytics
    const materialPaths = {};
    projectsWithMetrics.forEach(project => {
      const path = `${project.startMaterial} → ${project.finishMaterial}`;
      if (!materialPaths[path]) {
        materialPaths[path] = { yields: [], profits: [], count: 0 };
      }
      materialPaths[path].yields.push(parseFloat(project.actualYieldPercent));
      materialPaths[path].profits.push(parseFloat(project.profit));
      materialPaths[path].count++;
    });

    const pathAnalytics = Object.entries(materialPaths)
      .map(([path, data]) => ({
        path,
        avgYield: (data.yields.reduce((a, b) => a + b, 0) / data.yields.length).toFixed(1),
        avgProfit: (data.profits.reduce((a, b) => a + b, 0) / data.profits.length).toFixed(0),
        projectCount: data.count
      }))
      .sort((a, b) => parseFloat(b.avgYield) - parseFloat(a.avgYield));

    // Calculate overall metrics
    const totalRevenue = projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.revenue), 0);
    const totalProfit = projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.profit), 0);
    const avgEfficiency = projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.efficiency), 0) / projectsWithMetrics.length;
    const avgYield = projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.actualYieldPercent), 0) / projectsWithMetrics.length;

    // Calculate recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProjects = projectsWithMetrics.filter(p => new Date(p.endDate) > thirtyDaysAgo);
    const recentAvgYield = recentProjects.length > 0 
      ? recentProjects.reduce((sum, p) => sum + parseFloat(p.actualYieldPercent), 0) / recentProjects.length 
      : avgYield;

    return {
      strainAnalytics,
      pathAnalytics,
      totalRevenue,
      totalProfit,
      avgEfficiency,
      avgYield,
      recentAvgYield,
      yieldTrend: recentAvgYield > avgYield ? 'up' : recentAvgYield < avgYield ? 'down' : 'stable',
      projectCount: projects.length,
      recentProjectCount: recentProjects.length
    };
  }, [projects, calculateProjectMetrics]);

  // Process data for charts
  const chartData = useMemo(() => {
    if (!projects.length) return [];
    
    const processedData = projects.map(project => {
      const projectWithMetrics = calculateProjectMetrics(project);
      const processingDays = Math.ceil(
        (new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24)
      );
      
      return {
        ...project,
        ...projectWithMetrics,
        date: project.endDate,
        formattedDate: new Date(project.endDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        processingTime: processingDays,
        yieldValue: parseFloat(project.actualYieldPercent || projectWithMetrics.actualYieldPercent)
      };
    });

    return processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [projects, calculateProjectMetrics]);

  // Filter data based on selected strain/processor
  const filteredYieldData = useMemo(() => {
    if (selectedStrain === 'all') return chartData;
    return chartData.filter(item => item.strain === selectedStrain);
  }, [chartData, selectedStrain]);

  const filteredProcessingData = useMemo(() => {
    if (selectedProcessor === 'all') return chartData;
    return chartData.filter(item => item.processor === selectedProcessor);
  }, [chartData, selectedProcessor]);

  // Get unique strains and processors
  const strains = [...new Set(projects.map(p => p.strain))];
  const processors = [...new Set(projects.map(p => p.processor))];

  // Custom tooltip components
  const YieldTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className=" style={{ color: textColor }} font-semibold mb-2">{data.projectName}</p>
          <p className="text-blue-300 text-sm">Date: {label}</p>
          <p className="text-emerald-300 text-sm">Yield: {data.yieldValue.toFixed(1)}%</p>
          <p className="text-purple-300 text-sm">Strain: {data.strain}</p>
          <p className="text-green-300 text-sm">Profit: ${data.profit}</p>
        </div>
      );
    }
    return null;
  };

  const ProcessingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className=" style={{ color: textColor }} font-semibled mb-2">{data.projectName}</p>
          <p className="text-blue-300 text-sm">Date: {label}</p>
          <p className="text-orange-300 text-sm">Processing Time: {data.processingTime} days</p>
          <p className="text-cyan-300 text-sm">Processor: {data.processor}</p>
          <p className="text-emerald-300 text-sm">Yield: {data.yieldValue.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  if (!analytics) {
    return (
      <div className="space-y-8">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <BarChart3 size={32} className="text-blue-400" />
          <span>Advanced Analytics</span>
        </h2>
        <GlassCard className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-4">No Data Available</h3>
          <p style={{ color: textSecondaryColor }} className="text-lg">
            Complete some projects to see detailed analytics and insights here.
          </p>
        </GlassCard>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUp size={16} className="text-emerald-400" />;
      case 'down': return <ArrowDown size={16} className="text-red-400" />;
      default: return <Minus size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <BarChart3 size={32} className="text-blue-400" />
          <span>Advanced Analytics</span>
        </h2>
        <div className="flex items-center space-x-4">
          <select style={{ color: textColor }} className="px-4 py-2 bg-white/5 border border-slate-700/50 rounded-xl bg-transparent">
            <option value="all">All Time</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button style={{ color: textColor }} className="px-4 py-2 bg-white/5 border border-slate-700/50 rounded-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Filter size={16} />
            <span>Advanced Filters</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600  style={{ color: textColor }} rounded-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            ${analytics.totalRevenue.toFixed(0)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Total Revenue</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {analytics.projectCount} projects
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-green-400 mb-1">
            ${analytics.totalProfit.toFixed(0)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Total Profit</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(1)}% margin
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-blue-400 mb-1 flex items-center justify-center space-x-1">
            <span>{analytics.avgYield.toFixed(1)}%</span>
            {getTrendIcon(analytics.yieldTrend)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Avg Yield</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {analytics.recentAvgYield.toFixed(1)}% recent
          </div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {analytics.avgEfficiency.toFixed(0)}%
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Avg Efficiency</div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            Process performance
          </div>
        </GlassCard>
      </div>

      {/* NEW: Performance Charts Section */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveChartTab('yield')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeChartTab === 'yield'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500  style={{ color: textColor }} shadow-lg scale-105'
                  : 'text-gray-400 hover: style={{ color: textColor }} hover:bg-white/5'
              }`}
            >
              <TrendingUp size={18} />
              <span>Yield Performance</span>
            </button>
            <button
              onClick={() => setActiveChartTab('processing')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeChartTab === 'processing'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500  style={{ color: textColor }} shadow-lg scale-105'
                  : 'text-gray-400 hover: style={{ color: textColor }} hover:bg-white/5'
              }`}
            >
              <Clock size={18} />
              <span>Processing Time</span>
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            {activeChartTab === 'yield' ? (
              <div className="relative">
                <select
                  value={selectedStrain}
                  onChange={(e) => setSelectedStrain(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-10  style={{ color: textColor }} font-medium cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all" className="bg-gray-800">All Strains</option>
                  {strains.map(strain => (
                    <option key={strain} value={strain} className="bg-gray-800">{strain}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedProcessor}
                  onChange={(e) => setSelectedProcessor(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-10  style={{ color: textColor }} font-medium cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all" className="bg-gray-800">All Processors</option>
                  {processors.map(processor => (
                    <option key={processor} value={processor} className="bg-gray-800">{processor}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <GlassCard className="p-8 h-[500px]">
          {activeChartTab === 'yield' ? (
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Target size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold  style={{ color: textColor }}">Yield Performance Over Time</h3>
                    <p className="text-gray-400 text-sm">
                      Tracking {selectedStrain === 'all' ? 'all strains' : selectedStrain} against {averageYieldTarget}% target
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Actual Yield</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Target ({averageYieldTarget}%)</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={filteredYieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
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
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip content={<YieldTooltip />} />
                  <ReferenceLine 
                    y={averageYieldTarget} 
                    stroke="#6b7280" 
                    strokeDasharray="5 5"
                    label={{ value: `Target: ${averageYieldTarget}%`, position: "insideTopRight" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="yieldValue"
                    stroke="url(#yieldGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 3, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-xl">
                    <Activity size={24} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold  style={{ color: textColor }}">Processing Time Trends</h3>
                    <p className="text-gray-400 text-sm">
                      Monitoring {selectedProcessor === 'all' ? 'all processors' : selectedProcessor} efficiency over time
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                    <span className="text-gray-300">Processing Days</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={filteredProcessingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="processingGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
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
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip content={<ProcessingTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="processingTime"
                    stroke="url(#processingGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {activeChartTab === 'yield' 
                ? `${filteredYieldData.length ? (filteredYieldData.reduce((sum, p) => sum + p.yieldValue, 0) / filteredYieldData.length).toFixed(1) : '0'}%`
                : `${filteredProcessingData.length ? (filteredProcessingData.reduce((sum, p) => sum + p.processingTime, 0) / filteredProcessingData.length).toFixed(1) : '0'} days`
              }
            </div>
            <div className="text-gray-400 text-sm">
              {activeChartTab === 'yield' ? 'Average Yield' : 'Average Processing Time'}
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {activeChartTab === 'yield' 
                ? `${filteredYieldData.length ? Math.max(...filteredYieldData.map(p => p.yieldValue)).toFixed(1) : '0'}%`
                : `${filteredProcessingData.length ? Math.min(...filteredProcessingData.map(p => p.processingTime)) : '0'} days`
              }
            </div>
            <div className="text-gray-400 text-sm">
              {activeChartTab === 'yield' ? 'Best Yield' : 'Fastest Processing'}
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {activeChartTab === 'yield' ? filteredYieldData.length : filteredProcessingData.length}
            </div>
            <div className="text-gray-400 text-sm">Total Projects</div>
          </GlassCard>
        </div>
      </div>
      
      {/* Existing analytics content continues... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <GlassCard className="h-96">
            <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp size={20} className="text-emerald-400" />
              <span>Material Path Performance</span>
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analytics.pathAnalytics.map((path, index) => (
                <div key={path.path} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl">
                  <div>
                    <div style={{ color: textColor }} className="font-medium text-sm">{path.path}</div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">
                      {path.projectCount} project{path.projectCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{path.avgYield}%</div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">avg yield</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        
        <GlassCard className="h-96">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <DollarSign size={20} className="text-green-400" />
            <span>Profitability Breakdown</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: textSecondaryColor }} className="text-sm">Revenue per Project</span>
                <span style={{ color: textColor }} className="font-semibold">
                  ${(analytics.totalRevenue / analytics.projectCount).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: textSecondaryColor }} className="text-sm">Profit per Project</span>
                <span className="font-semibold text-green-400">
                  ${(analytics.totalProfit / analytics.projectCount).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: textSecondaryColor }} className="text-sm">Success Rate</span>
                <span style={{ color: textColor }} className="font-semibold">
                  {((projects.filter(p => parseFloat(calculateProjectMetrics(p).profit) > 0).length / projects.length) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 style={{ color: textColor }} className="font-medium text-sm">Top Performing Strains</h4>
              {analytics.strainAnalytics.slice(0, 3).map((strain, index) => (
                <div key={strain.strain} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span style={{ color: textColor }} className="text-sm">{strain.strain}</span>
                  <span className="text-emerald-400 text-sm font-medium">{strain.avgYield}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="h-96">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Leaf size={20} className="text-green-400" />
            <span>Strain Performance</span>
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.strainAnalytics.map((strain, index) => (
              <div key={strain.strain} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                <div>
                  <span style={{ color: textColor }} className="font-medium text-sm">{strain.strain}</span>
                  <div style={{ color: textSecondaryColor }} className="text-xs">
                    {strain.projectCount} extraction{strain.projectCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">{strain.avgYield}%</p>
                  <p style={{ color: textSecondaryColor }} className="text-xs">avg yield</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="h-96">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Settings size={20} className="text-blue-400" />
            <span>Process Efficiency</span>
          </h3>
          <div className="space-y-4">
            {[
              { 
                name: 'Overall Efficiency', 
                efficiency: analytics.avgEfficiency, 
                status: analytics.avgEfficiency >= 100 ? 'optimal' : analytics.avgEfficiency >= 90 ? 'good' : 'maintenance' 
              },
              { 
                name: 'Yield Consistency', 
                efficiency: Math.max(0, 100 - (analytics.strainAnalytics.length > 1 ? 
                  ((Math.max(...analytics.strainAnalytics.map(s => parseFloat(s.avgYield))) - 
                    Math.min(...analytics.strainAnalytics.map(s => parseFloat(s.avgYield)))) * 2) : 0)), 
                status: 'good' 
              },
              { 
                name: 'Profit Margin', 
                efficiency: (analytics.totalProfit / analytics.totalRevenue) * 100, 
                status: (analytics.totalProfit / analytics.totalRevenue) > 0.5 ? 'optimal' : 'good' 
              }
            ].map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span style={{ color: textColor }} className="font-medium text-sm">{metric.name}</span>
                  <span className={`text-sm ${metric.status === 'optimal' ? 'text-green-400' : metric.status === 'good' ? 'text-blue-400' : 'text-yellow-400'}`}>
                    {metric.efficiency.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${metric.status === 'optimal' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : metric.status === 'good' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`} 
                    style={{ width: `${Math.min(metric.efficiency, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        
        <div className="xl:col-span-2">
          <GlassCard className="h-96">
            <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Brain size={20} className="text-purple-400" />
              <span>AI-Powered Insights</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 flex flex-col justify-center">
                <h4 style={{ color: textColor }} className="font-semibold mb-2">Best Performing Setup</h4>
                <p style={{ color: textSecondaryColor }} className="text-sm mb-4">
                  {analytics.pathAnalytics[0]?.path} shows highest yields at {analytics.pathAnalytics[0]?.avgYield}% average
                </p>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Optimize Setup →</button>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 flex flex-col justify-center">
                <h4 style={{ color: textColor }} className="font-semibold mb-2">Efficiency Recommendation</h4>
                <p style={{ color: textSecondaryColor }} className="text-sm mb-4">
                  Focus on {analytics.strainAnalytics[0]?.strain} strain - {analytics.strainAnalytics[0]?.projectCount} successful extraction{analytics.strainAnalytics[0]?.projectCount !== 1 ? 's' : ''}
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View Analysis →</button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
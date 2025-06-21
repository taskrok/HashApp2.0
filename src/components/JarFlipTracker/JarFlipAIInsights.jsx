// components/JarFlipTracker/JarFlipAIInsights.jsx
import React, { useMemo, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Brain, TrendingUp, Award, Lightbulb, AlertTriangle, Target, Star, BarChart3, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/jarFlipCalculations';

// Import database for competition analysis
import { competitions, events, placements, eventAwards } from '../../data/database.js';

export const JarFlipAIInsights = ({ 
  projects, 
  portfolioMetrics, 
  theme, 
  isDarkMode,
  // Placeholder for future consumption data
  consumptionData = null,
  yieldTrackerData = null
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [selectedInsightType, setSelectedInsightType] = useState('all');

  // AI Insight Generation Logic
  const insights = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    const generatedInsights = [];

    // 1. STRAIN PERFORMANCE ANALYSIS
    const strainPerformance = analyzeStrainPerformance(projects);
    if (strainPerformance.insights.length > 0) {
      generatedInsights.push(...strainPerformance.insights);
    }

    // 2. COMPETITION WINNERS ANALYSIS
    const competitionInsights = analyzeCompetitionTrends(projects, placements, eventAwards);
    generatedInsights.push(...competitionInsights);

    // 3. MARKET TIMING ANALYSIS
    const timingInsights = analyzeMarketTiming(projects);
    generatedInsights.push(...timingInsights);

    // 4. PROFIT OPTIMIZATION INSIGHTS
    const profitInsights = analyzeProfitOptimization(projects, portfolioMetrics);
    generatedInsights.push(...profitInsights);

    // 5. RISK ASSESSMENT
    const riskInsights = analyzeRiskFactors(projects, portfolioMetrics);
    generatedInsights.push(...riskInsights);

    // 6. FUTURE PLACEHOLDERS
    if (consumptionData) {
      const consumptionInsights = analyzeConsumptionPatterns(projects, consumptionData);
      generatedInsights.push(...consumptionInsights);
    }

    if (yieldTrackerData) {
      const yieldInsights = analyzeYieldCorrelations(projects, yieldTrackerData);
      generatedInsights.push(...yieldInsights);
    }

    return generatedInsights.sort((a, b) => b.priority - a.priority);
  }, [projects, portfolioMetrics, consumptionData, yieldTrackerData]);

  const filteredInsights = useMemo(() => {
    if (selectedInsightType === 'all') return insights;
    return insights.filter(insight => insight.type === selectedInsightType);
  }, [insights, selectedInsightType]);

  const insightTypes = [
    { id: 'all', label: 'All Insights', icon: Brain },
    { id: 'strain', label: 'Strain Analysis', icon: Star },
    { id: 'competition', label: 'Competition Trends', icon: Award },
    { id: 'timing', label: 'Market Timing', icon: Clock },
    { id: 'profit', label: 'Profit Optimization', icon: DollarSign },
    { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle }
  ];

  if (projects.length === 0) {
    return (
      <div className="space-y-8">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Brain size={32} className="text-purple-400" />
          <span>AI Insights</span>
        </h2>
        <GlassCard className="text-center py-16">
          <Brain size={64} className="mx-auto text-purple-400 mb-4" />
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-4">No Data to Analyze</h3>
          <p style={{ color: textSecondaryColor }} className="text-lg">
            Complete some flip projects to unlock AI-powered insights and recommendations.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Brain size={32} className="text-purple-400" />
          <span>AI Insights</span>
        </h2>
        <div className="text-sm" style={{ color: textSecondaryColor }}>
          {insights.length} insights generated
        </div>
      </div>

      {/* Insight Type Filter */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-3">
          {insightTypes.map(type => {
            const Icon = type.icon;
            const isActive = selectedInsightType === type.id;
            const count = type.id === 'all' ? insights.length : insights.filter(i => i.type === type.id).length;
            
            return (
              <button
                key={type.id}
                onClick={() => setSelectedInsightType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/20'
                }`}
                style={{ color: isActive ? undefined : textSecondaryColor }}
              >
                <Icon size={16} />
                <span className="font-medium">{type.label}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => (
          <InsightCard
            key={index}
            insight={insight}
            textColor={textColor}
            textSecondaryColor={textSecondaryColor}
          />
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <GlassCard className="text-center py-12">
          <Lightbulb size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 style={{ color: textColor }} className="text-xl font-bold mb-2">No insights for this category</h3>
          <p style={{ color: textSecondaryColor }}>
            Try selecting a different insight type or complete more projects.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ insight, textColor, textSecondaryColor }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'strain': return Star;
      case 'competition': return Award;
      case 'timing': return Clock;
      case 'profit': return DollarSign;
      case 'risk': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (priority) => {
    if (priority >= 8) return 'text-red-400';
    if (priority >= 6) return 'text-orange-400';
    if (priority >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <GlassCard className="p-6 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl bg-white/10 ${getInsightColor(insight.priority)}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 style={{ color: textColor }} className="font-semibold text-lg">{insight.title}</h3>
            <p style={{ color: textSecondaryColor }} className="text-sm capitalize">{insight.type} insight</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getInsightColor(insight.priority)} bg-white/10`}>
          Priority {insight.priority}/10
        </div>
      </div>
      
      <p style={{ color: textColor }} className="mb-4 leading-relaxed">
        {insight.description}
      </p>
      
      {insight.data && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(insight.data).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-white/5 rounded-lg">
              <div style={{ color: textColor }} className="font-semibold">{value}</div>
              <div style={{ color: textSecondaryColor }} className="text-xs">{key}</div>
            </div>
          ))}
        </div>
      )}
      
      {insight.actionItems && insight.actionItems.length > 0 && (
        <div>
          <h4 style={{ color: textColor }} className="font-semibold mb-2 text-sm">Recommended Actions:</h4>
          <ul className="space-y-1">
            {insight.actionItems.map((action, index) => (
              <li key={index} style={{ color: textSecondaryColor }} className="text-sm flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  );
};

// Analysis Functions
function analyzeStrainPerformance(projects) {
  const strainMap = {};
  projects.forEach(project => {
    const strain = project.strain || 'Unknown';
    if (!strainMap[strain]) {
      strainMap[strain] = { profits: [], rois: [], count: 0 };
    }
    strainMap[strain].profits.push(project.profit || 0);
    strainMap[strain].rois.push(project.roi || 0);
    strainMap[strain].count += 1;
  });

  const insights = [];
  const strainStats = Object.entries(strainMap)
    .map(([strain, data]) => ({
      strain,
      avgProfit: data.profits.reduce((sum, p) => sum + p, 0) / data.count,
      avgROI: data.rois.reduce((sum, r) => sum + r, 0) / data.count,
      count: data.count
    }))
    .sort((a, b) => b.avgProfit - a.avgProfit);

  if (strainStats.length > 1) {
    const topStrain = strainStats[0];
    const worstStrain = strainStats[strainStats.length - 1];
    
    if (topStrain.avgProfit > worstStrain.avgProfit * 1.5) {
      insights.push({
        type: 'strain',
        title: `${topStrain.strain} is Your Star Performer`,
        description: `${topStrain.strain} generates ${formatPercentage((topStrain.avgProfit - worstStrain.avgProfit) / worstStrain.avgProfit * 100)} more profit on average than ${worstStrain.strain}. Consider focusing more inventory on high-performing strains.`,
        priority: 7,
        data: {
          'Top Strain': topStrain.strain,
          'Avg Profit': formatCurrency(topStrain.avgProfit),
          'Projects': topStrain.count
        },
        actionItems: [
          `Increase ${topStrain.strain} inventory allocation`,
          `Research similar genetics to ${topStrain.strain}`,
          `Reduce investment in underperforming strains`
        ]
      });
    }
  }

  return { insights };
}

function analyzeCompetitionTrends(projects, placements, eventAwards) {
  const insights = [];
  const userStrains = new Set(projects.map(p => p.strain?.toLowerCase()).filter(Boolean));
  
  // Find competition winners that match user's strains
  const competitionWinners = placements.filter(p => 
    p.parsedEntryStrains?.some(strain => 
      userStrains.has(strain.toLowerCase())
    )
  );

  if (competitionWinners.length > 0) {
    const winningStrain = competitionWinners[0].parsedEntryStrains[0];
    const userProjects = projects.filter(p => p.strain?.toLowerCase() === winningStrain.toLowerCase());
    
    if (userProjects.length > 0) {
      insights.push({
        type: 'competition',
        title: `You're Trading Award-Winning Genetics`,
        description: `${winningStrain} has won competitions and you've flipped it ${userProjects.length} times. Award-winning strains often command premium prices and faster turnover.`,
        priority: 6,
        data: {
          'Winning Strain': winningStrain,
          'Your Projects': userProjects.length,
          'Avg Profit': formatCurrency(userProjects.reduce((sum, p) => sum + (p.profit || 0), 0) / userProjects.length)
        },
        actionItems: [
          'Market the competition history in your sales',
          'Consider premium pricing for award winners',
          'Source more competition-winning genetics'
        ]
      });
    }
  }

  // Analyze trending strains from recent competitions
  const recentWinners = placements
    .filter(p => p.eventId && p.parsedEntryStrains)
    .slice(0, 20)
    .flatMap(p => p.parsedEntryStrains)
    .reduce((acc, strain) => {
      acc[strain] = (acc[strain] || 0) + 1;
      return acc;
    }, {});

  const trendingStrains = Object.entries(recentWinners)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([strain]) => strain);

  const missingTrends = trendingStrains.filter(strain => 
    !userStrains.has(strain.toLowerCase())
  );

  if (missingTrends.length > 0) {
    insights.push({
      type: 'competition',
      title: 'Missing Trending Competition Strains',
      description: `Recent competition winners include ${missingTrends.slice(0, 3).join(', ')} which you haven't flipped yet. These strains are gaining market recognition.`,
      priority: 5,
      data: {
        'Trending Strains': missingTrends.length,
        'Top Trend': missingTrends[0]
      },
      actionItems: [
        `Research sourcing ${missingTrends[0]}`,
        'Monitor competition results for emerging trends',
        'Build relationships with winning cultivators'
      ]
    });
  }

  return insights;
}

function analyzeMarketTiming(projects) {
  const insights = [];
  
  if (projects.length < 3) return insights;

  // Analyze flip duration trends
  const durations = projects.map(p => p.flipDurationDays || 0).filter(d => d > 0);
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  
  const recentProjects = projects.slice(0, Math.ceil(projects.length / 3));
  const recentAvgDuration = recentProjects
    .map(p => p.flipDurationDays || 0)
    .filter(d => d > 0)
    .reduce((sum, d, _, arr) => sum + d / arr.length, 0);

  if (recentAvgDuration > avgDuration * 1.2) {
    insights.push({
      type: 'timing',
      title: 'Inventory Moving Slower Recently',
      description: `Your recent flips are taking ${(recentAvgDuration - avgDuration).toFixed(0)} days longer on average. This could indicate market saturation or pricing issues.`,
      priority: 6,
      data: {
        'Recent Avg': `${recentAvgDuration.toFixed(0)} days`,
        'Historical Avg': `${avgDuration.toFixed(0)} days`,
        'Difference': `+${(recentAvgDuration - avgDuration).toFixed(0)} days`
      },
      actionItems: [
        'Review current pricing strategy',
        'Analyze market demand for your strains',
        'Consider promotional pricing to move inventory'
      ]
    });
  }

  return insights;
}

function analyzeProfitOptimization(projects, portfolioMetrics) {
  const insights = [];
  
  // Analyze cost structure
  const avgCostPerGram = projects.reduce((sum, p) => sum + (parseFloat(p.costPerGram) || 0), 0) / projects.length;
  const avgSalePrice = projects.reduce((sum, p) => sum + (parseFloat(p.salePricePerGram) || 0), 0) / projects.length;
  const margin = ((avgSalePrice - avgCostPerGram) / avgSalePrice) * 100;

  if (margin < 30) {
    insights.push({
      type: 'profit',
      title: 'Low Profit Margins Detected',
      description: `Your average margin is ${margin.toFixed(1)}%, which is below the typical 30-40% for cannabis flips. Consider optimizing your cost structure or pricing strategy.`,
      priority: 8,
      data: {
        'Current Margin': formatPercentage(margin),
        'Avg Cost': formatCurrency(avgCostPerGram),
        'Avg Sale Price': formatCurrency(avgSalePrice)
      },
      actionItems: [
        'Negotiate better wholesale prices',
        'Increase sale prices where market allows',
        'Reduce overhead costs per unit'
      ]
    });
  }

  return insights;
}

function analyzeRiskFactors(projects, portfolioMetrics) {
  const insights = [];
  
  // Analyze success rate
  if (portfolioMetrics.successRate < 70) {
    insights.push({
      type: 'risk',
      title: 'High Risk Portfolio Profile',
      description: `Only ${portfolioMetrics.successRate.toFixed(1)}% of your flips are profitable. This indicates high risk exposure that should be addressed.`,
      priority: 9,
      data: {
        'Success Rate': formatPercentage(portfolioMetrics.successRate),
        'Profitable Flips': portfolioMetrics.profitableFlips,
        'Total Flips': portfolioMetrics.totalFlips
      },
      actionItems: [
        'Implement stricter due diligence on purchases',
        'Set stop-loss limits for underperforming inventory',
        'Diversify strain portfolio to reduce risk'
      ]
    });
  }

  return insights;
}

// Placeholder functions for future features
function analyzeConsumptionPatterns(projects, consumptionData) {
  // TODO: Analyze correlation between consumption patterns and flip success
  return [{
    type: 'consumption',
    title: 'Consumption Pattern Analysis',
    description: 'This feature will analyze how your personal consumption patterns correlate with successful flips.',
    priority: 4,
    data: { 'Status': 'Coming Soon' },
    actionItems: ['Complete consumption tracking to unlock this insight']
  }];
}

function analyzeYieldCorrelations(projects, yieldTrackerData) {
  // TODO: Correlate yield data with flip performance
  return [{
    type: 'yield',
    title: 'Yield Correlation Analysis',
    description: 'This feature will analyze how cultivation yields correlate with market flip performance.',
    priority: 4,
    data: { 'Status': 'Coming Soon' },
    actionItems: ['Link yield tracker data to unlock this insight']
  }];
}
// components/ConsumptionTracker/ConsumptionAIInsights.jsx
import React, { useMemo, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Brain, TrendingUp, DollarSign, Lightbulb, AlertTriangle, Target, Star, BarChart3, Clock, Hash, Leaf, Heart, Zap } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/consumptionCalculations';

export const ConsumptionAIInsights = ({ 
  entries, 
  consumptionMetrics, 
  settings,
  theme, 
  isDarkMode
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [selectedInsightType, setSelectedInsightType] = useState('all');

  // AI Insight Generation Logic
  const insights = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const generatedInsights = [];

    // 1. CONSUMPTION PATTERN ANALYSIS
    const patternInsights = analyzeConsumptionPatterns(entries, consumptionMetrics);
    generatedInsights.push(...patternInsights);

    // 2. MOOD & EFFECTS CORRELATION
    const moodInsights = analyzeMoodCorrelations(entries);
    generatedInsights.push(...moodInsights);

    // 3. COST OPTIMIZATION ANALYSIS
    const costInsights = analyzeCostOptimization(entries, consumptionMetrics, settings);
    generatedInsights.push(...costInsights);

    // 4. TOLERANCE & USAGE PATTERNS
    const toleranceInsights = analyzeTolerancePatterns(entries);
    generatedInsights.push(...toleranceInsights);

    // 5. HEALTH & WELLNESS RECOMMENDATIONS
    const healthInsights = analyzeHealthPatterns(entries, consumptionMetrics);
    generatedInsights.push(...healthInsights);

    // 6. TEMPORAL PATTERN ANALYSIS
    const temporalInsights = analyzeTemporalPatterns(entries);
    generatedInsights.push(...temporalInsights);

    return generatedInsights.sort((a, b) => b.priority - a.priority);
  }, [entries, consumptionMetrics, settings]);

  const filteredInsights = useMemo(() => {
    if (selectedInsightType === 'all') return insights;
    return insights.filter(insight => insight.type === selectedInsightType);
  }, [insights, selectedInsightType]);

  const insightTypes = [
    { id: 'all', label: 'All Insights', icon: Brain },
    { id: 'pattern', label: 'Usage Patterns', icon: BarChart3 },
    { id: 'mood', label: 'Mood & Effects', icon: Heart },
    { id: 'cost', label: 'Cost Analysis', icon: DollarSign },
    { id: 'tolerance', label: 'Tolerance', icon: Target },
    { id: 'health', label: 'Health & Wellness', icon: Zap },
    { id: 'temporal', label: 'Timing Patterns', icon: Clock }
  ];

  if (entries.length === 0) {
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
            Complete some consumption sessions to unlock AI-powered insights and recommendations.
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
            Try selecting a different insight type or complete more sessions.
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
      case 'pattern': return BarChart3;
      case 'mood': return Heart;
      case 'cost': return DollarSign;
      case 'tolerance': return Target;
      case 'health': return Zap;
      case 'temporal': return Clock;
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
function analyzeConsumptionPatterns(entries, metrics) {
  const insights = [];
  
  // Analyze consumption type preferences
  const typePreferences = entries.reduce((acc, entry) => {
    if (entry.hashAmount > 0) acc.hash += entry.hashAmount;
    if (entry.flowerAmount > 0) acc.flower += entry.flowerAmount;
    if (entry.edibleAmount > 0) acc.edibles += entry.edibleAmount;
    if (entry.vapeAmount > 0) acc.vape += entry.vapeAmount;
    return acc;
  }, { hash: 0, flower: 0, edibles: 0, vape: 0 });

  const totalConsumption = Object.values(typePreferences).reduce((sum, val) => sum + val, 0);
  const dominantType = Object.entries(typePreferences).sort((a, b) => b[1] - a[1])[0];

  if (dominantType && totalConsumption > 0) {
    const percentage = (dominantType[1] / totalConsumption) * 100;
    
    if (percentage > 60) {
      insights.push({
        type: 'pattern',
        title: `${dominantType[0].charAt(0).toUpperCase() + dominantType[0].slice(1)} Preference Detected`,
        description: `You have a strong preference for ${dominantType[0]}, representing ${percentage.toFixed(0)}% of your total consumption. This suggests you enjoy the specific effects and experience that ${dominantType[0]} provides.`,
        priority: 7,
        data: {
          'Primary Type': dominantType[0],
          'Percentage': `${percentage.toFixed(0)}%`,
          'Total Amount': `${dominantType[1].toFixed(1)}${dominantType[0] === 'edibles' ? ' units' : 'g'}`
        },
        actionItems: [
          `Consider bulk purchasing ${dominantType[0]} for better pricing`,
          'Explore different strains within your preferred type',
          'Track which specific products work best for you'
        ]
      });
    }
  }

  // Analyze session frequency patterns
  const sessionFrequency = entries.length / Math.max(1, (Date.now() - new Date(entries[entries.length - 1]?.startDate || Date.now())) / (1000 * 60 * 60 * 24));
  
  if (sessionFrequency > 1) {
    insights.push({
      type: 'pattern',
      title: 'High Frequency Usage Pattern',
      description: `You're tracking ${sessionFrequency.toFixed(1)} sessions per day on average. This indicates regular usage patterns that could benefit from structured tracking and goal setting.`,
      priority: 6,
      data: {
        'Sessions/Day': sessionFrequency.toFixed(1),
        'Total Sessions': entries.length,
        'Avg Duration': `${metrics.avgSessionDays.toFixed(1)} days`
      },
      actionItems: [
        'Consider setting daily consumption targets',
        'Track mood and effects for pattern optimization',
        'Schedule regular tolerance breaks'
      ]
    });
  }

  return insights;
}

function analyzeMoodCorrelations(entries) {
  const insights = [];
  
  const moodData = entries.filter(e => e.moodBefore && e.moodAfter);
  if (moodData.length < 3) return insights;

  // Analyze mood improvements
  const positiveTransitions = moodData.filter(entry => {
    const positiveMoods = ['Happy', 'Excited', 'Relaxed', 'Focused', 'Creative'];
    const negativeMoods = ['Stressed', 'Anxious', 'Sad', 'Tired', 'Irritated'];
    
    return negativeMoods.includes(entry.moodBefore) && positiveMoods.includes(entry.moodAfter);
  });

  if (positiveTransitions.length > moodData.length * 0.6) {
    const avgImprovement = (positiveTransitions.length / moodData.length) * 100;
    const avgCost = positiveTransitions.reduce((sum, entry) => sum + (entry.totalCost || 0), 0) / positiveTransitions.length;
    
    insights.push({
      type: 'mood',
      title: 'Consistent Mood Enhancement',
      description: `Cannabis consumption shows positive mood effects in ${avgImprovement.toFixed(0)}% of tracked sessions. Your usage appears to be effectively addressing mood-related concerns.`,
      priority: 8,
      data: {
        'Success Rate': `${avgImprovement.toFixed(0)}%`,
        'Positive Sessions': positiveTransitions.length,
        'Avg Cost': formatCurrency(avgCost)
      },
      actionItems: [
        'Continue tracking specific strains that work best',
        'Note environmental factors during successful sessions',
        'Consider maintaining current dosage levels'
      ]
    });
  }

  // Analyze strain-mood correlations
  const strainMoodMap = {};
  moodData.forEach(entry => {
    if (entry.strain) {
      if (!strainMoodMap[entry.strain]) {
        strainMoodMap[entry.strain] = { positive: 0, total: 0 };
      }
      strainMoodMap[entry.strain].total += 1;
      
      const positiveMoods = ['Happy', 'Excited', 'Relaxed', 'Focused', 'Creative'];
      if (positiveMoods.includes(entry.moodAfter)) {
        strainMoodMap[entry.strain].positive += 1;
      }
    }
  });

  const topStrain = Object.entries(strainMoodMap)
    .filter(([strain, data]) => data.total >= 2)
    .sort((a, b) => (b[1].positive / b[1].total) - (a[1].positive / a[1].total))[0];

  if (topStrain) {
    const successRate = (topStrain[1].positive / topStrain[1].total) * 100;
    
    insights.push({
      type: 'mood',
      title: `${topStrain[0]} Shows Strong Mood Benefits`,
      description: `${topStrain[0]} has a ${successRate.toFixed(0)}% success rate for positive mood outcomes across ${topStrain[1].total} sessions. This strain appears to be particularly effective for your needs.`,
      priority: 7,
      data: {
        'Best Strain': topStrain[0],
        'Success Rate': `${successRate.toFixed(0)}%`,
        'Sessions': topStrain[1].total
      },
      actionItems: [
        `Stock up on ${topStrain[0]} when available`,
        'Research similar genetics for backup options',
        'Track specific effects this strain provides'
      ]
    });
  }

  return insights;
}

function analyzeCostOptimization(entries, metrics, settings) {
  const insights = [];
  
  if (entries.length < 5) return insights;

  // Analyze cost per gram across types
  const costAnalysis = entries.reduce((acc, entry) => {
    if (entry.hashAmount > 0) {
      acc.hash.totalCost += (entry.hashAmount * parseFloat(entry.hashCostPerGram || 0));
      acc.hash.totalAmount += entry.hashAmount;
    }
    if (entry.flowerAmount > 0) {
      acc.flower.totalCost += (entry.flowerAmount * parseFloat(entry.flowerCostPerGram || 0));
      acc.flower.totalAmount += entry.flowerAmount;
    }
    return acc;
  }, {
    hash: { totalCost: 0, totalAmount: 0 },
    flower: { totalCost: 0, totalAmount: 0 }
  });

  const hashCostPerGram = costAnalysis.hash.totalAmount > 0 ? costAnalysis.hash.totalCost / costAnalysis.hash.totalAmount : 0;
  const flowerCostPerGram = costAnalysis.flower.totalAmount > 0 ? costAnalysis.flower.totalCost / costAnalysis.flower.totalAmount : 0;

  // High cost analysis
  if (metrics.avgDailyCost > 50) {
    insights.push({
      type: 'cost',
      title: 'High Daily Spending Detected',
      description: `Your average daily consumption cost of ${formatCurrency(metrics.avgDailyCost)} projects to ${formatCurrency(metrics.avgDailyCost * 365)} annually. Consider optimization strategies to reduce costs while maintaining effectiveness.`,
      priority: 8,
      data: {
        'Daily Average': formatCurrency(metrics.avgDailyCost),
        'Monthly Projection': formatCurrency(metrics.avgDailyCost * 30),
        'Annual Projection': formatCurrency(metrics.avgDailyCost * 365)
      },
      actionItems: [
        'Look for bulk purchasing opportunities',
        'Compare prices across different dispensaries',
        'Consider tolerance breaks to reset effectiveness',
        'Track cost-effectiveness of different consumption methods'
      ]
    });
  }

  // Cost efficiency comparison
  if (hashCostPerGram > 0 && flowerCostPerGram > 0) {
    const efficiency = hashCostPerGram / flowerCostPerGram;
    
    if (efficiency > 3) {
      insights.push({
        type: 'cost',
        title: 'Flower Offers Better Value',
        description: `Hash costs ${efficiency.toFixed(1)}x more per gram than flower (${formatCurrency(hashCostPerGram)} vs ${formatCurrency(flowerCostPerGram)}). Consider increasing flower usage for better cost efficiency.`,
        priority: 6,
        data: {
          'Hash Cost/g': formatCurrency(hashCostPerGram),
          'Flower Cost/g': formatCurrency(flowerCostPerGram),
          'Cost Ratio': `${efficiency.toFixed(1)}:1`
        },
        actionItems: [
          'Experiment with higher flower consumption',
          'Look for hash deals and discounts',
          'Track effectiveness per dollar spent'
        ]
      });
    }
  }

  return insights;
}

function analyzeTolerancePatterns(entries) {
  const insights = [];
  
  if (entries.length < 10) return insights;

  // Analyze consumption trends over time
  const recentEntries = entries.slice(0, Math.ceil(entries.length / 3));
  const olderEntries = entries.slice(Math.ceil(entries.length * 2 / 3));

  const recentAvg = recentEntries.reduce((sum, entry) => {
    return sum + (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
  }, 0) / recentEntries.length;

  const olderAvg = olderEntries.reduce((sum, entry) => {
    return sum + (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
  }, 0) / olderEntries.length;

  const increase = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (increase > 25) {
    insights.push({
      type: 'tolerance',
      title: 'Potential Tolerance Build-up Detected',
      description: `Your consumption has increased ${increase.toFixed(0)}% compared to earlier sessions, suggesting possible tolerance development. Consider implementing tolerance breaks.`,
      priority: 7,
      data: {
        'Consumption Increase': `${increase.toFixed(0)}%`,
        'Recent Average': `${recentAvg.toFixed(1)}g`,
        'Earlier Average': `${olderAvg.toFixed(1)}g`
      },
      actionItems: [
        'Schedule a 3-7 day tolerance break',
        'Try microdosing to reset sensitivity',
        'Switch between consumption methods',
        'Focus on CBD-dominant strains temporarily'
      ]
    });
  }

  return insights;
}

function analyzeHealthPatterns(entries, metrics) {
  const insights = [];
  
  // Analyze session duration patterns
  const longSessions = entries.filter(entry => (entry.sessionDays || 1) > 3);
  
  if (longSessions.length > entries.length * 0.3) {
    insights.push({
      type: 'health',
      title: 'Extended Session Duration Pattern',
      description: `${((longSessions.length / entries.length) * 100).toFixed(0)}% of your sessions last longer than 3 days. Consider the benefits of shorter, more intentional consumption periods.`,
      priority: 5,
      data: {
        'Long Sessions': `${((longSessions.length / entries.length) * 100).toFixed(0)}%`,
        'Average Duration': `${metrics.avgSessionDays.toFixed(1)} days`,
        'Sessions >3 days': longSessions.length
      },
      actionItems: [
        'Experiment with shorter, more focused sessions',
        'Track effectiveness of different session lengths',
        'Consider daily vs. periodic usage patterns'
      ]
    });
  }

  // Daily consumption analysis
  if (metrics.avgDailyCost > 0) {
    const dailyAmount = (metrics.totalHashConsumed + metrics.totalFlowerConsumed + (metrics.totalEdiblesConsumed || 0)) / Math.max(1, metrics.totalDaysTracked);
    
    if (dailyAmount > 5) {
      insights.push({
        type: 'health',
        title: 'High Daily Consumption Volume',
        description: `Your average daily consumption of ${dailyAmount.toFixed(1)}g is above moderate usage guidelines. Consider gradual reduction strategies while maintaining therapeutic benefits.`,
        priority: 6,
        data: {
          'Daily Average': `${dailyAmount.toFixed(1)}g`,
          'Weekly Average': `${(dailyAmount * 7).toFixed(1)}g`,
          'Monthly Average': `${(dailyAmount * 30).toFixed(1)}g`
        },
        actionItems: [
          'Set daily consumption limits',
          'Use smaller doses more frequently',
          'Track minimum effective dose',
          'Implement device/method rotation'
        ]
      });
    }
  }

  return insights;
}

function analyzeTemporalPatterns(entries) {
  const insights = [];
  
  if (entries.length < 7) return insights;

  // Analyze day-of-week patterns
  const dayPattern = {};
  entries.forEach(entry => {
    const day = new Date(entry.startDate).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[day];
    
    if (!dayPattern[dayName]) {
      dayPattern[dayName] = { count: 0, totalCost: 0 };
    }
    dayPattern[dayName].count += 1;
    dayPattern[dayName].totalCost += entry.totalCost || 0;
  });

  const peakDay = Object.entries(dayPattern).sort((a, b) => b[1].count - a[1].count)[0];
  
  if (peakDay && peakDay[1].count > entries.length * 0.25) {
    insights.push({
      type: 'temporal',
      title: `${peakDay[0]} Usage Peak Identified`,
      description: `${peakDay[0]} accounts for ${((peakDay[1].count / entries.length) * 100).toFixed(0)}% of your consumption sessions. This pattern suggests ${peakDay[0]}s may be particularly important for your routine.`,
      priority: 5,
      data: {
        'Peak Day': peakDay[0],
        'Sessions': peakDay[1].count,
        'Percentage': `${((peakDay[1].count / entries.length) * 100).toFixed(0)}%`,
        'Avg Cost': formatCurrency(peakDay[1].totalCost / peakDay[1].count)
      },
      actionItems: [
        `Ensure adequate supply for ${peakDay[0]}s`,
        'Track what makes this day different',
        'Consider if this pattern aligns with your goals'
      ]
    });
  }

  return insights;
}
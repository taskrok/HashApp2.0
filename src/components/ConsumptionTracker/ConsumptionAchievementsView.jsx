// components/ConsumptionTracker/ConsumptionAchievementsView.jsx
import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Trophy, Star, Award, Lock, CheckCircle, BarChart3, Target, Calendar, DollarSign, Hash, Leaf, Heart, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/consumptionCalculations';

// Achievement definitions
const consumptionAchievements = [
  // Tracking Achievements
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Log your first consumption session',
    icon: '🌱',
    type: 'single',
    category: 'tracking',
    rarity: 'common',
    xp: 50,
    condition: (entries) => entries.length >= 1
  },
  {
    id: 'consistent_tracker',
    title: 'Consistent Tracker',
    description: 'Log sessions for 7 consecutive days',
    icon: '📅',
    type: 'single',
    category: 'tracking',
    rarity: 'uncommon',
    xp: 150,
    condition: (entries) => checkConsecutiveDays(entries, 7)
  },
  {
    id: 'session_milestone',
    title: 'Session Milestone',
    description: 'Complete multiple session tracking milestones',
    icon: '📊',
    type: 'tiered',
    category: 'tracking',
    rarity: 'rare',
    tiers: [
      { threshold: 10, title: 'Bronze Tracker', emoji: '🥉', xp: 100 },
      { threshold: 25, title: 'Silver Logger', emoji: '🥈', xp: 200 },
      { threshold: 50, title: 'Gold Chronicler', emoji: '🥇', xp: 350 },
      { threshold: 100, title: 'Platinum Archivist', emoji: '💎', xp: 500 }
    ],
    condition: (entries) => entries.length
  },

  // Cost Management Achievements
  {
    id: 'budget_conscious',
    title: 'Budget Conscious',
    description: 'Keep daily average under $30 for 10 sessions',
    icon: '💰',
    type: 'single',
    category: 'cost',
    rarity: 'uncommon',
    xp: 200,
    condition: (entries) => {
      const recentSessions = entries.slice(0, 10);
      if (recentSessions.length < 10) return false;
      const avgCost = recentSessions.reduce((sum, e) => sum + ((e.totalCost || 0) / Math.max(1, e.sessionDays || 1)), 0) / 10;
      return avgCost <= 30;
    }
  },
  {
    id: 'cost_tracker',
    title: 'Cost Conscious',
    description: 'Track spending milestones across all sessions',
    icon: '💵',
    type: 'tiered',
    category: 'cost',
    rarity: 'common',
    tiers: [
      { threshold: 100, title: 'Penny Watcher', emoji: '🪙', xp: 75 },
      { threshold: 500, title: 'Dollar Tracker', emoji: '💵', xp: 150 },
      { threshold: 1000, title: 'Budget Master', emoji: '💰', xp: 300 },
      { threshold: 2500, title: 'Financial Guru', emoji: '🏦', xp: 500 }
    ],
    condition: (entries) => entries.reduce((sum, e) => sum + (e.totalCost || 0), 0)
  },

  // Consumption Type Achievements
  {
    id: 'hash_explorer',
    title: 'Hash Explorer',
    description: 'Consume various amounts of hash concentrates',
    icon: '🔥',
    type: 'tiered',
    category: 'consumption',
    rarity: 'uncommon',
    tiers: [
      { threshold: 5, title: 'Hash Novice', emoji: '🔥', xp: 100 },
      { threshold: 15, title: 'Concentrate Connoisseur', emoji: '💎', xp: 200 },
      { threshold: 30, title: 'Extract Expert', emoji: '🏆', xp: 350 },
      { threshold: 50, title: 'Hash Master', emoji: '👑', xp: 500 }
    ],
    condition: (entries) => entries.reduce((sum, e) => sum + (e.hashAmount || 0), 0)
  },
  {
    id: 'flower_enthusiast',
    title: 'Flower Enthusiast',
    description: 'Appreciate the classic flower experience',
    icon: '🌸',
    type: 'tiered',
    category: 'consumption',
    rarity: 'common',
    tiers: [
      { threshold: 10, title: 'Bud Beginner', emoji: '🌱', xp: 75 },
      { threshold: 50, title: 'Flower Friend', emoji: '🌸', xp: 150 },
      { threshold: 100, title: 'Garden Guardian', emoji: '🌺', xp: 300 },
      { threshold: 200, title: 'Botanical Master', emoji: '🌳', xp: 500 }
    ],
    condition: (entries) => entries.reduce((sum, e) => sum + (e.flowerAmount || 0), 0)
  },
  {
    id: 'edible_adventurer',
    title: 'Edible Adventurer',
    description: 'Explore the world of cannabis edibles',
    icon: '🍪',
    type: 'tiered',
    category: 'consumption',
    rarity: 'uncommon',
    tiers: [
      { threshold: 5, title: 'Cookie Rookie', emoji: '🍪', xp: 100 },
      { threshold: 20, title: 'Gummy Guru', emoji: '🍬', xp: 200 },
      { threshold: 50, title: 'Edible Expert', emoji: '🎂', xp: 350 },
      { threshold: 100, title: 'Culinary Champion', emoji: '👨‍🍳', xp: 500 }
    ],
    condition: (entries) => entries.reduce((sum, e) => sum + (e.edibleAmount || 0), 0)
  },
  {
    id: 'vape_pioneer',
    title: 'Vape Pioneer',
    description: 'Embrace modern vaping technology',
    icon: '💨',
    type: 'tiered',
    category: 'consumption',
    rarity: 'uncommon',
    tiers: [
      { threshold: 3, title: 'Vapor Novice', emoji: '💨', xp: 100 },
      { threshold: 10, title: 'Cloud Chaser', emoji: '☁️', xp: 200 },
      { threshold: 25, title: 'Vape Virtuoso', emoji: '🌪️', xp: 350 },
      { threshold: 50, title: 'Vapor Master', emoji: '⚡', xp: 500 }
    ],
    condition: (entries) => entries.reduce((sum, e) => sum + (e.vapeAmount || 0), 0)
  },

  // Wellness & Mood Achievements
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Track mood changes in sessions',
    icon: '😊',
    type: 'single',
    category: 'wellness',
    rarity: 'uncommon',
    xp: 150,
    condition: (entries) => entries.filter(e => e.moodBefore && e.moodAfter).length >= 10
  },
  {
    id: 'positive_vibes',
    title: 'Positive Vibes',
    description: 'Achieve positive mood outcomes in 80% of tracked sessions',
    icon: '✨',
    type: 'single',
    category: 'wellness',
    rarity: 'rare',
    xp: 300,
    condition: (entries) => {
      const moodEntries = entries.filter(e => e.moodBefore && e.moodAfter);
      if (moodEntries.length < 10) return false;
      const positiveMoods = ['Happy', 'Excited', 'Relaxed', 'Focused', 'Creative'];
      const positiveOutcomes = moodEntries.filter(e => positiveMoods.includes(e.moodAfter)).length;
      return (positiveOutcomes / moodEntries.length) >= 0.8;
    }
  },
  {
    id: 'strain_explorer',
    title: 'Strain Explorer',
    description: 'Try different cannabis strains',
    icon: '🧬',
    type: 'tiered',
    category: 'wellness',
    rarity: 'uncommon',
    tiers: [
      { threshold: 3, title: 'Strain Sampler', emoji: '🧪', xp: 100 },
      { threshold: 8, title: 'Variety Seeker', emoji: '🔍', xp: 200 },
      { threshold: 15, title: 'Strain Collector', emoji: '📚', xp: 350 },
      { threshold: 25, title: 'Cannabis Curator', emoji: '🎨', xp: 500 }
    ],
    condition: (entries) => new Set(entries.map(e => e.strain).filter(Boolean)).size
  },

  // Social & Experience Achievements
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Enjoy 10 social consumption sessions',
    icon: '👥',
    type: 'single',
    category: 'social',
    rarity: 'uncommon',
    xp: 200,
    condition: (entries) => entries.filter(e => e.sessionType === 'Social').length >= 10
  },
  {
    id: 'solo_explorer',
    title: 'Solo Explorer',
    description: 'Complete 15 solo consumption sessions',
    icon: '🧘',
    type: 'single',
    category: 'social',
    rarity: 'uncommon',
    xp: 200,
    condition: (entries) => entries.filter(e => e.sessionType === 'Solo').length >= 15
  },
  {
    id: 'location_scout',
    title: 'Location Scout',
    description: 'Experience cannabis in various locations',
    icon: '🗺️',
    type: 'tiered',
    category: 'social',
    rarity: 'rare',
    tiers: [
      { threshold: 3, title: 'Local Explorer', emoji: '🏠', xp: 100 },
      { threshold: 6, title: 'Adventure Seeker', emoji: '🏞️', xp: 200 },
      { threshold: 10, title: 'Location Master', emoji: '🌍', xp: 350 },
      { threshold: 15, title: 'Global Nomad', emoji: '✈️', xp: 500 }
    ],
    condition: (entries) => new Set(entries.map(e => e.location).filter(Boolean)).size
  },

  // Time-based Achievements
  {
    id: 'morning_ritual',
    title: 'Morning Ritual',
    description: 'Start the day with 5 morning sessions',
    icon: '🌅',
    type: 'single',
    category: 'timing',
    rarity: 'uncommon',
    xp: 150,
    condition: (entries) => {
      const morningEntries = entries.filter(e => {
        const hour = new Date(e.startDate).getHours();
        return hour >= 6 && hour <= 10;
      });
      return morningEntries.length >= 5;
    }
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Enjoy 10 weekend consumption sessions',
    icon: '🎉',
    type: 'single',
    category: 'timing',
    rarity: 'common',
    xp: 100,
    condition: (entries) => {
      const weekendEntries = entries.filter(e => {
        const day = new Date(e.startDate).getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      });
      return weekendEntries.length >= 10;
    }
  },

  // Special Achievements
  {
    id: 'detailed_noter',
    title: 'Detailed Noter',
    description: 'Add detailed notes to 20 sessions',
    icon: '📝',
    type: 'single',
    category: 'special',
    rarity: 'rare',
    xp: 250,
    condition: (entries) => entries.filter(e => e.notes && e.notes.length > 50).length >= 20
  },
  {
    id: 'effects_researcher',
    title: 'Effects Researcher',
    description: 'Track effects in 25 sessions',
    icon: '🔬',
    type: 'single',
    category: 'special',
    rarity: 'rare',
    xp: 300,
    condition: (entries) => entries.filter(e => e.effects).length >= 25
  },
  {
    id: 'mindful_consumer',
    title: 'Mindful Consumer',
    description: 'Complete comprehensive tracking (mood, effects, notes) in 15 sessions',
    icon: '🧠',
    type: 'single',
    category: 'special',
    rarity: 'legendary',
    xp: 500,
    condition: (entries) => entries.filter(e => e.moodBefore && e.moodAfter && e.effects && e.notes && e.notes.length > 20).length >= 15
  }
];

const achievementCategories = {
  tracking: { name: 'Tracking', color: '#3b82f6', icon: BarChart3 },
  cost: { name: 'Cost Management', color: '#10b981', icon: DollarSign },
  consumption: { name: 'Consumption', color: '#8b5cf6', icon: Hash },
  wellness: { name: 'Wellness', color: '#f97316', icon: Heart },
  social: { name: 'Social', color: '#06b6d4', icon: Star },
  timing: { name: 'Timing', color: '#84cc16', icon: Calendar },
  special: { name: 'Special', color: '#f59e0b', icon: Award }
};

const rarityLevels = {
  common: { name: 'Common', color: '#9ca3af', multiplier: 1 },
  uncommon: { name: 'Uncommon', color: '#10b981', multiplier: 1.2 },
  rare: { name: 'Rare', color: '#3b82f6', multiplier: 1.5 },
  epic: { name: 'Epic', color: '#8b5cf6', multiplier: 2 },
  legendary: { name: 'Legendary', color: '#f59e0b', multiplier: 3 }
};

// Helper function to check consecutive days
function checkConsecutiveDays(entries, targetDays) {
  if (entries.length < targetDays) return false;
  
  const dates = entries.map(e => new Date(e.startDate).toDateString()).sort();
  const uniqueDates = [...new Set(dates)];
  
  if (uniqueDates.length < targetDays) return false;
  
  let consecutiveCount = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(currDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveCount++;
      if (consecutiveCount >= targetDays) return true;
    } else {
      consecutiveCount = 1;
    }
  }
  
  return consecutiveCount >= targetDays;
}

// Function to check earned achievements
function checkConsumptionAchievements(entries) {
  const earnedAchievements = [];
  
  consumptionAchievements.forEach(achievement => {
    if (achievement.type === 'single') {
      if (achievement.condition(entries)) {
        earnedAchievements.push(achievement);
      }
    } else if (achievement.type === 'tiered') {
      const currentValue = achievement.condition(entries);
      achievement.tiers.forEach(tier => {
        if (currentValue >= tier.threshold) {
          earnedAchievements.push({
            ...achievement,
            currentTier: tier,
            id: `${achievement.id}_${tier.threshold}`
          });
        }
      });
    }
  });
  
  return earnedAchievements;
}

export const ConsumptionAchievementsView = ({ 
  entries, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate earned achievements
  const earnedAchievements = useMemo(() => {
    return checkConsumptionAchievements(entries);
  }, [entries]);

  const earnedAchievementIds = useMemo(() => {
    return new Set(earnedAchievements.map(a => a.id));
  }, [earnedAchievements]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalXP = earnedAchievements.reduce((sum, a) => {
      const xp = a.currentTier?.xp || a.xp || 0;
      const multiplier = rarityLevels[a.rarity]?.multiplier || 1;
      return sum + (xp * multiplier);
    }, 0);

    const level = Math.floor(totalXP / 1000) + 1;
    const xpToNextLevel = (level * 1000) - totalXP;

    return {
      totalEarned: earnedAchievements.length,
      totalPossible: consumptionAchievements.reduce((sum, a) => 
        sum + (a.type === 'tiered' ? a.tiers.length : 1), 0
      ),
      totalXP,
      level,
      xpToNextLevel: Math.max(0, xpToNextLevel)
    };
  }, [earnedAchievements]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return consumptionAchievements;
    return consumptionAchievements.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy },
    ...Object.entries(achievementCategories).map(([id, cat]) => ({
      id,
      name: cat.name,
      icon: cat.icon
    }))
  ];

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Trophy size={32} className="text-yellow-400" />
          <span>Achievements</span>
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">Level {stats.level}</div>
          <div className="text-sm" style={{ color: textSecondaryColor }}>
            {stats.totalXP} XP • {stats.xpToNextLevel} to next level
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {stats.totalEarned}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">
            Achievements Earned
          </div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {stats.totalPossible} total available
          </div>
        </GlassCard>

        <GlassCard className="text-center p-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {stats.level}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">
            Current Level
          </div>
          <div style={{ color: textColor }} className="text-xs mt-1">
            {stats.totalXP} total XP
          </div>
        </GlassCard>

        <GlassCard className="text-center p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {((stats.totalEarned / stats.totalPossible) * 100).toFixed(1)}%
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">
            Completion Rate
          </div>
        </GlassCard>

        <GlassCard className="text-center p-6">
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {earnedAchievements.filter(a => a.rarity === 'legendary' || a.rarity === 'epic').length}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">
            Rare Achievements
          </div>
        </GlassCard>
      </div>

      {/* XP Progress Bar */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: textColor }} className="font-semibold">
            Level {stats.level} Progress
          </span>
          <span style={{ color: textSecondaryColor }} className="text-sm">
            {stats.xpToNextLevel} XP to Level {stats.level + 1}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
            style={{ 
              width: `${Math.max(5, ((stats.totalXP % 1000) / 1000) * 100)}%` 
            }}
          />
        </div>
      </GlassCard>

      {/* Category Filter */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            const count = category.id === 'all' 
              ? consumptionAchievements.length 
              : consumptionAchievements.filter(a => a.category === category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/20'
                }`}
                style={{ color: isActive ? undefined : textSecondaryColor }}
              >
                <Icon size={16} />
                <span className="font-medium">{category.name}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            earnedAchievements={earnedAchievements}
            earnedAchievementIds={earnedAchievementIds}
            entries={entries}
            textColor={textColor}
            textSecondaryColor={textSecondaryColor}
          />
        ))}
      </div>
    </div>
  );
};

// Achievement Card Component
const AchievementCard = ({ 
  achievement, 
  earnedAchievements, 
  earnedAchievementIds, 
  entries, 
  textColor, 
  textSecondaryColor 
}) => {
  const rarity = rarityLevels[achievement.rarity] || rarityLevels.common;
  
  // Calculate current progress
  const currentValue = achievement.condition(entries);
  
  if (achievement.type === 'tiered') {
    // For tiered achievements, show highest earned tier
    const earnedTiers = achievement.tiers.filter(tier => currentValue >= tier.threshold);
    const highestEarnedTier = earnedTiers[earnedTiers.length - 1];
    const nextTier = achievement.tiers.find(tier => currentValue < tier.threshold);
    
    const isCompleted = earnedTiers.length > 0;
    const progress = nextTier ? (currentValue / nextTier.threshold) * 100 : 100;
    
    return (
      <GlassCard className={`p-6 transition-all duration-200 ${isCompleted ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' : 'hover:bg-white/5'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${isCompleted ? 'grayscale-0' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            <div>
              <h3 style={{ color: textColor }} className="font-semibold text-lg">
                {highestEarnedTier ? highestEarnedTier.title : achievement.title}
              </h3>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {achievement.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: rarity.color + '20', 
                color: rarity.color 
              }}
            >
              {rarity.name}
            </div>
            {isCompleted && (
              <CheckCircle size={16} className="text-green-400" />
            )}
          </div>
        </div>

        {/* Tier Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span style={{ color: textSecondaryColor }} className="text-sm">
              Progress: {currentValue} / {nextTier ? nextTier.threshold : achievement.tiers[achievement.tiers.length - 1].threshold}
            </span>
            <span style={{ color: textColor }} className="text-sm font-medium">
              {progress.toFixed(0)}%
            </span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>

          {/* Tier List */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {achievement.tiers.map((tier, index) => {
              const isTierEarned = currentValue >= tier.threshold;
              return (
                <div 
                  key={index}
                  className={`p-2 rounded-lg text-center transition-all duration-200 ${
                    isTierEarned 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="text-lg">{tier.emoji}</div>
                  <div style={{ color: isTierEarned ? '#10B981' : textSecondaryColor }} className="text-xs font-medium">
                    {tier.title}
                  </div>
                  <div style={{ color: textSecondaryColor }} className="text-xs">
                    {tier.threshold}
                  </div>
                </div>
              );
            })}
          </div>

          {highestEarnedTier && (
            <div className="text-center p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <Star size={16} className="text-yellow-400 mx-auto mb-1" />
              <div style={{ color: textColor }} className="text-sm font-semibold">
                +{highestEarnedTier.xp * rarity.multiplier} XP Earned
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    );
  } else {
    // For single achievements
    const isEarned = earnedAchievementIds.has(achievement.id);
    
    return (
      <GlassCard className={`p-6 transition-all duration-200 ${isEarned ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' : 'hover:bg-white/5'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${isEarned ? 'grayscale-0' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            <div>
              <h3 style={{ color: textColor }} className="font-semibold text-lg">
                {achievement.title}
              </h3>
              <p style={{ color: textSecondaryColor }} className="text-sm">
                {achievement.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: rarity.color + '20', 
                color: rarity.color 
              }}
            >
              {rarity.name}
            </div>
            {isEarned ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Lock size={16} className="text-gray-500" />
            )}
          </div>
        </div>

        <div className="text-center">
          {isEarned ? (
            <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <Trophy size={20} className="text-yellow-400 mx-auto mb-2" />
              <div style={{ color: textColor }} className="font-semibold">Achievement Unlocked!</div>
              <div style={{ color: textSecondaryColor }} className="text-sm">
                +{achievement.xp * rarity.multiplier} XP
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <Lock size={20} className="text-gray-500 mx-auto mb-2" />
              <div style={{ color: textSecondaryColor }} className="text-sm">
                {achievement.xp * rarity.multiplier} XP when unlocked
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    );
  }
};
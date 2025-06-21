// components/JarFlipTracker/JarFlipAchievementsView.jsx
import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Trophy, Star, Award, Lock, CheckCircle, BarChart3 } from 'lucide-react';
import { jarFlipAchievements, achievementCategories, rarityLevels, checkJarFlipAchievements } from '../../data/jarFlipAchievements';

export const JarFlipAchievementsView = ({ 
  projects, 
  competitionData, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate earned achievements
  const earnedAchievements = useMemo(() => {
    return checkJarFlipAchievements(projects, competitionData);
  }, [projects, competitionData]);

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
      totalPossible: jarFlipAchievements.reduce((sum, a) => 
        sum + (a.type === 'tiered' ? a.tiers.length : 1), 0
      ),
      totalXP,
      level,
      xpToNextLevel: Math.max(0, xpToNextLevel)
    };
  }, [earnedAchievements]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return jarFlipAchievements;
    return jarFlipAchievements.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy },
    ...Object.entries(achievementCategories).map(([id, cat]) => ({
      id,
      name: cat.name,
      icon: Trophy // You can map specific icons here
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
            const isActive = selectedCategory === category.id;
            const count = category.id === 'all' 
              ? jarFlipAchievements.length 
              : jarFlipAchievements.filter(a => a.category === category.id).length;
            
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
                <Trophy size={16} />
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
            projects={projects}
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
  projects, 
  textColor, 
  textSecondaryColor 
}) => {
  const rarity = rarityLevels[achievement.rarity] || rarityLevels.common;
  
  // Calculate current progress
  const currentValue = achievement.condition(projects);
  
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
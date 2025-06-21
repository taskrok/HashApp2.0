// components/YieldTracker/AchievementComponents.jsx
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITY } from '../../data/enhancedAchievements';
import { Trophy, Star, Target, Zap, Flame, Beaker, Gift } from 'lucide-react';

// Get category icon
const getCategoryIcon = (category) => {
  switch (category) {
    case ACHIEVEMENT_CATEGORIES.MILESTONE: return Trophy;
    case ACHIEVEMENT_CATEGORIES.EFFICIENCY: return Zap;
    case ACHIEVEMENT_CATEGORIES.STREAK: return Flame;
    case ACHIEVEMENT_CATEGORIES.MASTERY: return Star;
    case ACHIEVEMENT_CATEGORIES.DISCOVERY: return Beaker;
    case ACHIEVEMENT_CATEGORIES.COLLECTION: return Target;
    case ACHIEVEMENT_CATEGORIES.SPECIAL: return Gift;
    default: return Trophy;
  }
};

// Get rarity color classes
const getRarityClasses = (rarity) => {
  const colorMap = {
    '#94a3b8': 'slate',
    '#3b82f6': 'blue', 
    '#8b5cf6': 'purple',
    '#f59e0b': 'amber',
    '#ef4444': 'red'
  };
  
  const colorName = colorMap[rarity.color] || 'blue';
  
  return {
    bg: `bg-gradient-to-br from-${colorName}-500/20 to-${colorName}-600/10`,
    border: `border-${colorName}-500/50`,
    text: `text-${colorName}-400`,
    shadow: `shadow-lg shadow-${colorName}-500/25`
  };
};

// Enhanced Achievement Card Component
export const EnhancedAchievementCard = ({ 
  achievement, 
  earnedData, 
  progress, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  const isEarned = !!earnedData;
  const progressPercent = progress && progress.nextThreshold ? 
    Math.min((progress.value / progress.nextThreshold) * 100, 100) : 
    (isEarned ? 100 : 0);
  
  const CategoryIcon = getCategoryIcon(achievement.category);
  const rarityClasses = getRarityClasses(achievement.rarity);
  
  return (
    <GlassCard className={`
      p-6 transition-all duration-300 hover:scale-105 cursor-pointer
      ${isEarned 
        ? `${rarityClasses.bg} ${rarityClasses.border} ${rarityClasses.shadow}` 
        : 'bg-slate-900/50 border-slate-700/50 opacity-60 hover:opacity-80'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{achievement.icon}</div>
          <CategoryIcon size={16} className={isEarned ? rarityClasses.text : 'text-gray-500'} />
        </div>
        {isEarned && (
          <div 
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: achievement.rarity.color + '20', 
              color: achievement.rarity.color 
            }}
          >
            {Object.keys(ACHIEVEMENT_RARITY).find(k => ACHIEVEMENT_RARITY[k] === achievement.rarity)}
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-lg mb-2" style={{ color: isEarned ? textColor : '#9ca3af' }}>
        {achievement.name}
        {earnedData?.tier && ` - ${earnedData.tier.name}`}
      </h3>
      
      <p className="text-slate-400 text-sm mb-4">
        {achievement.description}
      </p>
      
      {achievement.tiers && progress && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress: {progress.value}</span>
            <span>Next: {progress.nextThreshold || 'Max'}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isEarned 
                  ? `bg-gradient-to-r from-${rarityClasses.text.split('-')[1]}-500 to-${rarityClasses.text.split('-')[1]}-600`
                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
      
      {!achievement.tiers && !isEarned && (
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-1">Not yet earned</div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="h-2 rounded-full bg-slate-600" style={{ width: '0%' }} />
          </div>
        </div>
      )}
      
      {isEarned && (
        <div className="text-xs text-slate-500 space-y-1">
          <p>Unlocked: {new Date(earnedData.earnedAt).toLocaleDateString()}</p>
          {earnedData.tier && <p>Tier: {earnedData.tier.name}</p>}
          {earnedData.achievement?.reward?.xp && (
            <p className={rarityClasses.text}>
              +{earnedData.achievement.reward.xp * earnedData.achievement.rarity.multiplier} XP
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
};

// Achievement Statistics Component
export const AchievementStats = ({ achievementData, theme, isDarkMode }) => {
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  const totalAchievements = Object.values(ACHIEVEMENT_CATEGORIES).length * 3; // Rough estimate
  const earnedCount = Object.keys(achievementData.earned).length;
  const completionRate = earnedCount > 0 ? (earnedCount / totalAchievements) * 100 : 0;
  
  const nextLevelXP = Math.pow(achievementData.level, 2) * 100;
  const levelProgress = ((achievementData.totalXP % nextLevelXP) / nextLevelXP) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <GlassCard className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
        <div className="text-2xl font-bold text-blue-400">{earnedCount}</div>
        <div className="text-sm" style={{ color: textSecondaryColor }}>Achievements Earned</div>
      </GlassCard>
      
      <GlassCard className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
        <div className="text-2xl font-bold text-purple-400">Level {achievementData.level}</div>
        <div className="text-sm" style={{ color: textSecondaryColor }}>{achievementData.totalXP} Total XP</div>
        <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
          <div 
            className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </GlassCard>
      
      <GlassCard className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
        <div className="text-2xl font-bold text-green-400">{completionRate.toFixed(1)}%</div>
        <div className="text-sm" style={{ color: textSecondaryColor }}>Completion Rate</div>
      </GlassCard>
      
      <GlassCard className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
        <div className="text-2xl font-bold text-orange-400">{achievementData.titles.length}</div>
        <div className="text-sm" style={{ color: textSecondaryColor }}>Titles Unlocked</div>
      </GlassCard>
    </div>
  );
};

// Recent Achievements Component
export const RecentAchievements = ({ recentAchievements, theme, isDarkMode }) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  
  if (recentAchievements.length === 0) {
    return (
      <GlassCard className="p-6">
        <h4 className="font-semibold mb-4" style={{ color: textColor }}>Recent Achievements</h4>
        <p className="text-slate-400 text-sm">No achievements yet. Complete some projects to start earning!</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h4 className="font-semibold mb-4" style={{ color: textColor }}>Recent Achievements</h4>
      <div className="space-y-3">
        {recentAchievements.map((earned, index) => {
          const achievement = earned.achievement;
          if (!achievement) return null;
          
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="text-xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: textColor }}>
                  {achievement.name}
                  {earned.tier && ` - ${earned.tier.name}`}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(earned.earnedAt).toLocaleDateString()}
                </div>
              </div>
              <div 
                className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ 
                  backgroundColor: achievement.rarity.color + '20', 
                  color: achievement.rarity.color 
                }}
              >
                +{(achievement.reward?.xp || earned.tier?.reward?.xp || 0) * achievement.rarity.multiplier} XP
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// Achievement Category Filter
export const AchievementCategoryFilter = ({ selectedCategory, onCategoryChange, theme, isDarkMode }) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  const categories = [
    { key: 'all', label: 'All', icon: Trophy },
    { key: ACHIEVEMENT_CATEGORIES.MILESTONE, label: 'Milestones', icon: Trophy },
    { key: ACHIEVEMENT_CATEGORIES.EFFICIENCY, label: 'Efficiency', icon: Zap },
    { key: ACHIEVEMENT_CATEGORIES.STREAK, label: 'Streaks', icon: Flame },
    { key: ACHIEVEMENT_CATEGORIES.MASTERY, label: 'Mastery', icon: Star },
    { key: ACHIEVEMENT_CATEGORIES.COLLECTION, label: 'Collection', icon: Target },
    { key: ACHIEVEMENT_CATEGORIES.DISCOVERY, label: 'Discovery', icon: Beaker },
    { key: ACHIEVEMENT_CATEGORIES.SPECIAL, label: 'Special', icon: Gift }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(category => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.key;
        
        return (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-105' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{ color: isActive ? '#ffffff' : textSecondaryColor }}
          >
            <Icon size={16} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Title Selector Component
export const TitleSelector = ({ 
  availableTitles, 
  currentTitle, 
  onTitleChange, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  if (availableTitles.length === 0) {
    return null;
  }

  return (
    <GlassCard className="p-6 mb-6">
      <h4 className="font-semibold mb-4" style={{ color: textColor }}>Your Titles</h4>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTitleChange(null)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              !currentTitle 
                ? 'bg-blue-500' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{ color: !currentTitle ? '#ffffff' : textSecondaryColor }}
          >
            No Title
          </button>
          {availableTitles.map(title => (
            <button
              key={title}
              onClick={() => onTitleChange(title)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentTitle === title 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ color: currentTitle === title ? '#ffffff' : textSecondaryColor }}
            >
              {title}
            </button>
          ))}
        </div>
        {currentTitle && (
          <p className="text-sm text-slate-400">
            Currently displaying as: <span className="text-purple-400 font-medium">{currentTitle}</span>
          </p>
        )}
      </div>
    </GlassCard>
  );
};
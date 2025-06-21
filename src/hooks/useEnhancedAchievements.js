// hooks/useEnhancedAchievements.js
import { useState, useEffect, useCallback } from 'react';
import { enhancedAchievementList, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITY } from '../data/enhancedAchievements';

export const useEnhancedAchievements = (projects, addNotification, calculateProjectMetrics) => {
  const [achievementData, setAchievementData] = useState(() => {
    const saved = localStorage.getItem('enhancedAchievements');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Check for legacy achievement data and migrate
    const legacyAchievements = localStorage.getItem('earnedAchievements');
    if (legacyAchievements) {
      const legacy = JSON.parse(legacyAchievements);
      return {
        earned: legacy, // Keep existing earned achievements
        progress: {},
        totalXP: Object.keys(legacy).length * 100, // Give retroactive XP
        level: 1,
        titles: ['Legacy User'],
        currentTitle: 'Legacy User'
      };
    }
    
    return {
      earned: {},
      progress: {},
      totalXP: 0,
      level: 1,
      titles: [],
      currentTitle: null
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('enhancedAchievements', JSON.stringify(achievementData));
  }, [achievementData]);

  // Calculate user level from XP (square root progression)
  const calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;

  // Enhanced achievement checking with progress tracking
  const checkAchievements = useCallback((newProject, allProjects, context = {}) => {
    const projectsWithMetrics = allProjects.map(p => ({
      ...p,
      metrics: calculateProjectMetrics(p)
    }));
    
    const newProjectWithMetrics = {
      ...newProject,
      metrics: calculateProjectMetrics(newProject)
    };

    // Calculate comprehensive user stats
    const userStats = {
      totalRevenue: projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.metrics.revenue || 0), 0),
      totalFinishWeight: projectsWithMetrics.reduce((sum, p) => sum + (parseFloat(p.finishWeight) || 0), 0),
      highestYield: Math.max(0, ...projectsWithMetrics.map(p => parseFloat(p.metrics.actualYieldPercent || 0))),
      uniqueStrains: new Set(projectsWithMetrics.map(p => p.strain).filter(Boolean)),
      uniqueFinishMaterials: new Set(projectsWithMetrics.map(p => p.finishMaterial).filter(Boolean)),
      uniqueStartMaterials: new Set(projectsWithMetrics.map(p => p.startMaterial).filter(Boolean)),
    };

    const newData = { ...achievementData };
    let xpGained = 0;
    const newNotifications = [];

    enhancedAchievementList.forEach(achievement => {
      try {
        const currentValue = achievement.trigger(newProjectWithMetrics, projectsWithMetrics, userStats, context);
        
        if (achievement.tiers) {
          // Handle tiered achievements
          const currentTier = achievement.getCurrentTier ? 
            achievement.getCurrentTier(currentValue, achievement.tiers) :
            achievement.tiers.reduceRight((acc, tier) => currentValue >= tier.threshold ? tier : acc, null);
          
          const previousProgress = newData.progress[achievement.id] || { tier: null, value: 0 };
          
          if (currentTier && (!previousProgress.tier || currentTier.threshold > (previousProgress.tier.threshold || 0))) {
            // New tier achieved
            const earnedKey = `${achievement.id}_${currentTier.threshold}`;
            if (!newData.earned[earnedKey]) {
              newData.earned[earnedKey] = {
                earnedAt: new Date().toISOString(),
                projectId: newProject.id,
                tier: currentTier,
                achievement: achievement
              };
              
              xpGained += currentTier.reward.xp * achievement.rarity.multiplier;
              
              if (currentTier.reward.title && !newData.titles.includes(currentTier.reward.title)) {
                newData.titles.push(currentTier.reward.title);
              }
              
              newNotifications.push({
                type: 'achievement',
                title: `${achievement.name} - ${currentTier.name}`,
                message: achievement.description,
                rarity: achievement.rarity,
                xp: currentTier.reward.xp * achievement.rarity.multiplier
              });
            }
          }
          
          // Update progress
          newData.progress[achievement.id] = {
            tier: currentTier,
            value: currentValue,
            nextThreshold: achievement.tiers.find(t => t.threshold > currentValue)?.threshold
          };
          
        } else {
          // Handle single achievements
          if (currentValue && !newData.earned[achievement.id]) {
            newData.earned[achievement.id] = {
              earnedAt: new Date().toISOString(),
              projectId: newProject.id,
              achievement: achievement
            };
            
            xpGained += achievement.reward.xp * achievement.rarity.multiplier;
            
            if (achievement.reward.title && !newData.titles.includes(achievement.reward.title)) {
              newData.titles.push(achievement.reward.title);
            }
            
            newNotifications.push({
              type: 'achievement',
              title: achievement.name,
              message: achievement.description,
              rarity: achievement.rarity,
              xp: achievement.reward.xp * achievement.rarity.multiplier
            });
          }
        }
      } catch (error) {
        console.warn(`Error checking achievement ${achievement.id}:`, error);
      }
    });

    // Update XP and level
    const oldLevel = newData.level;
    newData.totalXP += xpGained;
    newData.level = calculateLevel(newData.totalXP);
    
    if (newData.level > oldLevel) {
      newNotifications.push({
        type: 'levelUp',
        title: `Level Up!`,
        message: `You've reached level ${newData.level}! You now have ${newData.totalXP} total XP.`
      });
    }

    // Send notifications
    newNotifications.forEach(notif => {
      const message = notif.xp ? `${notif.message} (+${notif.xp} XP)` : notif.message;
      addNotification('success', notif.title, message);
    });

    if (newNotifications.length > 0) {
      setAchievementData(newData);
    }

  }, [achievementData, addNotification, calculateProjectMetrics]);

  // Helper functions for UI
  const getAchievementsByCategory = (category) => {
    return enhancedAchievementList.filter(a => a.category === category);
  };

  const getProgressPercentage = (achievementId) => {
    const progress = achievementData.progress[achievementId];
    if (!progress || !progress.nextThreshold) return 100;
    return Math.min((progress.value / progress.nextThreshold) * 100, 100);
  };

  const getRecentAchievements = (limit = 5) => {
    return Object.values(achievementData.earned)
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, limit);
  };

  const getAchievementProgress = (achievementId) => {
    return achievementData.progress[achievementId] || { value: 0, nextThreshold: null };
  };

  const isAchievementEarned = (achievementId, tierThreshold = null) => {
    if (tierThreshold) {
      return !!achievementData.earned[`${achievementId}_${tierThreshold}`];
    }
    return !!achievementData.earned[achievementId];
  };

  const getXPToNextLevel = () => {
    const currentLevel = achievementData.level;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    return nextLevelXP - achievementData.totalXP;
  };

  const setCurrentTitle = (title) => {
    setAchievementData(prev => ({
      ...prev,
      currentTitle: title
    }));
  };

  return {
    achievementData,
    checkAchievements,
    getAchievementsByCategory,
    getProgressPercentage,
    getRecentAchievements,
    getAchievementProgress,
    isAchievementEarned,
    setCurrentTitle,
    totalEarned: Object.keys(achievementData.earned).length,
    currentLevel: achievementData.level,
    totalXP: achievementData.totalXP,
    xpToNextLevel: getXPToNextLevel(),
    availableTitles: achievementData.titles,
    currentTitle: achievementData.currentTitle
  };
};
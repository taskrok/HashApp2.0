import { useState, useEffect, useCallback } from 'react';
import { achievementList } from '../data/achievements';

export const useAchievements = (projects, addNotification, calculateProjectMetrics) => {
  const [earnedAchievements, setEarnedAchievements] = useState(() => {
    const saved = localStorage.getItem('earnedAchievements');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('earnedAchievements', JSON.stringify(earnedAchievements));
  }, [earnedAchievements]);

  const checkAchievements = useCallback((newlyCompletedProject, allProjects, context) => {
    // Attach metrics to all projects for easier checking
    const projectsWithMetrics = allProjects.map(p => ({
      ...p,
      metrics: calculateProjectMetrics(p)
    }));
    
    const newProjectWithMetrics = {
        ...newlyCompletedProject,
        metrics: calculateProjectMetrics(newlyCompletedProject)
    };

    // --- Pre-calculate User-Wide Statistics ---
    const userStats = {
      totalRevenue: projectsWithMetrics.reduce((sum, p) => sum + parseFloat(p.metrics.revenue), 0),
      totalFinishWeight: projectsWithMetrics.reduce((sum, p) => sum + p.finishWeight, 0),
      highestYield: Math.max(0, ...projectsWithMetrics.map(p => p.metrics.actualYieldPercent)),
      uniqueStrains: new Set(projectsWithMetrics.map(p => p.strain).filter(Boolean)),
      uniqueFinishMaterials: new Set(projectsWithMetrics.map(p => p.finishMaterial).filter(Boolean)),
      uniqueStartMaterials: new Set(projectsWithMetrics.map(p => p.startMaterial).filter(Boolean)),
    };

    const newAwards = [];

    achievementList.forEach(achievement => {
      // If not already earned, check the trigger
      if (!earnedAchievements[achievement.id]) {
        const triggerContext = {
            ...context, // Includes processingPaths, marketPrices
        };
        if (achievement.trigger(newProjectWithMetrics, projectsWithMetrics, userStats, triggerContext)) {
          newAwards.push(achievement);
        }
      }
    });

    if (newAwards.length > 0) {
      // Update state with new awards
      const updatedEarned = { ...earnedAchievements };
      newAwards.forEach(award => {
        updatedEarned[award.id] = {
          earnedAt: new Date().toISOString(),
          projectId: newlyCompletedProject.id, // Link to the project that triggered it
        };
        // Notify the user
        addNotification('success', 'Achievement Unlocked!', award.name);
      });
      setEarnedAchievements(updatedEarned);
    }

  }, [earnedAchievements, addNotification, calculateProjectMetrics]);

  return { earnedAchievements, checkAchievements };
};
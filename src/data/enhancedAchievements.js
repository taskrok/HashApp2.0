// data/enhancedAchievements.js
export const ACHIEVEMENT_CATEGORIES = {
  MILESTONE: 'milestone',
  EFFICIENCY: 'efficiency', 
  STREAK: 'streak',
  MASTERY: 'mastery',
  DISCOVERY: 'discovery',
  COLLECTION: 'collection',
  SPECIAL: 'special'
};

export const ACHIEVEMENT_RARITY = {
  COMMON: { color: '#94a3b8', multiplier: 1 },
  UNCOMMON: { color: '#3b82f6', multiplier: 1.5 },
  RARE: { color: '#8b5cf6', multiplier: 2 },
  EPIC: { color: '#f59e0b', multiplier: 3 },
  LEGENDARY: { color: '#ef4444', multiplier: 5 }
};

export const enhancedAchievementList = [
  // First-time achievements
  {
    id: 'first_extraction',
    name: 'First Steps',
    description: 'Complete your first extraction project',
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    icon: '🌱',
    reward: { xp: 100, title: 'Novice Extractor' },
    trigger: (project, allProjects) => allProjects.length === 1
  },

  // Progressive project count achievements
  {
    id: 'project_milestone',
    name: 'Production Master',
    description: 'Complete multiple extraction milestones',
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    icon: '🏭',
    tiers: [
      { threshold: 5, name: 'Getting Started', reward: { xp: 250, title: 'Regular Producer' } },
      { threshold: 10, name: 'Experienced', reward: { xp: 400, title: 'Seasoned Extractor' } },
      { threshold: 25, name: 'Expert', reward: { xp: 750, title: 'Veteran Extractor' } },
      { threshold: 50, name: 'Master', reward: { xp: 1500, title: 'Master Producer' } },
      { threshold: 100, name: 'Legend', reward: { xp: 3000, title: 'Extraction Legend' } }
    ],
    trigger: (project, allProjects) => allProjects.length,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Revenue milestones
  {
    id: 'revenue_milestone',
    name: 'Money Maker',
    description: 'Achieve significant revenue milestones',
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: ACHIEVEMENT_RARITY.RARE,
    icon: '💰',
    tiers: [
      { threshold: 10000, name: 'Profitable', reward: { xp: 500 } },
      { threshold: 25000, name: 'Successful', reward: { xp: 1000 } },
      { threshold: 50000, name: 'Entrepreneur', reward: { xp: 2000 } },
      { threshold: 100000, name: 'Mogul', reward: { xp: 4000, title: 'Cannabis Mogul' } }
    ],
    trigger: (project, allProjects, userStats) => userStats.totalRevenue,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Efficiency achievements
  {
    id: 'efficiency_master',
    name: 'Efficiency Expert',
    description: 'Achieve exceptional efficiency ratings',
    category: ACHIEVEMENT_CATEGORIES.EFFICIENCY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    icon: '⚡',
    tiers: [
      { threshold: 95, name: 'Efficient', reward: { xp: 300 } },
      { threshold: 105, name: 'Optimized', reward: { xp: 600 } },
      { threshold: 115, name: 'Masterful', reward: { xp: 1200, title: 'Efficiency Master' } },
      { threshold: 125, name: 'Legendary', reward: { xp: 2500, title: 'Process Perfectionist' } }
    ],
    trigger: (project, allProjects) => {
      const recent5 = allProjects.slice(0, 5);
      if (recent5.length < 5) return 0;
      return recent5.reduce((sum, p) => sum + parseFloat(p.metrics?.efficiency || 0), 0) / 5;
    },
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Yield achievements
  {
    id: 'yield_master',
    name: 'Yield Champion',
    description: 'Achieve exceptional yield percentages',
    category: ACHIEVEMENT_CATEGORIES.EFFICIENCY,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    icon: '📈',
    tiers: [
      { threshold: 8, name: 'Good Yields', reward: { xp: 400 } },
      { threshold: 10, name: 'Great Yields', reward: { xp: 800 } },
      { threshold: 12, name: 'Exceptional', reward: { xp: 1600, title: 'Yield Master' } },
      { threshold: 15, name: 'Legendary', reward: { xp: 3200, title: 'Extraction Savant' } }
    ],
    trigger: (project, allProjects, userStats) => userStats.highestYield,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Streak achievements
  {
    id: 'profit_streak',
    name: 'Profit Streak',
    description: 'Maintain consecutive profitable projects',
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    icon: '🔥',
    tiers: [
      { threshold: 3, name: 'Hot Streak', reward: { xp: 400 } },
      { threshold: 5, name: 'Money Maker', reward: { xp: 700 } },
      { threshold: 10, name: 'Golden Touch', reward: { xp: 1400, title: 'Profit Prophet' } },
      { threshold: 20, name: 'Unstoppable', reward: { xp: 2800, title: 'Golden Touch' } }
    ],
    trigger: (project, allProjects) => {
      let streak = 0;
      for (const p of allProjects) {
        if (parseFloat(p.metrics?.profit || 0) > 0) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Collection achievements
  {
    id: 'strain_collector',
    name: 'Strain Collector',
    description: 'Work with diverse cannabis strains',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    icon: '🧬',
    tiers: [
      { threshold: 3, name: 'Variety Seeker', reward: { xp: 200 } },
      { threshold: 8, name: 'Strain Explorer', reward: { xp: 500 } },
      { threshold: 15, name: 'Cannabis Connoisseur', reward: { xp: 1000, title: 'Strain Specialist' } },
      { threshold: 25, name: 'Master Curator', reward: { xp: 2000, title: 'Cannabis Curator' } }
    ],
    trigger: (project, allProjects, userStats) => userStats.uniqueStrains.size,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  {
    id: 'material_explorer',
    name: 'Material Explorer',
    description: 'Experiment with different extraction materials',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    rarity: ACHIEVEMENT_RARITY.COMMON,
    icon: '🔬',
    tiers: [
      { threshold: 3, name: 'Experimenter', reward: { xp: 150 } },
      { threshold: 6, name: 'Explorer', reward: { xp: 400 } },
      { threshold: 10, name: 'Pioneer', reward: { xp: 800, title: 'Process Pioneer' } }
    ],
    trigger: (project, allProjects, userStats) => userStats.uniqueFinishMaterials.size,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Special achievements
  {
    id: 'perfect_yield',
    name: 'Perfect Extraction',
    description: 'Achieve exactly the expected yield percentage (within 0.5%)',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    rarity: ACHIEVEMENT_RARITY.LEGENDARY,
    icon: '🎯',
    reward: { xp: 2000, title: 'Precision Master' },
    trigger: (project) => {
      const variance = Math.abs(parseFloat(project.metrics?.variance || 100));
      return variance <= 0.5;
    }
  },

  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Exceed expected yield by 50% or more',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    rarity: ACHIEVEMENT_RARITY.EPIC,
    icon: '🚀',
    reward: { xp: 1500, title: 'Yield Destroyer' },
    trigger: (project) => {
      const variance = parseFloat(project.metrics?.variance || 0);
      return variance >= 50;
    }
  },

  // Discovery achievements
  {
    id: 'innovator',
    name: 'Process Innovator',
    description: 'Try a new extraction method combination',
    category: ACHIEVEMENT_CATEGORIES.DISCOVERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    icon: '💡',
    reward: { xp: 800, title: 'Innovator' },
    trigger: (project, allProjects) => {
      const currentPath = `${project.startMaterial}->${project.finishMaterial}`;
      const usedPaths = new Set(allProjects.slice(1).map(p => `${p.startMaterial}->${p.finishMaterial}`));
      return !usedPaths.has(currentPath);
    }
  },

  {
    id: 'high_volume',
    name: 'High Volume Producer',
    description: 'Process large quantities of material',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rarity: ACHIEVEMENT_RARITY.RARE,
    icon: '📦',
    tiers: [
      { threshold: 1000, name: 'Bulk Processor', reward: { xp: 300 } },
      { threshold: 5000, name: 'Volume King', reward: { xp: 800 } },
      { threshold: 10000, name: 'Industrial Scale', reward: { xp: 1600, title: 'Industrial Producer' } }
    ],
    trigger: (project, allProjects, userStats) => userStats.totalFinishWeight,
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  },

  // Client relationship achievements
  {
    id: 'client_specialist',
    name: 'Client Specialist',
    description: 'Build relationships with multiple clients',
    category: ACHIEVEMENT_CATEGORIES.COLLECTION,
    rarity: ACHIEVEMENT_RARITY.UNCOMMON,
    icon: '🤝',
    tiers: [
      { threshold: 3, name: 'Networker', reward: { xp: 200 } },
      { threshold: 8, name: 'Relationship Builder', reward: { xp: 500 } },
      { threshold: 15, name: 'Client Whisperer', reward: { xp: 1000, title: 'Client Specialist' } }
    ],
    trigger: (project, allProjects, userStats) => {
      const uniqueClients = new Set(allProjects.map(p => p.client).filter(Boolean));
      return uniqueClients.size;
    },
    getCurrentTier: (value, tiers) => {
      return tiers.reduceRight((acc, tier) => value >= tier.threshold ? tier : acc, null);
    }
  }
];
// data/jarFlipAchievements.js

export const jarFlipAchievements = [
  // 🚀 GETTING STARTED ACHIEVEMENTS
  {
    id: 'first_flip',
    title: 'First Flip',
    description: 'Complete your first cannabis flip project',
    category: 'milestones',
    type: 'single',
    icon: '🌱',
    xp: 100,
    rarity: 'common',
    condition: (projects) => projects.length >= 1
  },
  {
    id: 'first_profit',
    title: 'First Profit',
    description: 'Make your first profitable flip',
    category: 'milestones',
    type: 'single',
    icon: '💰',
    xp: 150,
    rarity: 'common',
    condition: (projects) => projects.some(p => (p.profit || 0) > 0)
  },

  // 📊 VOLUME ACHIEVEMENTS (Tiered)
  {
    id: 'flip_count',
    title: 'Flip Master',
    description: 'Complete multiple flip projects',
    category: 'volume',
    type: 'tiered',
    icon: '📦',
    rarity: 'common',
    tiers: [
      { threshold: 5, title: 'Novice Flipper', xp: 200, emoji: '🟢' },
      { threshold: 10, title: 'Experienced Flipper', xp: 400, emoji: '🔵' },
      { threshold: 25, title: 'Professional Flipper', xp: 800, emoji: '🟣' },
      { threshold: 50, title: 'Flip Master', xp: 1500, emoji: '🟡' },
      { threshold: 100, title: 'Flip Legend', xp: 3000, emoji: '🔴' }
    ],
    condition: (projects) => projects.length
  },
  {
    id: 'total_grams',
    title: 'Volume Dealer',
    description: 'Flip large quantities of cannabis',
    category: 'volume',
    type: 'tiered',
    icon: '⚖️',
    rarity: 'common',
    tiers: [
      { threshold: 100, title: 'Ounce Flipper', xp: 300, emoji: '🟢' },
      { threshold: 500, title: 'Pound Pusher', xp: 600, emoji: '🔵' },
      { threshold: 1000, title: 'Kilo King', xp: 1200, emoji: '🟣' },
      { threshold: 5000, title: 'Wholesale Warrior', xp: 2500, emoji: '🟡' },
      { threshold: 10000, title: 'Distribution Dynasty', xp: 5000, emoji: '🔴' }
    ],
    condition: (projects) => projects.reduce((sum, p) => sum + (p.grams || 0), 0)
  },

  // 💵 PROFIT ACHIEVEMENTS
  {
    id: 'profit_milestones',
    title: 'Money Maker',
    description: 'Achieve significant profit milestones',
    category: 'profit',
    type: 'tiered',
    icon: '💸',
    rarity: 'uncommon',
    tiers: [
      { threshold: 1000, title: 'Thousand Club', xp: 400, emoji: '🟢' },
      { threshold: 5000, title: 'Five Figure Flipper', xp: 800, emoji: '🔵' },
      { threshold: 10000, title: 'Ten Grand Gang', xp: 1600, emoji: '🟣' },
      { threshold: 25000, title: 'Quarter Million Mind', xp: 3200, emoji: '🟡' },
      { threshold: 50000, title: 'Fifty K Phenomenon', xp: 6400, emoji: '🔴' }
    ],
    condition: (projects) => projects.reduce((sum, p) => sum + (p.profit || 0), 0)
  },
  {
    id: 'single_flip_profit',
    title: 'Big Score',
    description: 'Make massive profit on a single flip',
    category: 'profit',
    type: 'tiered',
    icon: '🎯',
    rarity: 'rare',
    tiers: [
      { threshold: 500, title: 'Nice Score', xp: 300, emoji: '🟢' },
      { threshold: 1000, title: 'Big Score', xp: 600, emoji: '🔵' },
      { threshold: 2500, title: 'Huge Score', xp: 1200, emoji: '🟣' },
      { threshold: 5000, title: 'Massive Score', xp: 2400, emoji: '🟡' },
      { threshold: 10000, title: 'Legendary Score', xp: 4800, emoji: '🔴' }
    ],
    condition: (projects) => Math.max(...projects.map(p => p.profit || 0))
  },

  // 📈 ROI ACHIEVEMENTS
  {
    id: 'roi_master',
    title: 'ROI Master',
    description: 'Achieve exceptional return on investment',
    category: 'efficiency',
    type: 'tiered',
    icon: '📈',
    rarity: 'rare',
    tiers: [
      { threshold: 50, title: 'ROI Rookie', xp: 400, emoji: '🟢' },
      { threshold: 100, title: 'Double Dipper', xp: 800, emoji: '🔵' },
      { threshold: 200, title: 'Triple Threat', xp: 1600, emoji: '🟣' },
      { threshold: 500, title: 'ROI Royalty', xp: 3200, emoji: '🟡' },
      { threshold: 1000, title: 'Profit Prophet', xp: 6400, emoji: '🔴' }
    ],
    condition: (projects) => Math.max(...projects.map(p => p.roi || 0))
  },

  // ⚡ SPEED ACHIEVEMENTS
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete flips in record time',
    category: 'efficiency',
    type: 'single',
    icon: '⚡',
    xp: 600,
    rarity: 'rare',
    condition: (projects) => projects.some(p => (p.flipDurationDays || 999) <= 3)
  },
  {
    id: 'consistent_speed',
    title: 'Consistent Turner',
    description: 'Complete 5 flips in under 7 days each',
    category: 'efficiency',
    type: 'single',
    icon: '🔄',
    xp: 800,
    rarity: 'rare',
    condition: (projects) => projects.filter(p => (p.flipDurationDays || 999) <= 7).length >= 5
  },

  // 🏆 COMPETITION & STRAIN ACHIEVEMENTS
  {
    id: 'award_winner_trader',
    title: 'Award Winner Trader',
    description: 'Flip a competition-winning strain',
    category: 'prestige',
    type: 'single',
    icon: '🏆',
    xp: 1000,
    rarity: 'epic',
    condition: (projects, competitionData) => {
      if (!competitionData) return false;
      const userStrains = projects.map(p => p.strain?.toLowerCase()).filter(Boolean);
      const winningStrains = competitionData.placements
        ?.flatMap(p => p.parsedEntryStrains?.map(s => s.toLowerCase()) || []) || [];
      return userStrains.some(strain => winningStrains.includes(strain));
    }
  },
  {
    id: 'strain_collector',
    title: 'Strain Collector',
    description: 'Flip many different strains',
    category: 'diversity',
    type: 'tiered',
    icon: '🧬',
    rarity: 'uncommon',
    tiers: [
      { threshold: 5, title: 'Strain Sampler', xp: 300, emoji: '🟢' },
      { threshold: 10, title: 'Variety Vendor', xp: 600, emoji: '🔵' },
      { threshold: 20, title: 'Genetics Guru', xp: 1200, emoji: '🟣' },
      { threshold: 35, title: 'Strain Sommelier', xp: 2400, emoji: '🟡' },
      { threshold: 50, title: 'Cannabis Curator', xp: 4800, emoji: '🔴' }
    ],
    condition: (projects) => new Set(projects.map(p => p.strain).filter(Boolean)).size
  },

  // 🎯 EFFICIENCY ACHIEVEMENTS
  {
    id: 'margin_master',
    title: 'Margin Master',
    description: 'Achieve exceptional profit margins',
    category: 'efficiency',
    type: 'single',
    icon: '🎯',
    xp: 800,
    rarity: 'rare',
    condition: (projects) => projects.some(p => (p.margin || 0) >= 70)
  },
  {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete 10 profitable flips in 30 days',
    category: 'consistency',
    type: 'single',
    icon: '🌟',
    xp: 1500,
    rarity: 'epic',
    condition: (projects) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentProfitable = projects.filter(p => 
        new Date(p.selloutDate) >= thirtyDaysAgo && (p.profit || 0) > 0
      );
      return recentProfitable.length >= 10;
    }
  },

  // 🔥 STREAK ACHIEVEMENTS
  {
    id: 'profit_streak',
    title: 'Profit Streak',
    description: 'Consecutive profitable flips',
    category: 'consistency',
    type: 'tiered',
    icon: '🔥',
    rarity: 'rare',
    tiers: [
      { threshold: 3, title: 'Hot Streak', xp: 400, emoji: '🟢' },
      { threshold: 5, title: 'Fire Streak', xp: 800, emoji: '🔵' },
      { threshold: 10, title: 'Blazing Streak', xp: 1600, emoji: '🟣' },
      { threshold: 15, title: 'Inferno Streak', xp: 3200, emoji: '🟡' },
      { threshold: 25, title: 'Unstoppable Force', xp: 6400, emoji: '🔴' }
    ],
    condition: (projects) => {
      let maxStreak = 0;
      let currentStreak = 0;
      
      for (const project of projects.slice().reverse()) {
        if ((project.profit || 0) > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      return maxStreak;
    }
  },

  // 💎 PREMIUM ACHIEVEMENTS
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Complete a flip worth over $20,000',
    category: 'prestige',
    type: 'single',
    icon: '💎',
    xp: 2000,
    rarity: 'legendary',
    condition: (projects) => projects.some(p => (p.totalRevenue || 0) >= 20000)
  },
  {
    id: 'efficiency_expert',
    title: 'Efficiency Expert',
    description: '90% success rate with 20+ flips',
    category: 'mastery',
    type: 'single',
    icon: '⚙️',
    xp: 2500,
    rarity: 'legendary',
    condition: (projects) => {
      if (projects.length < 20) return false;
      const successRate = projects.filter(p => (p.profit || 0) > 0).length / projects.length;
      return successRate >= 0.9;
    }
  },

  // 🌈 SPECIAL ACHIEVEMENTS
  {
    id: 'diversified_portfolio',
    title: 'Diversified Portfolio',
    description: 'Flip all major material types',
    category: 'diversity',
    type: 'single',
    icon: '🌈',
    xp: 1200,
    rarity: 'epic',
    condition: (projects) => {
      const materialTypes = new Set(projects.map(p => p.materialType).filter(Boolean));
      const requiredTypes = ['Flower', 'Pre-Rolls', 'Concentrates', 'Edibles'];
      return requiredTypes.every(type => materialTypes.has(type));
    }
  },
  {
    id: 'quarter_master',
    title: 'Quarter Master',
    description: 'Specialize in quarter ounce flips (7g packages)',
    category: 'specialization',
    type: 'single',
    icon: '🎲',
    xp: 600,
    rarity: 'uncommon',
    condition: (projects) => projects.filter(p => p.packagingUnit === 7).length >= 10
  },
  {
    id: 'eighth_expert',
    title: 'Eighth Expert',
    description: 'Master of 3.5g package flips',
    category: 'specialization',
    type: 'single',
    icon: '🎯',
    xp: 600,
    rarity: 'uncommon',
    condition: (projects) => projects.filter(p => p.packagingUnit === 3.5).length >= 15
  },

  // 🚨 CHALLENGE ACHIEVEMENTS
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Recover from 3 consecutive losses with a profit',
    category: 'resilience',
    type: 'single',
    icon: '🚨',
    xp: 800,
    rarity: 'rare',
    condition: (projects) => {
      for (let i = 3; i < projects.length; i++) {
        const last3 = projects.slice(i-3, i);
        const current = projects[i];
        
        if (last3.every(p => (p.profit || 0) <= 0) && (current.profit || 0) > 0) {
          return true;
        }
      }
      return false;
    }
  },
  {
    id: 'risk_taker',
    title: 'Risk Taker',
    description: 'Complete a flip with over $5,000 investment',
    category: 'courage',
    type: 'single',
    icon: '🎰',
    xp: 1000,
    rarity: 'epic',
    condition: (projects) => projects.some(p => (p.totalCost || 0) >= 5000)
  },

  // 📅 TIME-BASED ACHIEVEMENTS
  {
    id: 'veteran_trader',
    title: 'Veteran Trader',
    description: 'Active for 6+ months',
    category: 'longevity',
    type: 'single',
    icon: '🎖️',
    xp: 1500,
    rarity: 'epic',
    condition: (projects) => {
      if (projects.length === 0) return false;
      const earliest = Math.min(...projects.map(p => new Date(p.purchaseDate).getTime()));
      const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
      return earliest <= sixMonthsAgo;
    }
  },
  {
    id: 'new_year_grinder',
    title: 'New Year Grinder',
    description: 'Complete 10 flips in January',
    category: 'seasonal',
    type: 'single',
    icon: '🎊',
    xp: 800,
    rarity: 'rare',
    condition: (projects) => {
      const januaryFlips = projects.filter(p => {
        const date = new Date(p.selloutDate);
        return date.getMonth() === 0; // January is month 0
      });
      return januaryFlips.length >= 10;
    }
  },

  // 🏅 MASTERY ACHIEVEMENTS
  {
    id: 'flip_god',
    title: 'Flip God',
    description: 'Ultimate achievement: 100+ flips, $100k+ profit, 80%+ success',
    category: 'mastery',
    type: 'single',
    icon: '👑',
    xp: 10000,
    rarity: 'legendary',
    condition: (projects) => {
      const totalProfit = projects.reduce((sum, p) => sum + (p.profit || 0), 0);
      const successRate = projects.filter(p => (p.profit || 0) > 0).length / projects.length;
      return projects.length >= 100 && totalProfit >= 100000 && successRate >= 0.8;
    }
  }
];

// Achievement Categories
export const achievementCategories = {
  milestones: { name: 'Milestones', icon: '🎯', color: '#10B981' },
  volume: { name: 'Volume', icon: '📦', color: '#3B82F6' },
  profit: { name: 'Profit', icon: '💰', color: '#F59E0B' },
  efficiency: { name: 'Efficiency', icon: '⚡', color: '#8B5CF6' },
  consistency: { name: 'Consistency', icon: '🔥', color: '#EF4444' },
  prestige: { name: 'Prestige', icon: '🏆', color: '#F97316' },
  diversity: { name: 'Diversity', icon: '🌈', color: '#06B6D4' },
  specialization: { name: 'Specialization', icon: '🎯', color: '#84CC16' },
  resilience: { name: 'Resilience', icon: '💪', color: '#6366F1' },
  courage: { name: 'Courage', icon: '🎰', color: '#DC2626' },
  longevity: { name: 'Longevity', icon: '🎖️', color: '#7C3AED' },
  seasonal: { name: 'Seasonal', icon: '📅', color: '#EC4899' },
  mastery: { name: 'Mastery', icon: '👑', color: '#FBBF24' }
};

// Rarity levels
export const rarityLevels = {
  common: { name: 'Common', color: '#9CA3AF', multiplier: 1 },
  uncommon: { name: 'Uncommon', color: '#10B981', multiplier: 1.2 },
  rare: { name: 'Rare', color: '#3B82F6', multiplier: 1.5 },
  epic: { name: 'Epic', color: '#8B5CF6', multiplier: 2 },
  legendary: { name: 'Legendary', color: '#F59E0B', multiplier: 3 }
};

// Utility function to check all achievements
export function checkJarFlipAchievements(projects, competitionData = null) {
  const earnedAchievements = [];
  
  jarFlipAchievements.forEach(achievement => {
    try {
      const result = achievement.condition(projects, competitionData);
      
      if (achievement.type === 'tiered') {
        // For tiered achievements, find the highest tier achieved
        const value = result;
        const earnedTiers = achievement.tiers.filter(tier => value >= tier.threshold);
        
        earnedTiers.forEach(tier => {
          earnedAchievements.push({
            ...achievement,
            currentTier: tier,
            value: value,
            earnedAt: new Date().toISOString(),
            id: `${achievement.id}_${tier.threshold}`
          });
        });
      } else {
        // For single achievements
        if (result) {
          earnedAchievements.push({
            ...achievement,
            earnedAt: new Date().toISOString(),
            value: result
          });
        }
      }
    } catch (error) {
      console.error(`Error checking achievement ${achievement.id}:`, error);
    }
  });
  
  return earnedAchievements;
}
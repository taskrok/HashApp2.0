export const achievementList = [
  // Efficiency & Yield Achievements
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Awarded for outperforming the expected yield.',
    category: 'Efficiency & Yield',
    trigger: (project) => project.metrics.efficiency >= 100,
  },
  {
    id: 'the_overachiever',
    name: 'The Overachiever',
    description: 'For when you dramatically exceed expectations.',
    category: 'Efficiency & Yield',
    trigger: (project) => project.metrics.efficiency >= 120,
  },
  {
    id: 'yield_king',
    name: 'Yield King',
    description: 'For pushing the boundaries and achieving a new personal best.',
    category: 'Efficiency & Yield',
    trigger: (project, allProjects, userStats) => project.metrics.actualYieldPercent > userStats.highestYield,
  },
  {
    id: 'mr_consistent',
    name: 'Mr. Consistent',
    description: 'Recognizes sustained excellence and a highly refined process.',
    category: 'Efficiency & Yield',
    trigger: (project, allProjects) => {
      if (allProjects.length < 5) return false;
      const recentProjects = allProjects.slice(0, 5);
      return recentProjects.every(p => (p.metrics?.efficiency || 0) >= 95);
    },
  },
  {
    id: 'precision_processor',
    name: 'Precision Processor',
    description: 'For hitting the target with incredible accuracy.',
    category: 'Efficiency & Yield',
    trigger: (project) => {
      const variance = Math.abs(parseFloat(project.metrics.variance));
      return variance <= 0.5;
    },
  },
  {
    id: 'yield_milestone_1',
    name: 'Yield Milestone I',
    description: 'Milestone for achieving a yield of 10% on any single project.',
    category: 'Efficiency & Yield',
    trigger: (project) => project.metrics.actualYieldPercent >= 10,
  },
  {
    id: 'yield_milestone_2',
    name: 'Yield Milestone II',
    description: 'Milestone for achieving a yield of 15% on any single project.',
    category: 'Efficiency & Yield',
    trigger: (project) => project.metrics.actualYieldPercent >= 15,
  },
  {
    id: 'yield_milestone_3',
    name: 'Yield Milestone III',
    description: 'Milestone for achieving a yield of 20% on any single project.',
    category: 'Efficiency & Yield',
    trigger: (project) => project.metrics.actualYieldPercent >= 20,
  },
  // Financial & Profitability Achievements
  {
    id: 'first_profits',
    name: 'First Profits',
    description: 'A milestone for making your first successful return.',
    category: 'Financial & Profitability',
    trigger: (project, allProjects) => allProjects.filter(p => p.metrics?.profit > 0).length === 1 && project.metrics.profit > 0,
  },
  {
    id: 'margin_master',
    name: 'Margin Master',
    description: 'For demonstrating excellent profitability.',
    category: 'Financial & Profitability',
    trigger: (project) => project.metrics.margin >= 50,
  },
  {
    id: 'the_big_one',
    name: 'The Big One',
    description: 'Awarded for a highly successful project.',
    category: 'Financial & Profitability',
    trigger: (project) => project.metrics.profit >= 1000,
  },
  {
    id: 'revenue_milestone_1',
    name: 'Revenue Milestone I',
    description: 'Reach total revenue of $10,000 across all projects.',
    category: 'Financial & Profitability',
    trigger: (project, allProjects, userStats) => userStats.totalRevenue >= 10000,
  },
  {
    id: 'revenue_milestone_2',
    name: 'Revenue Milestone II',
    description: 'Reach total revenue of $50,000 across all projects.',
    category: 'Financial & Profitability',
    trigger: (project, allProjects, userStats) => userStats.totalRevenue >= 50000,
  },
  {
    id: 'revenue_milestone_3',
    name: 'Revenue Milestone III',
    description: 'Reach total revenue of $100,000 across all projects.',
    category: 'Financial & Profitability',
    trigger: (project, allProjects, userStats) => userStats.totalRevenue >= 100000,
  },
  {
    id: 'cost_cutter',
    name: 'Cost Cutter',
    description: 'For running an exceptionally lean and cost-effective operation.',
    category: 'Financial & Profitability',
    trigger: (project, allProjects, userStats, context) => {
        const path = context.processingPaths[project.startMaterial]?.[project.finishMaterial];
        if (!path || !path.cost) return false;
        const suggestedCost = path.cost;
        const actualCost = parseFloat(project.processingCost);
        return actualCost <= (suggestedCost * 0.75);
    }
  },
  // Volume & Consistency Achievements
  {
    id: 'first_step',
    name: 'First Step',
    description: 'The journey of a thousand extractions begins with a single step.',
    category: 'Volume & Consistency',
    trigger: (project, allProjects) => allProjects.length === 1,
  },
  {
    id: 'workhorse',
    name: 'Project Milestone (Workhorse)',
    description: 'Successfully complete 10 projects.',
    category: 'Volume & Consistency',
    trigger: (project, allProjects) => allProjects.length >= 10,
  },
  {
    id: 'veteran',
    name: 'Project Milestone (Veteran)',
    description: 'Successfully complete 50 projects.',
    category: 'Volume & Consistency',
    trigger: (project, allProjects) => allProjects.length >= 50,
  },
  {
    id: 'centurion',
    name: 'Project Milestone (Centurion)',
    description: 'Successfully complete 100 projects.',
    category: 'Volume & Consistency',
    trigger: (project, allProjects) => allProjects.length >= 100,
  },
  {
    id: 'first_ounce',
    name: 'First Ounce',
    description: 'A celebratory milestone for producing your first ounce of finished product.',
    category: 'Volume & Consistency',
    trigger: (project, allProjects, userStats) => userStats.totalFinishWeight >= 28.35,
  },
  {
    id: 'client_champion',
    name: 'Client Champion',
    description: 'Awarded for building strong, repeat business relationships.',
    category: 'Volume & Consistency',
    trigger: (project) => {
        if (!project.client) return false;
        const clientProjectCount = project.allProjects.filter(p => p.client === project.client).length;
        return clientProjectCount === 5;
    }
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'For a quick and efficient turnaround.',
    category: 'Volume & Consistency',
    trigger: (project) => {
        const startTime = new Date(project.startDate).getTime();
        const endTime = new Date(project.endDate).getTime();
        const processingTime = (endTime - startTime) / (1000 * 60 * 60); // in hours
        return processingTime < 48;
    }
  },
  // Mastery & Variety Achievements
  {
    id: 'rosin_baron',
    name: 'Rosin Baron',
    description: 'For demonstrating mastery of one of the most sought-after extraction types.',
    category: 'Mastery & Variety',
    trigger: (project, allProjects) => {
        return allProjects.filter(p => p.finishMaterial === 'Live Rosin').length >= 25;
    }
  },
  {
    id: 'strain_hunter',
    name: 'Strain Hunter',
    description: 'For having a diverse portfolio and experience with a wide variety of cultivars.',
    category: 'Mastery & Variety',
    trigger: (project, allProjects, userStats) => userStats.uniqueStrains.size >= 15,
  },
  {
    id: 'alchemist',
    name: 'The Alchemist',
    description: 'For experimenting with and creating a variety of end products.',
    category: 'Mastery & Variety',
    trigger: (project, allProjects, userStats) => userStats.uniqueFinishMaterials.size >= 5,
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder',
    description: 'For exploring the full spectrum of extraction paths.',
    category: 'Mastery & Variety',
    trigger: (project, allProjects, userStats, context) => {
        const availableTypes = Object.keys(context.processingPaths);
        return availableTypes.every(type => userStats.uniqueStartMaterials.has(type));
    }
  },
  {
    id: 'fresh_frozen_fanatic',
    name: 'Fresh Frozen Fanatic',
    description: 'For specializing in and processing a large volume of fresh frozen material.',
    category: 'Mastery & Variety',
    trigger: (project, allProjects) => {
        const totalFFW = allProjects
            .filter(p => p.startMaterial === 'Fresh Frozen')
            .reduce((sum, p) => sum + p.startWeight, 0);
        return totalFFW >= 10000;
    }
  },
  // Dynamic achievements like [Strain Name] Specialist would require a more complex implementation
  // to generate them on the fly. This list covers the static ones.
];
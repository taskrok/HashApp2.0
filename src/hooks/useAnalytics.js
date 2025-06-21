import { useMemo } from 'react';

export const useAnalytics = (projects) => {
  return useMemo(() => {
    if (!projects.length) return {};
    
    const totalProjects = projects.length;
    const avgYield = projects.reduce((sum, p) => sum + parseFloat(p.actualYieldPercent), 0) / totalProjects;
    const totalRevenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalCost = projects.reduce((sum, p) => sum + (p.cost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    
    const yieldTrend = projects.length > 1 ? 
      ((parseFloat(projects[0].actualYieldPercent) - parseFloat(projects[projects.length - 1].actualYieldPercent)) / parseFloat(projects[projects.length - 1].actualYieldPercent)) * 100 : 0;
    
    const strainPerformance = projects.reduce((acc, p) => {
      if (!p.strain) return acc;
      if (!acc[p.strain]) acc[p.strain] = { total: 0, count: 0, revenue: 0 };
      acc[p.strain].total += parseFloat(p.actualYieldPercent);
      acc[p.strain].count += 1;
      acc[p.strain].revenue += p.revenue || 0;
      return acc;
    }, {});
    
    Object.keys(strainPerformance).forEach(strain => {
      strainPerformance[strain].average = strainPerformance[strain].total / strainPerformance[strain].count;
    });
    
    const topStrain = Object.entries(strainPerformance).sort((a, b) => b[1].average - a[1].average)[0];
    
    return {
      totalProjects,
      avgYield,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: totalRevenue ? (totalProfit / totalRevenue) * 100 : 0,
      yieldTrend,
      strainPerformance,
      topStrain: topStrain ? topStrain[0] : null,
      efficiency: avgYield > 0 ? Math.min(100, (avgYield / 25) * 100) : 0
    };
  }, [projects]);
};
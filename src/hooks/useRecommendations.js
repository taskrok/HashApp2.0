import { useMemo } from 'react';

export const useRecommendations = (projects, analytics) => {
    return useMemo(() => {
    const recommendations = [];
    
    if (analytics.yieldTrend < -5) {
      recommendations.push({
        type: 'warning',
        title: 'Declining Yield Trend',
        message: 'Your yields have decreased by ' + Math.abs(analytics.yieldTrend).toFixed(1) + '% recently.',
        action: 'Review your processing techniques and equipment maintenance.'
      });
    }
    
    if (analytics.profitMargin < 30) {
      recommendations.push({
        type: 'info',
        title: 'Profit Optimization',
        message: 'Consider focusing on higher-margin products.',
        action: 'Live Rosin typically offers 3x better margins than BHO.'
      });
    }
    
    if (analytics.topStrain && analytics.strainPerformance[analytics.topStrain].average > analytics.avgYield * 1.2) {
      recommendations.push({
        type: 'success',
        title: 'High-Performing Strain',
        message: `${analytics.topStrain} consistently outperforms average by ${((analytics.strainPerformance[analytics.topStrain].average / analytics.avgYield - 1) * 100).toFixed(1)}%`,
        action: 'Consider increasing production of this strain.'
      });
    }
    
    return recommendations;
  }, [projects, analytics]);
};
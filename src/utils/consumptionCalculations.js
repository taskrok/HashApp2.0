// utils/consumptionCalculations.js

// Calculate metrics for a single consumption entry
export function calculateConsumptionMetrics(entry) {
  const sessionDays = Math.max(1, 
    (new Date(entry.endDate) - new Date(entry.startDate)) / (1000 * 60 * 60 * 24) + 1
  );

  const hashCost = (parseFloat(entry.hashAmount) || 0) * parseFloat(entry.hashCostPerGram || 0);
  const flowerCost = (parseFloat(entry.flowerAmount) || 0) * parseFloat(entry.flowerCostPerGram || 0);
  const edibleCost = (parseFloat(entry.edibleAmount) || 0) * parseFloat(entry.edibleCostPerUnit || 0);
  const vapeCost = (parseFloat(entry.vapeAmount) || 0) * parseFloat(entry.vapeCostPerGram || 0);

  const totalCost = hashCost + flowerCost + edibleCost + vapeCost;
  const dailyCost = totalCost / sessionDays;

  const totalAmount = (parseFloat(entry.hashAmount) || 0) + 
                     (parseFloat(entry.flowerAmount) || 0) + 
                     (parseFloat(entry.edibleAmount) || 0) + 
                     (parseFloat(entry.vapeAmount) || 0);

  return {
    ...entry,
    sessionDays,
    totalCost,
    dailyCost,
    totalAmount,
    hashCost,
    flowerCost,
    edibleCost,
    vapeCost
  };
}

// Calculate portfolio-wide consumption metrics
export function calculateConsumptionPortfolioMetrics(entries) {
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      totalCost: 0,
      totalHashConsumed: 0,
      totalFlowerConsumed: 0,
      totalEdiblesConsumed: 0,
      totalVapeConsumed: 0,
      avgDailyCost: 0,
      avgSessionDays: 0,
      avgHashPerDay: 0,
      avgFlowerPerDay: 0,
      totalDaysTracked: 0,
      hashTrend: 0,
      flowerTrend: 0,
      costTrend: 0
    };
  }

  const processedEntries = entries.map(calculateConsumptionMetrics);
  
  const totals = processedEntries.reduce((acc, entry) => {
    acc.totalCost += entry.totalCost || 0;
    acc.totalHashConsumed += parseFloat(entry.hashAmount) || 0;
    acc.totalFlowerConsumed += parseFloat(entry.flowerAmount) || 0;
    acc.totalEdiblesConsumed += parseFloat(entry.edibleAmount) || 0;
    acc.totalVapeConsumed += parseFloat(entry.vapeAmount) || 0;
    acc.totalSessionDays += entry.sessionDays || 1;
    return acc;
  }, {
    totalCost: 0,
    totalHashConsumed: 0,
    totalFlowerConsumed: 0,
    totalEdiblesConsumed: 0,
    totalVapeConsumed: 0,
    totalSessionDays: 0
  });

  const totalDaysTracked = totals.totalSessionDays;
  const avgDailyCost = totalDaysTracked > 0 ? totals.totalCost / totalDaysTracked : 0;
  const avgSessionDays = processedEntries.length > 0 ? 
    processedEntries.reduce((sum, e) => sum + (e.sessionDays || 1), 0) / processedEntries.length : 0;
  
  const avgHashPerDay = totalDaysTracked > 0 ? totals.totalHashConsumed / totalDaysTracked : 0;
  const avgFlowerPerDay = totalDaysTracked > 0 ? totals.totalFlowerConsumed / totalDaysTracked : 0;

  // Calculate trends (recent vs older entries)
  const recentEntries = processedEntries.slice(0, Math.ceil(processedEntries.length / 3));
  const olderEntries = processedEntries.slice(Math.ceil(processedEntries.length * 2 / 3));

  let hashTrend = 0;
  let flowerTrend = 0;
  let costTrend = 0;

  if (recentEntries.length > 0 && olderEntries.length > 0) {
    const recentHashAvg = recentEntries.reduce((sum, e) => sum + (parseFloat(e.hashAmount) || 0), 0) / recentEntries.length;
    const olderHashAvg = olderEntries.reduce((sum, e) => sum + (parseFloat(e.hashAmount) || 0), 0) / olderEntries.length;
    hashTrend = olderHashAvg > 0 ? ((recentHashAvg - olderHashAvg) / olderHashAvg) * 100 : 0;

    const recentFlowerAvg = recentEntries.reduce((sum, e) => sum + (parseFloat(e.flowerAmount) || 0), 0) / recentEntries.length;
    const olderFlowerAvg = olderEntries.reduce((sum, e) => sum + (parseFloat(e.flowerAmount) || 0), 0) / olderEntries.length;
    flowerTrend = olderFlowerAvg > 0 ? ((recentFlowerAvg - olderFlowerAvg) / olderFlowerAvg) * 100 : 0;

    const recentCostAvg = recentEntries.reduce((sum, e) => sum + (e.totalCost || 0), 0) / recentEntries.length;
    const olderCostAvg = olderEntries.reduce((sum, e) => sum + (e.totalCost || 0), 0) / olderEntries.length;
    costTrend = olderCostAvg > 0 ? ((recentCostAvg - olderCostAvg) / olderCostAvg) * 100 : 0;
  }

  return {
    totalEntries: processedEntries.length,
    totalCost: totals.totalCost,
    totalHashConsumed: totals.totalHashConsumed,
    totalFlowerConsumed: totals.totalFlowerConsumed,
    totalEdiblesConsumed: totals.totalEdiblesConsumed,
    totalVapeConsumed: totals.totalVapeConsumed,
    avgDailyCost,
    avgSessionDays,
    avgHashPerDay,
    avgFlowerPerDay,
    totalDaysTracked,
    hashTrend,
    flowerTrend,
    costTrend
  };
}

// Format currency values
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format percentage values
export function formatPercentage(percentage) {
  if (typeof percentage !== 'number') {
    percentage = parseFloat(percentage) || 0;
  }
  return `${percentage.toFixed(1)}%`;
}

// Get performance-based color for values
export function getPerformanceColor(value, type = 'cost') {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }

  switch (type) {
    case 'cost':
      if (value <= 20) return '#10B981'; // Green - low cost
      if (value <= 40) return '#F59E0B'; // Yellow - medium cost
      return '#EF4444'; // Red - high cost
      
    case 'amount':
      if (value <= 2) return '#10B981'; // Green - low amount
      if (value <= 5) return '#F59E0B'; // Yellow - medium amount
      return '#EF4444'; // Red - high amount
      
    case 'mood':
      // For mood improvements (positive change)
      if (value > 0) return '#10B981'; // Green - improvement
      if (value === 0) return '#F59E0B'; // Yellow - no change
      return '#EF4444'; // Red - worse
      
    default:
      return '#6B7280'; // Default gray
  }
}

// Calculate consumption efficiency (effects per dollar)
export function calculateEfficiency(entry) {
  const totalCost = entry.totalCost || 0;
  const totalAmount = entry.totalAmount || 0;
  
  if (totalCost === 0) return 0;
  
  // Simple efficiency metric: grams per dollar
  return totalAmount / totalCost;
}

// Analyze consumption patterns
export function analyzeConsumptionPattern(entries) {
  if (!entries || entries.length === 0) return null;

  const typeBreakdown = entries.reduce((acc, entry) => {
    if (entry.hashAmount > 0) acc.hash += entry.hashAmount;
    if (entry.flowerAmount > 0) acc.flower += entry.flowerAmount;
    if (entry.edibleAmount > 0) acc.edibles += entry.edibleAmount;
    if (entry.vapeAmount > 0) acc.vape += entry.vapeAmount;
    return acc;
  }, { hash: 0, flower: 0, edibles: 0, vape: 0 });

  const total = Object.values(typeBreakdown).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) return null;

  const percentages = Object.entries(typeBreakdown).map(([type, amount]) => ({
    type,
    amount,
    percentage: (amount / total) * 100
  })).sort((a, b) => b.percentage - a.percentage);

  return {
    breakdown: typeBreakdown,
    percentages,
    primaryType: percentages[0]?.type,
    isBalanced: percentages[0]?.percentage < 50
  };
}

// Calculate predicted run-out dates based on consumption patterns
export function calculateInventoryPredictions(entries, inventory) {
  const metrics = calculateConsumptionPortfolioMetrics(entries);
  
  const predictions = {};
  
  if (metrics.avgHashPerDay > 0 && inventory.hashInventory > 0) {
    const daysRemaining = parseFloat(inventory.hashInventory) / metrics.avgHashPerDay;
    predictions.hash = {
      daysRemaining: Math.floor(daysRemaining),
      runOutDate: new Date(Date.now() + (daysRemaining * 24 * 60 * 60 * 1000))
    };
  }
  
  if (metrics.avgFlowerPerDay > 0 && inventory.flowerInventory > 0) {
    const daysRemaining = parseFloat(inventory.flowerInventory) / metrics.avgFlowerPerDay;
    predictions.flower = {
      daysRemaining: Math.floor(daysRemaining),
      runOutDate: new Date(Date.now() + (daysRemaining * 24 * 60 * 60 * 1000))
    };
  }

  return predictions;
}

// Time-based analysis functions
export function getTimeOfDayCategory(dateString) {
  const hour = new Date(dateString).getHours();
  
  if (hour >= 6 && hour <= 10) return 'morning';
  if (hour >= 11 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 21) return 'evening';
  return 'night';
}

export function getDayOfWeekCategory(dateString) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}

// Mood analysis helpers
export function analyzeMoodChange(moodBefore, moodAfter) {
  const positiveMoods = ['Happy', 'Relaxed', 'Excited', 'Focused', 'Creative', 'Peaceful', 'Energetic', 'Euphoric'];
  const negativeMoods = ['Sad', 'Anxious', 'Stressed', 'Tired', 'Irritated', 'Depressed'];
  
  const beforePositive = positiveMoods.includes(moodBefore);
  const afterPositive = positiveMoods.includes(moodAfter);
  const beforeNegative = negativeMoods.includes(moodBefore);
  const afterNegative = negativeMoods.includes(moodAfter);
  
  if (beforeNegative && afterPositive) return 'improved';
  if (beforePositive && afterNegative) return 'worsened';
  if (beforePositive && afterPositive) return 'maintained-positive';
  if (beforeNegative && afterNegative) return 'maintained-negative';
  return 'neutral';
}
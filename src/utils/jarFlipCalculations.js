// utils/jarFlipCalculations.js

export const calculateFlipMetrics = (project) => {
  if (!project) return null;

  const quantityNum = parseFloat(project.grams) || 0;
  const costPerGramNum = parseFloat(project.costPerGram) || 0;
  const salePricePerGramNum = parseFloat(project.salePricePerGram) || 0;
  const overheadCostNum = parseFloat(project.overheadCost) || 0;
  const packagingCostNum = parseFloat(project.packagingCost) || 0;
  const packagingUnitNum = parseFloat(project.packagingUnit) || 1;

  // Calculate packaging units needed
  const packagingUnits = Math.ceil(quantityNum / packagingUnitNum);

  // Calculate dates and duration
  const purchaseDateObj = new Date(project.purchaseDate);
  const selloutDateObj = new Date(project.selloutDate);
  const timeDiff = selloutDateObj.getTime() - purchaseDateObj.getTime();
  const flipDurationDays = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  // Calculate financials
  const baseCost = costPerGramNum * quantityNum;
  const totalPackagingCost = packagingCostNum * packagingUnits;
  const totalCost = baseCost + overheadCostNum + totalPackagingCost;
  const totalRevenue = salePricePerGramNum * quantityNum;
  const profit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    ...project,
    quantityNum,
    totalCost,
    totalRevenue,
    profit,
    roi,
    margin,
    packagingUnits,
    flipDurationDays,
    profitPerGram: quantityNum > 0 ? profit / quantityNum : 0,
    costBreakdown: {
      baseCost,
      overheadCost: overheadCostNum,
      packagingCost: totalPackagingCost,
      total: totalCost
    }
  };
};

export const calculatePortfolioMetrics = (projects) => {
  if (!projects || projects.length === 0) {
    return {
      totalProfit: 0,
      totalRevenue: 0,
      totalCost: 0,
      averageROI: 0,
      averageMargin: 0,
      averageFlipDays: 0,
      totalFlips: 0,
      profitableFlips: 0,
      successRate: 0
    };
  }

  const metrics = projects.map(calculateFlipMetrics);
  const totalProfit = metrics.reduce((sum, m) => sum + (m?.profit || 0), 0);
  const totalRevenue = metrics.reduce((sum, m) => sum + (m?.totalRevenue || 0), 0);
  const totalCost = metrics.reduce((sum, m) => sum + (m?.totalCost || 0), 0);
  const profitableFlips = metrics.filter(m => (m?.profit || 0) > 0).length;

  return {
    totalProfit,
    totalRevenue,
    totalCost,
    averageROI: metrics.length > 0 ? metrics.reduce((sum, m) => sum + (m?.roi || 0), 0) / metrics.length : 0,
    averageMargin: metrics.length > 0 ? metrics.reduce((sum, m) => sum + (m?.margin || 0), 0) / metrics.length : 0,
    averageFlipDays: metrics.length > 0 ? metrics.reduce((sum, m) => sum + (m?.flipDurationDays || 0), 0) / metrics.length : 0,
    totalFlips: projects.length,
    profitableFlips,
    successRate: projects.length > 0 ? (profitableFlips / projects.length) * 100 : 0
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`;
};

export const getPerformanceColor = (value, type = 'profit') => {
  switch (type) {
    case 'profit':
      return value > 0 ? '#10B981' : value < 0 ? '#EF4444' : '#6B7280';
    case 'roi':
      return value > 20 ? '#10B981' : value > 0 ? '#F59E0B' : '#EF4444';
    case 'margin':
      return value > 30 ? '#10B981' : value > 10 ? '#F59E0B' : '#EF4444';
    default:
      return '#6B7280';
  }
};
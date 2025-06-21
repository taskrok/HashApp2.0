import { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Calendar, DollarSign, Users, Award, AlertTriangle, CheckCircle, Clock, Target, Zap, Filter, Download, Upload, Settings, Eye, EyeOff, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

// Enhanced processing paths with more detailed data
const PROCESSING_PATHS = {
  'Fresh Frozen': {
    'Live Rosin': { yield: 0.04, variance: 0.015, difficulty: 'Expert', time: 8, cost: 250, quality: 95, tip: 'Premium live rosin from fresh frozen material. Requires precise temperature control.' },
    'Bubble Hash': { yield: 0.045, variance: 0.01, difficulty: 'Intermediate', time: 6, cost: 150, quality: 88, tip: 'Excellent water hash yield with proper washing technique.' },
    'Rosin': { yield: 0.05, variance: 0.02, difficulty: 'Beginner', time: 4, cost: 100, quality: 82, tip: 'Good entry-level extraction with decent returns.' },
    'BHO': { yield: 0.06, variance: 0.015, difficulty: 'Advanced', time: 12, cost: 200, quality: 90, tip: 'Higher yields but requires professional equipment.' }
  },
  'Bubble Hash': {
    'Live Rosin': { yield: 0.65, variance: 0.08, difficulty: 'Expert', time: 3, cost: 80, quality: 98, tip: 'Premium hash rosin - highest quality possible.' },
    'Rosin': { yield: 0.60, variance: 0.1, difficulty: 'Intermediate', time: 2, cost: 50, quality: 92, tip: 'Excellent yields from quality hash.' },
    'BHO': { yield: 0.55, variance: 0.05, difficulty: 'Advanced', time: 8, cost: 120, quality: 85, tip: 'Good secondary extraction option.' }
  },
  'Dry Bud': {
    'Rosin': { yield: 0.18, variance: 0.04, difficulty: 'Beginner', time: 2, cost: 30, quality: 78, tip: 'Most accessible extraction method.' },
    'BHO': { yield: 0.22, variance: 0.03, difficulty: 'Advanced', time: 10, cost: 180, quality: 88, tip: 'Professional extraction with consistent results.' },
    'Distillate': { yield: 0.65, variance: 0.1, difficulty: 'Expert', time: 24, cost: 400, quality: 95, tip: 'High-tech refinement process.' }
  },
  'Dry Trim': {
    'Bubble Hash': { yield: 0.075, variance: 0.025, difficulty: 'Intermediate', time: 8, cost: 100, quality: 70, tip: 'Good use of trim material.' },
    'BHO': { yield: 0.12, variance: 0.02, difficulty: 'Advanced', time: 12, cost: 150, quality: 75, tip: 'Decent extraction from waste material.' },
    'Edible Oil': { yield: 0.85, variance: 0.05, difficulty: 'Beginner', time: 4, cost: 25, quality: 65, tip: 'Maximum utilization for edibles.' }
  },
  'Dry Sift': {
    'Rosin': { yield: 0.70, variance: 0.12, difficulty: 'Intermediate', time: 1, cost: 20, quality: 85, tip: 'Quick pressing of sifted material.' }
  }
};

const MARKET_PRICES = {
  'Live Rosin': 80,
  'Bubble Hash': 45,
  'Rosin': 35,
  'BHO': 30,
  'Distillate': 25,
  'Edible Oil': 15,
  'Fresh Frozen': 8,
  'Dry Bud': 5,
  'Dry Trim': 1,
  'Dry Sift': 12
};

const DIFFICULTY_COLORS = {
  'Beginner': '#4ADE80',
  'Intermediate': '#FACC15',
  'Advanced': '#F97316',
  'Expert': '#EF4444'
};

// Smart notification system
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (type, message, action = null) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, action, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  return { notifications, addNotification };
};

// Advanced analytics calculations
const useAnalytics = (projects) => {
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

// Smart recommendations engine
const useRecommendations = (projects, analytics) => {
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

// Stable component definitions outside of main component to prevent re-renders
const Card = ({ children, className = '', theme, ...props }) => {
  // Provide default theme if not passed
  const safeTheme = theme || {
    cardBg: '#111111',
    border: '#333333'
  };
  
  return (
    <div 
      style={{
        background: safeTheme.cardBg,
        border: `1px solid ${safeTheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color, theme }) => {
  const safeTheme = theme || {
    cardBg: '#111111',
    border: '#333333',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    success: '#10B981',
    error: '#EF4444'
  };
  
  return (
    <Card theme={safeTheme} style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `${color}15`, borderRadius: '50%', transform: 'translate(30px, -30px)' }} />
      <Icon size={32} style={{ color, marginBottom: '12px' }} />
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: safeTheme.text, marginBottom: '4px' }}>{value}</div>
      <div style={{ color: safeTheme.textSecondary, fontSize: '0.9rem', marginBottom: '8px' }}>{title}</div>
      {subtitle && <div style={{ color: safeTheme.textSecondary, fontSize: '0.8rem' }}>{subtitle}</div>}
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px', fontSize: '0.8rem' }}>
          {trend > 0 ? <TrendingUp size={16} style={{ color: safeTheme.success, marginRight: '4px' }} /> : <TrendingDown size={16} style={{ color: safeTheme.error, marginRight: '4px' }} />}
          <span style={{ color: trend > 0 ? safeTheme.success : safeTheme.error }}>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </Card>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, theme, ...props }) => {
  const safeTheme = theme || {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#3B82F6',
    error: '#EF4444',
    textSecondary: '#A0A0A0'
  };
  
  const variants = {
    primary: { background: safeTheme.gradient, color: 'white', border: 'none' },
    secondary: { background: 'transparent', color: safeTheme.accent, border: `1px solid ${safeTheme.accent}` },
    danger: { background: safeTheme.error, color: 'white', border: 'none' },
    ghost: { background: 'transparent', color: safeTheme.textSecondary, border: 'none' }
  };
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.875rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 32px', fontSize: '1.125rem' }
  };
  
  return (
    <button
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        opacity: disabled ? 0.5 : 1,
        ...props.style
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, error, theme, list, ...props }) => {
  const safeTheme = theme || {
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    error: '#EF4444',
    border: '#333333',
    cardBg: '#111111'
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', color: safeTheme.text, fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: safeTheme.textSecondary }} />}
        <input
          style={{
            width: '100%',
            padding: Icon ? '12px 12px 12px 40px' : '12px',
            border: `1px solid ${error ? safeTheme.error : safeTheme.border}`,
            borderRadius: '8px',
            background: safeTheme.cardBg,
            color: safeTheme.text,
            fontSize: '1rem',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          list={list}
          {...props}
        />
      </div>
      {error && <div style={{ color: safeTheme.error, fontSize: '0.75rem', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

const Select = ({ label, options, theme, ...props }) => {
  const safeTheme = theme || {
    text: '#FFFFFF',
    border: '#333333',
    cardBg: '#111111'
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', color: safeTheme.text, fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>{label}</label>}
      <select
        style={{
          width: '100%',
          padding: '12px',
          border: `1px solid ${safeTheme.border}`,
          borderRadius: '8px',
          background: safeTheme.cardBg,
          color: safeTheme.text,
          fontSize: '1rem',
          boxSizing: 'border-box'
        }}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

const NotificationContainer = ({ notifications, theme }) => {
  const safeTheme = theme || {
    cardBg: '#111111',
    border: '#333333',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0'
  };
  
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={{
            background: safeTheme.cardBg,
            border: `1px solid ${notification.type === 'error' ? safeTheme.error : notification.type === 'success' ? safeTheme.success : safeTheme.warning}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            minWidth: '320px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {notification.type === 'error' && <AlertTriangle size={20} style={{ color: safeTheme.error, marginTop: '2px' }} />}
            {notification.type === 'success' && <CheckCircle size={20} style={{ color: safeTheme.success, marginTop: '2px' }} />}
            {notification.type === 'warning' && <AlertTriangle size={20} style={{ color: safeTheme.warning, marginTop: '2px' }} />}
            <div style={{ flex: 1 }}>
              <div style={{ color: safeTheme.text, fontWeight: '500', marginBottom: '4px' }}>{notification.message}</div>
              {notification.action && <div style={{ color: safeTheme.textSecondary, fontSize: '0.875rem' }}>{notification.action}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdvancedYieldTracker({ onBack }) {
  // Core state
  const [view, setView] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    strain: '',
    processor: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    startMaterial: 'Fresh Frozen',
    finishMaterial: 'Live Rosin',
    startWeight: '',
    finishWeight: '',
    notes: '',
    marketPrice: '',
    processingCost: ''
  });
  
  // Analytics and recommendations
  const analytics = useAnalytics(projects);
  const recommendations = useRecommendations(projects, analytics);
  const { notifications, addNotification } = useNotifications();
  
  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'all',
    strain: 'all',
    processor: 'all',
    minYield: '',
    maxYield: ''
  });
  
  // Load data
  useEffect(() => {
    const savedProjects = localStorage.getItem('advancedYieldProjects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);
  
  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('advancedYieldProjects', JSON.stringify(newProjects));
  };
  
  // Derived data
  const availableFinishMaterials = useMemo(() => 
    Object.keys(PROCESSING_PATHS[formData.startMaterial] || {}), 
    [formData.startMaterial]
  );
  
  const currentPath = PROCESSING_PATHS[formData.startMaterial]?.[formData.finishMaterial];
  
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (filters.strain !== 'all' && project.strain !== filters.strain) return false;
      if (filters.processor !== 'all' && project.processor !== filters.processor) return false;
      if (filters.minYield && parseFloat(project.actualYieldPercent) < parseFloat(filters.minYield)) return false;
      if (filters.maxYield && parseFloat(project.actualYieldPercent) > parseFloat(filters.maxYield)) return false;
      return true;
    });
  }, [projects, filters]);
  
  // Derived data for autocomplete
  const uniqueProjectNames = useMemo(() => [...new Set(projects.map(p => p.projectName))], [projects]);
  const uniqueClients = useMemo(() => [...new Set(projects.map(p => p.client).filter(Boolean))], [projects]);
  const uniqueStrains = useMemo(() => [...new Set(projects.map(p => p.strain).filter(Boolean))], [projects]);
  const uniqueProcessors = useMemo(() => [...new Set(projects.map(p => p.processor).filter(Boolean))], [projects]);
  
  // Event handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'startMaterial') {
      const newFinishOptions = Object.keys(PROCESSING_PATHS[value] || {});
      if (newFinishOptions.length > 0) {
        setFormData(prev => ({ ...prev, finishMaterial: newFinishOptions[0] }));
      }
    }
  };
  
  const calculateProjectMetrics = (project) => {
    const actualYield = parseFloat(project.actualYieldPercent);
    const pathData = PROCESSING_PATHS[project.startMaterial]?.[project.finishMaterial];
    const expectedYield = pathData ? pathData.yield * 100 : 0;
    const variance = actualYield - expectedYield;
    const efficiency = expectedYield > 0 ? (actualYield / expectedYield) * 100 : 100;
    
    const finishPrice = MARKET_PRICES[project.finishMaterial] || 0;
    const startPrice = MARKET_PRICES[project.startMaterial] || 0;
    const revenue = (project.finishWeight * finishPrice) / 28.35; // Convert to oz pricing
    const materialCost = (project.startWeight * startPrice) / 28.35;
    const processingCost = parseFloat(project.processingCost) || (pathData?.cost || 0);
    const totalCost = materialCost + processingCost;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return {
      ...project,
      variance: variance.toFixed(2),
      efficiency: efficiency.toFixed(1),
      revenue: revenue.toFixed(2),
      cost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      margin: margin.toFixed(1)
    };
  };
  
  const handleSaveProject = () => {
    if (!formData.projectName || !formData.startWeight || !formData.finishWeight) {
      addNotification('error', 'Please fill in required fields: Project Name, Start Weight, and Finish Weight');
      return;
    }
    
    const actualYield = (parseFloat(formData.finishWeight) / parseFloat(formData.startWeight)) * 100;
    const newProject = {
      id: Date.now(),
      ...formData,
      startWeight: parseFloat(formData.startWeight),
      finishWeight: parseFloat(formData.finishWeight),
      actualYieldPercent: actualYield.toFixed(2),
      processingCost: parseFloat(formData.processingCost) || 0,
      timestamp: new Date().toISOString()
    };
    
    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    
    // Reset form
    setFormData({
      projectName: '',
      client: '',
      strain: '',
      processor: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      startMaterial: 'Fresh Frozen',
      finishMaterial: 'Live Rosin',
      startWeight: '',
      finishWeight: '',
      notes: '',
      marketPrice: '',
      processingCost: ''
    });
    
    addNotification('success', 'Project saved successfully!', 'View in analytics dashboard');
  };
  
  // Theme
  const theme = isDarkMode ? {
    bg: '#0A0A0A',
    cardBg: '#111111',
    cardBgHover: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#333333',
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  } : {
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBgHover: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text, 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      <NotificationContainer notifications={notifications} theme={theme} />
      
      {/* Header */}
      <header style={{ 
        background: theme.cardBg, 
        borderBottom: `1px solid ${theme.border}`, 
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0, background: theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🧪 Advanced Yield Analytics
            </h1>
            <div style={{ background: theme.accent + '20', color: theme.accent, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500' }}>
              {projects.length} Projects Tracked
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" icon={isDarkMode ? Eye : EyeOff} onClick={() => setIsDarkMode(!isDarkMode)} theme={theme}>
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
            <Button variant="ghost" icon={Settings} onClick={() => setShowAdvanced(!showAdvanced)} theme={theme}>
              Advanced
            </Button>
            <Button variant="secondary" onClick={onBack} theme={theme}>← Back</Button>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}`, padding: '0 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'tracker', label: 'New Project', icon: Plus },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'projects', label: 'Project History', icon: Clock }
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setView(nav.id)}
              style={{
                padding: '16px 24px',
                background: view === nav.id ? theme.accent + '10' : 'transparent',
                color: view === nav.id ? theme.accent : theme.textSecondary,
                border: 'none',
                borderBottom: view === nav.id ? `2px solid ${theme.accent}` : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <nav.icon size={16} />
              {nav.label}
            </button>
          ))}
        </div>
      </nav>
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <MetricCard
                title="Total Projects"
                value={analytics.totalProjects || 0}
                subtitle="Completed extractions"
                icon={Target}
                color={theme.accent}
                theme={theme}
              />
              <MetricCard
                title="Average Yield"
                value={`${analytics.avgYield?.toFixed(1) || 0}%`}
                subtitle="Across all projects"
                icon={TrendingUp}
                trend={analytics.yieldTrend}
                color={theme.success}
                theme={theme}
              />
              <MetricCard
                title="Total Revenue"
                value={`${analytics.totalRevenue?.toFixed(0) || 0}`}
                subtitle="Gross revenue generated"
                icon={DollarSign}
                color={theme.warning}
                theme={theme}
              />
              <MetricCard
                title="Profit Margin"
                value={`${analytics.profitMargin?.toFixed(1) || 0}%`}
                subtitle="Net profitability"
                icon={Award}
                color={analytics.profitMargin > 30 ? theme.success : theme.error}
                theme={theme}
              />
            </div>
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card style={{ marginBottom: '32px' }} theme={theme}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} style={{ color: theme.accent }} />
                  Smart Recommendations
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {recommendations.map((rec, index) => (
                    <div key={index} style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: `1px solid ${rec.type === 'warning' ? theme.warning : rec.type === 'success' ? theme.success : theme.accent}`,
                      background: `${rec.type === 'warning' ? theme.warning : rec.type === 'success' ? theme.success : theme.accent}10`
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{rec.title}</div>
                      <div style={{ color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '8px' }}>{rec.message}</div>
                      <div style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{rec.action}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Quick Analytics Charts */}
            {projects.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <Card theme={theme}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Yield Performance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredProjects.slice(0, 10).reverse().map(p => ({
                      name: new Date(p.endDate).toLocaleDateString(),
                      actual: parseFloat(p.actualYieldPercent),
                      expected: PROCESSING_PATHS[p.startMaterial]?.[p.finishMaterial]?.yield * 100 || 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                      <XAxis dataKey="name" stroke={theme.textSecondary} />
                      <YAxis stroke={theme.textSecondary} />
                      <Tooltip 
                        contentStyle={{ 
                          background: theme.cardBg, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '8px',
                          color: theme.text
                        }} 
                      />
                      <Area type="monotone" dataKey="actual" stroke={theme.success} fill={theme.success + '30'} />
                      <Area type="monotone" dataKey="expected" stroke={theme.accent} fill={theme.accent + '20'} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
                
                <Card theme={theme}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Product Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          projects.reduce((acc, p) => {
                            acc[p.finishMaterial] = (acc[p.finishMaterial] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([material, count]) => ({ name: material, value: count }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.keys(PROCESSING_PATHS).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: theme.cardBg, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '8px',
                          color: theme.text
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}
            
            {/* Recent Projects */}
            {projects.length > 0 && (
              <Card theme={theme}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Recent Projects</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {projects.slice(0, 5).map(project => {
                    const metrics = calculateProjectMetrics(project);
                    return (
                      <div key={project.id} style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        background: theme.cardBgHover,
                        border: `1px solid ${theme.border}`,
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                        alignItems: 'center',
                        gap: '16px'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{project.projectName}</div>
                          <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                            {project.strain} • {project.startMaterial} → {project.finishMaterial}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '600', color: parseFloat(metrics.efficiency) >= 100 ? theme.success : theme.warning }}>
                            {project.actualYieldPercent}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Yield</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '600', color: parseFloat(metrics.margin) > 0 ? theme.success : theme.error }}>
                            ${metrics.profit}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Profit</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '600' }}>{metrics.efficiency}%</div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Efficiency</div>
                        </div>
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => setView('projects')} theme={theme}>
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
        
        {/* New Project Tracker */}
        {view === 'tracker' && (
          <Card theme={theme}>
            {/* Datalists for autocomplete */}
            <datalist id="project-names-list">
              {uniqueProjectNames.map(name => <option key={name} value={name} />)}
            </datalist>
            <datalist id="client-names-list">
              {uniqueClients.map(name => <option key={name} value={name} />)}
            </datalist>
            <datalist id="strain-list">
              {uniqueStrains.map(name => <option key={name} value={name} />)}
            </datalist>
            <datalist id="processor-list">
              {uniqueProcessors.map(name => <option key={name} value={name} />)}
            </datalist>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Plus size={24} style={{ color: theme.accent }} />
              Create New Project
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: showAdvanced ? '1fr 1fr' : '1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: theme.textSecondary }}>Basic Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Input
                    label="Project Name * 💡"
                    value={formData.projectName}
                    onChange={(e) => handleFormChange('projectName', e.target.value)}
                    placeholder="e.g., Premium OG Live Rosin (autocomplete available)"
                    list="project-names-list"
                    theme={theme}
                  />
                  <Input
                    label="Client 💡"
                    value={formData.client}
                    onChange={(e) => handleFormChange('client', e.target.value)}
                    placeholder="e.g., Green Valley Dispensary (autocomplete available)"
                    list="client-names-list"
                    theme={theme}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Input
                    label="Strain 💡"
                    value={formData.strain}
                    onChange={(e) => handleFormChange('strain', e.target.value)}
                    placeholder="e.g., Wedding Cake (autocomplete available)"
                    list="strain-list"
                    theme={theme}
                  />
                  <Input
                    label="Processor 💡"
                    value={formData.processor}
                    onChange={(e) => handleFormChange('processor', e.target.value)}
                    placeholder="e.g., Master Extractor (autocomplete available)"
                    list="processor-list"
                    theme={theme}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    theme={theme}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    theme={theme}
                  />
                </div>
                
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: theme.textSecondary }}>Processing Details</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Select
                    label="Starting Material"
                    value={formData.startMaterial}
                    onChange={(e) => handleFormChange('startMaterial', e.target.value)}
                    options={Object.keys(PROCESSING_PATHS).map(mat => ({ value: mat, label: mat }))}
                    theme={theme}
                  />
                  <Select
                    label="Finished Product"
                    value={formData.finishMaterial}
                    onChange={(e) => handleFormChange('finishMaterial', e.target.value)}
                    options={availableFinishMaterials.map(mat => ({ value: mat, label: mat }))}
                    theme={theme}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Input
                    label="Start Weight (grams) *"
                    type="number"
                    step="0.1"
                    value={formData.startWeight}
                    onChange={(e) => handleFormChange('startWeight', e.target.value)}
                    placeholder="e.g., 4536"
                    theme={theme}
                  />
                  <Input
                    label="Finish Weight (grams) *"
                    type="number"
                    step="0.1"
                    value={formData.finishWeight}
                    onChange={(e) => handleFormChange('finishWeight', e.target.value)}
                    placeholder="e.g., 272"
                    theme={theme}
                  />
                </div>
                
                {showAdvanced && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <Input
                        label="Processing Cost ($)"
                        type="number"
                        step="0.01"
                        value={formData.processingCost}
                        onChange={(e) => handleFormChange('processingCost', e.target.value)}
                        placeholder="e.g., 250"
                        theme={theme}
                      />
                      <Input
                        label="Market Price ($/oz)"
                        type="number"
                        step="0.01"
                        value={formData.marketPrice}
                        onChange={(e) => handleFormChange('marketPrice', e.target.value)}
                        placeholder={`Suggested: ${MARKET_PRICES[formData.finishMaterial] || 0}`}
                        theme={theme}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', color: theme.text, fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                        placeholder="Add any processing notes, observations, or special conditions..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          background: theme.cardBg,
                          color: theme.text,
                          fontSize: '1rem',
                          minHeight: '80px',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Real-time Preview */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: theme.textSecondary }}>Live Preview & Analysis</h3>
                
                {currentPath && (
                  <Card style={{ background: theme.gradient, color: 'white', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>Process Intelligence</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Expected Yield</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{(currentPath.yield * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Difficulty</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>{currentPath.difficulty}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Est. Time</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>{currentPath.time}h</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Quality Score</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>{currentPath.quality}/100</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', opacity: 0.9, fontStyle: 'italic' }}>
                      💡 {currentPath.tip}
                    </div>
                  </Card>
                )}
                
                {formData.startWeight && formData.finishWeight && (
                  <Card style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Calculated Results</h4>
                    
                    {(() => {
                      const actualYield = (parseFloat(formData.finishWeight) / parseFloat(formData.startWeight)) * 100;
                      const expectedYield = currentPath ? currentPath.yield * 100 : 0;
                      const variance = actualYield - expectedYield;
                      const efficiency = expectedYield > 0 ? (actualYield / expectedYield) * 100 : 100;
                      
                      return (
                        <div style={{ display: 'grid', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ textAlign: 'center', padding: '12px', background: theme.cardBgHover, borderRadius: '8px' }}>
                              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: actualYield >= expectedYield ? theme.success : theme.warning }}>
                                {actualYield.toFixed(2)}%
                              </div>
                              <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>Actual Yield</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '12px', background: theme.cardBgHover, borderRadius: '8px' }}>
                              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: variance >= 0 ? theme.success : theme.error }}>
                                {variance > 0 ? '+' : ''}{variance.toFixed(2)}%
                              </div>
                              <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>vs Expected</div>
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '16px', background: efficiency >= 100 ? theme.success + '20' : theme.warning + '20', borderRadius: '8px', border: `1px solid ${efficiency >= 100 ? theme.success : theme.warning}` }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: efficiency >= 100 ? theme.success : theme.warning }}>
                              {efficiency.toFixed(0)}%
                            </div>
                            <div style={{ fontSize: '0.9rem', color: theme.text, fontWeight: '500' }}>Process Efficiency</div>
                            <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: '4px' }}>
                              {efficiency >= 110 ? 'Outstanding Performance!' : 
                               efficiency >= 100 ? 'Meeting Expectations' : 
                               efficiency >= 90 ? 'Slight Underperformance' : 
                               'Needs Optimization'}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Card>
                )}
                
                {/* Financial Preview */}
                {formData.finishWeight && showAdvanced && (
                  <Card theme={theme}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Financial Projection</h4>
                    {(() => {
                      const finishOz = parseFloat(formData.finishWeight) / 28.35;
                      const marketPrice = parseFloat(formData.marketPrice) || MARKET_PRICES[formData.finishMaterial] || 0;
                      const revenue = finishOz * marketPrice;
                      const materialCost = (parseFloat(formData.startWeight) / 28.35) * (MARKET_PRICES[formData.startMaterial] || 0);
                      const processingCost = parseFloat(formData.processingCost) || (currentPath?.cost || 0);
                      const totalCost = materialCost + processingCost;
                      const profit = revenue - totalCost;
                      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
                      
                      return (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: theme.textSecondary }}>Revenue:</span>
                            <span style={{ fontWeight: '600' }}>${revenue.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: theme.textSecondary }}>Total Costs:</span>
                            <span style={{ fontWeight: '600' }}>${totalCost.toFixed(2)}</span>
                          </div>
                          <hr style={{ border: `1px solid ${theme.border}`, margin: '8px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                            <span style={{ fontWeight: '600' }}>Net Profit:</span>
                            <span style={{ fontWeight: 'bold', color: profit >= 0 ? theme.success : theme.error }}>
                              ${profit.toFixed(2)} ({margin.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </Card>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" theme={theme} onClick={() => {
                setFormData({
                  projectName: '',
                  client: '',
                  strain: '',
                  processor: '',
                  startDate: new Date().toISOString().slice(0, 10),
                  endDate: new Date().toISOString().slice(0, 10),
                  startMaterial: 'Fresh Frozen',
                  finishMaterial: 'Live Rosin',
                  startWeight: '',
                  finishWeight: '',
                  notes: '',
                  marketPrice: '',
                  processingCost: ''
                });
              }}>
                <X size={16} />
                Clear Form
              </Button>
              <Button onClick={handleSaveProject} disabled={!formData.projectName || !formData.startWeight || !formData.finishWeight} theme={theme}>
                <Save size={16} />
                Save Project
              </Button>
            </div>
          </Card>
        )}
        
        {/* Analytics View */}
        {view === 'analytics' && projects.length > 0 && (
          <div>
            {/* Filters */}
            <Card style={{ marginBottom: '24px' }} theme={theme}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={16} style={{ color: theme.textSecondary }} />
                  <span style={{ fontWeight: '500' }}>Filters:</span>
                </div>
                
                <Select
                  options={[
                    { value: 'all', label: 'All Strains' },
                    ...Array.from(new Set(projects.map(p => p.strain).filter(Boolean))).map(strain => ({ value: strain, label: strain }))
                  ]}
                  value={filters.strain}
                  onChange={(e) => setFilters(prev => ({ ...prev, strain: e.target.value }))}
                  style={{ minWidth: '150px' }}
                  theme={theme}
                />
                
                <Select
                  options={[
                    { value: 'all', label: 'All Processors' },
                    ...Array.from(new Set(projects.map(p => p.processor).filter(Boolean))).map(proc => ({ value: proc, label: proc }))
                  ]}
                  value={filters.processor}
                  onChange={(e) => setFilters(prev => ({ ...prev, processor: e.target.value }))}
                  style={{ minWidth: '150px' }}
                  theme={theme}
                />
                
                <Input
                  placeholder="Min Yield %"
                  type="number"
                  value={filters.minYield}
                  onChange={(e) => setFilters(prev => ({ ...prev, minYield: e.target.value }))}
                  style={{ width: '120px' }}
                  theme={theme}
                />
                
                <Input
                  placeholder="Max Yield %"
                  type="number"
                  value={filters.maxYield}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxYield: e.target.value }))}
                  style={{ width: '120px' }}
                  theme={theme}
                />
                
                <Button variant="ghost" onClick={() => setFilters({ dateRange: 'all', strain: 'all', processor: 'all', minYield: '', maxYield: '' })} theme={theme}>
                  Clear All
                </Button>
              </div>
            </Card>
            
            {/* Advanced Charts */}
            <div style={{ display: 'grid', gap: '24px' }}>
              <Card theme={theme}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Yield vs. Expected Performance</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={filteredProjects.map(p => ({
                    x: PROCESSING_PATHS[p.startMaterial]?.[p.finishMaterial]?.yield * 100 || 0,
                    y: parseFloat(p.actualYieldPercent),
                    name: p.projectName,
                    strain: p.strain
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                    <XAxis dataKey="x" name="Expected Yield %" stroke={theme.textSecondary} />
                    <YAxis dataKey="y" name="Actual Yield %" stroke={theme.textSecondary} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        background: theme.cardBg, 
                        border: `1px solid ${theme.border}`, 
                        borderRadius: '8px',
                        color: theme.text
                      }} 
                    />
                    <Scatter data={filteredProjects.map(p => ({
                      x: PROCESSING_PATHS[p.startMaterial]?.[p.finishMaterial]?.yield * 100 || 0,
                      y: parseFloat(p.actualYieldPercent)
                    }))} fill={theme.accent} />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card theme={theme}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Profitability by Product</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(
                      filteredProjects.reduce((acc, p) => {
                        const metrics = calculateProjectMetrics(p);
                        if (!acc[p.finishMaterial]) acc[p.finishMaterial] = { total: 0, count: 0 };
                        acc[p.finishMaterial].total += parseFloat(metrics.profit);
                        acc[p.finishMaterial].count += 1;
                        return acc;
                      }, {})
                    ).map(([product, data]) => ({
                      product,
                      avgProfit: data.total / data.count,
                      projects: data.count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                      <XAxis dataKey="product" stroke={theme.textSecondary} />
                      <YAxis stroke={theme.textSecondary} />
                      <Tooltip 
                        contentStyle={{ 
                          background: theme.cardBg, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '8px',
                          color: theme.text
                        }} 
                      />
                      <Bar dataKey="avgProfit" fill={theme.success} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                
                <Card theme={theme}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Processing Time Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredProjects.map(p => ({
                      name: p.projectName.slice(0, 15) + '...',
                      duration: Math.max(1, (new Date(p.endDate) - new Date(p.startDate)) / (1000 * 60 * 60 * 24) + 1),
                      yield: parseFloat(p.actualYieldPercent)
                    })).slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                      <XAxis dataKey="name" stroke={theme.textSecondary} />
                      <YAxis stroke={theme.textSecondary} />
                      <Tooltip 
                        contentStyle={{ 
                          background: theme.cardBg, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '8px',
                          color: theme.text
                        }} 
                      />
                      <Bar dataKey="duration" fill={theme.warning} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {/* Project History */}
        {view === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Project History</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="secondary" icon={Download} theme={theme}>Export Data</Button>
                <Button variant="secondary" icon={Upload} theme={theme}>Import Data</Button>
              </div>
            </div>
            
            {projects.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '48px' }} theme={theme}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>No Projects Yet</h3>
                <p style={{ color: theme.textSecondary, marginBottom: '24px' }}>Start tracking your extraction projects to see detailed analytics and insights.</p>
                <Button onClick={() => setView('tracker')} theme={theme}>Create Your First Project</Button>
              </Card>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {projects.map(project => {
                  const metrics = calculateProjectMetrics(project);
                  return (
                    <Card key={project.id} style={{ 
                      transition: 'all 0.2s ease',
                      ':hover': { transform: 'translateY(-2px)' }
                    }} theme={theme}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '24px', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px' }}>{project.projectName}</h4>
                          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                            <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                              📅 {new Date(project.endDate).toLocaleDateString()}
                            </span>
                            <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                              👤 {project.client || 'Internal'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ 
                              background: theme.accent + '20', 
                              color: theme.accent, 
                              padding: '4px 8px', 
                              borderRadius: '12px', 
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {project.strain || 'Unknown Strain'}
                            </span>
                            <span style={{ 
                              background: DIFFICULTY_COLORS[PROCESSING_PATHS[project.startMaterial]?.[project.finishMaterial]?.difficulty || 'Beginner'] + '20', 
                              color: DIFFICULTY_COLORS[PROCESSING_PATHS[project.startMaterial]?.[project.finishMaterial]?.difficulty || 'Beginner'], 
                              padding: '4px 8px', 
                              borderRadius: '12px', 
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {project.startMaterial} → {project.finishMaterial}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 'bold', 
                            color: parseFloat(metrics.efficiency) >= 100 ? theme.success : theme.warning,
                            marginBottom: '4px'
                          }}>
                            {project.actualYieldPercent}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                            Yield ({metrics.variance > 0 ? '+' : ''}{metrics.variance}% vs exp.)
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            color: parseFloat(metrics.profit) > 0 ? theme.success : theme.error,
                            marginBottom: '4px'
                          }}>
                            ${metrics.profit}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                            Profit ({metrics.margin}% margin)
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>
                            {metrics.efficiency}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                            Efficiency
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '50%', 
                            background: `conic-gradient(${theme.accent} ${parseFloat(metrics.efficiency) * 3.6}deg, ${theme.border} 0deg)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            margin: '0 auto'
                          }}>
                            <div style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '50%', 
                              background: theme.cardBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {Math.round(parseFloat(metrics.efficiency))}%
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Edit3}
                            theme={theme}
                            onClick={() => {
                              // Pre-fill form with project data for editing
                              setFormData({
                                projectName: project.projectName + ' (Copy)',
                                client: project.client,
                                strain: project.strain,
                                processor: project.processor,
                                startDate: project.startDate,
                                endDate: project.endDate,
                                startMaterial: project.startMaterial,
                                finishMaterial: project.finishMaterial,
                                startWeight: project.startWeight.toString(),
                                finishWeight: project.finishWeight.toString(),
                                notes: project.notes || '',
                                marketPrice: '',
                                processingCost: project.processingCost?.toString() || ''
                              });
                              setView('tracker');
                              addNotification('info', 'Project data loaded for editing');
                            }}
                          >
                            Copy
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2}
                            theme={theme}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this project?')) {
                                const updatedProjects = projects.filter(p => p.id !== project.id);
                                saveProjects(updatedProjects);
                                addNotification('success', 'Project deleted successfully');
                              }
                            }}
                            style={{ color: theme.error }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      {/* Expandable Details */}
                      {project.notes && (
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '16px', 
                          background: theme.cardBgHover, 
                          borderRadius: '8px',
                          borderTop: `1px solid ${theme.border}`
                        }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px', color: theme.textSecondary }}>
                            📝 Notes:
                          </div>
                          <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {project.notes}
                          </div>
                        </div>
                      )}
                      
                      {/* Processing Details */}
                      <div style={{ 
                        marginTop: '16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        padding: '16px',
                        background: theme.cardBgHover,
                        borderRadius: '8px',
                        borderTop: `1px solid ${theme.border}`
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Start Material</div>
                          <div style={{ fontWeight: '600' }}>{project.startWeight}g {project.startMaterial}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Finish Material</div>
                          <div style={{ fontWeight: '600' }}>{project.finishWeight}g {project.finishMaterial}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Duration</div>
                          <div style={{ fontWeight: '600' }}>
                            {Math.max(1, Math.round((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24) + 1))} days
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>Processor</div>
                          <div style={{ fontWeight: '600' }}>{project.processor || 'Not specified'}</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Empty state for analytics when no projects */}
        {view === 'analytics' && projects.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '48px' }} theme={theme}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📈</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>No Data to Analyze</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '24px' }}>
              Create some projects first to unlock powerful analytics and insights.
            </p>
            <Button onClick={() => setView('tracker')} theme={theme}>Start Tracking Projects</Button>
          </Card>
        )}
      </main>
      
      {/* Floating Action Button for Quick Add */}
      {view !== 'tracker' && (
        <button
          onClick={() => setView('tracker')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: theme.gradient,
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            zIndex: 999
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <Plus size={24} />
        </button>
      )}
      
      {/* Custom Styles */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
}
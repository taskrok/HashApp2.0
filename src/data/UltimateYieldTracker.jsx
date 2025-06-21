import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, DollarSign, 
  Users, Award, AlertTriangle, CheckCircle, Clock, Target, Zap, Filter, 
  Download, Upload, Settings, Eye, EyeOff, Plus, Trash2, Edit3, Save, 
  X, ChevronRight, ChevronDown, Search, Bell, Moon, Sun, Menu, Home,
  Activity, Database, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Sparkles, Layers, Maximize2, Minimize2, Command, Star, Trophy,
  Flame, Droplets, Leaf, Beaker, Brain, Robot, MessageSquare,
  Share2, Copy, RotateCcw, Play, Pause, FastForward, Rewind,
  Volume2, VolumeX, Mic, MicOff, Camera, Image, FileText,
  Bookmark, Heart, ThumbsUp, Coffee, Timer, MapPin, Wifi,
  WifiOff, Battery, BatteryLow, Smartphone, Monitor, Tablet
} from 'lucide-react';

const UltimateYieldTracker = () => {
  // Core State Management
  const [view, setView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);

  // Demo Data with Rich Information
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "Premium OG Live Rosin Batch #001",
      strain: "Wedding Cake",
      processor: "Master Extractor",
      startMaterial: "Fresh Frozen",
      finishMaterial: "Live Rosin",
      startWeight: 4536,
      finishWeight: 272,
      actualYieldPercent: "6.0",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      client: "Green Valley Dispensary",
      profit: 1850,
      efficiency: 102,
      status: "completed",
      priority: "high",
      tags: ["premium", "og", "rosin"],
      processingTime: 48,
      difficulty: "expert",
      temperature: 180,
      pressure: 1200,
      color: "#10B981",
      avatar: "🔥",
      collaboration: ["Alice", "Bob"],
      achievements: ["First Timer", "Efficiency Master"],
      notes: "Exceptional quality with perfect color and consistency. Customer extremely satisfied.",
      images: 3,
      qualityScore: 95,
      marketDemand: "high",
      profitMargin: 42.3,
      equipment: ["Rosin Press Pro", "Freeze Dryer XL"],
      environmentalFactors: { humidity: 45, temperature: 72 },
      customerRating: 4.9,
      repeatCustomer: true
    },
    {
      id: 2,
      projectName: "Blue Dream Hash Rosin Extract",
      strain: "Blue Dream",
      processor: "Elite Labs",
      startMaterial: "Bubble Hash",
      finishMaterial: "Hash Rosin",
      startWeight: 1000,
      finishWeight: 180,
      actualYieldPercent: "18.0",
      startDate: "2024-01-18",
      endDate: "2024-01-19",
      client: "Cannabis Co.",
      profit: 920,
      efficiency: 115,
      status: "completed",
      priority: "medium",
      tags: ["blue-dream", "hash", "premium"],
      processingTime: 24,
      difficulty: "intermediate",
      temperature: 175,
      pressure: 1000,
      color: "#3B82F6",
      avatar: "💙",
      collaboration: ["Charlie"],
      achievements: ["Speed Runner"],
      notes: "Fast turnaround with excellent results. Blue Dream always performs well.",
      images: 2,
      qualityScore: 88,
      marketDemand: "medium",
      profitMargin: 38.7,
      equipment: ["Hash Press Standard"],
      environmentalFactors: { humidity: 50, temperature: 70 },
      customerRating: 4.7,
      repeatCustomer: true
    },
    {
      id: 3,
      projectName: "Gelato Live Resin Production",
      strain: "Gelato #33",
      processor: "Extraction Ninja",
      startMaterial: "Fresh Frozen",
      finishMaterial: "Live Resin",
      startWeight: 2000,
      finishWeight: 140,
      actualYieldPercent: "7.0",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      client: "Premium Dispensary",
      profit: 1200,
      efficiency: 98,
      status: "in-progress",
      priority: "high",
      tags: ["gelato", "live-resin", "premium"],
      processingTime: 36,
      difficulty: "expert",
      temperature: 185,
      pressure: 1500,
      color: "#8B5CF6",
      avatar: "🍨",
      collaboration: ["Diana", "Eve"],
      achievements: [],
      notes: "Currently in final stages. Looking very promising with great terp retention.",
      images: 4,
      qualityScore: 92,
      marketDemand: "very-high",
      profitMargin: 45.2,
      equipment: ["Resin Extractor Pro", "Terp Saver 3000"],
      environmentalFactors: { humidity: 42, temperature: 68 },
      customerRating: 0,
      repeatCustomer: false
    }
  ]);

  // Advanced State for New Features
  const [achievements, setAchievements] = useState([
    { id: 1, name: "First Timer", description: "Complete your first project", earned: true, icon: "🏆" },
    { id: 2, name: "Efficiency Master", description: "Achieve >100% efficiency", earned: true, icon: "⚡" },
    { id: 3, name: "Speed Runner", description: "Complete project in <24h", earned: true, icon: "🏃" },
    { id: 4, name: "Quality Guru", description: "Achieve >90% quality score", earned: false, icon: "✨" },
    { id: 5, name: "Profit King", description: "Generate >$2000 profit", earned: false, icon: "💰" }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      type: "prediction",
      title: "Yield Optimization Opportunity",
      message: "Based on your Wedding Cake extractions, adjusting temperature to 175°F could increase yield by 0.3%",
      confidence: 85,
      action: "Optimize Settings",
      icon: Brain
    },
    {
      type: "market",
      title: "Market Demand Alert",
      message: "Live Resin demand is up 23% this week. Consider prioritizing resin projects.",
      confidence: 92,
      action: "View Market Data",
      icon: TrendingUp
    },
    {
      type: "equipment",
      title: "Maintenance Reminder",
      message: "Rosin Press Pro is due for maintenance in 3 days based on usage patterns.",
      confidence: 98,
      action: "Schedule Maintenance",
      icon: Settings
    }
  ]);

  // Advanced Theme System
  const themes = {
    dark: {
      bg: 'from-slate-950 via-blue-950 to-slate-950',
      cardBg: 'from-slate-900/90 to-slate-800/90',
      cardBorder: 'border-slate-700/50',
      text: ' style={{ color: textColor }}',
      textSecondary: 'text-slate-400',
      accent: 'from-blue-500 to-purple-600',
      success: 'text-emerald-400',
      warning: 'text-amber-400',
      error: 'text-red-400',
      glass: 'backdrop-blur-xl bg-white/5',
      glow: 'shadow-2xl shadow-blue-500/20',
      primary: 'bg-blue-600',
      secondary: 'bg-slate-600'
    },
    light: {
      bg: 'from-blue-50 via-white to-purple-50',
      cardBg: 'from-white/90 to-blue-50/90',
      cardBorder: 'border-blue-200/50',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      accent: 'from-blue-500 to-purple-600',
      success: 'text-emerald-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      glass: 'backdrop-blur-xl bg-black/5',
      glow: 'shadow-2xl shadow-blue-500/10',
      primary: 'bg-blue-500',
      secondary: 'bg-slate-400'
    },
    cannabis: {
      bg: 'from-green-950 via-emerald-900 to-green-950',
      cardBg: 'from-green-900/90 to-emerald-800/90',
      cardBorder: 'border-green-700/50',
      text: ' style={{ color: textColor }}',
      textSecondary: 'text-green-400',
      accent: 'from-green-500 to-emerald-600',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      glass: 'backdrop-blur-xl bg-white/5',
      glow: 'shadow-2xl shadow-green-500/20',
      primary: 'bg-green-600',
      secondary: 'bg-emerald-600'
    }
  };

  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];

  // Advanced Hooks and Effects
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Notification System
  const addNotification = useCallback((type, title, message, action) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message, action }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Advanced Components

  // Command Palette
  const CommandPalette = () => {
    const commands = [
      { id: 'new-project', label: 'New Project', icon: Plus, action: () => setView('tracker') },
      { id: 'dashboard', label: 'Go to Dashboard', icon: Home, action: () => setView('dashboard') },
      { id: 'analytics', label: 'View Analytics', icon: BarChart3, action: () => setView('analytics') },
      { id: 'toggle-theme', label: 'Toggle Dark Mode', icon: Moon, action: () => setIsDarkMode(!isDarkMode) },
      { id: 'export-data', label: 'Export Data', icon: Download, action: () => addNotification('success', 'Export Started', 'Your data is being prepared') },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const filteredCommands = commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!commandPaletteOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
        <div className={`w-full max-w-lg ${theme.glass} ${theme.cardBorder} border rounded-2xl shadow-2xl`}>
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <Command size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Type a command..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent  style={{ color: textColor }} placeholder-slate-400 outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.map((command) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    setCommandPaletteOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors"
                >
                  <Icon size={16} className="text-slate-400" />
                  <span className={theme.text}>{command.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Advanced Glass Card with animations
  const GlassCard = ({ children, className = "", hover = true, glow = false, gradient = false, onClick, selected = false }) => (
    <div 
      onClick={onClick}
      className={`
        ${theme.glass} ${theme.cardBorder} border rounded-2xl p-6
        ${hover ? 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer' : ''}
        ${glow ? theme.glow : 'shadow-lg'}
        ${gradient ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10' : ''}
        ${selected ? 'ring-2 ring-blue-500/50' : ''}
        transition-all duration-300 group
        ${className}
      `}
    >
      {children}
    </div>
  );

  // Enhanced Metric Card with Advanced Animations
  const MetricCard = ({ title, value, change, icon: Icon, trend, color = "blue", sparkline, target, onClick }) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-emerald-500 to-teal-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-red-500',
      yellow: 'from-yellow-500 to-orange-500'
    };

    return (
      <GlassCard className="group relative overflow-hidden" glow hover onClick={onClick}>
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Sparkline background */}
        {sparkline && (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <path
                d={`M 0,${100} ${sparkline.map((point, i) => `L ${(i / (sparkline.length - 1)) * 100},${100 - point}`).join(' ')}`}
                fill="none"
                stroke={`url(#${color}Gradient)`}
                strokeWidth="2"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id={`${color}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} bg-opacity-20 group-hover:scale-110 transition-transform duration-200`}>
              <Icon size={24} className={`text-${color}-400`} />
            </div>
            {trend !== undefined && (
              <div className={`flex items-center space-x-1 ${trend > 0 ? theme.success : theme.error}`}>
                {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="text-sm font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-bold ${theme.text} group-hover:scale-105 transition-transform duration-200`}>
              {value}
            </h3>
            <p className={`text-sm ${theme.textSecondary}`}>{title}</p>
            {change && (
              <p className="text-xs text-slate-500">{change}</p>
            )}
            {target && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((parseFloat(value.replace(/[^\d.-]/g, '')) / target) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`bg-gradient-to-r ${colors[color]} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min((parseFloat(value.replace(/[^\d.-]/g, '')) / target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    );
  };

  // AI Insights Panel
  const AIInsightsPanel = () => (
    <GlassCard className="space-y-4" glow>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain size={20} className=" style={{ color: textColor }}" />
          </div>
          <div>
            <h3 className={`font-bold ${theme.text}`}>AI Insights</h3>
            <p className={`text-sm ${theme.textSecondary}`}>Powered by YieldGPT</p>
          </div>
        </div>
        <button 
          onClick={() => setAiInsightsEnabled(!aiInsightsEnabled)}
          className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-colors`}
        >
          {aiInsightsEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      
      {aiInsightsEnabled && (
        <div className="space-y-3">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className={`p-3 rounded-xl ${theme.glass} border ${theme.cardBorder} hover:scale-[1.01] transition-all duration-200`}>
                <div className="flex items-start space-x-3">
                  <Icon size={16} className="text-blue-400 mt-1" />
                  <div className="flex-1">
                    <h4 className={`font-medium ${theme.text} text-sm`}>{insight.title}</h4>
                    <p className={`text-xs ${theme.textSecondary} mt-1`}>{insight.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${theme.textSecondary}`}>
                        {insight.confidence}% confidence
                      </span>
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        {insight.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );

  // Project Card with Advanced Features
  const ProjectCard = ({ project, viewMode = 'grid' }) => {
    const isSelected = selectedProjects.includes(project.id);
    
    const StatusBadge = ({ status }) => {
      const statusConfig = {
        'completed': { color: 'bg-emerald-500', text: 'Completed', icon: CheckCircle },
        'in-progress': { color: 'bg-blue-500', text: 'In Progress', icon: Clock },
        'pending': { color: 'bg-yellow-500', text: 'Pending', icon: Timer }
      };
      
      const config = statusConfig[status];
      const Icon = config.icon;
      
      return (
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color}  style={{ color: textColor }} text-xs font-medium`}>
          <Icon size={12} />
          <span>{config.text}</span>
        </div>
      );
    };

    if (viewMode === 'list') {
      return (
        <GlassCard 
          className="p-4"
          hover
          selected={isSelected}
          onClick={() => {
            if (isSelected) {
              setSelectedProjects(prev => prev.filter(id => id !== project.id));
            } else {
              setSelectedProjects(prev => [...prev, project.id]);
            }
          }}
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg">
                  {project.avatar}
                </div>
                <div>
                  <h4 className={`font-semibold ${theme.text}`}>{project.projectName}</h4>
                  <p className={`text-sm ${theme.textSecondary}`}>{project.strain}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <StatusBadge status={project.status} />
            </div>
            <div className="col-span-2 text-center">
              <p className={`font-bold ${project.efficiency >= 100 ? theme.success : theme.warning}`}>
                {project.actualYieldPercent}%
              </p>
              <p className={`text-xs ${theme.textSecondary}`}>Yield</p>
            </div>
            <div className="col-span-2 text-center">
              <p className={`font-bold ${theme.success}`}>${project.profit}</p>
              <p className={`text-xs ${theme.textSecondary}`}>Profit</p>
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <button className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-colors`}>
                <Edit3 size={16} />
              </button>
              <button className={`p-2 rounded-lg ${theme.textSecondary} hover:text-red-400 transition-colors`}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </GlassCard>
      );
    }

    return (
      <GlassCard 
        className="space-y-4 group"
        hover
        glow
        selected={isSelected}
        onClick={() => {
          if (isSelected) {
            setSelectedProjects(prev => prev.filter(id => id !== project.id));
          } else {
            setSelectedProjects(prev => [...prev, project.id]);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
              {project.avatar}
            </div>
            <div>
              <h4 className={`font-bold ${theme.text} group-hover:text-blue-400 transition-colors`}>
                {project.projectName}
              </h4>
              <p className={`text-sm ${theme.textSecondary}`}>{project.strain}</p>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl">
            <p className={`text-2xl font-bold ${project.efficiency >= 100 ? theme.success : theme.warning}`}>
              {project.actualYieldPercent}%
            </p>
            <p className={`text-xs ${theme.textSecondary}`}>Yield</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
            <p className={`text-2xl font-bold ${theme.success}`}>${project.profit}</p>
            <p className={`text-xs ${theme.textSecondary}`}>Profit</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-lg text-slate-400 hover: style={{ color: textColor }} transition-colors">
              <Heart size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover: style={{ color: textColor }} transition-colors">
              <Share2 size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover: style={{ color: textColor }} transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {project.achievements.length > 0 && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
            <Trophy size={14} className="text-yellow-400" />
            <span className={`text-xs ${theme.textSecondary}`}>
              {project.achievements.join(', ')}
            </span>
          </div>
        )}
      </GlassCard>
    );
  };

  // Enhanced Sidebar with Themes
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
      { id: 'tracker', label: 'New Project', icon: Plus, badge: 'New' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
      { id: 'projects', label: 'Projects', icon: Database, badge: projects.length },
      { id: 'insights', label: 'AI Insights', icon: Brain, badge: aiInsights.length },
      { id: 'achievements', label: 'Achievements', icon: Trophy, badge: achievements.filter(a => a.earned).length }
    ];

    return (
      <div className={`
        ${sidebarCollapsed ? 'w-20' : 'w-72'} 
        ${theme.glass} ${theme.cardBorder} border-r
        fixed left-0 top-0 h-full z-50 transition-all duration-300
        backdrop-blur-xl overflow-y-auto
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf size={24} className=" style={{ color: textColor }}" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-xl font-bold ${theme.text} bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent`}>
                  YieldMaster Pro
                </h1>
                <p className={`text-sm ${theme.textSecondary}`}>Advanced Cannabis Analytics</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-emerald-400 shadow-lg border border-emerald-500/30' 
                      : `${theme.textSecondary} hover:${theme.text} hover:bg-white/5`
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className={isActive ? 'text-emerald-400' : ''} />
                    {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <h4 className={`font-medium ${theme.text} mb-2`}>Theme</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(themes).map(themeName => (
                    <button
                      key={themeName}
                      onClick={() => setCurrentTheme(themeName)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentTheme === themeName 
                          ? 'ring-2 ring-blue-400' 
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${
                        themeName === 'dark' ? 'bg-slate-800' :
                        themeName === 'light' ? 'bg-white border border-slate-200' :
                        'bg-green-600'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                <span className={`text-sm ${theme.textSecondary}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              {realtimeUpdates && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                  <span className="text-xs text-blue-400">Live</span>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full p-3 rounded-xl ${theme.textSecondary} hover:${theme.text} hover:bg-white/5 transition-all duration-200 flex items-center justify-center`}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
    );
  };

  // Enhanced Header with Search and Quick Actions
  const Header = () => (
    <div className={`
      ${theme.glass} ${theme.cardBorder} border-b
      fixed top-0 right-0 left-${sidebarCollapsed ? '20' : '72'} h-16 z-40
      flex items-center justify-between px-6 backdrop-blur-xl transition-all duration-300
    `}>
      <div className="flex items-center space-x-4">
        <h2 className={`text-xl font-bold ${theme.text} capitalize flex items-center space-x-2`}>
          <span>{view === 'tracker' ? 'New Project' : view.replace('-', ' ')}</span>
          {view === 'dashboard' && realtimeUpdates && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-400">Live</span>
            </div>
          )}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 w-64 ${theme.glass} ${theme.cardBorder} border rounded-xl ${theme.text} placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover: style={{ color: textColor }}"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className={`p-2 rounded-xl ${theme.textSecondary} hover:${theme.text} hover:bg-white/5 transition-all duration-200 flex items-center space-x-2`}
          title="Command Palette (⌘K)"
        >
          <Command size={16} />
          <span className="text-xs">⌘K</span>
        </button>

        <button className={`p-2 rounded-xl ${theme.textSecondary} hover:${theme.text} hover:bg-white/5 transition-all duration-200 relative`}>
          <Bell size={16} />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs  style={{ color: textColor }}">{notifications.length}</span>
            </div>
          )}
        </button>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-xl ${theme.textSecondary} hover:${theme.text} hover:bg-white/5 transition-all duration-200`}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold  style={{ color: textColor }}">M</span>
          </div>
          <ChevronDown size={14} className={theme.textSecondary} />
        </div>
      </div>
    </div>
  );

  // Notification System Component
  const NotificationSystem = () => (
    <div className="fixed top-20 right-6 z-50 space-y-3">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${theme.glass} ${theme.cardBorder} border rounded-xl p-4 min-w-80 shadow-2xl animate-slide-in`}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              notification.type === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={16} /> :
               notification.type === 'error' ? <AlertTriangle size={16} /> :
               <Bell size={16} />}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${theme.text}`}>{notification.title}</h4>
              <p className={`text-sm ${theme.textSecondary} mt-1`}>{notification.message}</p>
              {notification.action && (
                <button className="text-sm text-blue-400 hover:text-blue-300 mt-2">
                  {notification.action}
                </button>
              )}
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className={`text-slate-400 hover: style={{ color: textColor }} transition-colors`}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Enhanced Dashboard View
  const DashboardView = () => {
    const metrics = [
      { 
        title: 'Total Revenue', 
        value: '$47,280', 
        change: '+18% from last month', 
        icon: DollarSign, 
        trend: 18, 
        color: 'green',
        sparkline: [20, 35, 25, 40, 35, 50, 45, 55],
        target: 50000
      },
      { 
        title: 'Active Projects', 
        value: '12', 
        change: '5 completed this week', 
        icon: Activity, 
        trend: 25, 
        color: 'blue',
        sparkline: [8, 10, 9, 12, 11, 14, 12, 12],
        target: 15
      },
      { 
        title: 'Avg Yield', 
        value: '7.2%', 
        change: '+0.5% improvement', 
        icon: TrendingUp, 
        trend: 7, 
        color: 'purple',
        sparkline: [6.5, 6.8, 7.0, 6.9, 7.1, 7.3, 7.2, 7.2],
        target: 8
      },
      { 
        title: 'Efficiency Score', 
        value: '96%', 
        change: 'Above industry average', 
        icon: Target, 
        trend: 12, 
        color: 'orange',
        sparkline: [85, 88, 92, 94, 95, 96, 96, 96],
        target: 100
      }
    ];

    return (
      <div className="space-y-8">
        {/* Hero Section with Live Data */}
        <div className="relative">
          <GlassCard className="text-center py-16" glow gradient>
            <div className="relative z-10">
              <h1 className={`text-5xl font-bold ${theme.text} mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent`}>
                Welcome back, Extract Master
              </h1>
              <p className={`text-xl ${theme.textSecondary} mb-8`}>
                Your cannabis extraction empire is thriving with precision and innovation
              </p>
              <div className="flex justify-center space-x-6">
                <button 
                  onClick={() => setView('tracker')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-2xl flex items-center space-x-3"
                >
                  <Plus size={24} />
                  <span>New Extraction</span>
                </button>
                <button 
                  onClick={() => setView('analytics')}
                  className={`px-8 py-4 ${theme.glass} ${theme.cardBorder} border rounded-2xl font-semibold ${theme.text} hover:scale-105 transition-all duration-200 flex items-center space-x-3`}
                >
                  <BarChart3 size={24} />
                  <span>Deep Analytics</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index} 
              {...metric} 
              onClick={() => setView('analytics')}
            />
          ))}
        </div>

        {/* AI Insights and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIInsightsPanel />
          </div>
          <div className="space-y-6">
            {/* Quick Achievement */}
            <GlassCard className="text-center" glow>
              <div className="text-4xl mb-2">🏆</div>
              <h3 className={`font-bold ${theme.text} mb-2`}>Efficiency Master</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                You've achieved 102% efficiency on your last 3 projects!
              </p>
            </GlassCard>

            {/* Market Pulse */}
            <GlassCard>
              <h4 className={`font-semibold ${theme.text} mb-3 flex items-center`}>
                <Activity size={16} className="mr-2 text-blue-400" />
                Market Pulse
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme.textSecondary}`}>Live Resin</span>
                  <span className="text-emerald-400 text-sm font-medium">↗ $280/oz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme.textSecondary}`}>Hash Rosin</span>
                  <span className="text-blue-400 text-sm font-medium">→ $320/oz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme.textSecondary}`}>Shatter</span>
                  <span className="text-red-400 text-sm font-medium">↘ $180/oz</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Enhanced Recent Projects */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${theme.text} flex items-center space-x-3`}>
              <Database size={24} className="text-blue-400" />
              <span>Recent Projects</span>
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : `${theme.textSecondary} hover:${theme.text}`
                  }`}
                >
                  <MoreHorizontal size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : `${theme.textSecondary} hover:${theme.text}`
                  }`}
                >
                  <Menu size={16} />
                </button>
              </div>
              <button 
                onClick={() => setView('projects')}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-xl transition-all duration-200 hover:bg-blue-500/20"
              >
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {projects.slice(0, viewMode === 'grid' ? 6 : 5).map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  // Enhanced Analytics View with Interactive Charts
  const AnalyticsView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme.text} flex items-center space-x-3`}>
          <BarChart3 size={32} className="text-blue-400" />
          <span>Advanced Analytics</span>
        </h2>
        <div className="flex items-center space-x-4">
          <select className={`px-4 py-2 ${theme.glass} ${theme.cardBorder} border rounded-xl ${theme.text} bg-transparent`}>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className={`px-4 py-2 ${theme.glass} ${theme.cardBorder} border rounded-xl ${theme.text} hover:scale-105 transition-all duration-200 flex items-center space-x-2`}>
            <Filter size={16} />
            <span>Advanced Filters</span>
          </button>
          <button className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600  style={{ color: textColor }} rounded-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2`}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Yield Performance Chart */}
        <div className="xl:col-span-2">
          <GlassCard className="h-96">
            <h3 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center space-x-2`}>
              <TrendingUp size={20} className="text-emerald-400" />
              <span>Yield Performance Trends</span>
            </h3>
            <div className="h-80 bg-gradient-to-br from-emerald-500/5 to-blue-600/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp size={24} className=" style={{ color: textColor }}" />
                </div>
                <p className={`${theme.textSecondary} text-lg`}>Interactive D3.js Chart</p>
                <p className={`${theme.textSecondary} text-sm`}>Real-time yield analysis with drill-down capabilities</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Profitability Breakdown */}
        <GlassCard className="h-96">
          <h3 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center space-x-2`}>
            <DollarSign size={20} className="text-green-400" />
            <span>Profitability</span>
          </h3>
          <div className="h-80 bg-gradient-to-br from-green-500/5 to-emerald-600/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <DollarSign size={24} className=" style={{ color: textColor }}" />
              </div>
              <p className={`${theme.textSecondary} text-lg`}>Profit Breakdown</p>
              <p className={`${theme.textSecondary} text-sm`}>Revenue streams and cost analysis</p>
            </div>
          </div>
        </GlassCard>

        {/* Strain Performance */}
        <GlassCard className="h-96">
          <h3 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center space-x-2`}>
            <Leaf size={20} className="text-green-400" />
            <span>Strain Analysis</span>
          </h3>
          <div className="space-y-3">
            {['Wedding Cake', 'Blue Dream', 'Gelato #33', 'OG Kush'].map((strain, index) => (
              <div key={strain} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                <span className={`font-medium ${theme.text}`}>{strain}</span>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{(7.2 - index * 0.3).toFixed(1)}%</p>
                  <p className={`text-xs ${theme.textSecondary}`}>avg yield</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Equipment Efficiency */}
        <GlassCard className="h-96">
          <h3 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center space-x-2`}>
            <Settings size={20} className="text-blue-400" />
            <span>Equipment Performance</span>
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Rosin Press Pro', efficiency: 98, status: 'optimal' },
              { name: 'Hash Extractor XL', efficiency: 95, status: 'good' },
              { name: 'Freeze Dryer', efficiency: 92, status: 'maintenance' }
            ].map((equipment) => (
              <div key={equipment.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${theme.text}`}>{equipment.name}</span>
                  <span className={`text-sm ${
                    equipment.status === 'optimal' ? 'text-green-400' :
                    equipment.status === 'good' ? 'text-blue-400' : 'text-yellow-400'
                  }`}>
                    {equipment.efficiency}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      equipment.status === 'optimal' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      equipment.status === 'good' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                      'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{ width: `${equipment.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Market Insights */}
        <div className="xl:col-span-2">
          <GlassCard className="h-96">
            <h3 className={`text-xl font-semibold ${theme.text} mb-4 flex items-center space-x-2`}>
              <Brain size={20} className="text-purple-400" />
              <span>AI Market Insights</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 flex flex-col justify-center">
                <h4 className={`font-semibold ${theme.text} mb-2`}>Demand Forecast</h4>
                <p className={`${theme.textSecondary} text-sm mb-4`}>
                  Live Resin demand expected to increase 34% next month based on market analysis
                </p>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View Detailed Forecast →
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 flex flex-col justify-center">
                <h4 className={`font-semibold ${theme.text} mb-2`}>Price Optimization</h4>
                <p className={`${theme.textSecondary} text-sm mb-4`}>
                  Increase Hash Rosin pricing by $15/oz to match market positioning
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Apply Optimization →
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500 font-inter`}>
      <CommandPalette />
      <NotificationSystem />
      <Sidebar />
      <Header />
      
      <main className={`
        ml-${sidebarCollapsed ? '20' : '72'} mt-16 p-8 
        transition-all duration-300 min-h-screen
      `}>
        {view === 'dashboard' && <DashboardView />}
        {view === 'tracker' && (
          <div className="max-w-6xl mx-auto">
            <GlassCard className="space-y-8" glow>
              <div className="text-center py-8">
                <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>Create New Extraction Project</h1>
                <p className={`text-lg ${theme.textSecondary}`}>
                  Track every detail of your cannabis extraction process with precision and insight
                </p>
              </div>
              {/* Enhanced Project Form would go here */}
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus size={32} className=" style={{ color: textColor }}" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text} mb-4`}>Advanced Project Creator</h3>
                <p className={`${theme.textSecondary} mb-8`}>
                  Smart forms with real-time calculations, AI suggestions, and predictive analytics
                </p>
                <button 
                  onClick={() => addNotification('success', 'Feature Coming Soon', 'Advanced project creator will be available in the next update')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-2xl font-semibold hover:scale-105 transition-all duration-200"
                >
                  Start Creating
                </button>
              </div>
            </GlassCard>
          </div>
        )}
        {view === 'analytics' && <AnalyticsView />}
        {view === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${theme.text} flex items-center space-x-3`}>
                <Database size={32} className="text-blue-400" />
                <span>Project Management</span>
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-colors ${
                      viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <Menu size={18} />
                  </button>
                </div>
                {selectedProjects.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${theme.textSecondary}`}>
                      {selectedProjects.length} selected
                    </span>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
                      Delete
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setView('tracker')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-xl font-semibold hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} />
              ))}
            </div>
          </div>
        )}
        {view === 'insights' && (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${theme.text} flex items-center space-x-3`}>
              <Brain size={32} className="text-purple-400" />
              <span>AI Insights Dashboard</span>
            </h2>
            <AIInsightsPanel />
          </div>
        )}
        {view === 'achievements' && (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${theme.text} flex items-center space-x-3`}>
              <Trophy size={32} className="text-yellow-400" />
              <span>Achievements & Milestones</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <GlassCard 
                  key={achievement.id} 
                  className={`text-center p-8 ${achievement.earned ? 'border-yellow-500/50' : ''}`}
                  glow={achievement.earned}
                >
                  <div className={`text-6xl mb-4 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${theme.text} mb-2`}>{achievement.name}</h3>
                  <p className={`${theme.textSecondary} text-sm`}>{achievement.description}</p>
                  {achievement.earned && (
                    <div className="mt-4 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl inline-block">
                      Earned!
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Enhanced Floating Action Button */}
      {view !== 'tracker' && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setView('tracker')}
            className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600  style={{ color: textColor }} rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default UltimateYieldTracker;
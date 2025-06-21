import React from 'react';
import { Home, Plus, BarChart3, Database, Brain, Trophy, Settings, ChevronRight, ChevronDown, Leaf } from 'lucide-react';

export const Sidebar = ({ 
  view, 
  setView, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  projects = [], 
  achievements = {}, 
  aiInsights = [], 
  themes = {}, 
  currentTheme, 
  setCurrentTheme, 
  isOnline, 
  realtimeUpdates,
  isDarkMode = true,
  viewTitle // Add this prop
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const textSecondaryColor = isDarkMode ? '#A0A0A0' : '#666666';
  
  // Default title if no viewTitle is provided
  const defaultTitle = { 
    title: "HashApp", 
    subtitle: "Advanced Cannabis Analytics" 
  };
  
  const currentTitle = viewTitle || defaultTitle;
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'form', label: 'New Project', icon: Plus, badge: 'New' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'projects', label: 'Projects', icon: Database, badge: projects.length },
    { id: 'insights', label: 'AI Insights', icon: Brain, badge: aiInsights.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: typeof achievements === 'object' ? Object.keys(achievements.earned || {}).length : 0 },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className={`
      ${sidebarCollapsed ? 'w-20' : 'w-72'} 
      bg-white/5 border-r border-slate-700/50
      fixed left-0 top-0 h-full z-50 transition-all duration-300
      backdrop-blur-xl overflow-y-auto
    `}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf size={24} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {currentTitle.title}
              </h1>
              <p className="text-sm text-slate-400">{currentTitle.subtitle}</p>
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
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-emerald-400 shadow-lg border border-emerald-500/30' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
                style={{ color: isActive ? '#10b981' : textSecondaryColor }}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className={isActive ? 'text-emerald-400' : ''} />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== null && item.badge > 0 && (
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
              <h4 className="font-medium mb-2" style={{ color: textColor }}>Theme</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(themes || {}).map(themeName => (
                  <button 
                    key={themeName} 
                    onClick={() => setCurrentTheme(themeName)} 
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentTheme === themeName ? 'ring-2 ring-blue-400' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${
                      themeName === 'dark' ? 'bg-slate-800' : 
                      themeName === 'light' ? 'bg-white border border-slate-200' : 
                      themeName === 'cannabis' ? 'bg-green-600' : 'bg-blue-600'
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
              <span className="text-sm text-slate-400">{isOnline ? 'Online' : 'Offline'}</span>
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
          className="w-full p-3 rounded-xl hover:bg-white/5 transition-all duration-200 flex items-center justify-center"
          style={{ color: textSecondaryColor }}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
    </div>
  );
};
// components/layout/Sidebar.jsx - Updated to support ConsumptionTracker
import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Settings, 
  Brain, 
  Trophy, 
  BarChart3,
  Hash,
  Leaf,
  Heart,
  Target,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';

export const Sidebar = ({ 
  view, 
  setView, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  projects, 
  achievements, 
  aiInsights,
  themes,
  currentTheme,
  setCurrentTheme,
  isOnline,
  realtimeUpdates,
  isDarkMode,
  theme,
  viewTitle,
  appTitle // Accept the new appTitle prop
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Determine which app we're in based on the current URL or context
  const getAppContext = () => {
    // This logic might need refinement if you have more apps.
    // For now, it defaults to 'jarflip' which covers the Yield Tracker case.
    if (window.location.pathname.includes('consumption')) {
      return 'consumption';
    }
    return 'jarflip'; 
  };

  const appContext = getAppContext();

  // Define menu items based on app context
  const getMenuItems = () => {
    if (appContext === 'consumption') {
      return [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: TrendingUp, 
          badge: null,
          description: 'Overview of consumption patterns'
        },
        { 
          id: 'form', 
          label: 'New Session', 
          icon: Package, 
          badge: 'New',
          description: 'Log a new consumption session'
        },
        { 
          id: 'history', 
          label: 'History', 
          icon: Calendar, 
          badge: projects?.length || 0,
          description: 'View past consumption sessions'
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: BarChart3, 
          badge: null,
          description: 'Consumption analytics and trends'
        },
        { 
          id: 'insights', 
          label: 'AI Insights', 
          icon: Brain, 
          badge: aiInsights?.length || null,
          description: 'Smart consumption recommendations'
        },
        { 
          id: 'achievements', 
          label: 'Achievements', 
          icon: Trophy, 
          // FIX: Calculate the number of earned achievements
          badge: achievements?.earned ? Object.keys(achievements.earned).length : null,
          description: 'Track your consumption milestones'
        },
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings, 
          badge: null,
          description: 'Configure consumption preferences'
        }
      ];
    } else {
      // JarFlip & YieldTracker menu items
      return [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: TrendingUp, 
          badge: null,
          description: 'Overview of your flips'
        },
        { 
          id: 'form', 
          label: 'New Flip', 
          icon: Package, 
          badge: 'New',
          description: 'Create a new flip project'
        },
        { 
          id: 'projects', 
          label: 'History', 
          icon: DollarSign, 
          badge: projects?.length || 0,
          description: 'View your flip history'
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: BarChart3, 
          badge: null,
          description: 'Performance insights and charts'
        },
        { 
          id: 'insights', 
          label: 'AI Insights', 
          icon: Brain, 
          badge: aiInsights?.length || null,
          description: 'Smart flip recommendations'
        },
        { 
          id: 'achievements', 
          label: 'Achievements', 
          icon: Trophy, 
          // FIX: Calculate the number of earned achievements
          badge: achievements?.earned ? Object.keys(achievements.earned).length : null,
          description: 'Track your flip milestones'
        },
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings, 
          badge: null,
          description: 'Configure flip preferences'
        }
      ];
    }
  };

  const menuItems = getMenuItems();

  const getAppIcon = () => {
    switch (appContext) {
      case 'consumption':
        return Leaf;
      case 'yield':
        return BarChart3;
      case 'winners':
        return Trophy;
      default:
        return TrendingUp;
    }
  };

  const AppIcon = getAppIcon();

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
      sidebarCollapsed ? 'w-20' : 'w-72'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl">
                  <AppIcon size={24} className="text-white" />
                </div>
                <div>
                  <h1 style={{ color: textColor }} className="text-lg font-bold">
                    {/* Use the appTitle prop here */}
                    {appTitle || 'Dashboard'}
                  </h1>
                  {viewTitle && (
                    <p style={{ color: textSecondaryColor }} className="text-xs">
                      {viewTitle.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: textSecondaryColor }}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                    : 'hover:bg-white/10 border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon 
                  size={20} 
                  className={`${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} transition-colors`}
                />
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div 
                        className={`font-medium ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'} transition-colors`}
                      >
                        {item.label}
                      </div>
                      <div 
                        className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors"
                      >
                        {item.description}
                      </div>
                    </div>
                    {item.badge != null && item.badge !== 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        item.badge === 'New' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Section */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/10 space-y-4">
            {/* App-specific status */}
            {appContext === 'consumption' && (
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: textColor }} className="text-sm font-medium">
                    Session Stats
                  </span>
                  <Heart size={16} className="text-pink-400" />
                </div>
                <div className="space-y-1 text-xs" style={{ color: textSecondaryColor }}>
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span>{projects?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span>{Math.floor((projects?.length || 0) / 4)}</span>
                  </div>
                </div>
              </div>
            )}

            {appContext === 'jarflip' && (
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: textColor }} className="text-sm font-medium">
                    Flip Stats
                  </span>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <div className="space-y-1 text-xs" style={{ color: textSecondaryColor }}>
                  <div className="flex justify-between">
                    <span>Total Flips:</span>
                    <span>{projects?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                <span style={{ color: textSecondaryColor }} className="text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              {realtimeUpdates && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                  <span style={{ color: textSecondaryColor }} className="text-xs">Live</span>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <span style={{ color: textSecondaryColor }} className="text-xs">Theme</span>
              <div className="flex items-center space-x-1">
                {Object.entries(themes).map(([key, themeConfig]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      currentTheme === key ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ 
                      background: key === 'dark' 
                        ? 'linear-gradient(135deg, #1e293b, #7c3aed)' 
                        : 'linear-gradient(135deg, #dbeafe, #c7d2fe)'
                    }}
                    title={`${key.charAt(0).toUpperCase() + key.slice(1)} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Theme Selector */}
        {sidebarCollapsed && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="w-12 h-8 rounded-full p-1 transition-colors bg-gray-600"
              title="Toggle theme"
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                currentTheme === 'dark' ? 'translate-x-0' : 'translate-x-4'
              }`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
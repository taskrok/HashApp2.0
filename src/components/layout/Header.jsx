import React from 'react';
import { Search, Command, Bell, Sun, Moon, X, ChevronDown, Menu, ArrowLeft } from 'lucide-react';

export const Header = ({
  sidebarCollapsed,
  view,
  setCommandPaletteOpen,
  notifications = [],
  setIsDarkMode,
  isDarkMode,
  theme,
  searchQuery,
  setSearchQuery,
  isMobile,
  onMenuClick,
  onBack
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  return (
    <div className={`
      bg-white/5 border-b border-slate-700/50
      fixed top-0 right-0 h-16 z-40
      flex items-center justify-between px-6 backdrop-blur-xl transition-all duration-300
      ${isMobile ? 'left-0' : (sidebarCollapsed ? 'left-20' : 'left-72')}
    `}>
      <div className="flex items-center space-x-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
            style={{ color: textSecondaryColor }}
            title="Back to HashApp"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {isMobile && (
          <button 
            onClick={onMenuClick} 
            className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
            style={{ color: textSecondaryColor }}
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-xl font-bold capitalize flex items-center space-x-2" style={{ color: textColor }}>
          <span>{view === 'tracker' ? 'New Project' : view.replace('-', ' ')}</span>
        </h2>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-40 md:w-64 bg-white/5 border border-slate-700/50 rounded-xl placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{ color: textColor }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-white transition-colors"
              style={{ color: textSecondaryColor }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200 hidden md:flex items-center space-x-2"
          style={{ color: textSecondaryColor }}
          title="Command Palette (⌘K)"
        >
          <Command size={16} />
          <span className="text-xs">⌘K</span>
        </button>

        <button className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200 relative" style={{ color: textSecondaryColor }}>
          <Bell size={16} />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"/>
          )}
        </button>

        <button 
          onClick={setIsDarkMode}
          className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
          style={{ color: textSecondaryColor }}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
};
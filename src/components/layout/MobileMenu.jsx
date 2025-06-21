import React from 'react';
import { Home, Plus, BarChart3, Database, Brain, Trophy, Settings } from 'lucide-react';

export const MobileMenu = ({ isOpen, setView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tracker', label: 'New Project', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Database },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isOpen) {
    return null;
  }

  const handleNavigate = (view) => {
    setView(view);
    onNavigate(); // This will close the menu
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden" 
      onClick={onNavigate} // Close menu when clicking on the overlay
    >
      <div 
        className="fixed top-0 left-0 h-full w-72 bg-slate-900/95 border-r border-slate-700 p-6"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
      >
        <div className="flex items-center space-x-3 mb-8">
            <h1 className="text-xl font-bold  style={{ color: textColor }} bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              YieldMaster Pro
            </h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-300 hover: style={{ color: textColor }} hover:bg-white/10 transition-colors"
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Home, BarChart3, Moon, Download, Command } from 'lucide-react';

export const CommandPalette = ({ isOpen, setOpen, setView, setIsDarkMode, addNotification }) => {
  const commands = [
    { id: 'new-project', label: 'New Project', icon: Plus, action: () => setView('tracker') },
    { id: 'dashboard', label: 'Go to Dashboard', icon: Home, action: () => setView('dashboard') },
    { id: 'analytics', label: 'View Analytics', icon: BarChart3, action: () => setView('analytics') },
    { id: 'toggle-theme', label: 'Toggle Dark Mode', icon: Moon, action: () => setIsDarkMode(prev => !prev) },
    { id: 'export-data', label: 'Export Data', icon: Download, action: () => addNotification('success', 'Export Started', 'Your data is being prepared') },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg bg-white/5 border border-slate-700/50 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                  setOpen(false);
                  setSearchTerm('');
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 transition-colors  style={{ color: textColor }}"
              >
                <Icon size={16} className="text-slate-400" />
                <span>{command.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
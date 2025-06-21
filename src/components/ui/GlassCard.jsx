import React from 'react';

export const GlassCard = ({ children, className = "", hover = true, glow = false, gradient = false, onClick, selected = false }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white/5 backdrop-blur-xl border-slate-700/50 border rounded-2xl p-6
      ${hover ? 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer' : ''}
      ${glow ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg'}
      ${gradient ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10' : ''}
      ${selected ? 'ring-2 ring-blue-500/50' : ''}
      transition-all duration-300 group
      ${className}
    `}
  >
    {children}
  </div>
);
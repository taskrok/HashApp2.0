import React from 'react';
import { GlassCard } from './GlassCard'; // You will create this new UI component
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricCard = ({ title, value, change, icon: Icon, trend, color = "blue", sparkline, target, onClick }) => {
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
            <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold  style={{ color: textColor }} group-hover:scale-105 transition-transform duration-200">
            {value}
          </h3>
          <p className="text-sm text-slate-400">{title}</p>
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
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Brain, Eye, EyeOff } from 'lucide-react';

export const AIInsightsPanel = ({ insights = [], theme, isDarkMode }) => {
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);

  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  return (
    <GlassCard className="space-y-4" glow>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain size={20} className=" style={{ color: textColor }}" />
          </div>
          <div>
            <h3 style={{ color: textColor }} className="font-bold">AI Insights</h3>
            <p style={{ color: textSecondaryColor }} className="text-sm">Powered by YieldGPT</p>
          </div>
        </div>
        <button 
          onClick={() => setAiInsightsEnabled(!aiInsightsEnabled)} 
          style={{ color: textSecondaryColor }}
          className="p-2 rounded-lg hover: style={{ color: textColor }} transition-colors"
        >
          {aiInsightsEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      
      {aiInsightsEnabled && (
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            if (!Icon) return null; // Safety check in case an icon is missing
            return (
              <div key={index} className="p-3 rounded-xl bg-white/5 border border-slate-700/50 hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-start space-x-3">
                  <Icon size={16} className="text-blue-400 mt-1" />
                  <div className="flex-1">
                    <h4 style={{ color: textColor }} className="font-medium text-sm">{insight.title}</h4>
                    <p style={{ color: textSecondaryColor }} className="text-xs mt-1">{insight.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ color: textSecondaryColor }} className="text-xs">{insight.confidence}% confidence</span>
                      <button className="text-xs text-blue-400 hover:text-blue-300">{insight.action}</button>
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
};
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Settings, DollarSign, Percent } from 'lucide-react';

export const SettingsView = ({ marketPrices, setMarketPrices, processingPaths, setProcessingPaths, theme, isDarkMode }) => {
  // Use theme colors
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  const handlePriceChange = (key, value) => {
    setMarketPrices(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleYieldChange = (startMaterial, finishMaterial, value) => {
    setProcessingPaths(prev => ({
      ...prev,
      [startMaterial]: {
        ...prev[startMaterial],
        [finishMaterial]: {
          ...prev[startMaterial][finishMaterial],
          yield: Number(value)
        }
      }
    }));
  };

  return (
    <div className="space-y-8">
      <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
        <Settings size={32} className="text-blue-400" />
        <span>Application Settings</span>
      </h2>

      {/* Market Prices Settings */}
      <GlassCard>
        <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-3">
          <DollarSign size={20} className="text-emerald-400" />
          <span>Market Prices</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(marketPrices).map(([key, value]) => (
            <div key={key}>
              <label style={{ color: textSecondaryColor }} className="block text-sm font-medium mb-2">{key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handlePriceChange(key, e.target.value)}
                style={{ color: textColor }}
                className="w-full pl-4 pr-4 py-2 bg-slate-900/80 border border-slate-700/50 rounded-xl placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Yield Ratio Settings */}
      <GlassCard>
        <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-3">
          <Percent size={20} className="text-purple-400" />
          <span>Yield Ratios</span>
        </h3>
        <div className="space-y-8">
          {Object.entries(processingPaths).map(([startMaterial, paths]) => (
            <div key={startMaterial}>
              <h4 className="text-lg font-medium text-blue-400 mb-4 border-b border-slate-700 pb-2">{startMaterial}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(paths).map(([finishMaterial, details]) => (
                  <div key={finishMaterial}>
                    <label style={{ color: textSecondaryColor }} className="block text-sm font-medium mb-2">{finishMaterial} Yield (%)</label>
                    <input
                      type="number"
                      value={details.yield * 100} // Display as percentage
                      onChange={(e) => handleYieldChange(startMaterial, finishMaterial, e.target.value / 100)} // Convert back to decimal
                      style={{ color: textColor }}
                      className="w-full pl-4 pr-4 py-2 bg-slate-900/80 border border-slate-700/50 rounded-xl placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
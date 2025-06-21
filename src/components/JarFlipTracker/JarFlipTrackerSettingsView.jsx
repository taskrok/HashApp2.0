// components/JarFlipTracker/JarFlipTrackerSettingsView.jsx
import React, { useState, useCallback } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Settings, DollarSign, Package, Save, RotateCcw, AlertCircle } from 'lucide-react';

export const JarFlipTrackerSettingsView = ({ 
  defaultSettings, 
  onSaveSettings, 
  theme, 
  isDarkMode 
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    onSaveSettings(settings);
    setHasChanges(false);
  }, [settings, onSaveSettings]);

  const handleReset = useCallback(() => {
    const defaultJarFlipSettings = {
      defaultPrices: {
        costPerGram: '25.00',
        salePricePerGram: '35.00',
        overheadCost: '50.00',
        packagingCost: '2.50'
      },
      defaultSettings: {
        packagingUnit: 3.5,
        materialType: 'Flower',
        autoCalculateUnits: true,
        showAdvancedMetrics: true
      },
      preferences: {
        defaultCurrency: 'USD',
        roundingDecimals: 2,
        showProfitWarnings: true,
        autoSaveProjects: true
      }
    };
    setSettings(defaultJarFlipSettings);
    setHasChanges(true);
  }, []);

  const CurrencyInput = ({ label, value, onChange, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*(\.\d{0,2})?$/.test(val)) {
              onChange(val);
            }
          }}
          onBlur={(e) => {
            const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            onChange(isNaN(num) ? '0.00' : num.toFixed(2));
          }}
          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          style={{ color: textColor }}
          placeholder="0.00"
        />
      </div>
      {help && (
        <p className="text-xs" style={{ color: textSecondaryColor }}>
          {help}
        </p>
      )}
    </div>
  );

  const NumberInput = ({ label, value, onChange, min, max, step = 1, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        style={{ color: textColor }}
      />
      {help && (
        <p className="text-xs" style={{ color: textSecondaryColor }}>
          {help}
        </p>
      )}
    </div>
  );

  const SelectInput = ({ label, value, onChange, options, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        style={{ color: textColor }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      {help && (
        <p className="text-xs" style={{ color: textSecondaryColor }}>
          {help}
        </p>
      )}
    </div>
  );

  const ToggleInput = ({ label, value, onChange, help }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div className="flex-1">
        <div className="font-medium" style={{ color: textColor }}>
          {label}
        </div>
        {help && (
          <p className="text-xs mt-1" style={{ color: textSecondaryColor }}>
            {help}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Settings size={32} className="text-purple-400" />
          <span>Flip Tracker Settings</span>
        </h2>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <div className="flex items-center space-x-2 text-orange-400">
              <AlertCircle size={16} />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center space-x-2"
            
style={{ color: textColor }}
          >
            <RotateCcw size={16} />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
              hasChanges 
                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:scale-105' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Default Pricing */}
        <GlassCard className="p-8">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <DollarSign size={20} className="text-emerald-400" />
            <span>Default Pricing</span>
          </h3>
          
          <div className="space-y-6">
            <CurrencyInput
              label="Default Cost per Gram"
              value={settings.defaultPrices?.costPerGram || '25.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'costPerGram', value)}
              help="Your typical purchase price per gram"
            />
            
            <CurrencyInput
              label="Default Sale Price per Gram"
              value={settings.defaultPrices?.salePricePerGram || '35.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'salePricePerGram', value)}
              help="Your typical sale price per gram"
            />
            
            <CurrencyInput
              label="Default Overhead Cost"
              value={settings.defaultPrices?.overheadCost || '50.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'overheadCost', value)}
              help="Fixed costs like lab testing, taxes, etc."
            />
            
            <CurrencyInput
              label="Default Packaging Cost per Unit"
              value={settings.defaultPrices?.packagingCost || '2.50'}
              onChange={(value) => handleSettingChange('defaultPrices', 'packagingCost', value)}
              help="Cost of jars, labels, bags per unit"
            />
          </div>
        </GlassCard>

        {/* Default Settings */}
        <GlassCard className="p-8">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Package size={20} className="text-blue-400" />
            <span>Default Project Settings</span>
          </h3>
          
          <div className="space-y-6">
            <NumberInput
              label="Default Packaging Unit Size (grams)"
              value={settings.defaultSettings?.packagingUnit || 3.5}
              onChange={(value) => handleSettingChange('defaultSettings', 'packagingUnit', value)}
              min={0.5}
              max={28}
              step={0.5}
              help="Default jar/package size for new projects"
            />
            
            <SelectInput
              label="Default Material Type"
              value={settings.defaultSettings?.materialType || 'Flower'}
              onChange={(value) => handleSettingChange('defaultSettings', 'materialType', value)}
              options={[
                { value: 'Flower', label: 'Flower' },
                { value: 'Pre-Rolls', label: 'Pre-Rolls' },
                { value: 'Concentrates', label: 'Concentrates' },
                { value: 'Edibles', label: 'Edibles' },
                { value: 'Other', label: 'Other' }
              ]}
              help="Default material type for new projects"
            />
            
            <NumberInput
              label="Rounding Decimals"
              value={settings.preferences?.roundingDecimals || 2}
              onChange={(value) => handleSettingChange('preferences', 'roundingDecimals', value)}
              min={0}
              max={4}
              help="Number of decimal places for currency display"
            />
          </div>
        </GlassCard>
      </div>

      {/* Preferences */}
      <GlassCard className="p-8">
        <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Settings size={20} className="text-purple-400" />
          <span>Preferences</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToggleInput
            label="Auto-calculate Units"
            value={settings.defaultSettings?.autoCalculateUnits ?? true}
            onChange={(value) => handleSettingChange('defaultSettings', 'autoCalculateUnits', value)}
            help="Automatically calculate packaging units based on total grams"
          />
          
          <ToggleInput
            label="Show Advanced Metrics"
            value={settings.defaultSettings?.showAdvancedMetrics ?? true}
            onChange={(value) => handleSettingChange('defaultSettings', 'showAdvancedMetrics', value)}
            help="Display detailed ROI, margin, and efficiency calculations"
          />
          
          <ToggleInput
            label="Show Profit Warnings"
            value={settings.preferences?.showProfitWarnings ?? true}
            onChange={(value) => handleSettingChange('preferences', 'showProfitWarnings', value)}
            help="Alert when projects may be unprofitable"
          />
          
          <ToggleInput
            label="Auto-save Projects"
            value={settings.preferences?.autoSaveProjects ?? true}
            onChange={(value) => handleSettingChange('preferences', 'autoSaveProjects', value)}
            help="Automatically save projects to localStorage"
          />
        </div>
      </GlassCard>

      {/* Help Section */}
      <GlassCard className="p-8">
        <h3 style={{ color: textColor }} className="text-xl font-semibold mb-4">
          Settings Help
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm" style={{ color: textSecondaryColor }}>
          <div>
            <h4 style={{ color: textColor }} className="font-semibold mb-2">Pricing Defaults</h4>
            <p className="mb-2">Set your typical costs and prices to speed up project creation. These values will be pre-filled in new project forms.</p>
            <p>You can always override these values for individual projects.</p>
          </div>
          <div>
            <h4 style={{ color: textColor }} className="font-semibold mb-2">Project Settings</h4>
            <p className="mb-2">Configure default packaging sizes and material types based on your typical business operations.</p>
            <p>Adjust rounding decimals to match your pricing precision needs.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
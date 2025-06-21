// components/ConsumptionTracker/ConsumptionSettingsView.jsx
import React, { useState, useCallback } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Settings, DollarSign, Package, Save, RotateCcw, AlertCircle, Target, Heart, Clock, Download, Upload, Trash2 } from 'lucide-react';

export const ConsumptionSettingsView = ({ 
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
    const defaultConsumptionSettings = {
      defaultPrices: {
        hashCostPerGram: '25.00',
        flowerCostPerGram: '12.00',
        edibleCostPerUnit: '15.00',
        vapeCostPerGram: '35.00'
      },
      defaultSettings: {
        sessionType: 'Mixed',
        trackMood: true,
        trackEffects: true,
        enableNotifications: true
      },
      inventory: {
        hashInventory: '10.0',
        flowerInventory: '15.0',
        edibleInventory: '5',
        vapeInventory: '3.0'
      },
      goals: {
        dailyHashTarget: '2.0',
        dailyFlowerTarget: '3.0',
        monthlyBudget: '500.00',
        trackTolerance: true
      }
    };
    setSettings(defaultConsumptionSettings);
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

  const NumberInput = ({ label, value, onChange, min, max, step = 1, unit, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label} {unit && <span className="text-gray-400">({unit})</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          <span>Consumption Settings</span>
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
              label="Hash Cost per Gram"
              value={settings.defaultPrices?.hashCostPerGram || '25.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'hashCostPerGram', value)}
              help="Your typical cost for hash, concentrates, and extracts"
            />
            
            <CurrencyInput
              label="Flower Cost per Gram"
              value={settings.defaultPrices?.flowerCostPerGram || '12.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'flowerCostPerGram', value)}
              help="Your typical cost for flower and bud products"
            />
            
            <CurrencyInput
              label="Edible Cost per Unit"
              value={settings.defaultPrices?.edibleCostPerUnit || '15.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'edibleCostPerUnit', value)}
              help="Cost per edible item (gummies, chocolates, etc.)"
            />
            
            <CurrencyInput
              label="Vape Cost per Gram"
              value={settings.defaultPrices?.vapeCostPerGram || '35.00'}
              onChange={(value) => handleSettingChange('defaultPrices', 'vapeCostPerGram', value)}
              help="Cost for vape cartridges and pods"
            />
          </div>
        </GlassCard>

        {/* Current Inventory */}
        <GlassCard className="p-8">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Package size={20} className="text-blue-400" />
            <span>Current Inventory</span>
          </h3>
          
          <div className="space-y-6">
            <NumberInput
              label="Hash Inventory"
              value={settings.inventory?.hashInventory || '10.0'}
              onChange={(value) => handleSettingChange('inventory', 'hashInventory', value)}
              min="0"
              step="0.1"
              unit="g"
              help="Current hash and concentrate inventory"
            />
            
            <NumberInput
              label="Flower Inventory"
              value={settings.inventory?.flowerInventory || '15.0'}
              onChange={(value) => handleSettingChange('inventory', 'flowerInventory', value)}
              min="0"
              step="0.1"
              unit="g"
              help="Current flower and bud inventory"
            />
            
            <NumberInput
              label="Edible Inventory"
              value={settings.inventory?.edibleInventory || '5'}
              onChange={(value) => handleSettingChange('inventory', 'edibleInventory', value)}
              min="0"
              step="1"
              unit="units"
              help="Current edible product count"
            />
            
            <NumberInput
              label="Vape Inventory"
              value={settings.inventory?.vapeInventory || '3.0'}
              onChange={(value) => handleSettingChange('inventory', 'vapeInventory', value)}
              min="0"
              step="0.1"
              unit="g"
              help="Current vape cartridge inventory"
            />
          </div>
        </GlassCard>

        {/* Consumption Goals */}
        <GlassCard className="p-8">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Target size={20} className="text-purple-400" />
            <span>Consumption Goals</span>
          </h3>
          
          <div className="space-y-6">
            <NumberInput
              label="Daily Hash Target"
              value={settings.goals?.dailyHashTarget || '2.0'}
              onChange={(value) => handleSettingChange('goals', 'dailyHashTarget', value)}
              min="0"
              step="0.1"
              unit="g"
              help="Target daily hash consumption"
            />
            
            <NumberInput
              label="Daily Flower Target"
              value={settings.goals?.dailyFlowerTarget || '3.0'}
              onChange={(value) => handleSettingChange('goals', 'dailyFlowerTarget', value)}
              min="0"
              step="0.1"
              unit="g"
              help="Target daily flower consumption"
            />
            
            <CurrencyInput
              label="Monthly Budget"
              value={settings.goals?.monthlyBudget || '500.00'}
              onChange={(value) => handleSettingChange('goals', 'monthlyBudget', value)}
              help="Target monthly spending limit"
            />
            
            <ToggleInput
              label="Track Tolerance Patterns"
              value={settings.goals?.trackTolerance ?? true}
              onChange={(value) => handleSettingChange('goals', 'trackTolerance', value)}
              help="Monitor consumption increases and tolerance build-up"
            />
          </div>
        </GlassCard>

        {/* Session Preferences */}
        <GlassCard className="p-8">
          <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Heart size={20} className="text-pink-400" />
            <span>Session Preferences</span>
          </h3>
          
          <div className="space-y-6">
            <SelectInput
              label="Default Session Type"
              value={settings.defaultSettings?.sessionType || 'Mixed'}
              onChange={(value) => handleSettingChange('defaultSettings', 'sessionType', value)}
              options={[
                { value: 'Solo', label: 'Solo' },
                { value: 'Social', label: 'Social' },
                { value: 'Medical', label: 'Medical' },
                { value: 'Recreational', label: 'Recreational' },
                { value: 'Mixed', label: 'Mixed' }
              ]}
              help="Default session type for new entries"
            />
            
            <ToggleInput
              label="Track Mood Changes"
              value={settings.defaultSettings?.trackMood ?? true}
              onChange={(value) => handleSettingChange('defaultSettings', 'trackMood', value)}
              help="Enable mood before/after tracking by default"
            />
            
            <ToggleInput
              label="Track Effects"
              value={settings.defaultSettings?.trackEffects ?? true}
              onChange={(value) => handleSettingChange('defaultSettings', 'trackEffects', value)}
              help="Enable effects tracking by default"
            />
            
            <ToggleInput
              label="Enable Notifications"
              value={settings.defaultSettings?.enableNotifications ?? true}
              onChange={(value) => handleSettingChange('defaultSettings', 'enableNotifications', value)}
              help="Show notifications for achievements and reminders"
            />
          </div>
        </GlassCard>
      </div>

      {/* Data Management */}
      <GlassCard className="p-8">
        <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Settings size={20} className="text-orange-400" />
          <span>Data Management</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 style={{ color: textColor }} className="font-semibold">Export Data</h4>
            <button
              onClick={() => {
                const data = {
                  settings: settings,
                  exportDate: new Date().toISOString(),
                  version: '1.0'
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `consumption-settings-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Download size={16} />
              <span>Export Settings</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <h4 style={{ color: textColor }} className="font-semibold">Import Data</h4>
            <label className="w-full px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer">
              <Upload size={16} />
              <span>Import Settings</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedData = JSON.parse(event.target.result);
                        if (importedData.settings) {
                          setSettings(importedData.settings);
                          setHasChanges(true);
                        }
                      } catch (error) {
                        alert('Invalid file format');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>
          
          <div className="space-y-4">
            <h4 style={{ color: textColor }} className="font-semibold">Reset Data</h4>
            <button
              onClick={() => {
                if (window.confirm('This will reset all settings to defaults. Are you sure?')) {
                  handleReset();
                }
              }}
              className="w-full px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Reset All</span>
            </button>
          </div>
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
            <p className="mb-2">Set your typical costs for different consumption types. These values will be pre-filled when creating new sessions.</p>
            <p>You can always override these values for individual sessions based on actual costs.</p>
          </div>
          <div>
            <h4 style={{ color: textColor }} className="font-semibold mb-2">Inventory Tracking</h4>
            <p className="mb-2">Keep track of your current inventory levels. This helps with consumption predictions and restocking reminders.</p>
            <p>Update these values when you purchase or consume products.</p>
          </div>
          <div>
            <h4 style={{ color: textColor }} className="font-semibold mb-2">Consumption Goals</h4>
            <p className="mb-2">Set daily targets and monthly budgets to help manage your consumption patterns and spending.</p>
            <p>Goals are used by the AI insights system to provide personalized recommendations.</p>
          </div>
          <div>
            <h4 style={{ color: textColor }} className="font-semibold mb-2">Session Preferences</h4>
            <p className="mb-2">Configure default tracking options for mood, effects, and notifications.</p>
            <p>These settings affect what fields are enabled by default when creating new sessions.</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl">
          <h4 style={{ color: textColor }} className="font-semibold mb-2">💡 Pro Tips</h4>
          <div className="space-y-2 text-sm" style={{ color: textSecondaryColor }}>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Regular inventory updates help the AI predict when you'll run out</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400">•</span>
              <span>Setting realistic goals improves the accuracy of insights and recommendations</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-400">•</span>
              <span>Enable mood and effects tracking for the most comprehensive analytics</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-400">•</span>
              <span>Export your settings before making major changes as a backup</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
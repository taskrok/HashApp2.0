// components/ConsumptionTracker/ConsumptionForm.jsx
import React, { useMemo, useCallback } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Package, DollarSign, Calendar, Save, Hash, Leaf, Zap, Pill } from 'lucide-react';
import { CONSUMPTION_TYPES, SESSION_TYPES, MOOD_OPTIONS, EFFECTS_OPTIONS } from '../../data/consumptionConstants';
import { calculateConsumptionMetrics, formatCurrency, formatPercentage } from '../../utils/consumptionCalculations';

export const ConsumptionForm = ({
  formData,
  setFormData,
  handleFormChange,
  handleSaveEntry,
  uniqueStrains,
  uniqueLocations,
  uniqueSessionNames,
  theme,
  isDarkMode
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Real-time calculation preview
  const previewMetrics = useMemo(() => {
    const hasConsumption = (parseFloat(formData.hashAmount) > 0) || 
                          (parseFloat(formData.flowerAmount) > 0) || 
                          (parseFloat(formData.edibleAmount) > 0) || 
                          (parseFloat(formData.vapeAmount) > 0);
    
    if (hasConsumption && formData.startDate && formData.endDate) {
      return calculateConsumptionMetrics(formData);
    }
    return null;
  }, [formData]);

  // Memoize input components to prevent re-creation on each render
  const InputField = useCallback(({ label, type = 'text', value, onChange, placeholder, list, required = false, unit, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label} {required && <span className="text-red-400">*</span>}
        {unit && <span className="text-gray-400 ml-1">({unit})</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        style={{ color: textColor }}
      />
      {help && <p className="text-xs text-gray-400">{help}</p>}
    </div>
  ), [textSecondaryColor, textColor]);

  const CurrencyField = useCallback(({ label, value, onChange, required = false, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
        <input
          type="text"
          value={value || ''}
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
      {help && <p className="text-xs text-gray-400">{help}</p>}
    </div>
  ), [textSecondaryColor, textColor]);

  const SelectField = useCallback(({ label, value, onChange, options, required = false, help }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        style={{ color: textColor }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
        ))}
      </select>
      {help && <p className="text-xs text-gray-400">{help}</p>}
    </div>
  ), [textSecondaryColor, textColor]);

  const TextAreaField = useCallback(({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        style={{ color: textColor }}
      />
    </div>
  ), [textSecondaryColor, textColor]);

  // Create stable change handlers
  const handleSessionNameChange = useCallback((value) => handleFormChange('sessionName', value), [handleFormChange]);
  const handleStrainChange = useCallback((value) => handleFormChange('strain', value), [handleFormChange]);
  const handleLocationChange = useCallback((value) => handleFormChange('location', value), [handleFormChange]);
  const handleSessionTypeChange = useCallback((value) => handleFormChange('sessionType', value), [handleFormChange]);
  const handleStartDateChange = useCallback((value) => handleFormChange('startDate', value), [handleFormChange]);
  const handleEndDateChange = useCallback((value) => handleFormChange('endDate', value), [handleFormChange]);
  const handleHashAmountChange = useCallback((value) => handleFormChange('hashAmount', value), [handleFormChange]);
  const handleFlowerAmountChange = useCallback((value) => handleFormChange('flowerAmount', value), [handleFormChange]);
  const handleEdibleAmountChange = useCallback((value) => handleFormChange('edibleAmount', value), [handleFormChange]);
  const handleVapeAmountChange = useCallback((value) => handleFormChange('vapeAmount', value), [handleFormChange]);
  const handleHashCostChange = useCallback((value) => handleFormChange('hashCostPerGram', value), [handleFormChange]);
  const handleFlowerCostChange = useCallback((value) => handleFormChange('flowerCostPerGram', value), [handleFormChange]);
  const handleEdibleCostChange = useCallback((value) => handleFormChange('edibleCostPerUnit', value), [handleFormChange]);
  const handleVapeCostChange = useCallback((value) => handleFormChange('vapeCostPerGram', value), [handleFormChange]);
  const handleMoodBeforeChange = useCallback((value) => handleFormChange('moodBefore', value), [handleFormChange]);
  const handleMoodAfterChange = useCallback((value) => handleFormChange('moodAfter', value), [handleFormChange]);
  const handleEffectsChange = useCallback((value) => handleFormChange('effects', value), [handleFormChange]);
  const handleNotesChange = useCallback((value) => handleFormChange('notes', value), [handleFormChange]);

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Package size={32} className="text-emerald-400" />
          <span>New Consumption Session</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8">
            <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Package size={20} />
              <span>Session Details</span>
            </h3>

            {/* Auto-complete data lists */}
            <datalist id="strain-list">
              {uniqueStrains.map(strain => <option key={strain} value={strain} />)}
            </datalist>
            <datalist id="location-list">
              {uniqueLocations.map(location => <option key={location} value={location} />)}
            </datalist>
            <datalist id="session-list">
              {uniqueSessionNames.map(name => <option key={name} value={name} />)}
            </datalist>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Session Name"
                  value={formData.sessionName}
                  onChange={handleSessionNameChange}
                  placeholder="e.g., Evening Chill Session"
                  list="session-list"
                  required
                />
              </div>

              <InputField
                label="Strain"
                value={formData.strain}
                onChange={handleStrainChange}
                placeholder="e.g., Blue Dream"
                list="strain-list"
              />

              <InputField
                label="Location"
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="e.g., Home, Park, etc."
                list="location-list"
              />

              <SelectField
                label="Session Type"
                value={formData.sessionType}
                onChange={handleSessionTypeChange}
                options={SESSION_TYPES}
              />

              <SelectField
                label="Consumption Type"
                value={formData.consumptionType}
                onChange={(value) => handleFormChange('consumptionType', value)}
                options={CONSUMPTION_TYPES}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Timeline</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                  required
                />

                <InputField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleEndDateChange}
                  required
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Hash size={16} />
                <span>Consumption Amounts</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InputField
                    label="Hash Amount"
                    type="number"
                    value={formData.hashAmount}
                    onChange={handleHashAmountChange}
                    unit="g"
                    placeholder="0.0"
                    help="Hash, rosin, wax, etc."
                  />
                  
                  <InputField
                    label="Flower Amount"
                    type="number"
                    value={formData.flowerAmount}
                    onChange={handleFlowerAmountChange}
                    unit="g"
                    placeholder="0.0"
                    help="Traditional flower/bud"
                  />
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Edible Amount"
                    type="number"
                    value={formData.edibleAmount}
                    onChange={handleEdibleAmountChange}
                    unit="units"
                    placeholder="0"
                    help="Gummies, chocolates, etc."
                  />
                  
                  <InputField
                    label="Vape Amount"
                    type="number"
                    value={formData.vapeAmount}
                    onChange={handleVapeAmountChange}
                    unit="g"
                    placeholder="0.0"
                    help="Vape cartridges, pods"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign size={16} />
                <span>Cost Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CurrencyField
                  label="Hash Cost per Gram"
                  value={formData.hashCostPerGram}
                  onChange={handleHashCostChange}
                  help="Your cost for hash products"
                />

                <CurrencyField
                  label="Flower Cost per Gram"
                  value={formData.flowerCostPerGram}
                  onChange={handleFlowerCostChange}
                  help="Your cost for flower"
                />

                <CurrencyField
                  label="Edible Cost per Unit"
                  value={formData.edibleCostPerUnit}
                  onChange={handleEdibleCostChange}
                  help="Cost per edible unit"
                />

                <CurrencyField
                  label="Vape Cost per Gram"
                  value={formData.vapeCostPerGram}
                  onChange={handleVapeCostChange}
                  help="Cost for vape products"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap size={16} />
                <span>Experience Tracking</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Mood Before"
                  value={formData.moodBefore}
                  onChange={handleMoodBeforeChange}
                  options={MOOD_OPTIONS}
                  help="How you felt before consuming"
                />

                <SelectField
                  label="Mood After"
                  value={formData.moodAfter}
                  onChange={handleMoodAfterChange}
                  options={MOOD_OPTIONS}
                  help="How you felt after consuming"
                />

                <div className="md:col-span-2">
                  <SelectField
                    label="Primary Effects"
                    value={formData.effects}
                    onChange={handleEffectsChange}
                    options={EFFECTS_OPTIONS}
                    help="Main effects experienced"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <TextAreaField
                label="Session Notes"
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Add any notes about this session - setting, experience, thoughts..."
                rows={4}
              />
            </div>

            <button
              onClick={handleSaveEntry}
              disabled={!formData.sessionName || (!formData.hashAmount && !formData.flowerAmount && !formData.edibleAmount && !formData.vapeAmount)}
              className={`w-full mt-8 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 ${
                (!formData.sessionName || (!formData.hashAmount && !formData.flowerAmount && !formData.edibleAmount && !formData.vapeAmount))
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:scale-105'
              }`}
            >
              <Save size={20} />
              <span>Save Session to History</span>
            </button>
          </GlassCard>
        </div>

        {/* Preview Section */}
        <div>
          <GlassCard className="p-6">
            <h3 style={{ color: textColor }} className="text-lg font-semibold mb-4">
              Session Preview
            </h3>
            
            {previewMetrics ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-center">
                    <div 
                      className="text-2xl font-bold mb-1"
                      style={{ color: '#10B981' }}
                    >
                      {formatCurrency(previewMetrics.totalCost)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-sm">
                      Total Session Cost
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="font-semibold text-blue-400">
                      {formatCurrency(previewMetrics.dailyCost)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">Daily Cost</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="font-semibold text-purple-400">
                      {previewMetrics.sessionDays}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">Days</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 style={{ color: textColor }} className="font-semibold text-sm">Consumption Breakdown:</h4>
                  
                  {parseFloat(formData.hashAmount) > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Hash size={16} className="text-blue-400" />
                        <span style={{ color: textColor }} className="text-sm">Hash</span>
                      </div>
                      <div className="text-right">
                        <div style={{ color: textColor }} className="text-sm font-medium">
                          {formData.hashAmount}g
                        </div>
                        <div style={{ color: textSecondaryColor }} className="text-xs">
                          {formatCurrency(parseFloat(formData.hashAmount) * parseFloat(formData.hashCostPerGram || 0))}
                        </div>
                      </div>
                    </div>
                  )}

                  {parseFloat(formData.flowerAmount) > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Leaf size={16} className="text-green-400" />
                        <span style={{ color: textColor }} className="text-sm">Flower</span>
                      </div>
                      <div className="text-right">
                        <div style={{ color: textColor }} className="text-sm font-medium">
                          {formData.flowerAmount}g
                        </div>
                        <div style={{ color: textSecondaryColor }} className="text-xs">
                          {formatCurrency(parseFloat(formData.flowerAmount) * parseFloat(formData.flowerCostPerGram || 0))}
                        </div>
                      </div>
                    </div>
                  )}

                  {parseFloat(formData.edibleAmount) > 0 && (
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Pill size={16} className="text-purple-400" />
                        <span style={{ color: textColor }} className="text-sm">Edibles</span>
                      </div>
                      <div className="text-right">
                        <div style={{ color: textColor }} className="text-sm font-medium">
                          {formData.edibleAmount} units
                        </div>
                        <div style={{ color: textSecondaryColor }} className="text-xs">
                          {formatCurrency(parseFloat(formData.edibleAmount) * parseFloat(formData.edibleCostPerUnit || 0))}
                        </div>
                      </div>
                    </div>
                  )}

                  {parseFloat(formData.vapeAmount) > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap size={16} className="text-orange-400" />
                        <span style={{ color: textColor }} className="text-sm">Vape</span>
                      </div>
                      <div className="text-right">
                        <div style={{ color: textColor }} className="text-sm font-medium">
                          {formData.vapeAmount}g
                        </div>
                        <div style={{ color: textSecondaryColor }} className="text-xs">
                          {formatCurrency(parseFloat(formData.vapeAmount) * parseFloat(formData.vapeCostPerGram || 0))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {formData.moodBefore && formData.moodAfter && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 style={{ color: textColor }} className="font-semibold text-sm mb-2">Mood Impact:</h4>
                    <div className="text-sm">
                      <span style={{ color: textSecondaryColor }}>Before:</span>
                      <span style={{ color: textColor }} className="ml-2">{formData.moodBefore}</span>
                    </div>
                    <div className="text-sm">
                      <span style={{ color: textSecondaryColor }}>After:</span>
                      <span style={{ color: textColor }} className="ml-2">{formData.moodAfter}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-500 mb-4" />
                <p style={{ color: textSecondaryColor }} className="text-sm">
                  Enter session details to see preview calculations
                </p>
              </div>
            )}
          </GlassCard>

          {/* Quick Tips */}
          <GlassCard className="p-6 mt-6">
            <h3 style={{ color: textColor }} className="text-lg font-semibold mb-4">
              📝 Quick Tips
            </h3>
            <div className="space-y-3 text-sm" style={{ color: textSecondaryColor }}>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">•</span>
                <span>Track mood changes to understand strain effects</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Note location and setting for pattern analysis</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400">•</span>
                <span>Record costs to monitor spending habits</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-400">•</span>
                <span>Add detailed notes for future reference</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
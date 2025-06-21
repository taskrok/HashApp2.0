// components/JarFlipTracker/JarFlipForm.jsx
import React, { useMemo, useCallback } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Package, DollarSign, Calendar, Save } from 'lucide-react';
import { MATERIAL_TYPES, PACKAGING_UNITS } from '../../data/jarFlipConstants';
import { calculateFlipMetrics, formatCurrency, formatPercentage } from '../../utils/jarFlipCalculations';

export const JarFlipForm = ({
  formData,
  setFormData,
  handleFormChange,
  handleSaveProject,
  uniqueStrains,
  uniqueProcessors,
  uniqueProjectNames,
  theme,
  isDarkMode
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Real-time calculation preview
  const previewMetrics = useMemo(() => {
    if (formData.grams && parseFloat(formData.grams) > 0) {
      return calculateFlipMetrics(formData);
    }
    return null;
  }, [formData]);

  // Memoize input components to prevent re-creation on each render
  const InputField = useCallback(({ label, type = 'text', value, onChange, placeholder, list, required = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
        {label} {required && <span className="text-red-400">*</span>}
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
    </div>
  ), [textSecondaryColor]);

  const CurrencyField = useCallback(({ label, value, onChange, required = false }) => (
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
    </div>
  ), [textSecondaryColor]);

  const SelectField = useCallback(({ label, value, onChange, options, required = false }) => (
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
    </div>
  ), [textSecondaryColor]);

  // Create stable change handlers
  const handleProjectNameChange = useCallback((value) => handleFormChange('projectName', value), [handleFormChange]);
  const handleStrainChange = useCallback((value) => handleFormChange('strain', value), [handleFormChange]);
  const handleProcessorChange = useCallback((value) => handleFormChange('processor', value), [handleFormChange]);
  const handleMaterialTypeChange = useCallback((value) => handleFormChange('materialType', value), [handleFormChange]);
  const handlePackagingUnitChange = useCallback((value) => handleFormChange('packagingUnit', parseFloat(value)), [handleFormChange]);
  const handlePurchaseDateChange = useCallback((value) => handleFormChange('purchaseDate', value), [handleFormChange]);
  const handleSelloutDateChange = useCallback((value) => handleFormChange('selloutDate', value), [handleFormChange]);
  const handleCostPerGramChange = useCallback((value) => handleFormChange('costPerGram', value), [handleFormChange]);
  const handleSalePricePerGramChange = useCallback((value) => handleFormChange('salePricePerGram', value), [handleFormChange]);
  const handleGramsChange = useCallback((value) => handleFormChange('grams', value), [handleFormChange]);
  const handleOverheadCostChange = useCallback((value) => handleFormChange('overheadCost', value), [handleFormChange]);
  const handlePackagingCostChange = useCallback((value) => handleFormChange('packagingCost', value), [handleFormChange]);

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Package size={32} className="text-emerald-400" />
          <span>New Flip Project</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8">
            <h3 style={{ color: textColor }} className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Package size={20} />
              <span>Project Details</span>
            </h3>

            {/* Auto-complete data lists */}
            <datalist id="strain-list">
              {uniqueStrains.map(strain => <option key={strain} value={strain} />)}
            </datalist>
            <datalist id="processor-list">
              {uniqueProcessors.map(processor => <option key={processor} value={processor} />)}
            </datalist>
            <datalist id="project-list">
              {uniqueProjectNames.map(name => <option key={name} value={name} />)}
            </datalist>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Project Name"
                  value={formData.projectName}
                  onChange={handleProjectNameChange}
                  placeholder="e.g., Summer Zkittlez Batch"
                  list="project-list"
                  required
                />
              </div>

              <InputField
                label="Strain"
                value={formData.strain}
                onChange={handleStrainChange}
                placeholder="e.g., Zkittlez"
                list="strain-list"
              />

              <InputField
                label="Processor / Source"
                value={formData.processor}
                onChange={handleProcessorChange}
                placeholder="e.g., 710 Labs"
                list="processor-list"
              />

              <SelectField
                label="Material Type"
                value={formData.materialType}
                onChange={handleMaterialTypeChange}
                options={MATERIAL_TYPES}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: textSecondaryColor }}>
                  Packaging Unit Size: {formData.packagingUnit}g
                </label>
                <input
                  type="range"
                  min="1"
                  max="28"
                  value={formData.packagingUnit || 1}
                  onChange={(e) => handlePackagingUnitChange(e.target.value)}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs" style={{ color: textSecondaryColor }}>
                  <span>1g</span>
                  <span>28g</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Timeline</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handlePurchaseDateChange}
                />

                <InputField
                  label="Sellout Date"
                  type="date"
                  value={formData.selloutDate}
                  onChange={handleSelloutDateChange}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign size={16} />
                <span>Financial Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CurrencyField
                  label="Cost per Gram"
                  value={formData.costPerGram}
                  onChange={handleCostPerGramChange}
                  required
                />

                <CurrencyField
                  label="Sale Price per Gram"
                  value={formData.salePricePerGram}
                  onChange={handleSalePricePerGramChange}
                />

                <InputField
                  label="Quantity (grams)"
                  type="number"
                  value={formData.grams}
                  onChange={handleGramsChange}
                  placeholder="e.g., 100"
                  required
                />

                <CurrencyField
                  label="Fixed Overhead Cost"
                  value={formData.overheadCost}
                  onChange={handleOverheadCostChange}
                />

                <CurrencyField
                  label="Packaging Cost per Unit"
                  value={formData.packagingCost}
                  onChange={handlePackagingCostChange}
                />
              </div>
            </div>

            <button
              onClick={handleSaveProject}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Save size={20} />
              <span>Save Flip to History</span>
            </button>
          </GlassCard>
        </div>

        {/* Preview Section */}
        <div>
          <GlassCard className="p-6">
            <h3 style={{ color: textColor }} className="text-lg font-semibold mb-4">
              Real-time Preview
            </h3>
            
            {previewMetrics ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-center">
                    <div 
                      className="text-2xl font-bold mb-1"
                      style={{ color: previewMetrics.profit > 0 ? '#10B981' : '#EF4444' }}
                    >
                      {formatCurrency(previewMetrics.profit)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-sm">
                      Projected Profit
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="font-semibold text-blue-400">
                      {formatPercentage(previewMetrics.roi)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">ROI</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="font-semibold text-purple-400">
                      {formatPercentage(previewMetrics.margin)}
                    </div>
                    <div style={{ color: textSecondaryColor }} className="text-xs">Margin</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: textSecondaryColor }}>Total Cost:</span>
                    <span style={{ color: textColor }}>{formatCurrency(previewMetrics.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: textSecondaryColor }}>Total Revenue:</span>
                    <span style={{ color: textColor }}>{formatCurrency(previewMetrics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: textSecondaryColor }}>Packaging Units:</span>
                    <span style={{ color: textColor }}>{previewMetrics.packagingUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: textSecondaryColor }}>Flip Duration:</span>
                    <span style={{ color: textColor }}>{previewMetrics.flipDurationDays} days</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-500 mb-4" />
                <p style={{ color: textSecondaryColor }} className="text-sm">
                  Enter project details to see preview calculations
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
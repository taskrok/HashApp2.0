import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { GlassCard } from '../ui/GlassCard';
import { Plus, Save, X } from 'lucide-react';

// --- Sub-Components for the Live Preview Panel ---

// Shows expected metrics based on the selected processing path.
const ProcessIntelligencePreview = ({ theme, currentPath, isDarkMode }) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  return (
    <GlassCard className="mb-6" glow>
      <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
        <span>Process Intelligence</span>
      </h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {(currentPath.yield * 100).toFixed(1)}%
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Expected Yield</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
          <div style={{ color: textColor }} className="text-xl font-semibold mb-1">
            {currentPath.difficulty}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Difficulty</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div style={{ color: textColor }} className="font-semibold">{currentPath.time}h</div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Est. Time</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div style={{ color: textColor }} className="font-semibold">{currentPath.quality}/100</div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Quality Score</div>
        </div>
      </div>
      
      <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border-l-4 border-yellow-500">
        <div style={{ color: textColor }} className="text-sm flex items-center space-x-2">
          <span>💡</span>
          <span className="italic">{currentPath.tip}</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Shows calculated yield and efficiency based on user input.
const CalculatedResultsPreview = ({ theme, formData, currentPath, isDarkMode }) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const startWeight = parseFloat(formData.startWeight);
  const finishWeight = parseFloat(formData.finishWeight);

  if (isNaN(startWeight) || isNaN(finishWeight) || startWeight <= 0) {
    return null;
  }

  const actualYield = (finishWeight / startWeight) * 100;
  const expectedYield = currentPath ? currentPath.yield * 100 : 0;
  const variance = actualYield - expectedYield;
  const efficiency = expectedYield > 0 ? (actualYield / expectedYield) * 100 : 100;

  let efficiencyText = 'Needs Optimization';
  let efficiencyColor = '#F59E0B';
  if (efficiency >= 110) {
    efficiencyText = 'Outstanding Performance!';
    efficiencyColor = '#10B981';
  } else if (efficiency >= 100) {
    efficiencyText = 'Meeting Expectations';
    efficiencyColor = '#10B981';
  } else if (efficiency >= 90) {
    efficiencyText = 'Slight Underperformance';
    efficiencyColor = '#F59E0B';
  } else {
    efficiencyColor = '#EF4444';
  }

  return (
    <GlassCard className="mb-6" glow>
      <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
        <span>Calculated Results</span>
      </h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl">
          <div className={`text-2xl font-bold mb-1 ${actualYield >= expectedYield ? 'text-emerald-400' : 'text-amber-400'}`}>
            {actualYield.toFixed(2)}%
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Actual Yield</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
          <div className={`text-2xl font-bold mb-1 ${variance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {variance > 0 ? '+' : ''}{variance.toFixed(2)}%
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">vs Expected</div>
        </div>
      </div>
      
      <div className="text-center p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border" style={{ borderColor: efficiencyColor + '40' }}>
        <div className="text-3xl font-bold mb-2" style={{ color: efficiencyColor }}>
          {efficiency.toFixed(0)}%
        </div>
        <div style={{ color: textColor }} className="font-medium mb-1">Process Efficiency</div>
        <div style={{ color: textSecondaryColor }} className="text-sm">
          {efficiencyText}
        </div>
      </div>
    </GlassCard>
  );
};

// Shows projected financial outcomes based on user input.
const FinancialProjectionPreview = ({ theme, formData, currentPath, MARKET_PRICES, isDarkMode }) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const finishWeight = parseFloat(formData.finishWeight);
  const startWeight = parseFloat(formData.startWeight);

  if (isNaN(finishWeight) || finishWeight <= 0) {
    return null;
  }

  // 🔥 FIXED: Calculate directly with grams (no ounce conversion needed)
  const marketPrice = parseFloat(formData.marketPrice) || MARKET_PRICES[formData.finishMaterial] || 0;
  const revenue = finishWeight * marketPrice; // grams × $/gram = total revenue
  
  const materialCost = startWeight * (MARKET_PRICES[formData.startMaterial] || 0); // grams × $/gram = total cost
  const processingCost = parseFloat(formData.processingCost) || (currentPath?.cost || 0);
  const totalCost = materialCost + processingCost;
  
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <GlassCard className="mb-6" glow>
      <h4 style={{ color: textColor }} className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
        <span>Financial Projection</span>
      </h4>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span style={{ color: textSecondaryColor }} className="text-sm">Revenue:</span>
          <div className="text-right">
            <span style={{ color: textColor }} className="font-semibold">${revenue.toFixed(2)}</span>
            <div style={{ color: textSecondaryColor }} className="text-xs">
              {finishWeight}g × ${marketPrice}/g
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span style={{ color: textSecondaryColor }} className="text-sm">Material Cost:</span>
          <div className="text-right">
            <span style={{ color: textColor }} className="font-semibold">${materialCost.toFixed(2)}</span>
            <div style={{ color: textSecondaryColor }} className="text-xs">
              {startWeight}g × ${(MARKET_PRICES[formData.startMaterial] || 0).toFixed(2)}/g
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span style={{ color: textSecondaryColor }} className="text-sm">Processing Cost:</span>
          <span style={{ color: textColor }} className="font-semibold">${processingCost.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
        <div className="flex justify-between items-center">
          <span style={{ color: textColor }} className="font-semibold">Net Profit:</span>
          <div className="text-right">
            <div className={`text-xl font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${profit.toFixed(2)}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-sm">
              {margin.toFixed(1)}% margin
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// --- Main Project Form Component ---

export const ProjectForm = ({
  theme,
  isDarkMode,
  formData,
  handleFormChange,
  handleSaveProject,
  setFormData,
  showAdvanced,
  uniqueProjectNames,
  uniqueClients,
  uniqueStrains,
  uniqueProcessors,
  PROCESSING_PATHS,
  MARKET_PRICES,
  availableFinishMaterials,
  currentPath,
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  return (
    <Card theme={theme} isDarkMode={isDarkMode}>
      {/* Datalists for autocomplete suggestions */}
      <datalist id="project-names-list">
        {uniqueProjectNames.map(name => <option key={name} value={name} />)}
      </datalist>
      <datalist id="client-names-list">
        {uniqueClients.map(name => <option key={name} value={name} />)}
      </datalist>
      <datalist id="strain-list">
        {uniqueStrains.map(name => <option key={name} value={name} />)}
      </datalist>
      <datalist id="processor-list">
        {uniqueProcessors.map(name => <option key={name} value={name} />)}
      </datalist>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: textColor }}>
        <Plus size={24} style={{ color: theme?.accent || '#3B82F6' }} />
        Create New Project
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: showAdvanced ? '1fr 1fr' : '1fr', gap: '32px' }}>
        {/* --- Form Inputs Section --- */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: textSecondaryColor }}>Basic Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Project Name * 💡"
              value={formData.projectName}
              onChange={(e) => handleFormChange('projectName', e.target.value)}
              placeholder="e.g., Premium OG Live Rosin"
              list="project-names-list"
              theme={theme}
              isDarkMode={isDarkMode}
              required
            />
            <Input
              label="Client 💡"
              value={formData.client}
              onChange={(e) => handleFormChange('client', e.target.value)}
              placeholder="e.g., Green Valley Dispensary"
              list="client-names-list"
              theme={theme}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Strain 💡"
              value={formData.strain}
              onChange={(e) => handleFormChange('strain', e.target.value)}
              placeholder="e.g., Wedding Cake"
              list="strain-list"
              theme={theme}
              isDarkMode={isDarkMode}
            />
            <Input
              label="Processor 💡"
              value={formData.processor}
              onChange={(e) => handleFormChange('processor', e.target.value)}
              placeholder="e.g., Master Extractor"
              list="processor-list"
              theme={theme}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleFormChange('startDate', e.target.value)}
              theme={theme}
              isDarkMode={isDarkMode}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleFormChange('endDate', e.target.value)}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: textSecondaryColor }}>Processing Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Select
              label="Starting Material"
              value={formData.startMaterial}
              onChange={(e) => handleFormChange('startMaterial', e.target.value)}
              options={Object.keys(PROCESSING_PATHS).map(mat => ({ value: mat, label: mat }))}
              theme={theme}
              isDarkMode={isDarkMode}
            />
            <Select
              label="Finished Product"
              value={formData.finishMaterial}
              onChange={(e) => handleFormChange('finishMaterial', e.target.value)}
              options={availableFinishMaterials.map(mat => ({ value: mat, label: mat }))}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Start Weight (grams) *"
              type="number"
              step="0.1"
              value={formData.startWeight}
              onChange={(e) => handleFormChange('startWeight', e.target.value)}
              placeholder="e.g., 4536"
              theme={theme}
              isDarkMode={isDarkMode}
              required
            />
            <Input
              label="Finish Weight (grams) *"
              type="number"
              step="0.1"
              value={formData.finishWeight}
              onChange={(e) => handleFormChange('finishWeight', e.target.value)}
              placeholder="e.g., 272"
              theme={theme}
              isDarkMode={isDarkMode}
              required
            />
          </div>
          
          {showAdvanced && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Input
                  label="Processing Cost ($)"
                  type="number"
                  step="0.01"
                  value={formData.processingCost}
                  onChange={(e) => handleFormChange('processingCost', e.target.value)}
                  placeholder={`Default: ${currentPath?.cost || 0}`}
                  theme={theme}
                  isDarkMode={isDarkMode}
                />
                <Input
                  label="Market Price ($/oz)"
                  type="number"
                  step="0.01"
                  value={formData.marketPrice}
                  onChange={(e) => handleFormChange('marketPrice', e.target.value)}
                  placeholder={`Suggested: ${MARKET_PRICES[formData.finishMaterial] || 0}`}
                  theme={theme}
                  isDarkMode={isDarkMode}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: textColor, fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Add any processing notes, observations, or special conditions..."
                  style={{
                    width: '100%', padding: '12px', border: `1px solid ${theme?.border || '#333333'}`,
                    borderRadius: '8px', background: theme?.cardBgColor || '#111111', color: textColor,
                    fontSize: '1rem', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
              </div>
            </>
          )}
        </div>
        
        {/* --- Live Preview & Analysis Section --- */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: textSecondaryColor }}>Live Preview & Analysis</h3>
          
          {currentPath && (
            <ProcessIntelligencePreview theme={theme} currentPath={currentPath} isDarkMode={isDarkMode} />
          )}
          
          {formData.startWeight && formData.finishWeight && (
            <CalculatedResultsPreview theme={theme} formData={formData} currentPath={currentPath} isDarkMode={isDarkMode} />
          )}
          
          {formData.finishWeight && showAdvanced && (
            <FinancialProjectionPreview theme={theme} formData={formData} currentPath={currentPath} MARKET_PRICES={MARKET_PRICES} isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
      
      {/* --- Form Actions --- */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <Button 
          variant="secondary" 
          theme={theme} 
          isDarkMode={isDarkMode}
          onClick={() => {
            setFormData({
              projectName: '', client: '', strain: '', processor: '',
              startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10),
              startMaterial: 'Fresh Frozen', finishMaterial: 'Live Rosin',
              startWeight: '', finishWeight: '', notes: '',
              marketPrice: '', processingCost: ''
            });
          }}
        >
          <X size={16} />
          Clear Form
        </Button>
        <Button 
          onClick={handleSaveProject} 
          disabled={!formData.projectName || !formData.startWeight || !formData.finishWeight} 
          theme={theme}
          isDarkMode={isDarkMode}
        >
          <Save size={16} />
          Save Project
        </Button>
      </div>
    </Card>
  );
};
// components/ConsumptionTracker/ConsumptionHistory.jsx
import React, { useMemo, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { 
  Package, 
  Edit3, 
  Trash2, 
  Grid, 
  List, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Hash,
  Leaf,
  Pill,
  Zap,
  Clock,
  MapPin,
  Smile,
  Frown
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/consumptionCalculations';

// Safe function to get performance color
const getPerformanceColor = (value, type) => {
  if (typeof value !== 'number') return '#FFFFFF';
  
  switch (type) {
    case 'cost':
      if (value < 20) return '#10B981'; // green
      if (value < 50) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    default:
      return '#FFFFFF';
  }
};

export const ConsumptionHistory = ({
  entries = [],
  viewMode = 'grid',
  setViewMode,
  selectedEntries = [],
  setSelectedEntries,
  onEditEntry,
  onDeleteEntry,
  searchQuery = '',
  theme = {},
  isDarkMode = false
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    if (!Array.isArray(entries)) return [];
    
    let filtered = entries.filter(entry => {
      if (!entry) return false;
      
      const matchesSearch = !searchQuery || 
        (entry.sessionName && entry.sessionName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.strain && entry.strain.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.location && entry.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.sessionType && entry.sessionType.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'hash' && (entry.hashAmount || 0) > 0) ||
        (filterBy === 'flower' && (entry.flowerAmount || 0) > 0) ||
        (filterBy === 'edibles' && (entry.edibleAmount || 0) > 0) ||
        (filterBy === 'vape' && (entry.vapeAmount || 0) > 0) ||
        (filterBy === 'recent' && entry.endDate && new Date(entry.endDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filterBy === 'expensive' && (entry.totalCost || 0) > 50) ||
        (filterBy === 'social' && entry.sessionType === 'Social') ||
        (filterBy === 'solo' && entry.sessionType === 'Solo');

      return matchesSearch && matchesFilter;
    });

    // Sort entries
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.endDate || 0);
          bVal = new Date(b.endDate || 0);
          break;
        case 'cost':
          aVal = a.totalCost || 0;
          bVal = b.totalCost || 0;
          break;
        case 'duration':
          aVal = a.sessionDays || 0;
          bVal = b.sessionDays || 0;
          break;
        case 'name':
          aVal = (a.sessionName || '').toLowerCase();
          bVal = (b.sessionName || '').toLowerCase();
          break;
        case 'amount':
          aVal = (a.hashAmount || 0) + (a.flowerAmount || 0) + (a.edibleAmount || 0) + (a.vapeAmount || 0);
          bVal = (b.hashAmount || 0) + (b.flowerAmount || 0) + (b.edibleAmount || 0) + (b.vapeAmount || 0);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [entries, searchQuery, filterBy, sortBy, sortOrder]);

  const SessionCard = ({ entry }) => {
    if (!entry) return null;
    
    const totalConsumption = (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
    const dailyCost = entry.dailyCost || ((entry.totalCost || 0) / Math.max(1, entry.sessionDays || 1));
    
    return (
      <GlassCard className="p-6 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 style={{ color: textColor }} className="text-lg font-semibold mb-1">
              {entry.sessionName || 'Unnamed Session'}
            </h3>
            <div className="flex items-center space-x-4 text-sm mb-2" style={{ color: textSecondaryColor }}>
              <span className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{entry.startDate ? new Date(entry.startDate).toLocaleDateString() : 'No date'}</span>
                {entry.startDate !== entry.endDate && entry.endDate && (
                  <>
                    <span>-</span>
                    <span>{new Date(entry.endDate).toLocaleDateString()}</span>
                  </>
                )}
              </span>
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{entry.sessionDays || 1} {(entry.sessionDays || 1) > 1 ? 'days' : 'day'}</span>
              </span>
              {entry.location && (
                <span className="flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>{entry.location}</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                {entry.sessionType || 'Mixed'}
              </span>
              {entry.strain && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  {entry.strain}
                </span>
              )}
              {entry.consumptionType && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  {entry.consumptionType}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEditEntry && onEditEntry(entry)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Copy session"
            >
              <Edit3 size={16} style={{ color: textSecondaryColor }} />
            </button>
            <button
              onClick={() => onDeleteEntry && onDeleteEntry(entry.id)}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
              title="Delete session"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Consumption breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {(entry.hashAmount || 0) > 0 && (
            <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Hash size={14} className="text-blue-400" />
                <span style={{ color: textColor }} className="text-sm">Hash</span>
              </div>
              <span style={{ color: textColor }} className="text-sm font-medium">{entry.hashAmount}g</span>
            </div>
          )}
          {(entry.flowerAmount || 0) > 0 && (
            <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Leaf size={14} className="text-green-400" />
                <span style={{ color: textColor }} className="text-sm">Flower</span>
              </div>
              <span style={{ color: textColor }} className="text-sm font-medium">{entry.flowerAmount}g</span>
            </div>
          )}
          {(entry.edibleAmount || 0) > 0 && (
            <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Pill size={14} className="text-purple-400" />
                <span style={{ color: textColor }} className="text-sm">Edibles</span>
              </div>
              <span style={{ color: textColor }} className="text-sm font-medium">{entry.edibleAmount}</span>
            </div>
          )}
          {(entry.vapeAmount || 0) > 0 && (
            <div className="flex items-center justify-between p-2 bg-orange-500/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap size={14} className="text-orange-400" />
                <span style={{ color: textColor }} className="text-sm">Vape</span>
              </div>
              <span style={{ color: textColor }} className="text-sm font-medium">{entry.vapeAmount}g</span>
            </div>
          )}
        </div>

        {/* Cost and mood info */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div 
              className="text-lg font-bold"
              style={{ color: getPerformanceColor(entry.totalCost, 'cost') }}
            >
              {formatCurrency ? formatCurrency(entry.totalCost || 0) : `$${(entry.totalCost || 0).toFixed(2)}`}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-xs">Total Cost</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div 
              className="text-lg font-bold"
              style={{ color: getPerformanceColor(dailyCost, 'cost') }}
            >
              {formatCurrency ? formatCurrency(dailyCost) : `$${dailyCost.toFixed(2)}`}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-xs">Daily Cost</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-blue-400">
              {totalConsumption.toFixed(1)}g
            </div>
            <div style={{ color: textSecondaryColor }} className="text-xs">Total Amount</div>
          </div>
        </div>

        {/* Mood tracking */}
        {(entry.moodBefore || entry.moodAfter) && (
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <h4 style={{ color: textColor }} className="font-semibold text-sm mb-2">Mood Impact:</h4>
            <div className="flex items-center justify-between">
              {entry.moodBefore && (
                <div className="flex items-center space-x-2">
                  <span style={{ color: textSecondaryColor }} className="text-xs">Before:</span>
                  <span style={{ color: textColor }} className="text-sm">{entry.moodBefore}</span>
                  {(entry.moodBefore.includes('Happy') || entry.moodBefore.includes('Excited')) ? 
                    <Smile size={14} className="text-green-400" /> : 
                    <Frown size={14} className="text-red-400" />
                  }
                </div>
              )}
              {entry.moodAfter && (
                <div className="flex items-center space-x-2">
                  <span style={{ color: textSecondaryColor }} className="text-xs">After:</span>
                  <span style={{ color: textColor }} className="text-sm">{entry.moodAfter}</span>
                  {(entry.moodAfter.includes('Happy') || entry.moodAfter.includes('Relaxed')) ? 
                    <Smile size={14} className="text-green-400" /> : 
                    <Frown size={14} className="text-red-400" />
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Effects and notes */}
        {entry.effects && (
          <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg mb-4">
            <h4 style={{ color: textColor }} className="font-semibold text-sm mb-1">Effects:</h4>
            <span style={{ color: textSecondaryColor }} className="text-sm">{entry.effects}</span>
          </div>
        )}

        {entry.notes && (
          <div className="p-3 bg-white/5 rounded-lg">
            <h4 style={{ color: textColor }} className="font-semibold text-sm mb-1">Notes:</h4>
            <p style={{ color: textSecondaryColor }} className="text-sm">{entry.notes}</p>
          </div>
        )}
      </GlassCard>
    );
  };

  const SessionRow = ({ entry }) => {
    if (!entry) return null;
    
    const totalConsumption = (entry.hashAmount || 0) + (entry.flowerAmount || 0) + (entry.edibleAmount || 0) + (entry.vapeAmount || 0);
    const dailyCost = entry.dailyCost || ((entry.totalCost || 0) / Math.max(1, entry.sessionDays || 1));

    return (
      <div className="flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
        <div className="flex-1 grid grid-cols-7 gap-4 items-center">
          <div>
            <h4 style={{ color: textColor }} className="font-semibold">{entry.sessionName || 'Unnamed Session'}</h4>
            <p style={{ color: textSecondaryColor }} className="text-sm">{entry.strain || 'No strain'}</p>
          </div>
          <div className="text-center">
            <div style={{ color: textColor }} className="font-medium">{entry.sessionType || 'Mixed'}</div>
            <div style={{ color: textSecondaryColor }} className="text-sm">{entry.location || 'Unknown'}</div>
          </div>
          <div className="text-center">
            <div style={{ color: textColor }} className="font-medium">{totalConsumption.toFixed(1)}g</div>
            <div style={{ color: textSecondaryColor }} className="text-sm">Total</div>
          </div>
          <div className="text-center">
            <div 
              className="font-bold"
              style={{ color: getPerformanceColor(entry.totalCost, 'cost') }}
            >
              {formatCurrency ? formatCurrency(entry.totalCost || 0) : `$${(entry.totalCost || 0).toFixed(2)}`}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-sm">Total Cost</div>
          </div>
          <div className="text-center">
            <div 
              className="font-bold"
              style={{ color: getPerformanceColor(dailyCost, 'cost') }}
            >
              {formatCurrency ? formatCurrency(dailyCost) : `$${dailyCost.toFixed(2)}`}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-sm">Daily Cost</div>
          </div>
          <div className="text-center">
            <div style={{ color: textColor }} className="font-medium">{entry.sessionDays || 1}</div>
            <div style={{ color: textSecondaryColor }} className="text-sm">Days</div>
          </div>
          <div className="text-center">
            <div style={{ color: textColor }} className="font-medium">
              {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'No date'}
            </div>
            <div style={{ color: textSecondaryColor }} className="text-sm">Ended</div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEditEntry && onEditEntry(entry)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Edit3 size={16} style={{ color: textSecondaryColor }} />
          </button>
          <button
            onClick={() => onDeleteEntry && onDeleteEntry(entry.id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Package size={32} className="text-blue-400" />
          <span>Session History</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode && setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
              }`}
              style={{ color: viewMode === 'grid' ? undefined : textSecondaryColor }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode && setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
              }`}
              style={{ color: viewMode === 'list' ? undefined : textSecondaryColor }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              readOnly
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              style={{ color: textColor }}
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
            style={{ color: textColor }}
          >
            <option value="all" className="bg-slate-800">All Sessions</option>
            <option value="hash" className="bg-slate-800">Hash Sessions</option>
            <option value="flower" className="bg-slate-800">Flower Sessions</option>
            <option value="edibles" className="bg-slate-800">Edible Sessions</option>
            <option value="vape" className="bg-slate-800">Vape Sessions</option>
            <option value="recent" className="bg-slate-800">Recent (7 days)</option>
            <option value="expensive" className="bg-slate-800">High Cost ($50+)</option>
            <option value="social" className="bg-slate-800">Social Sessions</option>
            <option value="solo" className="bg-slate-800">Solo Sessions</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
            style={{ color: textColor }}
          >
            <option value="date" className="bg-slate-800">Sort by Date</option>
            <option value="cost" className="bg-slate-800">Sort by Cost</option>
            <option value="amount" className="bg-slate-800">Sort by Amount</option>
            <option value="duration" className="bg-slate-800">Sort by Duration</option>
            <option value="name" className="bg-slate-800">Sort by Name</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
            style={{ color: textColor }}
          >
            <option value="desc" className="bg-slate-800">Descending</option>
            <option value="asc" className="bg-slate-800">Ascending</option>
          </select>
        </div>
      </GlassCard>

      {/* Sessions Display */}
      {filteredAndSortedEntries.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-2">No sessions found</h3>
          <p style={{ color: textSecondaryColor }} className="text-lg mb-6">
            {entries.length === 0 
              ? "Start tracking your first consumption session"
              : "Try adjusting your search or filters"
            }
          </p>
        </GlassCard>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEntries.map((entry) => (
                <SessionCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* List Header */}
              <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-white/5 rounded-xl font-medium" style={{ color: textSecondaryColor }}>
                <div>Session</div>
                <div className="text-center">Type</div>
                <div className="text-center">Amount</div>
                <div className="text-center">Total Cost</div>
                <div className="text-center">Daily Cost</div>
                <div className="text-center">Duration</div>
                <div className="text-center">Date</div>
              </div>
              
              {/* List Items */}
              <div className="space-y-3">
                {filteredAndSortedEntries.map((entry) => (
                  <SessionRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}
          
          {/* Summary */}
          <div className="mt-8 text-center">
            <p style={{ color: textSecondaryColor }}>
              Showing {filteredAndSortedEntries.length} of {entries.length} sessions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add default export for compatibility
export default ConsumptionHistory;
// components/JarFlipTracker/JarFlipHistory.jsx
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
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor } from '../../utils/jarFlipCalculations';

export const JarFlipHistory = ({
  projects,
  viewMode,
  setViewMode,
  selectedProjects,
  setSelectedProjects,
  onEditProject,
  onDeleteProject,
  searchQuery,
  theme,
  isDarkMode
}) => {
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = !searchQuery || 
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.strain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.processor?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'profitable' && project.profit > 0) ||
        (filterBy === 'unprofitable' && project.profit <= 0) ||
        (filterBy === 'recent' && new Date(project.selloutDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.selloutDate);
          bVal = new Date(b.selloutDate);
          break;
        case 'profit':
          aVal = a.profit;
          bVal = b.profit;
          break;
        case 'roi':
          aVal = a.roi;
          bVal = b.roi;
          break;
        case 'name':
          aVal = a.projectName.toLowerCase();
          bVal = b.projectName.toLowerCase();
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
  }, [projects, searchQuery, filterBy, sortBy, sortOrder]);

  const ProjectCard = ({ project }) => (
    <GlassCard className="p-6 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 style={{ color: textColor }} className="text-lg font-semibold mb-1">
            {project.projectName}
          </h3>
          <p style={{ color: textSecondaryColor }} className="text-sm mb-2">
            {project.strain} • {project.materialType} • {project.processor}
          </p>
          <div className="flex items-center space-x-4 text-xs" style={{ color: textSecondaryColor }}>
            <span className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{new Date(project.selloutDate).toLocaleDateString()}</span>
            </span>
            <span>{project.grams}g</span>
            <span>{project.packagingUnits} units</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEditProject(project)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Copy project"
          >
            <Edit3 size={16} style={{ color: textSecondaryColor }} />
          </button>
          <button
            onClick={() => onDeleteProject(project.id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
            title="Delete project"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-white/5 rounded-lg">
          <div 
            className="text-lg font-bold"
            style={{ color: getPerformanceColor(project.profit) }}
          >
            {formatCurrency(project.profit)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Profit</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <div 
            className="text-lg font-bold"
            style={{ color: getPerformanceColor(project.roi, 'roi') }}
          >
            {formatPercentage(project.roi)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">ROI</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-lg font-bold text-blue-400">
            {project.flipDurationDays}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-xs">Days</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span style={{ color: textSecondaryColor }}>Cost:</span>
            <span style={{ color: textColor }}>{formatCurrency(project.totalCost)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: textSecondaryColor }}>Revenue:</span>
            <span style={{ color: textColor }}>{formatCurrency(project.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );

  const ProjectRow = ({ project }) => (
    <div className="flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
        <div>
          <h4 style={{ color: textColor }} className="font-semibold">{project.projectName}</h4>
          <p style={{ color: textSecondaryColor }} className="text-sm">{project.strain}</p>
        </div>
        <div className="text-center">
          <div style={{ color: textColor }} className="font-medium">{project.materialType}</div>
          <div style={{ color: textSecondaryColor }} className="text-sm">{project.grams}g</div>
        </div>
        <div className="text-center">
          <div 
            className="font-bold"
            style={{ color: getPerformanceColor(project.profit) }}
          >
            {formatCurrency(project.profit)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Profit</div>
        </div>
        <div className="text-center">
          <div 
            className="font-bold"
            style={{ color: getPerformanceColor(project.roi, 'roi') }}
          >
            {formatPercentage(project.roi)}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">ROI</div>
        </div>
        <div className="text-center">
          <div style={{ color: textColor }} className="font-medium">{project.flipDurationDays}</div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Days</div>
        </div>
        <div className="text-center">
          <div style={{ color: textColor }} className="font-medium">
            {new Date(project.selloutDate).toLocaleDateString()}
          </div>
          <div style={{ color: textSecondaryColor }} className="text-sm">Sold</div>
        </div>
      </div>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onEditProject(project)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Edit3 size={16} style={{ color: textSecondaryColor }} />
        </button>
        <button
          onClick={() => onDeleteProject(project.id)}
          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 style={{ color: textColor }} className="text-3xl font-bold flex items-center space-x-3">
          <Package size={32} className="text-blue-400" />
          <span>Flip History</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
              }`}
              style={{ color: viewMode === 'grid' ? undefined : textSecondaryColor }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
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
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              style={{ color: textColor }}
              // Note: searchQuery is controlled by parent component
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
            style={{ color: textColor }}
          >
            <option value="all" className="bg-slate-800">All Projects</option>
            <option value="profitable" className="bg-slate-800">Profitable</option>
            <option value="unprofitable" className="bg-slate-800">Unprofitable</option>
            <option value="recent" className="bg-slate-800">Recent (30 days)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
            style={{ color: textColor }}
          >
            <option value="date" className="bg-slate-800">Sort by Date</option>
            <option value="profit" className="bg-slate-800">Sort by Profit</option>
            <option value="roi" className="bg-slate-800">Sort by ROI</option>
            <option value="name" className="bg-slate-800">Sort by Name</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl  style={{ color: textColor }} focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc" className="bg-slate-800">Descending</option>
            <option value="asc" className="bg-slate-800">Ascending</option>
          </select>
        </div>
      </GlassCard>

      {/* Projects Display */}
      {filteredAndSortedProjects.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 style={{ color: textColor }} className="text-2xl font-bold mb-2">No projects found</h3>
          <p style={{ color: textSecondaryColor }} className="text-lg mb-6">
            {projects.length === 0 
              ? "Start tracking your first flip project"
              : "Try adjusting your search or filters"
            }
          </p>
        </GlassCard>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* List Header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white/5 rounded-xl font-medium" style={{ color: textSecondaryColor }}>
                <div>Project</div>
                <div className="text-center">Material</div>
                <div className="text-center">Profit</div>
                <div className="text-center">ROI</div>
                <div className="text-center">Duration</div>
                <div className="text-center">Date</div>
              </div>
              
              {/* List Items */}
              <div className="space-y-3">
                {filteredAndSortedProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
          
          {/* Summary */}
          <div className="mt-8 text-center">
            <p style={{ color: textSecondaryColor }}>
              Showing {filteredAndSortedProjects.length} of {projects.length} projects
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
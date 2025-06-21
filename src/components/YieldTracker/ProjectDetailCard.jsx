import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Timer,
  Heart,
  Share2,
  MoreHorizontal,
  Trophy
} from 'lucide-react';
import { achievementList } from '../../data/achievements';

export const ProjectDetailCard = ({
  project,
  earnedAchievements = {},
  viewMode = 'grid',
  isSelected,
  onSelect,
  theme,
  isDarkMode
}) => {
  // Theme-based colors
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');

  // Status badge sub‐component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed:   { color: 'bg-emerald-500', text: 'Completed',   icon: CheckCircle },
      'in-progress': { color: 'bg-blue-500',   text: 'In Progress', icon: Clock },
      pending:     { color: 'bg-yellow-500', text: 'Pending',     icon: Timer }
    };
    const { color, text, icon: Icon } = statusConfig[status] || statusConfig.pending;
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${color}  style={{ color: textColor }} text-xs font-medium`}>
        <Icon size={12} />
        <span>{text}</span>
      </div>
    );
  };

  // === DYNAMIC ACHIEVEMENTS ===
  const projectBadges = Object.entries(earnedAchievements)
    .filter(([achId, record]) => record.projectId === project.id)
    .map(([achId]) => {
      const ach = achievementList.find(a => a.id === Number(achId));
      return ach ? ach.name : null;
    })
    .filter(Boolean);

  // === RENDERING ===
  if (viewMode === 'list') {
    return (
      <GlassCard className="p-4" hover selected={isSelected} onClick={onSelect}>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg">
                {project.avatar}
              </div>
              <div>
                <h4 style={{ color: textColor }} className="font-semibold">{project.projectName}</h4>
                <p style={{ color: textSecondaryColor }} className="text-sm">{project.strain}</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 text-center">
            <StatusBadge status={project.status} />
          </div>

          <div className="col-span-2 text-center">
            <p className={`font-bold ${project.efficiency >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {project.actualYieldPercent}%
            </p>
            <p style={{ color: textSecondaryColor }} className="text-xs">Yield</p>
          </div>

          <div className="col-span-2 text-center">
            <p className="font-bold text-emerald-400">${project.profit}</p>
            <p style={{ color: textSecondaryColor }} className="text-xs">Profit</p>
          </div>

          <div className="col-span-2 flex justify-end space-x-2">
            <button style={{ color: textSecondaryColor }} className="p-2 rounded-lg hover: style={{ color: textColor }} transition-colors">
              <Edit3 size={16} />
            </button>
            <button style={{ color: textSecondaryColor }} className="p-2 rounded-lg hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          {projectBadges.length > 0 && (
            <div className="col-span-12 flex items-center space-x-2 pt-4 border-t border-slate-700/50">
              <Trophy size={14} className="text-yellow-400" />
              <span style={{ color: textSecondaryColor }} className="text-xs">
                {projectBadges.join(', ')}
              </span>
            </div>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="space-y-4 group" hover glow selected={isSelected} onClick={onSelect}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
            {project.avatar}
          </div>
          <div>
            <h4 style={{ color: textColor }} className="font-bold group-hover:text-blue-400 transition-colors">
              {project.projectName}
            </h4>
            <p style={{ color: textSecondaryColor }} className="text-sm">{project.strain}</p>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl">
          <p className={`text-2xl font-bold ${project.efficiency >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {project.actualYieldPercent}%
          </p>
          <p style={{ color: textSecondaryColor }} className="text-xs">Yield</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
          <p className="text-2xl font-bold text-emerald-400">${project.profit}</p>
          <p style={{ color: textSecondaryColor }} className="text-xs">Profit</p>
        </div>
      </div>

      {/* Tags & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(project.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-1">
          <button style={{ color: textSecondaryColor }} className="p-1.5 rounded-lg hover: style={{ color: textColor }} transition-colors">
            <Heart size={14} />
          </button>
          <button style={{ color: textSecondaryColor }} className="p-1.5 rounded-lg hover: style={{ color: textColor }} transition-colors">
            <Share2 size={14} />
          </button>
          <button style={{ color: textSecondaryColor }} className="p-1.5 rounded-lg hover: style={{ color: textColor }} transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Achievements */}
      {projectBadges.length > 0 && (
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
          <Trophy size={14} className="text-yellow-400" />
          <span style={{ color: textSecondaryColor }} className="text-xs">
            {projectBadges.join(', ')}
          </span>
        </div>
      )}
    </GlassCard>
  );
};

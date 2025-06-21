import React, { useState, useMemo, useEffect } from 'react';
import { 
  Crown, Medal, Award, Trophy, Star, Flame, Target, TrendingUp, 
  Users, BarChart3, Zap, Filter, Search, Download, Share2, 
  ChevronDown, ArrowUp, ArrowDown, Eye, Sparkles, Gift,
  Calendar, MapPin, Activity, Percent, Hash, Volume2, X, 
  ArrowLeft, ExternalLink, Clock, Tag
} from 'lucide-react';

// Enhanced UI Components
const GlassCard = ({ children, className = "", hover = true, glow = false }) => (
    <div className={`
        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
        border border-white/20 rounded-2xl shadow-2xl
        ${hover ? 'hover:from-white/15 hover:to-white/10 hover:border-white/30 hover:shadow-3xl transition-all duration-300' : ''}
        ${glow ? 'shadow-purple-500/25 ring-1 ring-purple-500/30' : ''}
        ${className}
    `}>
        {children}
    </div>
);

const AnimatedCounter = ({ value, duration = 1500, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    
    return <span>{prefix}{count}{suffix}</span>;
};

const TabButton = ({ label, icon, isActive, onClick, badge, pulse = false }) => (
    <button
        onClick={onClick}
        className={`
            relative flex items-center gap-3 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300
            ${isActive 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600  style={{ color: textColor }} shadow-lg shadow-purple-500/25 scale-105' 
                : 'text-gray-300 hover:bg-white/10 hover: style={{ color: textColor }} hover:scale-105'
            }
        `}
    >
        <div className={pulse && isActive ? 'animate-pulse' : ''}>
            {icon}
        </div>
        {label}
        {badge && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs  style={{ color: textColor }} flex items-center justify-center animate-bounce">
                {badge}
            </span>
        )}
    </button>
);

// Competitor Detail Modal Component
const CompetitorDetailModal = ({ competitor, isOpen, onClose, placementData, eventData }) => {
    if (!isOpen || !competitor) return null;

    // Mock detailed data - in real app, this would come from your database
    const mockCompetitorDetails = {
        awards: [
            { 
                competition: "High Times Cannabis Cup 2024", 
                category: "Flower - Indica", 
                rank: 1, 
                entryName: "Purple Sunset", 
                date: "2024-04-20",
                location: "Denver, CO",
                score: 95.5
            },
            { 
                competition: "Emerald Cup 2023", 
                category: "Rosin - Live", 
                rank: 2, 
                entryName: "Golden Hash", 
                date: "2023-12-09",
                location: "Santa Rosa, CA",
                score: 92.1
            },
            { 
                competition: "Cannabis Cup Amsterdam 2024", 
                category: "BHO - Shatter", 
                rank: 3, 
                entryName: "Crystal Clear", 
                date: "2024-06-15",
                location: "Amsterdam, NL",
                score: 89.7
            }
        ],
        stats: {
            averageScore: 92.4,
            bestCategory: "Flower Products",
            yearsActive: 3,
            locations: ["Denver", "Santa Rosa", "Amsterdam"]
        }
    };

    const getRankBadge = (rank) => {
        const badges = {
            1: { icon: <Crown size={16} />, class: "from-yellow-400 to-yellow-600", text: "Champion" },
            2: { icon: <Medal size={16} />, class: "from-gray-300 to-gray-500", text: "Runner-up" },
            3: { icon: <Award size={16} />, class: "from-amber-400 to-amber-600", text: "Third Place" }
        };
        return badges[rank] || { icon: <Trophy size={16} />, class: "from-purple-400 to-purple-600", text: `#${rank}` };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <GlassCard className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center  style={{ color: textColor }} text-xl font-bold">
                                {competitor.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold  style={{ color: textColor }} mb-1">{competitor.name}</h2>
                                <div className="flex items-center gap-4 text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Trophy size={16} />
                                        {competitor.total} Total Awards
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Target size={16} />
                                        {Math.round((competitor.first / competitor.total) * 100)}% Win Rate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {mockCompetitorDetails.stats.yearsActive} Years Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover: style={{ color: textColor }} transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4 rounded-xl border border-yellow-500/30">
                                <div className="text-yellow-400 text-2xl font-bold">{competitor.first || 0}</div>
                                <div className="text-yellow-300 text-sm">🥇 First Place</div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-300/20 to-gray-500/20 p-4 rounded-xl border border-gray-400/30">
                                <div className="text-gray-300 text-2xl font-bold">{competitor.second || 0}</div>
                                <div className="text-gray-400 text-sm">🥈 Second Place</div>
                            </div>
                            <div className="bg-gradient-to-r from-amber-400/20 to-amber-600/20 p-4 rounded-xl border border-amber-500/30">
                                <div className="text-amber-400 text-2xl font-bold">{competitor.third || 0}</div>
                                <div className="text-amber-300 text-sm">🥉 Third Place</div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-4 rounded-xl border border-purple-500/30">
                                <div className="text-purple-400 text-2xl font-bold">{mockCompetitorDetails.stats.averageScore}</div>
                                <div className="text-purple-300 text-sm">Average Score</div>
                            </div>
                        </div>

                        {/* Award History */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold  style={{ color: textColor }} mb-4 flex items-center gap-2">
                                <Trophy className="text-yellow-400" size={20} />
                                Award History
                            </h3>
                            <div className="space-y-3">
                                {mockCompetitorDetails.awards.map((award, index) => {
                                    const rankBadge = getRankBadge(award.rank);
                                    return (
                                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${rankBadge.class}  style={{ color: textColor }} flex items-center gap-1`}>
                                                        {rankBadge.icon}
                                                        <span className="text-sm font-medium">{rankBadge.text}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold  style={{ color: textColor }}">{award.competition}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={14} />
                                                                {award.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {award.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold  style={{ color: textColor }}">{award.score}</div>
                                                    <div className="text-xs text-gray-400">Score</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={16} className="text-purple-400" />
                                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                                        {award.category}
                                                    </span>
                                                </div>
                                                <div className="text-gray-300 font-medium">
                                                    "{award.entryName}"
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Performance Insights */}
                        <div>
                            <h3 className="text-xl font-bold  style={{ color: textColor }} mb-4 flex items-center gap-2">
                                <BarChart3 className="text-blue-400" size={20} />
                                Performance Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h4 className=" style={{ color: textColor }} font-medium mb-2">Best Category</h4>
                                    <div className="text-2xl font-bold text-blue-400">{mockCompetitorDetails.stats.bestCategory}</div>
                                    <div className="text-sm text-gray-400">Highest win rate</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h4 className=" style={{ color: textColor }} font-medium mb-2">Global Presence</h4>
                                    <div className="text-2xl font-bold text-green-400">{mockCompetitorDetails.stats.locations.length}</div>
                                    <div className="text-sm text-gray-400">Countries competed</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 hover: style={{ color: textColor }} transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Leaderboard
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover: style={{ color: textColor }} transition-colors">
                                <Download size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover: style={{ color: textColor }} transition-colors">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

const LeaderCard = ({ competitor, rank, isTopThree, onClick, category = "overall" }) => {
    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
        if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
        return <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center  style={{ color: textColor }} text-sm font-bold">{rank}</div>;
    };

    const getRankGlow = (rank) => {
        if (rank === 1) return 'shadow-yellow-400/50 ring-yellow-400/30';
        if (rank === 2) return 'shadow-gray-300/50 ring-gray-300/30';
        if (rank === 3) return 'shadow-amber-600/50 ring-amber-600/30';
        return '';
    };

    const winRate = competitor.total > 0 ? Math.round((competitor.first / competitor.total) * 100) : 0;

    return (
        <GlassCard 
            className={`
                p-6 cursor-pointer transform transition-all duration-300 hover:scale-105
                ${isTopThree ? `ring-2 ${getRankGlow(rank)}` : ''}
                ${rank === 1 ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5' : ''}
            `}
            hover={true}
            glow={isTopThree}
            onClick={() => onClick && onClick(competitor)}
        >
            <div className="flex items-center gap-4">
                {/* Rank Icon */}
                <div className="relative">
                    {getRankIcon(rank)}
                    {isTopThree && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                            <Flame className="w-2 h-2  style={{ color: textColor }}" />
                        </div>
                    )}
                </div>

                {/* Competitor Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold  style={{ color: textColor }} text-lg truncate">{competitor.name}</h3>
                        {rank <= 3 && (
                            <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs  style={{ color: textColor }} font-medium">
                                Elite
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>{competitor.total} awards</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{winRate}% win rate</span>
                        </div>
                    </div>
                </div>

                {/* Award Breakdown */}
                <div className="text-right">
                    <div className="text-2xl font-bold  style={{ color: textColor }} mb-1">
                        <AnimatedCounter value={competitor.total} />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-400">🥇{competitor.first || 0}</span>
                        <span className="text-gray-300">🥈{competitor.second || 0}</span>
                        <span className="text-amber-600">🥉{competitor.third || 0}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {competitor.total > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Performance</span>
                        <span>{winRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${winRate}%` }}
                        />
                    </div>
                </div>
            )}
        </GlassCard>
    );
};

const StatsCard = ({ title, value, change, icon, color = "purple" }) => {
    const colorClasses = {
        purple: 'from-purple-400 to-purple-600',
        yellow: 'from-yellow-400 to-yellow-600', 
        green: 'from-green-400 to-green-600',
        blue: 'from-blue-400 to-blue-600'
    };

    return (
        <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${colorClasses[color]} rounded-full blur-2xl`} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} bg-opacity-20`}>
                        {icon}
                    </div>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                            change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
                <p className="text-3xl font-bold  style={{ color: textColor }}">
                    <AnimatedCounter value={value} duration={2000} />
                </p>
            </div>
        </GlassCard>
    );
};

const LeaderboardTable = ({ data, type, onRowClick }) => {
    const [sortBy, setSortBy] = useState('total');
    const [sortOrder, setSortOrder] = useState('desc');
    
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortBy] || 0;
            const bVal = b[sortBy] || 0;
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });
    }, [data, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const SortableHeader = ({ field, children }) => (
        <th 
            className="p-4 text-left cursor-pointer hover:bg-white/5 transition-colors group"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                {children}
                <div className="flex flex-col">
                    <ChevronDown className={`w-3 h-3 transition-all ${
                        sortBy === field && sortOrder === 'asc' ? 'rotate-180 text-purple-400' : 'text-gray-600'
                    }`} />
                </div>
            </div>
        </th>
    );

    return (
        <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                            <th className="p-4 text-left w-16">#</th>
                            <SortableHeader field="name">
                                <span className="font-semibold  style={{ color: textColor }}">Competitor</span>
                            </SortableHeader>
                            {type === 'placements' && (
                                <>
                                    <SortableHeader field="first">
                                        <span className="text-yellow-400">🥇 First</span>
                                    </SortableHeader>
                                    <SortableHeader field="second">
                                        <span className="text-gray-300">🥈 Second</span>
                                    </SortableHeader>
                                    <SortableHeader field="third">
                                        <span className="text-amber-600">🥉 Third</span>
                                    </SortableHeader>
                                </>
                            )}
                            <SortableHeader field="total">
                                <span className="font-semibold  style={{ color: textColor }}">Total Awards</span>
                            </SortableHeader>
                            <th className="p-4 text-center">Win Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((entry, idx) => {
                            const winRate = entry.total > 0 ? Math.round((entry.first / entry.total) * 100) : 0;
                            const isTopThree = idx < 3;
                            
                            return (
                                <tr 
                                    key={idx} 
                                    className={`
                                        border-b border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer
                                        ${isTopThree ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/5' : ''}
                                    `}
                                    onClick={() => onRowClick && onRowClick(entry)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            {idx + 1 <= 3 ? (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center  style={{ color: textColor }} font-bold text-sm">
                                                    {idx + 1}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 font-medium">{idx + 1}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                isTopThree ? 'bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse' : 'bg-gray-600'
                                            }`} />
                                            <span className="font-medium  style={{ color: textColor }}">{entry.name}</span>
                                            {isTopThree && (
                                                <Star className="w-4 h-4 text-yellow-400" />
                                            )}
                                        </div>
                                    </td>
                                    {type === 'placements' && (
                                        <>
                                            <td className="p-4 text-center">
                                                <span className="text-yellow-400 font-bold text-lg">
                                                    {entry.first || 0}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="text-gray-300 font-bold text-lg">
                                                    {entry.second || 0}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="text-amber-600 font-bold text-lg">
                                                    {entry.third || 0}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    <td className="p-4 text-center">
                                        <span className="text-2xl font-bold  style={{ color: textColor }}">
                                            {entry.total}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-12 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                                                    style={{ width: `${Math.min(winRate, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium">
                                                {winRate}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
};

// Main Enhanced Leaderboard Component
const EnhancedLeaderboardModal = ({ placementData, eventAwardData }) => {
    const [activeTab, setActiveTab] = useState('placements');
    const [viewMode, setViewMode] = useState('cards');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    const data = activeTab === 'placements' ? placementData : eventAwardData;
    
    const filteredData = useMemo(() => {
        if (!searchTerm) return data || [];
        return (data || []).filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const stats = useMemo(() => {
        if (!data) return { totalCompetitors: 0, totalAwards: 0, avgAwards: 0 };
        
        const totalCompetitors = data.length;
        const totalAwards = data.reduce((sum, item) => sum + (item.total || 0), 0);
        const avgAwards = totalCompetitors > 0 ? Math.round(totalAwards / totalCompetitors) : 0;
        
        return { totalCompetitors, totalAwards, avgAwards };
    }, [data]);

    const handleCompetitorClick = (competitor) => {
        setSelectedCompetitor(competitor);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedCompetitor(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-5xl font-bold  style={{ color: textColor }} mb-3">
                                🏆 Champions Leaderboard
                            </h1>
                            <p className="text-xl text-gray-400">
                                Celebrating excellence in cannabis competition
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    Live Rankings
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard 
                            title="Total Competitors" 
                            value={stats.totalCompetitors} 
                            icon={<Users className="w-6 h-6 text-purple-400" />} 
                            color="purple"
                        />
                        <StatsCard 
                            title="Total Awards" 
                            value={stats.totalAwards} 
                            icon={<Trophy className="w-6 h-6 text-yellow-400" />} 
                            color="yellow"
                        />
                        <StatsCard 
                            title="Average Awards" 
                            value={stats.avgAwards} 
                            icon={<BarChart3 className="w-6 h-6 text-green-400" />} 
                            color="green"
                        />
                    </div>

                    {/* Controls */}
                    <GlassCard className="p-6 mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Tab Navigation */}
                            <div className="flex gap-3">
                                <TabButton 
                                    label="Competition Awards" 
                                    icon={<Trophy size={18} />} 
                                    isActive={activeTab === 'placements'} 
                                    onClick={() => setActiveTab('placements')}
                                    badge={placementData?.length}
                                    pulse={true}
                                />
                                <TabButton 
                                    label="Industry Awards" 
                                    icon={<Award size={18} />} 
                                    isActive={activeTab === 'events'} 
                                    onClick={() => setActiveTab('events')}
                                    badge={eventAwardData?.length}
                                />
                            </div>

                            {/* Search and View Controls */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search competitors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg  style={{ color: textColor }} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-64"
                                    />
                                </div>
                                
                                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'cards' ? 'bg-purple-500  style={{ color: textColor }}' : 'text-gray-400 hover: style={{ color: textColor }}'
                                        }`}
                                    >
                                        <BarChart3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-md transition-colors ${
                                            viewMode === 'table' ? 'bg-purple-500  style={{ color: textColor }}' : 'text-gray-400 hover: style={{ color: textColor }}'
                                        }`}
                                    >
                                        <Hash size={16} />
                                    </button>
                                </div>

                                <button className="p-3 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {viewMode === 'cards' ? (
                        <div className="space-y-4">
                            {filteredData.map((competitor, index) => (
                                <LeaderCard
                                    key={competitor.name}
                                    competitor={competitor}
                                    rank={index + 1}
                                    isTopThree={index < 3}
                                    category={activeTab}
                                    onClick={handleCompetitorClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <LeaderboardTable 
                            data={filteredData} 
                            type={activeTab} 
                            onRowClick={handleCompetitorClick}
                        />
                    )}

                    {filteredData.length === 0 && (
                        <GlassCard className="p-12 text-center">
                            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold  style={{ color: textColor }} mb-2">No Results Found</h3>
                            <p className="text-gray-400">
                                {searchTerm ? `No competitors match "${searchTerm}"` : 'No data available'}
                            </p>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* Competitor Detail Modal */}
            <CompetitorDetailModal
                competitor={selectedCompetitor}
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                placementData={placementData}
                eventData={eventAwardData}
            />

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(147, 51, 234, 0.6);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(147, 51, 234, 0.8);
                }
            `}</style>
        </div>
    );
};

export default EnhancedLeaderboardModal;
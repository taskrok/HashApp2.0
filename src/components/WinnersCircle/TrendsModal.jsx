import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, Crown, Medal, Award, Star, Users, BarChart, PieChart, 
  TrendingUp, Target, Zap, Eye, Filter, Search, Download, Share2,
  Calendar, MapPin, Trophy, Flame, Leaf, ArrowUp, ArrowDown,
  Activity, DollarSign, Percent, AlertTriangle, CheckCircle,
  PlayCircle, Pause, RotateCcw, Maximize2, Minimize2
} from 'lucide-react';

// Mock data for demonstration
const mockPlacements = [
  { eventId: 1, category: "Rosin - Live", winnerNameRaw: "Green Dream Labs", rank: 1 },
  { eventId: 2, category: "BHO - Shatter", winnerNameRaw: "Crystal Clear Extracts", rank: 2 },
  { eventId: 1, category: "Flower - Indica", winnerNameRaw: "Mountain High Gardens", rank: 1 },
  { eventId: 3, category: "Edibles - Gummy", winnerNameRaw: "Sweet Relief Co", rank: 3 },
  { eventId: 2, category: "Vape - Live Resin", winnerNameRaw: "Vapor Trails", rank: 1 },
];

const mockEvents = [
  { eventId: 1, name: "High Times Cannabis Cup 2024", year: 2024, location: "Denver, CO" },
  { eventId: 2, name: "Emerald Cup 2023", year: 2023, location: "Santa Rosa, CA" },
  { eventId: 3, name: "Cannabis Cup Amsterdam 2024", year: 2024, location: "Amsterdam, NL" },
];

const mockCompetitorData = [
  { 
    name: "Green Dream Labs", 
    total: 15, 
    first: 8, 
    allAwards: [
      { eventId: 1, category: "Rosin - Live", rank: 1, entryNameRaw: "Purple Sunset Live Rosin" },
      { eventId: 2, category: "Hash - Bubble", rank: 1, entryNameRaw: "Ice Water Extract" }
    ]
  },
  { 
    name: "Crystal Clear Extracts", 
    total: 12, 
    first: 5, 
    allAwards: [
      { eventId: 2, category: "BHO - Shatter", rank: 2, entryNameRaw: "Golden Shatter" }
    ]
  }
];

// Enhanced utility functions
const getCategoryGroup = (category) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('rosin') || catLower.includes('sift') || catLower.includes('ice-o-lator') || catLower.includes('hash') || catLower.includes('solventless')) return 'Solventless';
    if (catLower.includes('bho') || catLower.includes('pho') || catLower.includes('resin') || catLower.includes('sauce') || catLower.includes('shatter') || catLower.includes('budder') || catLower.includes('sugar')) return 'Solvent';
    if (catLower.includes('flower') || catLower.includes('pre-roll')) return 'Flower';
    if (catLower.includes('edible') || catLower.includes('gummy') || catLower.includes('beverage') || catLower.includes('chocolate')) return 'Edibles';
    if (catLower.includes('vape') || catLower.includes('cartridge')) return 'Vapes & Carts';
    return 'Other';
};

const getGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

// Enhanced UI Components
const AnimatedCounter = ({ value, duration = 1000 }) => {
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
    
    return <span>{count}</span>;
};

const GlassCard = ({ children, className = "", hover = true }) => (
    <div className={`
        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
        border border-white/20 rounded-2xl shadow-2xl
        ${hover ? 'hover:from-white/15 hover:to-white/10 hover:border-white/30 hover:shadow-3xl transition-all duration-300' : ''}
        ${className}
    `}>
        {children}
    </div>
);

const MetricCard = ({ title, value, change, icon, color = "purple", trend }) => {
    const colorClasses = {
        purple: {
            bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
            icon: 'bg-purple-500/20 text-purple-400'
        },
        yellow: {
            bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
            icon: 'bg-yellow-500/20 text-yellow-400'
        },
        green: {
            bg: 'bg-gradient-to-br from-green-400 to-green-600',
            icon: 'bg-green-500/20 text-green-400'
        },
        blue: {
            bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
            icon: 'bg-blue-500/20 text-blue-400'
        }
    };
    
    return (
        <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className={`w-full h-full ${colorClasses[color].bg} rounded-full blur-3xl`} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colorClasses[color].icon}`}>
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
                <p className="text-3xl font-bold  style={{ color: textColor }} mb-2">
                    <AnimatedCounter value={value} />
                </p>
                {trend && (
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{trend}</span>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

const InteractiveChart = ({ data, type = "bar", height = 300, onDataPoint }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold  style={{ color: textColor }}">Market Evolution</h3>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                    >
                        {isPlaying ? <Pause size={16} /> : <PlayCircle size={16} />}
                    </button>
                    <button className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
            
            <div className="relative" style={{ height: `${height}px` }}>
                {/* Interactive chart visualization would go here */}
                <div className="w-full h-full bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg flex items-end justify-center">
                    <div className="text-gray-400 text-center">
                        <BarChart size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Interactive chart visualization</p>
                        <p className="text-xs">Hover for insights • Click to drill down</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

const CompetitorInsightCard = ({ competitor, rank, onSelect }) => {
    const getRankStyle = (rank) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600';
        if (rank === 2) return 'from-gray-300 to-gray-500';
        if (rank === 3) return 'from-amber-400 to-amber-600';
        return 'from-purple-400 to-purple-600';
    };
    
    return (
        <GlassCard className="p-4 cursor-pointer" hover={true} onClick={() => onSelect(competitor)}>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(rank)} flex items-center justify-center  style={{ color: textColor }} font-bold`}>
                        {rank <= 3 ? (
                            rank === 1 ? <Crown size={20} /> :
                            rank === 2 ? <Medal size={20} /> :
                            <Award size={20} />
                        ) : rank}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Flame size={12} className=" style={{ color: textColor }}" />
                    </div>
                </div>
                
                <div className="flex-1">
                    <h4 className="font-bold  style={{ color: textColor }} truncate">{competitor.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{competitor.total} awards</span>
                        <span className="text-green-400">{Math.round((competitor.first/competitor.total)*100)}% win rate</span>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="text-sm text-gray-400">Market Share</div>
                    <div className="text-lg font-bold text-purple-400">
                        {Math.round((competitor.total / 50) * 100)}%
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

const AIInsightsPanel = ({ insights }) => (
    <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <Zap size={20} className=" style={{ color: textColor }}" />
            </div>
            <div>
                <h3 className="font-bold  style={{ color: textColor }}">AI Market Insights</h3>
                <p className="text-sm text-gray-400">Powered by advanced analytics</p>
            </div>
        </div>
        
        <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="font-medium text-green-400">Opportunity Identified</span>
                </div>
                <p className="text-sm text-gray-300">
                    Solventless category showing 45% growth. Consider expanding product line.
                </p>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span className="font-medium text-amber-400">Market Alert</span>
                </div>
                <p className="text-sm text-gray-300">
                    Vape category competition intensifying. Monitor pricing strategies.
                </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-blue-400" />
                    <span className="font-medium text-blue-400">Strategic Recommendation</span>
                </div>
                <p className="text-sm text-gray-300">
                    Partner with top performers in underserved geographic markets.
                </p>
            </div>
        </div>
    </GlassCard>
);

const TabButton = ({ label, icon, isActive, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`
            relative flex items-center gap-3 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300
            ${isActive 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600  style={{ color: textColor }} shadow-lg shadow-purple-500/25' 
                : 'text-gray-300 hover:bg-white/10 hover: style={{ color: textColor }}'
            }
        `}
    >
        {icon}
        {label}
        {badge && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs  style={{ color: textColor }} flex items-center justify-center">
                {badge}
            </span>
        )}
    </button>
);

// Enhanced Tab Components
const MarketIntelligenceTab = ({ onHover, onLeave }) => {
    const [timeRange, setTimeRange] = useState('12M');
    const [selectedMetric, setSelectedMetric] = useState('awards');
    
    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <GlassCard className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <select 
                                value={timeRange} 
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2  style={{ color: textColor }} text-sm"
                            >
                                <option value="6M" className="bg-slate-800">Last 6 Months</option>
                                <option value="12M" className="bg-slate-800">Last 12 Months</option>
                                <option value="24M" className="bg-slate-800">Last 2 Years</option>
                                <option value="ALL" className="bg-slate-800">All Time</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                value={selectedMetric} 
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2  style={{ color: textColor }} text-sm"
                            >
                                <option value="awards" className="bg-slate-800">Total Awards</option>
                                <option value="winners" className="bg-slate-800">Unique Winners</option>
                                <option value="categories" className="bg-slate-800">Active Categories</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">
                            <Download size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </GlassCard>
            
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Total Awards" 
                    value={1247} 
                    change={23} 
                    icon={<Trophy size={24} />} 
                    color="purple"
                    trend="vs last period"
                />
                <MetricCard 
                    title="Market Leaders" 
                    value={89} 
                    change={12} 
                    icon={<Crown size={24} />} 
                    color="yellow"
                    trend="active competitors"
                />
                <MetricCard 
                    title="Growth Rate" 
                    value={34} 
                    change={8} 
                    icon={<TrendingUp size={24} />} 
                    color="green"
                    trend="% YoY growth"
                />
                <MetricCard 
                    title="Market Value" 
                    value={2.4} 
                    change={-3} 
                    icon={<DollarSign size={24} />} 
                    color="blue"
                    trend="billion USD"
                />
            </div>
            
            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <InteractiveChart data={[]} type="line" height={400} />
                </div>
                <div>
                    <AIInsightsPanel insights={[]} />
                </div>
            </div>
        </div>
    );
};

const CompetitorIntelligenceTab = ({ data, events, onHover, onLeave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);
    const [compareMode, setCompareMode] = useState(false);
    
    const filteredData = data.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="space-y-6">
            {/* Search and Controls */}
            <GlassCard className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search competitors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg  style={{ color: textColor }} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    
                    <button
                        onClick={() => setCompareMode(!compareMode)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                            compareMode 
                                ? 'bg-purple-500  style={{ color: textColor }}' 
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        Compare Mode
                    </button>
                </div>
            </GlassCard>
            
            {/* Competitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.slice(0, 12).map((competitor, index) => (
                    <CompetitorInsightCard
                        key={competitor.name}
                        competitor={competitor}
                        rank={index + 1}
                        onSelect={setSelectedCompetitor}
                    />
                ))}
            </div>
            
            {/* Detailed View */}
            {selectedCompetitor && (
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold  style={{ color: textColor }} mb-2">
                                {selectedCompetitor.name}
                            </h3>
                            <p className="text-gray-400">Competitive Intelligence Report</p>
                        </div>
                        <button
                            onClick={() => setSelectedCompetitor(null)}
                            className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
                        >
                            <Minimize2 size={16} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <InteractiveChart data={[]} type="area" height={300} />
                        </div>
                        <div className="space-y-4">
                            <MetricCard 
                                title="Win Rate" 
                                value={Math.round((selectedCompetitor.first/selectedCompetitor.total)*100)} 
                                icon={<Percent size={20} />} 
                                color="green"
                            />
                            <MetricCard 
                                title="Total Awards" 
                                value={selectedCompetitor.total} 
                                icon={<Trophy size={20} />} 
                                color="purple"
                            />
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

// Main Component
const EnhancedTrendsModal = ({ 
    allPlacements = mockPlacements, 
    allEvents = mockEvents, 
    competitorData = mockCompetitorData 
}) => {
    const [activeTab, setActiveTab] = useState('intelligence');
    const [tooltipData, setTooltipData] = useState({ show: false, content: '', x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const handleHover = (e, content) => 
        setTooltipData({ show: true, content, x: e.clientX + 15, y: e.clientY + 15 });
    const handleLeave = () => 
        setTooltipData({ ...tooltipData, show: false });
    
    return (
        <div className={`
            min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 
            ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}
        `}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            
            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold  style={{ color: textColor }} mb-2">
                                Cannabis Market Intelligence
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Advanced analytics for the cannabis industry
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Live Data
                                </div>
                            </div>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-3 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
                            >
                                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex gap-3 p-2 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
                        <TabButton 
                            label="Market Intelligence" 
                            icon={<BarChart size={18} />} 
                            isActive={activeTab === 'intelligence'} 
                            onClick={() => setActiveTab('intelligence')}
                            badge={3}
                        />
                        <TabButton 
                            label="Competitor Analysis" 
                            icon={<Users size={18} />} 
                            isActive={activeTab === 'competitors'} 
                            onClick={() => setActiveTab('competitors')}
                        />
                        <TabButton 
                            label="Predictive Insights" 
                            icon={<Eye size={18} />} 
                            isActive={activeTab === 'predictions'} 
                            onClick={() => setActiveTab('predictions')}
                        />
                    </div>
                </div>
                
                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'intelligence' && (
                        <MarketIntelligenceTab onHover={handleHover} onLeave={handleLeave} />
                    )}
                    {activeTab === 'competitors' && (
                        <CompetitorIntelligenceTab 
                            data={competitorData} 
                            events={allEvents} 
                            onHover={handleHover} 
                            onLeave={handleLeave} 
                        />
                    )}
                    {activeTab === 'predictions' && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                                <Eye size={32} className=" style={{ color: textColor }}" />
                            </div>
                            <h3 className="text-2xl font-bold  style={{ color: textColor }} mb-2">Predictive Insights</h3>
                            <p className="text-gray-400 mb-6">AI-powered market predictions and trend forecasting</p>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600  style={{ color: textColor }} rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all">
                                Coming Soon
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Enhanced Tooltip */}
            {tooltipData.show && (
                <div
                    className="fixed z-50 p-4 text-sm  style={{ color: textColor }} bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl pointer-events-none transition-all duration-200"
                    style={{ 
                        top: tooltipData.y, 
                        left: tooltipData.x,
                        transform: 'scale(1)',
                        opacity: 1
                    }}
                    dangerouslySetInnerHTML={{ __html: tooltipData.content }}
                />
            )}
        </div>
    );
};

export default EnhancedTrendsModal;
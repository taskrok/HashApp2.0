import React, { useState, useMemo, useRef } from 'react';
import { Search, Trophy, Calendar, MapPin, ChevronDown, Award, Medal, Crown, Star, Globe, Zap, BarChart2, Users, ArrowLeft } from 'lucide-react';
import { competitions, events, placements, eventAwards } from '../../data/database';
import CollabGraph from './CollabGraph';
import LeaderboardModal from './LeaderBoardModal';
import TrendsModal from './TrendsModal';

// Main Component - ADDED onBack prop
const WinnersCircle = ({ onBack }) => {
    // State Management
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] =useState('');
    const [expandedEvents, setExpandedEvents] = useState(new Set());
    const [showModal, setShowModal] = useState(null); // 'leaderboard', 'trends', 'collabs'

    // --- Data Processing ---
    const { processedData, placementLeaderboard, eventAwardLeaderboard, strainPerformance, stats } = useMemo(() => {
        // This part remains largely the same, but we no longer calculate categoryPopularity here.
        // It will be calculated inside the TrendsModal.
        
        const placementsByEvent = new Map();
        placements.forEach(p => {
            if (!placementsByEvent.has(p.eventId)) placementsByEvent.set(p.eventId, []);
            placementsByEvent.get(p.eventId).push(p);
        });

        const awardsByEvent = new Map();
        eventAwards.forEach(a => {
            if (!awardsByEvent.has(a.eventId)) awardsByEvent.set(a.eventId, []);
            awardsByEvent.get(a.eventId).push(a);
        });

        const enhancedEvents = events.map(event => {
            const eventPlacements = placementsByEvent.get(event.eventId) || [];
            const eventSpecialAwards = awardsByEvent.get(event.eventId) || [];
            
            const categories = {};
            eventPlacements.forEach(p => {
                if (!categories[p.category]) categories[p.category] = [];
                categories[p.category].push(p);
            });

            Object.keys(categories).forEach(cat => {
                categories[cat].sort((a, b) => (a.rank || 999) - (b.rank || 999));
            });

            return {
                ...event,
                categories,
                specialAwards: eventSpecialAwards,
                hasResults: eventPlacements.length > 0 || eventSpecialAwards.length > 0
            };
        }).filter(event => event.hasResults);

        const eventsByComp = new Map();
        enhancedEvents.forEach(event => {
            if (!eventsByComp.has(event.competitionId)) eventsByComp.set(event.competitionId, []);
            eventsByComp.get(event.competitionId).push(event);
        });

        const enhancedComps = competitions.map(comp => ({
            ...comp,
            events: (eventsByComp.get(comp.competitionId) || []).sort((a, b) => b.year - a.year)
        })).filter(comp => comp.events.length > 0);

        const dataByCountry = {};
        enhancedComps.forEach(comp => {
            const country = comp.country || 'Unknown';
            if (!dataByCountry[country]) dataByCountry[country] = [];
            dataByCountry[country].push(comp);
        });

        Object.keys(dataByCountry).forEach(country => {
            dataByCountry[country].sort((a, b) => a.name.localeCompare(b.name));
        });
        
        const competitorStats = {};
        const splitPattern = /\s+(?:&|and|\+|×|\/|x)\s+/i;
        placements.forEach(p => {
            if (!p.winnerNameRaw) return;
            String(p.winnerNameRaw).split(splitPattern).map(n => n.trim()).filter(Boolean).forEach(name => {
                if (!competitorStats[name]) {
                    competitorStats[name] = { name, first: 0, second: 0, third: 0, other: 0, total: 0, allAwards: [] };
                }
                if (p.rank === 1) competitorStats[name].first++;
                else if (p.rank === 2) competitorStats[name].second++;
                else if (p.rank === 3) competitorStats[name].third++;
                else competitorStats[name].other++;
                competitorStats[name].total++;
                competitorStats[name].allAwards.push(p);
            });
        });
        
        const RANK_POINTS = { 1: 10, 2: 7, 3: 4, other: 1 };
        Object.values(competitorStats).forEach(competitor => {
            competitor.score =
                (competitor.first * RANK_POINTS[1]) +
                (competitor.second * RANK_POINTS[2]) +
                (competitor.third * RANK_POINTS[3]) +
                (competitor.other * RANK_POINTS.other);
        });
        const placementLeaderboardData = Object.values(competitorStats)
            .sort((a, b) => (b.score || 0) - (a.score || 0));

        const eventAwardStats = {};
        eventAwards.forEach(award => {
            if (!award.winnerNameRaw) return;
            String(award.winnerNameRaw).split(splitPattern).map(n => n.trim()).filter(Boolean).forEach(name => {
                if (!eventAwardStats[name]) eventAwardStats[name] = { total: 0, allAwards: [] };
                eventAwardStats[name].total++;
                eventAwardStats[name].allAwards.push(award);
            });
        });
        const eventAwardLeaderboardData = Object.entries(eventAwardStats).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total);
        
        const strainCounts = {};
        placements.forEach(p => {
            if (p.entryNameRaw) {
                const cleanName = p.entryNameRaw.split(/[(xX]/)[0].trim();
                if (cleanName) {
                    if (!strainCounts[cleanName]) strainCounts[cleanName] = { count: 0, awards: [] };
                    strainCounts[cleanName].count++;
                    strainCounts[cleanName].awards.push(p);
                }
            }
        });
        const strainPerformanceData = Object.entries(strainCounts)
            .map(([name, data]) => ({ name, ...data }))
            .filter(strain => strain.count > 2).sort((a, b) => b.count - a.count).slice(0, 25);

        return {
            processedData: dataByCountry,
            placementLeaderboard: placementLeaderboardData,
            eventAwardLeaderboard: eventAwardLeaderboardData,
            strainPerformance: strainPerformanceData,
            stats: {
                totalCompetitions: competitions.length,
                totalEvents: events.length,
                totalWinners: placements.length,
            }
        };
    }, [competitions, events, placements, eventAwards]);

    // --- Filtering Logic ---
    const { countries, years, categories } = useMemo(() => {
        const countrySet = new Set(Object.keys(processedData));
        const yearSet = new Set();
        const categorySet = new Set();
        Object.values(processedData).flat().forEach(comp => {
            comp.events.forEach(event => {
                yearSet.add(event.year);
                Object.keys(event.categories).forEach(cat => categorySet.add(cat));
            });
        });
        return {
            countries: Array.from(countrySet).sort(),
            years: Array.from(yearSet).sort((a, b) => b - a),
            categories: Array.from(categorySet).sort()
        };
    }, [processedData]);

    const filteredData = useMemo(() => {
        const filtered = {};
        Object.entries(processedData).forEach(([country, comps]) => {
            if (selectedCountry && country !== selectedCountry) return;
            const filteredComps = comps.map(comp => {
                const searchLower = searchTerm.toLowerCase();
                const compNameMatch = comp.name.toLowerCase().includes(searchLower);

                const filteredEvents = comp.events.filter(event => {
                    const eventNameMatch = event.name.toLowerCase().includes(searchLower);
                    const yearMatch = !selectedYear || event.year.toString() === selectedYear;
                    const categoryMatch = !selectedCategory || Object.keys(event.categories).includes(selectedCategory);
                    
                    const winnerMatch = Object.values(event.categories).flat().some(p => 
                        p.winnerNameRaw?.toLowerCase().includes(searchLower) || 
                        p.entryNameRaw?.toLowerCase().includes(searchLower)
                    );
                    
                    return yearMatch && categoryMatch && (compNameMatch || eventNameMatch || winnerMatch);
                });

                if (filteredEvents.length > 0) {
                    return { ...comp, events: filteredEvents };
                }
                return null;
            }).filter(Boolean);

            if (filteredComps.length > 0) {
                filtered[country] = filteredComps;
            }
        });
        return filtered;
    }, [processedData, searchTerm, selectedCountry, selectedYear, selectedCategory]);

    // --- UI Handlers and Helpers ---
    const toggleEvent = (eventId) => {
        setExpandedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) newSet.delete(eventId);
            else newSet.add(eventId);
            return newSet;
        });
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
        if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
        return <Star className="w-4 h-4 text-blue-400" />;
    };
    
    const getRankGradient = (rank) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600';
        if (rank === 2) return 'from-gray-300 to-gray-500';
        if (rank === 3) return 'from-amber-500 to-amber-700';
        return 'from-blue-400 to-blue-600';
    };

    // --- Render Functions ---
    const renderModalContent = () => {
        switch (showModal) {
            case 'leaderboard':
                return <LeaderboardModal placementData={placementLeaderboard} eventAwardData={eventAwardLeaderboard} />;
            case 'trends':
                // Pass the raw data down to the TrendsModal
                return <TrendsModal 
                           allPlacements={placements} 
                           allEvents={events}
                           competitorData={placementLeaderboard}
                       />;
            case 'collabs':
                return <CollabGraph onClose={() => setShowModal(null)} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  style={{ color: textColor }} font-sans">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <header className="relative bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {/* ADDED: Back Button */}
                            {onBack && (
                                <button 
                                    onClick={onBack}
                                    className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                                    title="Back to HashApp"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <Trophy className="w-12 h-12 text-yellow-400" />
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                    Winners Circle
                                </h1>
                                <p className="text-gray-300 mt-1">Celebrating excellence in cannabis competitions worldwide</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => setShowModal('leaderboard')} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                               <Trophy className="w-4 h-4 text-yellow-400" /> Leaderboard
                           </button>
                           <button onClick={() => setShowModal('trends')} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                               <BarChart2 className="w-4 h-4 text-green-400" /> Trends
                           </button>
                           <button onClick={() => setShowModal('collabs')} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                               <Users className="w-4 h-4 text-blue-400" /> Collabs
                           </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input type="text" placeholder="Search competitions, winners, strains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all" />
                        </div>
                        <div className="relative">
                          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500">
                              <option value="" className="bg-slate-800">All Countries</option>
                              {countries.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500">
                              <option value="" className="bg-slate-800">All Years</option>
                              {years.map(y => <option key={y} value={y} className="bg-slate-800">{y}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500">
                              <option value="" className="bg-slate-800">All Categories</option>
                              {categories.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative max-w-7xl mx-auto px-6 py-8">
                {Object.keys(filteredData).length === 0 ? (
                    <div className="text-center py-20">
                        <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(filteredData).map(([country, comps]) => (
                            <section key={country}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                      <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{country}</h2>
                                        <p className="text-gray-400">{comps.length} competition{comps.length !== 1 ? 's' : ''} found</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {comps.map(competition => (
                                        <div key={competition.competitionId} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                                            <div className="p-6 border-b border-white/10">
                                                <h3 className="text-xl font-bold  style={{ color: textColor }} mb-2">{competition.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{competition.defaultRegion || 'National'}</span></div>
                                                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{competition.events.length} event{competition.events.length !== 1 ? 's' : ''}</span></div>
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                {competition.events.map(event => (
                                                    <div key={event.eventId} className="bg-white/5 rounded-lg overflow-hidden">
                                                        <div onClick={() => toggleEvent(event.eventId)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 transition-all">
                                                            <div>
                                                                <h4 className="font-semibold">{event.name} ({event.year})</h4>
                                                                <span className="text-sm text-gray-400">{Object.keys(event.categories).length} categories</span>
                                                            </div>
                                                            <ChevronDown className={`w-5 h-5 transition-transform ${expandedEvents.has(event.eventId) ? 'rotate-180' : ''}`} />
                                                        </div>
                                                        {expandedEvents.has(event.eventId) && (
                                                          <div className="border-t border-white/10 p-4 space-y-4">
                                                            {Object.entries(event.categories).map(([category, placements]) => (
                                                                <div key={category}>
                                                                    <h5 className="font-medium text-purple-300 text-sm uppercase tracking-wide mb-2">{category}</h5>
                                                                    <div className="space-y-2">
                                                                        {placements.map(p => (
                                                                            <div key={p.placementId} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankGradient(p.rank)} flex items-center justify-center flex-shrink-0`}>{getRankIcon(p.rank)}</div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium truncate">{p.winnerNameRaw}</p>
                                                                                    {p.entryNameRaw && <p className="text-sm text-gray-400 truncate">{p.entryNameRaw}</p>}
                                                                                </div>
                                                                                <div className="text-sm font-medium text-gray-300">#{p.rank}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {event.specialAwards.length > 0 && (
                                                              <div className="mt-4">
                                                                <h5 className="font-medium text-yellow-300 text-sm uppercase tracking-wide mb-2">Special Awards</h5>
                                                                  <div className="space-y-2">
                                                                    {event.specialAwards.map(award => (
                                                                      <div key={award.awardId} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                                                                        <Award className="w-6 h-6 text-yellow-400" />
                                                                        <div>
                                                                          <div className="font-medium">{award.awardName}</div>
                                                                          <div className="text-sm text-gray-300">{award.winnerNameRaw}</div>
                                                                        </div>
                                                                      </div>
                                                                    ))}
                                                                  </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
            
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800/80 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <header className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-xl font-bold capitalize">{showModal}</h2>
                            <button onClick={() => setShowModal(null)} className="p-2 rounded-full hover:bg-white/10">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </header>
                        <div className="p-6 overflow-y-auto">
                            {renderModalContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WinnersCircle;
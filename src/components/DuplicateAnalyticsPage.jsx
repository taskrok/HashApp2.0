import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Database, ChevronLeft, ClipboardCopy, Check, Tags, Settings } from 'lucide-react';

import { competitions, events, placements, eventAwards } from '../data/database';

// Helper function to calculate Levenshtein distance
const levenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    
    return matrix[str2.length][str1.length];
};

// Helper function to calculate similarity percentage
const calculateSimilarity = (str1, str2) => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 100;
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return ((maxLength - distance) / maxLength) * 100;
};

// Helper function to find duplicates in an array based on a key
const findDuplicatesByKey = (array, key) => {
    const counts = new Map();
    array.forEach(item => {
        const id = item[key];
        if (id) {
            counts.set(id, (counts.get(id) || 0) + 1);
        }
    });

    const duplicates = new Set();
    counts.forEach((count, id) => {
        if (count > 1) {
            duplicates.add(id);
        }
    });

    return array.filter(item => duplicates.has(item[key]));
};

// Helper function to find similar categories
const findSimilarCategories = (array, categoryKey, threshold = 80) => {
    const categories = [...new Set(array.map(item => item[categoryKey]).filter(Boolean))];
    const similarGroups = [];
    const processed = new Set();

    categories.forEach(category => {
        if (processed.has(category)) return;

        const similar = categories.filter(otherCategory => {
            if (category === otherCategory || processed.has(otherCategory)) return false;
            return calculateSimilarity(category, otherCategory) >= threshold;
        });

        if (similar.length > 0) {
            const group = [category, ...similar];
            similarGroups.push({
                categories: group,
                items: array.filter(item => group.includes(item[categoryKey])),
                similarity: Math.min(...group.map(cat1 => 
                    Math.max(...group.filter(cat2 => cat2 !== cat1)
                        .map(cat2 => calculateSimilarity(cat1, cat2)))
                ))
            });
            group.forEach(cat => processed.add(cat));
        }
    });

    return similarGroups;
};

// A reusable card component to display results
const DuplicateCard = ({ title, items, idKey }) => {
    const hasDuplicates = items.length > 0;
    const [copiedId, setCopiedId] = useState(null);

    const handleCopyClick = (idToCopy) => {
        navigator.clipboard.writeText(idToCopy).then(() => {
            setCopiedId(idToCopy);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error('Failed to copy ID: ', err);
            alert('Failed to copy ID to clipboard.');
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
                 {hasDuplicates ? (
                    <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                 ) : (
                    <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                 )}
                 <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                     <p className="text-sm text-gray-400">
                         {hasDuplicates ? `${items.length} duplicate entries found.` : 'No duplicates found.'}
                     </p>
                 </div>
            </div>
            
            {hasDuplicates && (
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-2">
                    {items.map((item, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-lg text-sm">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-mono text-red-300 break-all">ID: {item[idKey]}</p>
                                <button 
                                    onClick={() => handleCopyClick(item[idKey])}
                                    className="p-1.5 rounded-md hover:bg-slate-700 transition-colors text-gray-300 hover: style={{ color: textColor }} flex-shrink-0 ml-2"
                                    aria-label="Copy ID"
                                >
                                    {copiedId === item[idKey] ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <ClipboardCopy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <pre className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">
                                {JSON.stringify(item, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for displaying similar categories
const SimilarCategoriesCard = ({ title, groups, threshold, onThresholdChange }) => {
    const hasIssues = groups.length > 0;
    const [copiedCategory, setCopiedCategory] = useState(null);

    const handleCopyClick = (categoryToCopy) => {
        navigator.clipboard.writeText(categoryToCopy).then(() => {
            setCopiedCategory(categoryToCopy);
            setTimeout(() => setCopiedCategory(null), 2000);
        }).catch(err => {
            console.error('Failed to copy category: ', err);
            alert('Failed to copy category to clipboard.');
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
                 {hasIssues ? (
                    <Tags className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                 ) : (
                    <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                 )}
                 <div className="flex-1">
                    <h3 className="text-xl font-bold">{title}</h3>
                     <p className="text-sm text-gray-400">
                         {hasIssues ? `${groups.length} groups of similar categories found.` : 'No similar categories found.'}
                     </p>
                 </div>
                 <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <label className="text-sm text-gray-400">Similarity:</label>
                    <input 
                        type="range" 
                        min="50" 
                        max="95" 
                        value={threshold}
                        onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                        className="w-20"
                    />
                    <span className="text-sm text-gray-300 min-w-[3rem]">{threshold}%</span>
                 </div>
            </div>
            
            {hasIssues && (
                <div className="mt-4 space-y-4 max-h-80 overflow-y-auto pr-2">
                    {groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-orange-300">
                                    Similar Categories ({Math.round(group.similarity)}% match)
                                </h4>
                                <span className="text-xs text-gray-400">
                                    {group.items.length} items affected
                                </span>
                            </div>
                            <div className="space-y-2">
                                {group.categories.map((category, catIndex) => (
                                    <div key={catIndex} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                                        <span className="text-sm font-mono text-yellow-300">"{category}"</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                {group.items.filter(item => item.category === category).length} uses
                                            </span>
                                            <button 
                                                onClick={() => handleCopyClick(category)}
                                                className="p-1 rounded hover:bg-slate-600 transition-colors text-gray-300 hover: style={{ color: textColor }}"
                                                aria-label="Copy category"
                                            >
                                                {copiedCategory === category ? (
                                                    <Check className="w-3 h-3 text-green-400" />
                                                ) : (
                                                    <ClipboardCopy className="w-3 h-3" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-xs text-gray-400">
                                <strong>Suggestion:</strong> Consider standardizing to one category name across all items.
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function DuplicateAnalyticsPage({ onBack }) {
    const [categoryThreshold, setCategoryThreshold] = useState(80);

    // Debug: Log the actual data structure
    React.useEffect(() => {
        console.log('=== DEBUGGING CATEGORY DATA ===');
        console.log('Sample competition:', competitions[0]);
        console.log('Sample event:', events[0]);
        console.log('Sample placement:', placements[0]);
        console.log('Sample award:', eventAwards[0]);
        
        console.log('Competition fields:', competitions[0] ? Object.keys(competitions[0]) : 'No competitions');
        console.log('Event fields:', events[0] ? Object.keys(events[0]) : 'No events');
        console.log('Placement fields:', placements[0] ? Object.keys(placements[0]) : 'No placements');
        console.log('Award fields:', eventAwards[0] ? Object.keys(eventAwards[0]) : 'No awards');
        
        // Check for categories in placements and awards instead
        const possibleCategoryFields = ['category', 'categoryId', 'categoryName', 'type', 'class', 'division', 'strain', 'product'];
        
        console.log('=== SEARCHING FOR CATEGORIES IN ALL TABLES ===');
        
        const allTables = [
            { name: 'competitions', data: competitions },
            { name: 'events', data: events },
            { name: 'placements', data: placements },
            { name: 'eventAwards', data: eventAwards }
        ];
        
        allTables.forEach(table => {
            console.log(`\n--- ${table.name.toUpperCase()} ---`);
            possibleCategoryFields.forEach(field => {
                const categories = table.data.map(item => item[field]).filter(Boolean);
                if (categories.length > 0) {
                    const uniqueCategories = [...new Set(categories)];
                    console.log(`Found ${categories.length} total, ${uniqueCategories.length} unique categories in "${field}":`, uniqueCategories.slice(0, 10));
                }
            });
        });
    }, []);

    // Memoize the duplicate search so it only runs when data changes
    const duplicateData = useMemo(() => ({
        duplicateCompetitions: findDuplicatesByKey(competitions, 'competitionId'),
        duplicateEvents: findDuplicatesByKey(events, 'eventId'),
        duplicatePlacements: findDuplicatesByKey(placements, 'placementId'),
        duplicateAwards: findDuplicatesByKey(eventAwards, 'awardId'),
    }), []);

    // Memoize the category analysis - try different field names
    const categoryData = useMemo(() => {
        // Try common category field names
        const categoryFields = ['category', 'categoryId', 'categoryName', 'type', 'subject', 'discipline'];
        
        let similarCompetitionCategories = [];
        let similarEventCategories = [];
        
        // Find the field that has the most category data
        for (const field of categoryFields) {
            const compCategories = findSimilarCategories(competitions, field, categoryThreshold);
            const eventCategories = findSimilarCategories(events, field, categoryThreshold);
            
            if (compCategories.length > similarCompetitionCategories.length) {
                similarCompetitionCategories = compCategories;
            }
            if (eventCategories.length > similarEventCategories.length) {
                similarEventCategories = eventCategories;
            }
        }
        
        return {
            similarCompetitionCategories,
            similarEventCategories,
        };
    }, [categoryThreshold]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="flex items-center gap-4 mb-12">
                <button 
                    onClick={onBack} 
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
                    aria-label="Go back"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-4xl font-bold  style={{ color: textColor }}">
                        Database Integrity Check
                    </h1>
                    <p className="text-gray-400 mt-1">Scanning for duplicate IDs and similar categories in your database.</p>
                </div>
            </header>

            {/* Duplicate ID Checks */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold  style={{ color: textColor }} mb-6 flex items-center gap-2">
                    <Database className="w-6 h-6" />
                    Duplicate ID Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DuplicateCard 
                        title="Competition Duplicates"
                        items={duplicateData.duplicateCompetitions}
                        idKey="competitionId"
                    />
                    <DuplicateCard 
                        title="Event Duplicates"
                        items={duplicateData.duplicateEvents}
                        idKey="eventId"
                    />
                    <DuplicateCard 
                        title="Placement Duplicates"
                        items={duplicateData.duplicatePlacements}
                        idKey="placementId"
                    />
                    <DuplicateCard 
                        title="Award Duplicates"
                        items={duplicateData.duplicateAwards}
                        idKey="awardId"
                    />
                </div>
            </section>

            {/* Category Cleanup */}
            <section>
                <h2 className="text-2xl font-bold  style={{ color: textColor }} mb-6 flex items-center gap-2">
                    <Tags className="w-6 h-6" />
                    Category Cleanup Analysis
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SimilarCategoriesCard 
                        title="Competition Categories"
                        groups={categoryData.similarCompetitionCategories}
                        threshold={categoryThreshold}
                        onThresholdChange={setCategoryThreshold}
                    />
                    <SimilarCategoriesCard 
                        title="Event Categories"
                        groups={categoryData.similarEventCategories}
                        threshold={categoryThreshold}
                        onThresholdChange={setCategoryThreshold}
                    />
                </div>
            </section>
        </div>
    );
}

export default DuplicateAnalyticsPage;
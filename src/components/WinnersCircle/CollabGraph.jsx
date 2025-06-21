import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Users, Search, Minus, Plus, X, Award, GitCommitHorizontal, Star } from 'lucide-react';
// Corrected: Removed unused 'eventAwards' import
import { competitions, events, placements } from '../../data/database';

// Helper function to consistently calculate node radius
const getNodeRadius = (node) => 6 + Math.log((node.wins || 1) + 1) * 6;

// Main Component
export default function CollabGraph({ onClose }) {
    const canvasRef = useRef(null);
    const detailsPanelRef = useRef(null);
    const transformRef = useRef(d3.zoomIdentity);
    const zoomBehaviorRef = useRef(null);
    
    // --- State Management ---
    const [search, setSearch] = useState('');
    const [minStrength, setMinStrength] = useState(1);
    const [hoverNode, setHoverNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Refs to pass state to the canvas render loop without triggering re-renders
    const minStrengthRef = useRef(minStrength);
    useEffect(() => { minStrengthRef.current = minStrength; }, [minStrength]);
    const searchRef = useRef(search);
    useEffect(() => { searchRef.current = search; }, [search]);

    // --- Data Processing ---
    // Corrected: Removed unused 'stats' variable
    const { rawNodes, rawLinks, eventMap, compMap, maxCount } = useMemo(() => {
        const winCounts = {};
        const collabCounts = {};
        
        placements.forEach(p => {
            const names = p.parsedWinners || [];
            names.forEach(n => { if (n) winCounts[n] = (winCounts[n] || 0) + 1; });
            
            if (names.length > 1) {
                for (let i = 0; i < names.length; i++) {
                    for (let j = i + 1; j < names.length; j++) {
                        const nameI = names[i];
                        const nameJ = names[j];
                        if (nameI && nameJ) {
                            const key = [nameI, nameJ].sort().join('|');
                            collabCounts[key] = (collabCounts[key] || 0) + 1;
                        }
                    }
                }
            }
        });
        
        const winnersInCollabs = new Set(Object.keys(collabCounts).flatMap(k => k.split('|')));
        
        const nodes = Array.from(winnersInCollabs).map(id => ({ id, wins: winCounts[id] || 1 }));
        const links = Object.entries(collabCounts).map(([key, count]) => {
            const [a, b] = key.split('|');
            return { source: a, target: b, count };
        });

        return {
            rawNodes: nodes,
            rawLinks: links,
            // 'stats' object removed as it was unused
            eventMap: new Map(events.map(e => [e.eventId, e])),
            compMap: new Map(competitions.map(c => [c.competitionId, c])),
            maxCount: Math.max(1, ...links.map(l => l.count)),
        };
    }, []);

    // --- D3 Simulation ---
    const { nodes: simNodes, links: simLinks } = useMemo(() => {
        if (isLoading || rawNodes.length === 0) return { nodes: [], links: [] };
        
        const nodes = rawNodes.map(n => ({ ...n }));
        const links = rawLinks.map(l => ({ ...l }));
        
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.8))
            .force('charge', d3.forceManyBody().strength(-400))
            // Corrected: Used the helper function for radius to avoid ReferenceError
            .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 2)) // Added a 2px buffer
            .stop();

        // Run simulation for a number of ticks to get a stable layout
        for (let i = 0; i < 300; ++i) simulation.tick();
        
        return { nodes, links };
    }, [rawNodes, rawLinks, isLoading]);


    // --- Canvas Drawing Logic ---
    // Corrected: Added 'simLinks' to the dependency array
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || simNodes.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { x, y, k } = transformRef.current;
        const currentMinStrength = minStrengthRef.current;
        const currentSearch = searchRef.current.toLowerCase();

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
        bgGrad.addColorStop(0, '#1e1b4b'); // Indigo-900
        bgGrad.addColorStop(1, '#0c0a09'); // Stone-950
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.translate(x, y);
        ctx.scale(k, k);

        const visibleNodeIds = new Set();
        simLinks.forEach(l => {
            if (l.count >= currentMinStrength) {
                visibleNodeIds.add(l.source.id);
                visibleNodeIds.add(l.target.id);
            }
        });
        
        const isNodeSelected = !!selectedNode;
        const selectedId = isNodeSelected ? selectedNode.id : null;
        
        // Draw Links
        ctx.lineWidth = 1.5 / k;
        simLinks.forEach(link => {
            if (link.count < currentMinStrength) return;
            const isLinkSelected = isNodeSelected && (link.source.id === selectedId || link.target.id === selectedId);
            
            ctx.beginPath();
            ctx.moveTo(link.source.x, link.source.y);
            // Switched to a simpler line for performance with many links
            ctx.lineTo(link.target.x, link.target.y);
            
            if (isLinkSelected) {
                ctx.strokeStyle = `rgba(251, 191, 36, 0.9)`; // Amber-400
                ctx.lineWidth = (2.5 * Math.log1p(link.count)) / k;
            } else {
                ctx.strokeStyle = `rgba(129, 140, 248, ${isNodeSelected ? 0.05 : 0.2})`; // Indigo-400
                ctx.lineWidth = (1.5 * Math.log1p(link.count)) / k;
            }
            ctx.stroke();
        });

        // Draw Nodes
        simNodes.forEach(node => {
            if (!visibleNodeIds.has(node.id) || (currentSearch && !node.id.toLowerCase().includes(currentSearch))) return;
            
            // Corrected: Used helper function
            const radius = getNodeRadius(node) / k;
            const isHovered = hoverNode && hoverNode.id === node.id;
            const isSelected = selectedNode && selectedNode.id === node.id;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            
            const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * k); // scale gradient with node
            if (isSelected) {
                grad.addColorStop(0, '#fde047'); // yellow-300
                grad.addColorStop(1, '#f59e0b'); // amber-500
            } else if (isHovered) {
                grad.addColorStop(0, '#a5b4fc'); // indigo-300
                grad.addColorStop(1, '#6366f1'); // indigo-500
            } else {
                grad.addColorStop(0, '#67e8f9'); // cyan-300
                grad.addColorStop(1, '#0e7490'); // cyan-700
            }
            ctx.fillStyle = grad;

            if (isNodeSelected && !isSelected) {
                ctx.globalAlpha = 0.3;
            }
            
            ctx.shadowColor = isSelected ? '#f59e0b' : isHovered ? '#6366f1' : '#0e7490';
            ctx.shadowBlur = 20 / k;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            
            // Draw Text
            if (k > 0.8 || isHovered || isSelected) {
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${Math.max(12, 14 / k)}px ui-sans-serif, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.id, node.x, node.y);
            }
        });
        
        ctx.restore();
    }, [simNodes, simLinks, hoverNode, selectedNode]);

    // --- Effects for D3 setup, resizing, and drawing ---
    useEffect(() => {
        // Mock loading
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isLoading) return;
        
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                const dpr = window.devicePixelRatio || 1;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                canvas.getContext('2d').scale(dpr, dpr);
                draw();
            }
        });
        
        resizeObserver.observe(canvas.parentElement);
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 8])
            .on('zoom', ({ transform }) => {
                transformRef.current = transform;
                requestAnimationFrame(draw);
            });
        
        zoomBehaviorRef.current = zoom;
        d3.select(canvas).call(zoom);

        return () => resizeObserver.disconnect();
    }, [isLoading, draw]);

    useEffect(() => {
        requestAnimationFrame(draw);
    }, [search, minStrength, draw]);


    // --- Event Handlers ---
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        
        const { x, y, k } = transformRef.current;
        
        let foundNode = null;
        // Iterate backwards to prioritize nodes drawn on top
        for (const node of [...simNodes].reverse()) {
            // Corrected: Used helper function for consistent hit detection
            const radius = getNodeRadius(node); 
            const dist = Math.sqrt(Math.pow(pointer.x - (node.x * k + x), 2) + Math.pow(pointer.y - (node.y * k + y), 2));
            if (dist < radius) {
                foundNode = node;
                break;
            }
        }
        setHoverNode(foundNode);
    };

    const handleMouseClick = () => {
        if (hoverNode) {
            setSelectedNode(hoverNode);
            // Scroll the details panel into view on mobile
            if (window.innerWidth < 768) {
                detailsPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    
    const handleZoom = (direction) => {
        const canvas = canvasRef.current;
        if (zoomBehaviorRef.current && canvas) {
            d3.select(canvas)
                .transition()
                .duration(250)
                .call(zoomBehaviorRef.current.scaleBy, direction === 'in' ? 1.3 : 1 / 1.3);
        }
    };

    // --- Details Panel Logic ---
    const selectedNodeDetails = useMemo(() => {
        if (!selectedNode) return null;
        
        const placementsByNode = placements.filter(p => (p.parsedWinners || []).includes(selectedNode.id));
        const collaborations = simLinks
            .filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id)
            .map(l => {
                const otherNode = l.source.id === selectedNode.id ? l.target : l.source;
                return { name: otherNode.id, count: l.count };
            })
            .sort((a, b) => b.count - a.count);

        return {
            ...selectedNode,
            placements: placementsByNode,
            collaborations,
        };
    }, [selectedNode, simLinks]);

    // The JSX part of the component remains the same
    return (
        <div className="bg-slate-900/80 backdrop-blur-lg border border-white/10 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col p-4 md:p-6  style={{ color: textColor }} font-sans">
            <header className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-2 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Winning Collaborations Graph</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-grow flex flex-col md:flex-row gap-6 mt-4 min-h-0">
                {/* --- Graph & Controls --- */}
                <div className="flex-grow flex flex-col gap-4 min-w-0">
                    <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search winner..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300 whitespace-nowrap">Min. Collabs: <strong>{minStrength}</strong></span>
                                <input
                                    type="range"
                                    min="1"
                                    max={maxCount}
                                    value={minStrength}
                                    onChange={(e) => setMinStrength(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex-grow relative rounded-lg overflow-hidden border border-white/10">
                         {isLoading || simNodes.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="mt-4 text-gray-400">{rawNodes.length > 0 ? 'Calculating graph layout...' : 'No collaboration data available.'}</p>
                                </div>
                            </div>
                        ) : (
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                onMouseMove={handleMouseMove}
                                onClick={handleMouseClick}
                                onMouseLeave={() => setHoverNode(null)}
                            />
                        )}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            <button onClick={() => handleZoom('in')} className="p-2 bg-slate-800/80 rounded-lg border border-white/20 hover:bg-slate-700 transition-colors"><Plus className="w-5 h-5" /></button>
                            <button onClick={() => handleZoom('out')} className="p-2 bg-slate-800/80 rounded-lg border border-white/20 hover:bg-slate-700 transition-colors"><Minus className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* --- Details Panel --- */}
                <aside ref={detailsPanelRef} className="w-full md:w-96 flex-shrink-0 bg-white/5 rounded-lg border border-white/10 flex flex-col max-h-full">
                    <div className="p-4 border-b border-white/10 flex-shrink-0">
                        <h3 className="font-bold text-lg">Details</h3>
                    </div>
                    {selectedNodeDetails ? (
                        <div className="flex-grow p-4 overflow-y-auto space-y-6">
                            <div>
                                <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">{selectedNodeDetails.id}</h4>
                                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                    <Award className="w-4 h-4 text-amber-400" /> {selectedNodeDetails.wins} Total Wins
                                </p>
                            </div>
                            <div>
                                <h5 className="font-bold text-purple-300 mb-2">Top Collaborations</h5>
                                <ul className="space-y-2">
                                    {selectedNodeDetails.collaborations.slice(0, 5).map(c => (
                                        <li key={c.name} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-md text-sm">
                                            <span>{c.name}</span>
                                            <span className="flex items-center gap-1.5 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                                <GitCommitHorizontal className="w-3 h-3"/> {c.count}
                                            </span>
                                        </li>
                                    ))}
                                    {selectedNodeDetails.collaborations.length === 0 && <p className="text-sm text-gray-500 italic">No collaborations found.</p>}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-bold text-cyan-300 mb-2">Recent Wins</h5>
                                <ul className="space-y-3">
                                    {selectedNodeDetails.placements.slice(0,3).map(p => {
                                        const event = eventMap.get(p.eventId) || {};
                                        const competition = compMap.get(event.competitionId) || {};
                                        return (
                                            <li key={p.placementId} className="text-sm">
                                                <p className="font-semibold flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-cyan-400" /> #{p.rank} in {p.category}
                                                </p>
                                                <p className="text-gray-400 pl-6">{event.name} ({competition.name} {event.year})</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center p-4">
                            <div className="text-center text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2" />
                                <p>Click on a node in the graph to see details about the winner.</p>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { 
    FlaskConical, 
    Archive, 
    Flame, 
    Calculator, 
    Users, 
    Search, 
    Trophy, 
    ChevronLeft, 
    BarChart,
    Package,
    Sparkles,
    Thermometer,
    Percent,
    Leaf,
    Zap,
    Star,
    Shield,
    ArrowRight
} from 'lucide-react';

import WinnersCircle from './WinnersCircle/Index.jsx';
import DuplicateAnalyticsPage from './DuplicateAnalyticsPage.jsx';
import YieldTracker from "./AdvancedYieldTracker.jsx";
import JarFlipTracker from './JarFlipTracker.jsx';    // This should work now
import ConsumptionTracker from './ConsumptionTracker.jsx'; // This should work now

// Main App Component that handles navigation
const HashApp = () => {
    const [currentView, setCurrentView] = useState('landing');

    const navigateTo = (view) => {
        setCurrentView(view);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'yieldTracker':
                return <YieldTracker title="YieldMaster Pro" onBack={() => navigateTo('landing')} />;
            case 'jarFlipTracker':
                return <JarFlipTracker title="FlipTracker Pro" onBack={() => navigateTo('landing')} />;
            case 'consumptionTracker':
                return <ConsumptionTracker title="Consumption Tracker" onBack={() => navigateTo('landing')} />;
            case 'rosinPressCalculator':
                return <ToolComponent title="Rosin Press Calculator" onBack={() => navigateTo('landing')} />;
            case 'splitCalculator':
                return <DuplicateAnalyticsPage title="Split Calculator (Collab %)" onBack={() => navigateTo('landing')} />;
            case 'strainDiscovery':
                return <ToolComponent title="Winning Strain Discovery" onBack={() => navigateTo('landing')} />;
            case 'winnersCircle':
                return <WinnersCircle onBack={() => navigateTo('landing')} />;
            case 'landing':
            default:
                return <LandingPage onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  text-white font-sans relative">
            {/* Background Orbs */}
            <BackgroundOrbs />
            
            {/* Particles */}
            <ParticleSystem />
            
            <div className="relative z-10">
                {renderContent()}
            </div>
        </div>
    );
};

// Particle System Component
const ParticleSystem = () => {
    useEffect(() => {
        const createParticles = () => {
            const container = document.getElementById('particles-container');
            if (!container) return;
            
            const particleCount = 50;
            container.innerHTML = ''; // Clear existing particles
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-70';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animation = `particles 8s linear infinite`;
                container.appendChild(particle);
            }
        };
        
        createParticles();
    }, []);

    return <div id="particles-container" className="fixed inset-0 pointer-events-none z-0" />;
};

// Background Orbs Component
const BackgroundOrbs = () => {
    return (
        <>
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full filter blur-[40px] opacity-60 animate-pulse" 
                 style={{ animation: 'float 8s ease-in-out infinite' }} />
            <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-red-500 to-orange-500 rounded-full filter blur-[40px] opacity-60 animate-pulse" 
                 style={{ animation: 'float 8s ease-in-out infinite 2s' }} />
            <div className="absolute bottom-[10%] left-[30%] w-[250px] h-[250px] bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full filter blur-[40px] opacity-60 animate-pulse" 
                 style={{ animation: 'float 8s ease-in-out infinite 4s' }} />
        </>
    );
};

// Enhanced Landing Page
const LandingPage = ({ onNavigate }) => {
    const tools = [
        { 
            id: 'yieldTracker', 
            title: "YieldMaster Pro", 
            icon: <FlaskConical size={32} />, 
            description: "Calculate and track extraction yields with precision analytics and real-time insights.",
            tags: ['Analytics', 'Real-time', 'Advanced'],
            colors: 'from-emerald-400 to-cyan-400',
            bgColors: 'from-emerald-500/10 to-cyan-500/10',
            available: true
        },
        { 
            id: 'jarFlipTracker', 
            title: "FlipTracker Pro", 
            icon: <Archive size={32} />, 
            description: "Manage and monitor your curing process with automated tracking and notifications.",
            tags: ['Automation', 'Monitoring', 'Curing'],
            colors: 'from-orange-400 to-red-400',
            bgColors: 'from-orange-500/10 to-red-500/10',
            available: true
        },
        { 
            id: 'consumptionTracker', 
            title: "Consumption Tracker", 
            icon: <Leaf size={32} />, 
            description: "Log and analyze personal consumption patterns with detailed insights and trends.",
            tags: ['Personal', 'Insights', 'Tracking'],
            colors: 'from-green-400 to-emerald-400',
            bgColors: 'from-green-500/10 to-emerald-500/10',
            available: false
        },
        { 
            id: 'rosinPressCalculator', 
            title: "Rosin Press Calculator", 
            icon: <Calculator size={32} />, 
            description: "Optimize your rosin press settings and yields with advanced pressure calculations.",
            tags: ['Calculator', 'Optimization', 'Rosin'],
            colors: 'from-blue-400 to-indigo-400',
            bgColors: 'from-blue-500/10 to-indigo-500/10',
            available: false
        },
        { 
            id: 'splitCalculator', 
            title: "Split Calculator", 
            icon: <Percent size={32} />, 
            description: "Fairly calculate splits for collaborative work with transparent percentage breakdowns.",
            tags: ['Collaboration', 'Analytics', 'Fair Split'],
            colors: 'from-pink-400 to-rose-400',
            bgColors: 'from-pink-500/10 to-rose-500/10',
            available: true
        },
        { 
            id: 'strainDiscovery', 
            title: "Strain Discovery", 
            icon: <Sparkles size={32} />, 
            description: "Explore comprehensive data on award-winning cannabis strains and genetics.",
            tags: ['Discovery', 'Genetics', 'Awards'],
            colors: 'from-yellow-400 to-orange-400',
            bgColors: 'from-yellow-500/10 to-orange-500/10',
            available: false
        },
        { 
            id: 'winnersCircle', 
            title: "Winners Circle", 
            icon: <Trophy size={32} />, 
            description: "Browse the comprehensive directory of competition winners and champions.",
            tags: ['Champions', 'Directory', 'Awards'],
            colors: 'from-violet-400 to-purple-400',
            bgColors: 'from-violet-500/10 to-purple-500/10',
            available: true
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes particles {
                    0% { transform: translateY(0px) translateX(0px); opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b, #dc2626, #7c3aed);
                    background-size: 300% 300%;
                    animation: gradient-shift 6s ease infinite;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .tool-card {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .tool-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.1), transparent);
                    animation: rotate 8s linear infinite;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .tool-card:hover::before {
                    opacity: 1;
                }
                
                .tool-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 25px 50px rgba(139, 92, 246, 0.3);
                }
                
                .icon-container {
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
                    position: relative;
                    overflow: hidden;
                }
                
                .icon-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: rotate(45deg);
                    transition: all 0.6s ease;
                }
                
                .tool-card:hover .icon-container::before {
                    top: -100%;
                    left: -100%;
                }
            `}</style>

            <header className="text-center mb-16 md:mb-24 relative">
                {/* Floating Elements */}
                <div className="absolute top-0 left-1/4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20" 
                     style={{ animation: 'float 6s ease-in-out infinite 1s' }} />
                <div className="absolute top-10 right-1/4 w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-30" 
                     style={{ animation: 'float 6s ease-in-out infinite 3s' }} />
                
                {/* Main Title */}
                <div className="relative">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black gradient-text mb-6 relative">
                        HashApp
                        <div className="absolute inset-0 gradient-text blur-xl opacity-30" />
                    </h1>
                    
                    {/* Subtitle */}
                    <div className="relative max-w-4xl mx-auto">
                        <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light leading-relaxed mb-8">
                            A <span className="font-semibold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">comprehensive suite</span> of tools designed for the modern cannabis 
                            <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"> cultivator</span>, 
                            <span className="font-semibold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text"> extractor</span>, and 
                            <span className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text"> connoisseur</span>.
                        </p>
                        
                        {/* Stats Row */}
                        <div className="flex justify-center items-center space-x-8 md:space-x-12 mb-12">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-emerald-400">7</div>
                                <div className="text-sm text-gray-400">Tools</div>
                            </div>
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-blue-400">∞</div>
                                <div className="text-sm text-gray-400">Possibilities</div>
                            </div>
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-purple-400">Pro</div>
                                <div className="text-sm text-gray-400">Level</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tools Grid */}
            <main className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} onClick={() => onNavigate(tool.id)} />
                    ))}
                </div>
            </main>

            {/* Call to Action Section */}
            <CallToActionSection />

            {/* Footer */}
            <Footer />
        </div>
    );
};

// Enhanced Tool Card Component
const ToolCard = ({ tool, onClick }) => {
    return (
        <div 
            className="tool-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer group transition-all duration-300 hover:bg-white/10"
            onClick={onClick}
        >
            <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                    <div className="icon-container p-4 rounded-2xl  text-white flex-shrink-0">
                        {tool.icon}
                    </div>
                    <div className="flex-grow">
                        <h3 className={`text-xl md:text-2xl font-bold  text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${tool.colors} group-hover:bg-clip-text transition-all duration-300`}>
                            {tool.title}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            {tool.description}
                        </p>
                    </div>
                </div>
                
                {/* Feature badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag, index) => (
                        <span key={index} className={`px-3 py-1 bg-gradient-to-r ${tool.bgColors} text-xs rounded-full font-medium`}>
                            {tag}
                        </span>
                    ))}
                </div>
                
                {/* Action area */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        {tool.available ? 'Available' : 'Coming Soon'}
                    </div>
                    <div className={`w-8 h-8 bg-gradient-to-r ${tool.colors} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110`}>
                        <ArrowRight size={16} className=" text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Call to Action Section Component
const CallToActionSection = () => {
    return (
        <section className="mt-20 md:mt-32 text-center relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full" />
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text">
                        Ready to Elevate Your Game?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of professionals who are already using HashApp to optimize their cannabis operations and maximize their results.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <FeatureHighlight 
                            icon={<Zap size={32} />}
                            title="Lightning Fast"
                            description="Get results in seconds, not hours"
                            gradient="from-emerald-500 to-teal-500"
                        />
                        <FeatureHighlight 
                            icon={<BarChart size={32} />}
                            title="Data Driven"
                            description="Make decisions based on real insights"
                            gradient="from-blue-500 to-purple-500"
                        />
                        <FeatureHighlight 
                            icon={<Shield size={32} />}
                            title="Secure & Private"
                            description="Your data stays yours, always"
                            gradient="from-purple-500 to-pink-500"
                        />
                    </div>
                    
                    {/* CTA Button */}
                    <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-2xl  text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                        <span className="relative z-10 flex items-center">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                        
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    </button>
                    
                    <p className="text-sm text-gray-500 mt-4">No credit card required • Start in under 60 seconds</p>
                </div>
            </div>
        </section>
    );
};

// Feature Highlight Component
const FeatureHighlight = ({ icon, title, description, gradient }) => {
    return (
        <div className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold  text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="mt-20 text-center relative">
            <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm">System Status: All Good</span>
                </div>
                <div className="w-px h-4 bg-gray-600" />
                <div className="text-gray-400 text-sm">
                    Last Updated: <span className=" text-white">2 minutes ago</span>
                </div>
            </div>
            
            <div className="text-gray-500 text-sm">
                <p>&copy; 2024 Cannabis Tech Solutions. Crafted with ❤️ for the community.</p>
                <p className="mt-2">Built for professionals, by professionals.</p>
            </div>
        </footer>
    );
};

// Placeholder component for tools
const ToolComponent = ({ title, onBack }) => {
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
                <h1 className="text-4xl font-bold  text-white">
                    {title}
                </h1>
            </header>
            <main className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-300">Component coming soon!</h2>
                    <p className="text-gray-400 mt-2">The "{title}" feature is under development.</p>
                </div>
            </main>
        </div>
    );
};

export default HashApp;
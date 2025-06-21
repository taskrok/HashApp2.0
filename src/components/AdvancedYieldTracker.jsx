import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Icon Imports ---
import { TrendingUp, Brain } from 'lucide-react';

// --- Custom Hook Imports ---
import { useWindowSize } from '../hooks/useWindowSize.js';
import { useEnhancedAchievements } from '../hooks/useEnhancedAchievements.js'; // FIXED: Correct import

// --- Data and Theme Imports ---
import { themes, PROCESSING_PATHS as INITIAL_PROCESSING_PATHS, MARKET_PRICES as INITIAL_MARKET_PRICES, DIFFICULTY_COLORS } from '../data/constants.js';
import { enhancedAchievementList } from '../data/enhancedAchievements.js'; // FIXED: Correct export name
import { competitions, events, placements, eventAwards } from '../data/database.js';
import { processCompetitionData } from '../utils/competitionDataProcessor.js';

// --- Component Imports ---
import { Sidebar } from './layout/Sidebar.jsx';
import { Header } from './layout/Header.jsx';
import { MobileMenu } from './layout/MobileMenu.jsx';
import { DashboardView } from './YieldTracker/DashboardView.jsx';
import { AnalyticsView } from './YieldTracker/AnalyticsView.jsx';
import { ProjectHistory } from './YieldTracker/ProjectHistory.jsx';
import { SettingsView } from './YieldTracker/SettingsView.jsx';
import { CommandPalette } from './ui/CommandPalette.jsx';
import { NotificationContainer } from './ui/NotificationContainer.jsx';
import { AIInsightsPanel } from './YieldTracker/AIInsightsPanel.jsx';
import { ProjectForm } from './YieldTracker/ProjectForm.jsx';
import { generateAIInsights } from '../utils/aiInsightGenerator.js';

import { 
  EnhancedAchievementCard, 
  AchievementStats, 
  RecentAchievements, 
  AchievementCategoryFilter,
  TitleSelector 
} from './YieldTracker/AchievementComponents.jsx';

// --- Main Application Component ---
export default function AdvancedYieldTracker({ onBack }) {
  // --- Responsive State ---
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Core State Management ---
  const [view, setView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  
  // --- Theme State ---
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];
  const isDarkMode = currentTheme === 'dark';

  // --- Data & Notification State ---
  const [notifications, setNotifications] = useState([]);
  const [marketPrices, setMarketPrices] = useState(() => JSON.parse(localStorage.getItem('marketPrices')) || INITIAL_MARKET_PRICES);
  const [processingPaths, setProcessingPaths] = useState(() => JSON.parse(localStorage.getItem('processingPaths')) || INITIAL_PROCESSING_PATHS);
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('projects')) || []);
  
  const [aiInsights, setAiInsights] = useState([]);
  
  const processedWinners = useMemo(() => {
    return processCompetitionData({ placements, eventAwards, events, competitions });
  }, []);

  // --- Form State ---
  const [formData, setFormData] = useState({
    projectName: '', client: '', strain: '', processor: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    startMaterial: 'Fresh Frozen', finishMaterial: 'Live Rosin',
    startWeight: '', finishWeight: '', notes: '',
    marketPrice: '', processingCost: ''
  });

  // --- FUNCTIONS ---
  const addNotification = useCallback((type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const calculateProjectMetrics = useCallback((project) => {
    if (!project || !project.startWeight || !project.finishWeight || parseFloat(project.startWeight) === 0) {
      return { variance: '0.00', efficiency: '100.0', revenue: '0.00', cost: '0.00', profit: '0.00', margin: '0.0', actualYieldPercent: '0.00' };
    }
    
    const actualYieldPercent = (parseFloat(project.finishWeight) / parseFloat(project.startWeight)) * 100;
    
    const pathData = processingPaths[project.startMaterial]?.[project.finishMaterial];
    const expectedYield = pathData ? pathData.yield * 100 : 0;
    const variance = actualYieldPercent - expectedYield;
    const efficiency = expectedYield > 0 ? (actualYieldPercent / expectedYield) * 100 : 100;
    
    const finishPrice = marketPrices[project.finishMaterial] || 0;
    const startPrice = marketPrices[project.startMaterial] || 0;
    const revenue = (project.finishWeight * finishPrice) / 28.35;
    const materialCost = (project.startWeight * startPrice) / 28.35;
    const processingCost = parseFloat(project.processingCost) || (pathData?.cost || 0);
    const totalCost = materialCost + processingCost;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return {
      ...project,
      variance: variance.toFixed(2),
      efficiency: efficiency.toFixed(1),
      revenue: revenue.toFixed(2),
      cost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      margin: margin.toFixed(1),
      actualYieldPercent: actualYieldPercent.toFixed(2)
    };
  }, [processingPaths, marketPrices]);

  // FIXED: Achievement hook usage
  const { 
    achievementData, 
    checkAchievements, 
    getAchievementsByCategory, 
    getProgressPercentage, 
    getRecentAchievements,
    getAchievementProgress,
    isAchievementEarned,
    setCurrentTitle,
    totalEarned,
    currentLevel,
    totalXP,
    xpToNextLevel,
    availableTitles,
    currentTitle
  } = useEnhancedAchievements(projects, addNotification, calculateProjectMetrics);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('marketPrices', JSON.stringify(marketPrices));
  }, [marketPrices]);

  useEffect(() => {
    localStorage.setItem('processingPaths', JSON.stringify(processingPaths));
  }, [processingPaths]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (projects.length === 0) {
      setAiInsights([]);
      return;
    }
    
    const projectsWithMetrics = projects.map(p => ({
      ...p,
      ...calculateProjectMetrics(p)
    }));

    const newInsights = generateAIInsights(projectsWithMetrics, processedWinners, { processingPaths, marketPrices });
    setAiInsights(newInsights);

  }, [projects, processingPaths, marketPrices, processedWinners]);

  // --- DERIVED DATA for FORMS ---
  const availableFinishMaterials = useMemo(() => Object.keys(processingPaths[formData.startMaterial] || {}), [formData.startMaterial, processingPaths]);
  const currentPath = useMemo(() => processingPaths[formData.startMaterial]?.[formData.finishMaterial], [formData.startMaterial, formData.finishMaterial, processingPaths]);
  const uniqueProjectNames = useMemo(() => [...new Set(projects.map(p => p.projectName))], [projects]);
  const uniqueClients = useMemo(() => [...new Set(projects.map(p => p.client).filter(Boolean))], [projects]);
  const uniqueStrains = useMemo(() => [...new Set(projects.map(p => p.strain).filter(Boolean))], [projects]);
  const uniqueProcessors = useMemo(() => [...new Set(projects.map(p => p.processor).filter(Boolean))], [projects]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'startMaterial') {
      const newFinishOptions = Object.keys(processingPaths[value] || {});
      if (newFinishOptions.length > 0) {
        setFormData(prev => ({ ...prev, finishMaterial: newFinishOptions[0] }));
      }
    }
  };

  const handleSaveProject = () => {
    if (!formData.projectName || !formData.startWeight || !formData.finishWeight) {
      addNotification('error', 'Missing Fields', 'Please fill in all required fields.');
      return;
    }
    
    const newProject = {
      id: Date.now(),
      ...formData,
      status: 'completed',
      avatar: '🌿',
      tags: [],
      startWeight: parseFloat(formData.startWeight),
      finishWeight: parseFloat(formData.finishWeight),
      timestamp: new Date().toISOString()
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    
    const achievementContext = { processingPaths, marketPrices };
    checkAchievements(newProject, updatedProjects, achievementContext);
    
    addNotification('success', 'Project Saved', `${formData.projectName} has been added.`);
    setView('projects');
  };

  // --- VIEWS ---
  const AchievementsView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Define theme colors here since this is an inner component
  const textColor = theme?.text || (isDarkMode ? '#FFFFFF' : '#000000');
  const textSecondaryColor = theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666');
  
  const filteredAchievements = selectedCategory === 'all' 
    ? enhancedAchievementList 
    : getAchievementsByCategory(selectedCategory);
  
  const recentAchievements = getRecentAchievements(10);

  return (
    <div className="p-4 md:p-8 space-y-8" style={{ color: textColor }}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Achievements</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">Level {currentLevel}</div>
          <div className="text-sm text-slate-400">{totalXP} XP • {xpToNextLevel} to next level</div>
        </div>
      </div>

      <AchievementStats achievementData={achievementData} theme={theme} isDarkMode={isDarkMode} />
      
      {availableTitles.length > 0 && (
        <TitleSelector 
          availableTitles={availableTitles}
          currentTitle={currentTitle}
          onTitleChange={setCurrentTitle}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AchievementCategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            theme={theme}
            isDarkMode={isDarkMode}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAchievements.map(achievement => {
              const progress = getAchievementProgress(achievement.id);
              const earnedData = achievement.tiers 
                ? (progress.tier ? achievementData.earned[`${achievement.id}_${progress.tier.threshold}`] : null)
                : achievementData.earned[achievement.id];
              
              return (
                <EnhancedAchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  earnedData={earnedData}
                  progress={progress}
                  theme={theme}
                  isDarkMode={isDarkMode}
                />
              );
            })}
          </div>
        </div>
        
        <div>
          <RecentAchievements 
            recentAchievements={recentAchievements}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

  const InsightsView = () => <div className="p-4"><AIInsightsPanel insights={aiInsights} theme={theme} isDarkMode={isDarkMode} /></div>;

  return (
  <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500 font-sans`}>
    <CommandPalette 
      isOpen={commandPaletteOpen} 
      setOpen={setCommandPaletteOpen} 
      setView={setView} 
      setIsDarkMode={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')} 
      addNotification={addNotification}
    />
    
    <NotificationContainer 
      notifications={notifications} 
      theme={theme} 
      isDarkMode={isDarkMode}
    />
    
    {!isMobile ? (
      <Sidebar 
        view={view} 
        setView={setView} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        projects={projects} 
        achievements={achievementData} 
        aiInsights={aiInsights} 
        themes={themes} 
        currentTheme={currentTheme} 
        setCurrentTheme={setCurrentTheme} 
        isOnline={isOnline} 
        realtimeUpdates={realtimeUpdates}
        isDarkMode={isDarkMode}
      />
    ) : (
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setView={setView} 
        onNavigate={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
      />
    )}
    
    <Header 
      sidebarCollapsed={sidebarCollapsed}
      view={view}
      setCommandPaletteOpen={setCommandPaletteOpen}
      notifications={notifications}
      setIsDarkMode={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      isDarkMode={isDarkMode}
      theme={theme}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isMobile={isMobile}
      onMenuClick={() => setIsMobileMenuOpen(true)}
      onBack={onBack}
    />
    
    <main className={`transition-all duration-300 min-h-screen pt-30 p-4 md:p-8 ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-72')}`}>
      {view === 'dashboard' && (
        <DashboardView 
          projects={projects} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          setView={setView} 
          aiInsights={aiInsights} 
          calculateProjectMetrics={calculateProjectMetrics}
          theme={theme}
          isDarkMode={isDarkMode}
          achievementData={achievementData}
          totalEarned={totalEarned}
          recentAchievements={getRecentAchievements(1)}
        />
      )}
      
      {view === 'projects' && (
        <ProjectHistory 
          projects={projects} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          selectedProjects={selectedProjects} 
          setSelectedProjects={setSelectedProjects} 
          setView={setView} 
          calculateProjectMetrics={calculateProjectMetrics} 
          addNotification={addNotification} 
          setFormData={setFormData} 
          DIFFICULTY_COLORS={DIFFICULTY_COLORS} 
          PROCESSING_PATHS={processingPaths} 
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
      
      {view === 'analytics' && (
        <AnalyticsView 
          projects={projects} 
          calculateProjectMetrics={calculateProjectMetrics} 
          processingPaths={processingPaths} 
          theme={theme}
          isDarkMode={isDarkMode}
          averageYieldTarget={85}
        />
      )}
      
      {view === 'settings' && (
        <SettingsView 
          marketPrices={marketPrices} 
          setMarketPrices={setMarketPrices} 
          processingPaths={processingPaths} 
          setProcessingPaths={setProcessingPaths} 
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
      
      {view === 'achievements' && <AchievementsView />}
      {view === 'insights' && <InsightsView />}
      
      {view === 'tracker' && (
        <ProjectForm
          theme={theme}
          isDarkMode={isDarkMode}
          formData={formData}
          setFormData={setFormData}
          handleFormChange={handleFormChange}
          handleSaveProject={handleSaveProject}
          showAdvanced={true}
          uniqueProjectNames={uniqueProjectNames}
          uniqueClients={uniqueClients}
          uniqueStrains={uniqueStrains}
          uniqueProcessors={uniqueProcessors}
          PROCESSING_PATHS={processingPaths}
          MARKET_PRICES={marketPrices}
          availableFinishMaterials={availableFinishMaterials}
          currentPath={currentPath}
        />
      )}
    </main>
  </div>
);
}
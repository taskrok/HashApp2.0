// components/JarFlipTracker.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Icon Imports ---
import { TrendingUp, Package, DollarSign, Settings, Brain, Trophy } from 'lucide-react';

// --- Custom Hook Imports ---
import { useWindowSize } from '../hooks/useWindowSize';

// --- Data and Theme Imports ---
import { themes, DEFAULT_FORM_DATA, MATERIAL_TYPES } from '../data/jarFlipConstants';
import { calculateFlipMetrics, calculatePortfolioMetrics } from '../utils/jarFlipCalculations';
import { competitions, events, placements, eventAwards } from '../data/database.js';

// --- Component Imports ---
import { Sidebar } from './layout/Sidebar.jsx';
import { Header } from './layout/Header.jsx';
import { MobileMenu } from './layout/MobileMenu.jsx';
import { NotificationContainer } from './ui/NotificationContainer.jsx';
import { CommandPalette } from './ui/CommandPalette.jsx';

// --- JarFlip Specific Components ---
import { JarFlipDashboard } from './JarFlipTracker/JarFlipDashboard.jsx';
import { JarFlipForm } from './JarFlipTracker/JarFlipForm.jsx';
import { JarFlipHistory } from './JarFlipTracker/JarFlipHistory.jsx';
import { JarFlipAnalytics } from './JarFlipTracker/JarFlipAnalytics.jsx';
import { JarFlipTrackerSettingsView } from './JarFlipTracker/JarFlipTrackerSettingsView.jsx';
import { JarFlipAIInsights } from './JarFlipTracker/JarFlipAIInsights.jsx';
import { JarFlipAchievementsView } from './JarFlipTracker/JarFlipAchievementsView.jsx';

// --- Main Application Component ---
export default function JarFlipTracker({ onBack }) {
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
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('jarFlipTheme');
      // Check if the saved theme exists in our themes object
      if (savedTheme && themes[savedTheme]) {
        return savedTheme;
      }
      return 'dark'; // Default fallback
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
      return 'dark';
    }
  });

  const theme = themes[currentTheme];
  const isDarkMode = currentTheme === 'dark';

  // --- Settings State ---
  const [jarFlipSettings, setJarFlipSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('jarFlipSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        defaultPrices: {
          costPerGram: '25.00',
          salePricePerGram: '35.00',
          overheadCost: '50.00',
          packagingCost: '2.50'
        },
        defaultSettings: {
          packagingUnit: 3.5,
          materialType: 'Flower',
          autoCalculateUnits: true,
          showAdvancedMetrics: true
        },
        preferences: {
          defaultCurrency: 'USD',
          roundingDecimals: 2,
          showProfitWarnings: true,
          autoSaveProjects: true
        }
      };
    } catch (error) {
      console.error('Failed to load jar flip settings:', error);
      return {
        defaultPrices: {
          costPerGram: '25.00',
          salePricePerGram: '35.00',
          overheadCost: '50.00',
          packagingCost: '2.50'
        },
        defaultSettings: {
          packagingUnit: 3.5,
          materialType: 'Flower',
          autoCalculateUnits: true,
          showAdvancedMetrics: true
        },
        preferences: {
          defaultCurrency: 'USD',
          roundingDecimals: 2,
          showProfitWarnings: true,
          autoSaveProjects: true
        }
      };
    }
  });

  // --- Data & Notification State ---
  const [notifications, setNotifications] = useState([]);
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('jarFlipProjects');
      return savedProjects ? JSON.parse(savedProjects) : [];
    } catch (error) {
      console.error('Failed to load jar flip projects:', error);
      return [];
    }
  });
  
  // --- Form State with default settings ---
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FORM_DATA,
    costPerGram: jarFlipSettings.defaultPrices?.costPerGram || '25.00',
    salePricePerGram: jarFlipSettings.defaultPrices?.salePricePerGram || '35.00',
    overheadCost: jarFlipSettings.defaultPrices?.overheadCost || '50.00',
    packagingCost: jarFlipSettings.defaultPrices?.packagingCost || '2.50',
    packagingUnit: jarFlipSettings.defaultSettings?.packagingUnit || 3.5,
    materialType: jarFlipSettings.defaultSettings?.materialType || 'Flower'
  }));

  // --- EFFECTS ---
  useEffect(() => {
    try {
      localStorage.setItem('jarFlipProjects', JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save jar flip projects:', error);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('jarFlipSettings', JSON.stringify(jarFlipSettings));
    } catch (error) {
      console.error('Failed to save jar flip settings:', error);
    }
  }, [jarFlipSettings]);

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
  try {
    localStorage.setItem('jarFlipTheme', currentTheme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}, [currentTheme]);

  // --- DERIVED DATA ---
  const uniqueStrains = useMemo(() => [...new Set(projects.map(p => p.strain).filter(Boolean))], [projects]);
  const uniqueProcessors = useMemo(() => [...new Set(projects.map(p => p.processor).filter(Boolean))], [projects]);
  const uniqueProjectNames = useMemo(() => [...new Set(projects.map(p => p.projectName).filter(Boolean))], [projects]);
  
  const portfolioMetrics = useMemo(() => calculatePortfolioMetrics(projects), [projects]);
  const projectsWithMetrics = useMemo(() => projects.map(calculateFlipMetrics), [projects]);

  // --- FUNCTIONS ---
  const addNotification = useCallback((type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Custom view handler for sidebar compatibility
  const handleViewChange = useCallback((newView) => {
    if (newView === 'projects') {
      setView('history'); // Redirect 'projects' to 'history'
    } else {
      setView(newView); // Default behavior for other views
    }
  }, []);

  const handleSaveSettings = useCallback((newSettings) => {
    setJarFlipSettings(newSettings);
    addNotification('success', 'Settings Saved', 'Your default settings have been updated.');
  }, [addNotification]);

  const handleSaveProject = useCallback(() => {
    if (!formData.projectName || !formData.grams || parseFloat(formData.grams) <= 0) {
      addNotification('error', 'Missing Fields', 'Please fill in Project Name and Quantity (grams).');
      return;
    }

    const newProject = {
      id: Date.now(),
      ...formData,
      grams: parseFloat(formData.grams),
      timestamp: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    
    addNotification('success', 'Project Saved', `${formData.projectName} has been added to your flip history.`);
    
    // Reset form with current settings
    setFormData({
      ...DEFAULT_FORM_DATA,
      costPerGram: jarFlipSettings.defaultPrices?.costPerGram || '25.00',
      salePricePerGram: jarFlipSettings.defaultPrices?.salePricePerGram || '35.00',
      overheadCost: jarFlipSettings.defaultPrices?.overheadCost || '50.00',
      packagingCost: jarFlipSettings.defaultPrices?.packagingCost || '2.50',
      packagingUnit: jarFlipSettings.defaultSettings?.packagingUnit || 3.5,
      materialType: jarFlipSettings.defaultSettings?.materialType || 'Flower'
    });
    setView('history');
  }, [formData, projects, addNotification, jarFlipSettings]);

  const handleDeleteProject = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      addNotification('success', 'Project Deleted', 'Project has been removed from your history.');
    }
  }, [projects, addNotification]);

  const handleEditProject = useCallback((project) => {
    setFormData({
      ...project,
      projectName: project.projectName + ' (Copy)',
      costPerGram: project.costPerGram.toString(),
      salePricePerGram: project.salePricePerGram.toString(),
      grams: project.grams.toString(),
      overheadCost: project.overheadCost.toString(),
      packagingCost: project.packagingCost.toString()
    });
    setView('form');
    addNotification('info', 'Project Loaded', 'Project data loaded for editing.');
  }, [addNotification]);

  // --- SIDEBAR MENU ITEMS ---
  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, badge: null },
    { id: 'form', label: 'New Flip', icon: Package, badge: 'New' },
    { id: 'history', label: 'History', icon: DollarSign, badge: projects.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const viewTitles = {
    dashboard: { title: "Flip Tracker", subtitle: "Get to Flippin" },
    form: { title: "New Project", subtitle: "Create Flip Project" },
    history: { title: "Project History", subtitle: "View Past Flips" },
    analytics: { title: "Analytics", subtitle: "Performance Insights" },
    settings: { title: "Settings", subtitle: "Configure Preferences" },
    insights: { title: "AI Insights", subtitle: "Smart Recommendations" },
    achievements: { title: "Achievements", subtitle: "Track Progress" }
  };

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
          view={view === 'history' ? 'projects' : view}
          setView={handleViewChange}
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
          projects={projects}
          achievements={{}}
          aiInsights={[]}
          themes={themes}  
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          isOnline={isOnline} 
          realtimeUpdates={realtimeUpdates}
          isDarkMode={isDarkMode}
          theme={theme}
          viewTitle={viewTitles[view]} 
        />
      ) : (
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          setView={handleViewChange}
          menuItems={sidebarMenuItems}
          onNavigate={() => setIsMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          theme={theme}  // ✅ ADD THIS
        />
      )}
      
      <Header 
        view={view}
        sidebarCollapsed={sidebarCollapsed}
        setCommandPaletteOpen={setCommandPaletteOpen}
        notifications={notifications}
        setIsDarkMode={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        isDarkMode={isDarkMode}
        theme={theme}  // ✅ ADD THIS
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobile={isMobile}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onBack={onBack}
      />
      
      <main className={`transition-all duration-300 min-h-screen pt-16 p-4 md:p-8 ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-72')}`}>
        {view === 'dashboard' && (
          <JarFlipDashboard 
            projects={projectsWithMetrics}
            portfolioMetrics={portfolioMetrics}
            setView={setView}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'form' && (
          <JarFlipForm
            formData={formData}
            setFormData={setFormData}
            handleFormChange={handleFormChange}
            handleSaveProject={handleSaveProject}
            uniqueStrains={uniqueStrains}
            uniqueProcessors={uniqueProcessors}
            uniqueProjectNames={uniqueProjectNames}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'history' && (
          <JarFlipHistory 
            projects={projectsWithMetrics}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            searchQuery={searchQuery}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'analytics' && (
          <JarFlipAnalytics 
            projects={projectsWithMetrics}
            portfolioMetrics={portfolioMetrics}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'insights' && (
          <JarFlipAIInsights 
            projects={projectsWithMetrics}
            portfolioMetrics={portfolioMetrics}
            theme={theme}
            isDarkMode={isDarkMode}
            consumptionData={null} // Placeholder for future consumption tracker
            yieldTrackerData={null} // Placeholder for future yield tracker integration
          />
        )}
        
        {view === 'achievements' && (
          <JarFlipAchievementsView 
            projects={projectsWithMetrics}
            competitionData={{ placements, eventAwards, competitions, events }}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'settings' && (
          <JarFlipTrackerSettingsView 
            defaultSettings={jarFlipSettings}
            onSaveSettings={handleSaveSettings}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
    </div>
  );
}
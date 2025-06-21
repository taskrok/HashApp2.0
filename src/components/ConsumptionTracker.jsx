// components/ConsumptionTracker.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Icon Imports ---
import { TrendingUp, Package, DollarSign, Settings, Brain, Trophy } from 'lucide-react';

// --- Custom Hook Imports ---
import { useWindowSize } from '../hooks/useWindowSize.js';

// --- Data and Theme Imports ---
import { themes, DEFAULT_CONSUMPTION_FORM_DATA, CONSUMPTION_TYPES } from '../data/consumptionConstants.js';
import { calculateConsumptionMetrics, calculateConsumptionPortfolioMetrics } from '../utils/consumptionCalculations.js';

// --- Component Imports ---
import { Sidebar } from './layout/Sidebar.jsx';
import { Header } from './layout/Header.jsx';
import { MobileMenu } from './layout/MobileMenu.jsx';
import { NotificationContainer } from './ui/NotificationContainer.jsx';
import { CommandPalette } from './ui/CommandPalette.jsx';

// --- Consumption Specific Components ---
import { ConsumptionDashboard } from './ConsumptionTracker/ConsumptionDashboard.jsx';
import { ConsumptionForm } from './ConsumptionTracker/ConsumptionForm.jsx';
import { ConsumptionHistory } from './ConsumptionTracker/ConsumptionHistory.jsx';
import { ConsumptionAnalytics } from './ConsumptionTracker/ConsumptionAnalytics.jsx';
import { ConsumptionSettingsView } from './ConsumptionTracker/ConsumptionSettingsView.jsx';
import { ConsumptionAIInsights } from './ConsumptionTracker/ConsumptionAIInsights.jsx';
import { ConsumptionAchievementsView } from './ConsumptionTracker/ConsumptionAchievementsView.jsx';

// --- Main Application Component ---
export default function ConsumptionTracker({ onBack }) {
  // --- Responsive State ---
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Core State Management ---
  const [view, setView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  
  // --- Theme State ---
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('consumptionTheme');
      if (savedTheme && themes[savedTheme]) {
        return savedTheme;
      }
      return 'dark';
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
      return 'dark';
    }
  });

  const theme = themes[currentTheme];
  const isDarkMode = currentTheme === 'dark';

  // --- Settings State ---
  const [consumptionSettings, setConsumptionSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('consumptionSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        defaultPrices: {
          hashCostPerGram: '25.00',
          flowerCostPerGram: '12.00',
          edibleCostPerUnit: '15.00',
          vapeCostPerGram: '35.00'
        },
        defaultSettings: {
          sessionType: 'Mixed',
          trackMood: true,
          trackEffects: true,
          enableNotifications: true
        },
        inventory: {
          hashInventory: '10.0',
          flowerInventory: '15.0',
          edibleInventory: '5',
          vapeInventory: '3.0'
        },
        goals: {
          dailyHashTarget: '2.0',
          dailyFlowerTarget: '3.0',
          monthlyBudget: '500.00',
          trackTolerance: true
        }
      };
    } catch (error) {
      console.error('Failed to load consumption settings:', error);
      return {
        defaultPrices: {
          hashCostPerGram: '25.00',
          flowerCostPerGram: '12.00',
          edibleCostPerUnit: '15.00',
          vapeCostPerGram: '35.00'
        },
        defaultSettings: {
          sessionType: 'Mixed',
          trackMood: true,
          trackEffects: true,
          enableNotifications: true
        },
        inventory: {
          hashInventory: '10.0',
          flowerInventory: '15.0',
          edibleInventory: '5',
          vapeInventory: '3.0'
        },
        goals: {
          dailyHashTarget: '2.0',
          dailyFlowerTarget: '3.0',
          monthlyBudget: '500.00',
          trackTolerance: true
        }
      };
    }
  });

  // --- Data & Notification State ---
  const [notifications, setNotifications] = useState([]);
  const [entries, setEntries] = useState(() => {
    try {
      const savedEntries = localStorage.getItem('consumptionEntries');
      return savedEntries ? JSON.parse(savedEntries) : [];
    } catch (error) {
      console.error('Failed to load consumption entries:', error);
      return [];
    }
  });
  
  // --- Form State with default settings ---
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_CONSUMPTION_FORM_DATA,
    hashCostPerGram: consumptionSettings.defaultPrices?.hashCostPerGram || '25.00',
    flowerCostPerGram: consumptionSettings.defaultPrices?.flowerCostPerGram || '12.00',
    edibleCostPerUnit: consumptionSettings.defaultPrices?.edibleCostPerUnit || '15.00',
    vapeCostPerGram: consumptionSettings.defaultPrices?.vapeCostPerGram || '35.00',
    sessionType: consumptionSettings.defaultSettings?.sessionType || 'Mixed'
  }));

  // --- EFFECTS ---
  useEffect(() => {
    try {
      localStorage.setItem('consumptionEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save consumption entries:', error);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem('consumptionSettings', JSON.stringify(consumptionSettings));
    } catch (error) {
      console.error('Failed to save consumption settings:', error);
    }
  }, [consumptionSettings]);

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
      localStorage.setItem('consumptionTheme', currentTheme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [currentTheme]);

  // --- DERIVED DATA ---
  const uniqueStrains = useMemo(() => [...new Set(entries.map(e => e.strain).filter(Boolean))], [entries]);
  const uniqueLocations = useMemo(() => [...new Set(entries.map(e => e.location).filter(Boolean))], [entries]);
  const uniqueSessionNames = useMemo(() => [...new Set(entries.map(e => e.sessionName).filter(Boolean))], [entries]);
  
  const consumptionMetrics = useMemo(() => calculateConsumptionPortfolioMetrics(entries), [entries]);
  const entriesWithMetrics = useMemo(() => entries.map(calculateConsumptionMetrics), [entries]);

  // --- FUNCTIONS ---
  const addNotification = useCallback((type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleViewChange = useCallback((newView) => {
    if (newView === 'consumption') {
      setView('history');
    } else {
      setView(newView);
    }
  }, []);

  const handleSaveSettings = useCallback((newSettings) => {
    setConsumptionSettings(newSettings);
    addNotification('success', 'Settings Saved', 'Your consumption settings have been updated.');
  }, [addNotification]);

  const handleSaveEntry = useCallback(() => {
    if (!formData.sessionName || (!formData.hashAmount && !formData.flowerAmount && !formData.edibleAmount && !formData.vapeAmount)) {
      addNotification('error', 'Missing Fields', 'Please fill in Session Name and at least one consumption amount.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...formData,
      hashAmount: parseFloat(formData.hashAmount) || 0,
      flowerAmount: parseFloat(formData.flowerAmount) || 0,
      edibleAmount: parseFloat(formData.edibleAmount) || 0,
      vapeAmount: parseFloat(formData.vapeAmount) || 0,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    
    addNotification('success', 'Session Saved', `${formData.sessionName} has been added to your consumption history.`);
    
    // Reset form with current settings
    setFormData({
      ...DEFAULT_CONSUMPTION_FORM_DATA,
      hashCostPerGram: consumptionSettings.defaultPrices?.hashCostPerGram || '25.00',
      flowerCostPerGram: consumptionSettings.defaultPrices?.flowerCostPerGram || '12.00',
      edibleCostPerUnit: consumptionSettings.defaultPrices?.edibleCostPerUnit || '15.00',
      vapeCostPerGram: consumptionSettings.defaultPrices?.vapeCostPerGram || '35.00',
      sessionType: consumptionSettings.defaultSettings?.sessionType || 'Mixed'
    });
    setView('history');
  }, [formData, entries, addNotification, consumptionSettings]);

  const handleDeleteEntry = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this consumption session?')) {
      const updatedEntries = entries.filter(e => e.id !== id);
      setEntries(updatedEntries);
      addNotification('success', 'Session Deleted', 'Session has been removed from your history.');
    }
  }, [entries, addNotification]);

  const handleEditEntry = useCallback((entry) => {
    setFormData({
      ...entry,
      sessionName: entry.sessionName + ' (Copy)',
      hashCostPerGram: entry.hashCostPerGram.toString(),
      flowerCostPerGram: entry.flowerCostPerGram.toString(),
      edibleCostPerUnit: entry.edibleCostPerUnit.toString(),
      vapeCostPerGram: entry.vapeCostPerGram.toString(),
      hashAmount: entry.hashAmount.toString(),
      flowerAmount: entry.flowerAmount.toString(),
      edibleAmount: entry.edibleAmount.toString(),
      vapeAmount: entry.vapeAmount.toString()
    });
    setView('form');
    addNotification('info', 'Session Loaded', 'Session data loaded for editing.');
  }, [addNotification]);

  // --- SIDEBAR MENU ITEMS ---
  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, badge: null },
    { id: 'form', label: 'New Session', icon: Package, badge: 'New' },
    { id: 'history', label: 'History', icon: DollarSign, badge: entries.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
    { id: 'insights', label: 'AI Insights', icon: Brain, badge: null },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const viewTitles = {
    dashboard: { title: "Consumption Tracker", subtitle: "Track Your Usage" },
    form: { title: "New Session", subtitle: "Log Consumption" },
    history: { title: "Session History", subtitle: "View Past Sessions" },
    analytics: { title: "Analytics", subtitle: "Usage Insights" },
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
          appTitle="Consumption Tracker"
          appContext="consumption"
          view={view === 'history' ? 'consumption' : view}
          setView={handleViewChange}
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
          projects={entries}
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
          theme={theme}
        />
      )}
      
      <Header 
        view={view}
        sidebarCollapsed={sidebarCollapsed}
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
      
      <main className={`transition-all duration-300 min-h-screen pt-16 p-4 md:p-8 ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-72')}`}>
        {view === 'dashboard' && (
          <ConsumptionDashboard 
            entries={entriesWithMetrics}
            consumptionMetrics={consumptionMetrics}
            setView={setView}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'form' && (
          <ConsumptionForm
            formData={formData}
            setFormData={setFormData}
            handleFormChange={handleFormChange}
            handleSaveEntry={handleSaveEntry}
            uniqueStrains={uniqueStrains}
            uniqueLocations={uniqueLocations}
            uniqueSessionNames={uniqueSessionNames}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'history' && (
          <ConsumptionHistory 
            entries={entriesWithMetrics}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedEntries={selectedEntries}
            setSelectedEntries={setSelectedEntries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            searchQuery={searchQuery}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'analytics' && (
          <ConsumptionAnalytics 
            entries={entriesWithMetrics}
            consumptionMetrics={consumptionMetrics}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'insights' && (
          <ConsumptionAIInsights 
            entries={entriesWithMetrics}
            consumptionMetrics={consumptionMetrics}
            theme={theme}
            isDarkMode={isDarkMode}
            settings={consumptionSettings}
          />
        )}
        
        {view === 'achievements' && (
          <ConsumptionAchievementsView 
            entries={entriesWithMetrics}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
        
        {view === 'settings' && (
          <ConsumptionSettingsView 
            defaultSettings={consumptionSettings}
            onSaveSettings={handleSaveSettings}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
    </div>
  );
}
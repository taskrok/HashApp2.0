// data/consumptionConstants.js

// Default form data structure
export const DEFAULT_CONSUMPTION_FORM_DATA = {
  sessionName: '',
  strain: '',
  location: '',
  sessionType: 'Mixed',
  consumptionType: 'Mixed',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  hashAmount: '',
  flowerAmount: '',
  edibleAmount: '',
  vapeAmount: '',
  hashCostPerGram: '25.00',
  flowerCostPerGram: '12.00',
  edibleCostPerUnit: '15.00',
  vapeCostPerGram: '35.00',
  moodBefore: '',
  moodAfter: '',
  effects: '',
  notes: ''
};

// Consumption type options
export const CONSUMPTION_TYPES = [
  'Mixed',
  'Hash-focused',
  'Flower-focused',
  'Edibles-focused',
  'Vape-focused',
  'Micro-dosing',
  'Heavy Usage'
];

// Session type options
export const SESSION_TYPES = [
  'Solo',
  'Social', 
  'Medical',
  'Recreational',
  'Mixed',
  'Therapeutic',
  'Creative',
  'Sleep Aid',
  'Pain Relief'
];

// Mood options for before/after tracking
export const MOOD_OPTIONS = [
  '',
  'Happy',
  'Sad',
  'Anxious',
  'Relaxed',
  'Stressed',
  'Excited',
  'Tired',
  'Focused',
  'Creative',
  'Irritated',
  'Peaceful',
  'Energetic',
  'Depressed',
  'Euphoric'
];

// Effects options
export const EFFECTS_OPTIONS = [
  '',
  'Relaxed',
  'Euphoric',
  'Focused',
  'Creative',
  'Sleepy',
  'Energetic',
  'Pain Relief',
  'Anxiety Relief',
  'Appetite Increase',
  'Mood Boost',
  'Body High',
  'Head High',
  'Couch Lock',
  'Giggly',
  'Talkative',
  'Introspective',
  'Meditative'
];

// Theme configuration (uses same themes as JarFlip)
export const themes = {
  dark: {
    bg: 'from-slate-900 via-purple-900 to-slate-900',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  light: {
    bg: 'from-blue-50 via-indigo-50 to-purple-50',
    text: '#1F2937',
    textSecondary: '#6B7280',
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

// Location suggestions (common consumption locations)
export const COMMON_LOCATIONS = [
  'Home',
  'Friend\'s House',
  'Outdoor',
  'Beach',
  'Park',
  'Concert',
  'Festival',
  'Camping',
  'Dispensary',
  'Hotel',
  'Car',
  'Backyard'
];

// Time of day categories
export const TIME_CATEGORIES = {
  MORNING: { start: 6, end: 10, label: 'Morning' },
  AFTERNOON: { start: 11, end: 16, label: 'Afternoon' },
  EVENING: { start: 17, end: 21, label: 'Evening' },
  NIGHT: { start: 22, end: 5, label: 'Night' }
};

// Consumption method categories
export const CONSUMPTION_METHODS = [
  'Smoking',
  'Vaping',
  'Edibles',
  'Tinctures',
  'Topicals',
  'Dabbing',
  'Sublingual',
  'Beverages'
];

// Default settings structure
export const DEFAULT_CONSUMPTION_SETTINGS = {
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
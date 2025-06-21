// data/jarFlipConstants.js
export const MATERIAL_TYPES = [
  'Rosin',
  'Bubble Hash', 
  'BHO',
  'Dry Sift',
  'Flower',
  'Distillate',
  'Live Resin',
  'Hash Rosin',
  'Other'
];

export const PACKAGING_UNITS = [
  { value: 1, label: '1g' },
  { value: 2, label: '2g' },
  { value: 3.5, label: '3.5g' },
  { value: 7, label: '7g' },
  { value: 14, label: '14g' },
  { value: 28, label: '28g (oz)' }
];

export const JAR_FLIP_THEMES = {
  dark: {
    bg: 'from-slate-900 via-purple-900 to-slate-900',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    accent: '#4BC0C0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    cardBg: 'bg-white/5',
    cardBgHover: 'bg-white/10',
    border: 'border-white/10'
  }
};

export const DEFAULT_FORM_DATA = {
  projectName: '',
  strain: '',
  processor: '',
  materialType: 'Rosin',
  purchaseDate: new Date().toISOString().slice(0, 10),
  selloutDate: new Date().toISOString().slice(0, 10),
  costPerGram: '0.00',
  salePricePerGram: '0.00',
  grams: '',
  overheadCost: '0.00',
  packagingCost: '0.00',
  packagingUnit: 2
};
export const themes = {
  dark: {
    // Tailwind classes for background gradients (used in className)
    bg: 'from-slate-950 via-blue-950 to-slate-950',
    cardBg: 'from-slate-900/90 to-slate-800/90',
    cardBorder: 'border-slate-700/50',
    accent: 'from-blue-500 to-purple-600',
    glass: 'backdrop-blur-xl bg-white/5',
    glow: 'shadow-2xl shadow-blue-500/20',
    primary: 'bg-blue-600',
    secondary: 'bg-slate-600',
    
    // 🔥 FIX: Actual color values for inline styles
    text: '#FFFFFF',           // White text for dark mode
    textSecondary: '#94A3B8',  // Slate-400 equivalent
    cardBgColor: '#111827',    // Gray-900 equivalent  
    border: '#374151',         // Gray-700 equivalent
    success: '#10B981',        // Emerald-500
    warning: '#F59E0B',        // Amber-500
    error: '#EF4444',          // Red-500
    accent: '#3B82F6',         // Blue-500
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    cardBgHover: '#1F2937'     // Gray-800 equivalent
  },
  
  light: {
    // Tailwind classes for background gradients (used in className)
    bg: 'from-blue-50 via-white to-purple-50',
    cardBg: 'from-white/90 to-blue-50/90',
    cardBorder: 'border-blue-200/50',
    accent: 'from-blue-500 to-purple-600',
    glass: 'backdrop-blur-xl bg-black/5',
    glow: 'shadow-2xl shadow-blue-500/10',
    primary: 'bg-blue-500',
    secondary: 'bg-slate-400',
    
    // 🔥 FIX: Actual color values for inline styles
    text: '#0F172A',           // Slate-900 equivalent (dark text for light mode)
    textSecondary: '#475569',  // Slate-600 equivalent
    cardBgColor: '#FFFFFF',    // White background
    border: '#E2E8F0',         // Slate-200 equivalent
    success: '#059669',        // Emerald-600
    warning: '#D97706',        // Amber-600  
    error: '#DC2626',          // Red-600
    accent: '#3B82F6',         // Blue-500
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    cardBgHover: '#F8FAFC'     // Slate-50 equivalent
  },
  
  cannabis: {
    // Tailwind classes for background gradients (used in className)
    bg: 'from-green-950 via-emerald-900 to-green-950',
    cardBg: 'from-green-900/90 to-emerald-800/90',
    cardBorder: 'border-green-700/50',
    accent: 'from-green-500 to-emerald-600',
    glass: 'backdrop-blur-xl bg-white/5',
    glow: 'shadow-2xl shadow-green-500/20',
    primary: 'bg-green-600',
    secondary: 'bg-emerald-600',
    
    // 🔥 FIX: Actual color values for inline styles
    text: '#FFFFFF',           // White text
    textSecondary: '#4ADE80',  // Green-400 equivalent
    cardBgColor: '#14532D',    // Green-900 equivalent
    border: '#15803D',         // Green-700 equivalent
    success: '#22C55E',        // Green-500
    warning: '#EAB308',        // Yellow-500
    error: '#EF4444',          // Red-500
    accent: '#22C55E',         // Green-500
    gradient: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
    cardBgHover: '#166534'     // Green-800 equivalent
  }
};
// Enhanced processing paths with more detailed data
export const PROCESSING_PATHS = {
  'Fresh Frozen': {
    'Live Rosin': { yield: 0.04, variance: 0.015, difficulty: 'Expert', time: 8, cost: 250, quality: 95, tip: 'Premium live rosin from fresh frozen material. Requires precise temperature control.' },
    'Bubble Hash': { yield: 0.045, variance: 0.01, difficulty: 'Intermediate', time: 6, cost: 150, quality: 88, tip: 'Excellent water hash yield with proper washing technique.' },
    'Rosin': { yield: 0.05, variance: 0.02, difficulty: 'Beginner', time: 4, cost: 100, quality: 82, tip: 'Good entry-level extraction with decent returns.' },
    'BHO': { yield: 0.06, variance: 0.015, difficulty: 'Advanced', time: 12, cost: 200, quality: 90, tip: 'Higher yields but requires professional equipment.' }
  },
  'Bubble Hash': {
    'Live Rosin': { yield: 0.65, variance: 0.08, difficulty: 'Expert', time: 3, cost: 80, quality: 98, tip: 'Premium hash rosin - highest quality possible.' },
    'Rosin': { yield: 0.60, variance: 0.1, difficulty: 'Intermediate', time: 2, cost: 50, quality: 92, tip: 'Excellent yields from quality hash.' },
    'BHO': { yield: 0.55, variance: 0.05, difficulty: 'Advanced', time: 8, cost: 120, quality: 85, tip: 'Good secondary extraction option.' }
  },
  'Dry Bud': {
    'Rosin': { yield: 0.18, variance: 0.04, difficulty: 'Beginner', time: 2, cost: 30, quality: 78, tip: 'Most accessible extraction method.' },
    'BHO': { yield: 0.22, variance: 0.03, difficulty: 'Advanced', time: 10, cost: 180, quality: 88, tip: 'Professional extraction with consistent results.' },
    'Distillate': { yield: 0.65, variance: 0.1, difficulty: 'Expert', time: 24, cost: 400, quality: 95, tip: 'High-tech refinement process.' }
  },
  'Dry Trim': {
    'Bubble Hash': { yield: 0.075, variance: 0.025, difficulty: 'Intermediate', time: 8, cost: 100, quality: 70, tip: 'Good use of trim material.' },
    'BHO': { yield: 0.12, variance: 0.02, difficulty: 'Advanced', time: 12, cost: 150, quality: 75, tip: 'Decent extraction from waste material.' },
    'Edible Oil': { yield: 0.85, variance: 0.05, difficulty: 'Beginner', time: 4, cost: 25, quality: 65, tip: 'Maximum utilization for edibles.' }
  },
  'Dry Sift': {
    'Rosin': { yield: 0.70, variance: 0.12, difficulty: 'Intermediate', time: 1, cost: 20, quality: 85, tip: 'Quick pressing of sifted material.' }
  }
};

// 🔥 FIXED: Realistic market prices per gram
export const MARKET_PRICES = {
  // Finished products (retail prices per gram)
  'Live Rosin': 80,      // $80/gram (premium concentrate)
  'Bubble Hash': 30,     // $30/gram (high-quality hash)
  'Rosin': 20,           // $20/gram (standard rosin)
  'BHO': 15,             // $15/gram (butane hash oil)
  'Distillate': 10,      // $10/gram (distillate)
  'Edible Oil': 5,       // $5/gram (edible concentrate)
  
  // Starting materials (wholesale/input costs per gram)
  'Fresh Frozen': 5.36,  // $5.36/gram ($150/oz ÷ 28g)
  'Dry Bud': 4.29,      // $4.29/gram ($120/oz ÷ 28g)
  'Dry Trim': 1.07,     // $1.07/gram ($30/oz ÷ 28g)
  'Dry Sift': 7.14      // $7.14/gram ($200/oz ÷ 28g)
};

export const DIFFICULTY_COLORS = {
  'Beginner': '#4ADE80',
  'Intermediate': '#FACC15',
  'Advanced': '#F97316',
  'Expert': '#EF4444'
};

// This is the advanced theme system
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
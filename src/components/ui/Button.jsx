import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  onClick, 
  disabled, 
  theme, 
  isDarkMode = true, 
  ...props 
}) => {
  // Use theme colors if available, only fallback if properties are missing
  const safeTheme = {
    gradient: theme?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: theme?.accent || '#3B82F6',
    error: theme?.error || '#EF4444',
    text: theme?.text || (isDarkMode ? '#FFFFFF' : '#000000'),
    textSecondary: theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666'),
    border: theme?.border || (isDarkMode ? '#333333' : '#E5E5E5'),
    cardBgColor: theme?.cardBgColor || (isDarkMode ? '#111111' : '#FFFFFF')
  };
  
  const variants = {
    primary: { 
      background: safeTheme.gradient, 
      color: 'white', // Primary buttons are always white text
      border: 'none' 
    },
    secondary: { 
      background: 'transparent', 
      color: safeTheme.accent, 
      border: `1px solid ${safeTheme.accent}` 
    },
    danger: { 
      background: safeTheme.error, 
      color: 'white', // Danger buttons are always white text
      border: 'none' 
    },
    ghost: { 
      background: 'transparent', 
      color: safeTheme.textSecondary, // This will now switch with theme
      border: 'none' 
    }
  };
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.875rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 32px', fontSize: '1.125rem' }
  };
  
  return (
    <button
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        opacity: disabled ? 0.5 : 1,
        ...props.style
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};
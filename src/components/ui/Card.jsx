import React from 'react';

export const Card = ({ children, className = '', theme, isDarkMode = true, ...props }) => {
  // Better fallback that considers the current theme mode
  const safeTheme = theme || {
    cardBg: isDarkMode ? '#111111' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#E5E5E5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#A0A0A0' : '#666666'
  };
  
  return (
    <div 
      style={{
        background: safeTheme.cardBg,
        border: `1px solid ${safeTheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        color: safeTheme.text, // This ensures text color switches with theme
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
import React from 'react';

export const Input = ({ label, icon: Icon, error, theme, isDarkMode = true, list, ...props }) => {
  // Use theme colors if available, only fallback if properties are missing
  const safeTheme = {
    text: theme?.text || (isDarkMode ? '#FFFFFF' : '#000000'),
    textSecondary: theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666'),
    error: theme?.error || '#EF4444',
    border: theme?.border || (isDarkMode ? '#333333' : '#E5E5E5'),
    cardBgColor: theme?.cardBgColor || (isDarkMode ? '#111111' : '#FFFFFF')
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          color: safeTheme.text,
          fontSize: '0.875rem', 
          fontWeight: '500', 
          marginBottom: '6px' 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: safeTheme.textSecondary 
            }} 
          />
        )}
        <input
          style={{
            width: '100%',
            padding: Icon ? '12px 12px 12px 40px' : '12px',
            border: `1px solid ${error ? safeTheme.error : safeTheme.border}`,
            borderRadius: '8px',
            background: safeTheme.cardBgColor,
            color: safeTheme.text,
            fontSize: '1rem',
            transition: 'border-color 0.2s ease, color 0.2s ease',
            boxSizing: 'border-box'
          }}
          list={list}
          {...props}
        />
      </div>
      {error && (
        <div style={{ 
          color: safeTheme.error, 
          fontSize: '0.75rem', 
          marginTop: '4px' 
        }}>
          {error}
        </div>
      )}
    </div>
  );
};
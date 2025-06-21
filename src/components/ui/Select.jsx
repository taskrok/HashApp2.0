import React from 'react';

export const Select = ({ label, options, theme, isDarkMode = true, ...props }) => {
  // Use theme colors if available, only fallback if properties are missing
  const safeTheme = {
    text: theme?.text || (isDarkMode ? '#FFFFFF' : '#000000'),
    textSecondary: theme?.textSecondary || (isDarkMode ? '#A0A0A0' : '#666666'),
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
      <select
        style={{
          width: '100%',
          padding: '12px',
          border: `1px solid ${safeTheme.border}`,
          borderRadius: '8px',
          background: safeTheme.cardBgColor,
          color: safeTheme.text,
          fontSize: '1rem',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease, color 0.2s ease'
        }}
        {...props}
      >
        {options.map((option, index) => (
          <option 
            key={index} 
            value={option.value}
            style={{
              background: safeTheme.cardBgColor,
              color: safeTheme.text
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
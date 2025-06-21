import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const NotificationContainer = ({ notifications, theme, isDarkMode = true }) => {
  // Better fallback that considers the current theme mode
  const safeTheme = theme || {
    cardBg: isDarkMode ? '#111111' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#E5E5E5',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#A0A0A0' : '#666666'
  };
  
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={{
            background: safeTheme.cardBg,
            border: `1px solid ${
              notification.type === 'error' 
                ? safeTheme.error 
                : notification.type === 'success' 
                ? safeTheme.success 
                : safeTheme.warning
            }`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            minWidth: '320px',
            boxShadow: isDarkMode 
              ? '0 10px 25px rgba(0,0,0,0.3)' 
              : '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease',
            color: safeTheme.text // This will now switch with theme
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {notification.type === 'error' && (
              <AlertTriangle 
                size={20} 
                style={{ color: safeTheme.error, marginTop: '2px' }} 
              />
            )}
            {notification.type === 'success' && (
              <CheckCircle 
                size={20} 
                style={{ color: safeTheme.success, marginTop: '2px' }} 
              />
            )}
            {notification.type === 'warning' && (
              <AlertTriangle 
                size={20} 
                style={{ color: safeTheme.warning, marginTop: '2px' }} 
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: safeTheme.text, // This will now switch with theme
                fontWeight: '500', 
                marginBottom: '4px' 
              }}>
                {notification.message}
              </div>
              {notification.action && (
                <div style={{ 
                  color: safeTheme.textSecondary, // This will now switch with theme
                  fontSize: '0.875rem' 
                }}>
                  {notification.action}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
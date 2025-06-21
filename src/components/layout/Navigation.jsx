import React from 'react';
import { BarChart3, Plus, TrendingUp, Clock } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'tracker', label: 'New Project', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'projects', label: 'Project History', icon: Clock }
];

export const Navigation = ({ view, setView, theme }) => {
  return (
    <nav style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}`, padding: '0 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0' }}>
        {navItems.map(nav => (
          <button
            key={nav.id}
            onClick={() => setView(nav.id)}
            style={{
              padding: '16px 24px',
              background: view === nav.id ? theme.accent + '10' : 'transparent',
              color: view === nav.id ? theme.accent : theme.textSecondary,
              border: 'none',
              borderBottom: view === nav.id ? `2px solid ${theme.accent}` : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <nav.icon size={16} />
            {nav.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
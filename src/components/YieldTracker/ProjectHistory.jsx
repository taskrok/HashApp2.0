import React from 'react';

// Import UI Components
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Import Icons
import { Download, Upload, Edit3, Trash2 } from 'lucide-react';

export const ProjectHistory = ({
  theme,
  isDarkMode, // 🔥 FIX: Added isDarkMode prop
  projects,
  setView,
  setFormData,
  addNotification,
  saveProjects,
  calculateProjectMetrics,
  PROCESSING_PATHS,
  DIFFICULTY_COLORS,
}) => {
  return (
    <div className="pt-100">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Project History</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="secondary" 
            icon={Download} 
            theme={theme}
            isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
          >
            Export Data
          </Button>
          <Button 
            variant="secondary" 
            icon={Upload} 
            theme={theme}
            isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
          >
            Import Data
          </Button>
        </div>
      </div>
      
      {projects.length === 0 ? (
        <Card 
          style={{ textAlign: 'center', padding: '48px' }} 
          theme={theme}
          isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>No Projects Yet</h3>
          <p style={{ color: theme.textSecondary, marginBottom: '24px' }}>Start tracking your extraction projects to see detailed analytics and insights.</p>
          <Button 
            onClick={() => setView('tracker')} 
            theme={theme}
            isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
          >
            Create Your First Project
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {projects.map(project => {
            const metrics = calculateProjectMetrics(project);
            return (
              <Card 
                key={project.id} 
                theme={theme}
                isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '24px', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px' }}>{project.projectName}</h4>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                      <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                        📅 {new Date(project.endDate).toLocaleDateString()}
                      </span>
                      <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                        👤 {project.client || 'Internal'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        background: theme.accent + '20', 
                        color: theme.accent, 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {project.strain || 'Unknown Strain'}
                      </span>
                      <span style={{ 
                        background: (DIFFICULTY_COLORS[PROCESSING_PATHS[project.startMaterial]?.[project.finishMaterial]?.difficulty || 'Beginner'] || '#000000') + '20', 
                        color: DIFFICULTY_COLORS[PROCESSING_PATHS[project.startMaterial]?.[project.finishMaterial]?.difficulty || 'Beginner'] || '#000000', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {project.startMaterial} → {project.finishMaterial}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: parseFloat(metrics.efficiency) >= 100 ? theme.success : theme.warning,
                      marginBottom: '4px'
                    }}>
                      {project.actualYieldPercent}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                      Yield ({metrics.variance > 0 ? '+' : ''}{metrics.variance}% vs exp.)
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: parseFloat(metrics.profit) > 0 ? theme.success : theme.error,
                      marginBottom: '4px'
                    }}>
                      ${metrics.profit}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                      Profit ({metrics.margin}% margin)
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {metrics.efficiency}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                      Efficiency
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      background: `conic-gradient(${theme.accent} ${parseFloat(metrics.efficiency) * 3.6}deg, ${theme.border} 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      margin: '0 auto'
                    }}>
                      <div style={{ 
                        width: '46px', 
                        height: '46px', 
                        borderRadius: '50%', 
                        background: theme.cardBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {Math.round(parseFloat(metrics.efficiency))}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Edit3}
                      theme={theme}
                      isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
                      onClick={() => {
                        setFormData({
                          projectName: project.projectName + ' (Copy)',
                          client: project.client,
                          strain: project.strain,
                          processor: project.processor,
                          startDate: project.startDate,
                          endDate: project.endDate,
                          startMaterial: project.startMaterial,
                          finishMaterial: project.finishMaterial,
                          startWeight: project.startWeight.toString(),
                          finishWeight: project.finishWeight.toString(),
                          notes: project.notes || '',
                          marketPrice: '',
                          processingCost: project.processingCost?.toString() || ''
                        });
                        setView('tracker');
                        addNotification('info', 'Project data loaded for editing');
                      }}
                    >
                      Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Trash2}
                      theme={theme}
                      isDarkMode={isDarkMode} // 🔥 FIX: Added isDarkMode prop
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this project?')) {
                          const updatedProjects = projects.filter(p => p.id !== project.id);
                          saveProjects(updatedProjects);
                          addNotification('success', 'Project deleted successfully');
                        }
                      }}
                      style={{ color: theme.error }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                {project.notes && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '16px', 
                    background: theme.cardBgHover, 
                    borderRadius: '8px',
                    borderTop: `1px solid ${theme.border}`
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px', color: theme.textSecondary }}>
                      📝 Notes:
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {project.notes}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
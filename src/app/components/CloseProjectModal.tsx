import React from 'react';
import { useNavigate } from 'react-router';

interface CloseProjectModalProps {
  projectName: string;
  onClose: () => void;
}

export default function CloseProjectModal({ projectName, onClose }: CloseProjectModalProps) {
  const navigate = useNavigate();

  const handleLeaveProject = () => {
    // Navigate back to My Projects (Global Mode)
    navigate('/app');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            width: '480px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px 24px 16px 24px',
            borderBottom: '1px solid #E2E6ED'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              Leave Project?
            </h2>
          </div>

          {/* Content */}
          <div style={{
            padding: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#5F6B7A',
              margin: 0,
              lineHeight: '1.6'
            }}>
              You will exit "<span style={{ fontWeight: '600', color: '#272721' }}>{projectName}</span>" and return to Projects.
            </p>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E6ED',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#F9FAFB'
          }}>
            <button 
              onClick={onClose}
              style={{
                height: '36px',
                padding: '0 20px',
                border: '1px solid #D8DEE8',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button 
              onClick={handleLeaveProject}
              style={{
                height: '36px',
                padding: '0 20px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              Leave Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useState } from 'react';
import { X, Lock, Unlock, AlertCircle } from 'lucide-react';
import StandardDropdown from './StandardDropdown';

interface LockConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId?: string) => void;
  isLocking: boolean; // true = locking, false = unlocking
  projects?: Array<{ value: string; label: string }>; // Optional - only needed for global context
  projectId?: string; // Optional - used when already in project context
  type?: 'progress' | 'access'; // Optional - used for different submission types
}

export default function LockConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLocking,
  projects,
  projectId, // When projectId is provided, we're in project-specific context
  type = 'progress' // Default to 'progress' if not specified
}: LockConfirmationModalProps) {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  // Determine if we're in project-specific context
  const isProjectSpecific = !!projectId;

  const handleConfirm = () => {
    if (isProjectSpecific) {
      // In project-specific context, use the provided projectId
      onConfirm(projectId);
      onClose();
    } else {
      // In global context, require project selection
      if (selectedProject) {
        onConfirm(selectedProject);
        onClose();
        setSelectedProject(''); // Reset for next time
      }
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedProject(''); // Reset on close
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        width: '480px',
        maxWidth: '95vw',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        minHeight: isDropdownOpen ? '580px' : 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E6ED',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#272721',
            margin: 0
          }}>
            {isLocking ? 'Lock Progress Submissions' : 'Unlock Progress Submissions'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px'
        }}>
          {/* Message */}
          <p style={{
            fontSize: '15px',
            color: '#374151',
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: '1.6'
          }}>
            {isLocking ? (
              <>
                Are you sure you want to <strong>lock</strong> progress submissions?
                <br />
                This will prevent new progress submissions.
              </>
            ) : (
              <>
                Are you sure you want to <strong>unlock</strong> progress submissions?
                <br />
                This will allow new progress submissions.
              </>
            )}
          </p>

          {/* Yellow Note/Warning Message */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '6px',
            marginBottom: isProjectSpecific ? '0' : '20px'
          }}>
            <AlertCircle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '14px', color: '#92400E', lineHeight: '1.6' }}>
              {isLocking ? (
                <>
                  <strong style={{ fontWeight: '600' }}>Important:</strong> All users will be unable to submit new progress updates until unlocked.
                </>
              ) : (
                <>
                  <strong style={{ fontWeight: '600' }}>Note:</strong> Users will be able to submit new progress updates after unlocking.
                </>
              )}
            </div>
          </div>

          {/* Project Selection */}
          {!isProjectSpecific && (
            <div style={{
              marginTop: '20px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Select Project <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <StandardDropdown
                options={projects}
                value={selectedProject}
                onChange={(value) => setSelectedProject(value as string)}
                placeholder="Select a project..."
                mode="single"
                forceDirection="bottom"
                onOpenChange={setIsDropdownOpen}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E6ED',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedProject && !isProjectSpecific}
            style={{
              padding: '10px 24px',
              backgroundColor: !selectedProject && !isProjectSpecific ? '#D1D5DB' : '#FD4314',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              cursor: !selectedProject && !isProjectSpecific ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: !selectedProject && !isProjectSpecific ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedProject || isProjectSpecific) {
                e.currentTarget.style.backgroundColor = '#DC3910';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProject || isProjectSpecific) {
                e.currentTarget.style.backgroundColor = '#FD4314';
              } else {
                e.currentTarget.style.backgroundColor = '#D1D5DB';
              }
            }}
          >
            {isLocking ? <Lock size={16} /> : <Unlock size={16} />}
            {isLocking ? 'Lock' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
}
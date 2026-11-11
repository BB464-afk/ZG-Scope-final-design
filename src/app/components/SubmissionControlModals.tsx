import React from 'react';
import { X, AlertCircle, Lock as LockIcon } from 'lucide-react';

interface LockSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LockSubmissionsModal({ isOpen, onClose, onConfirm }: LockSubmissionsModalProps) {
  if (!isOpen) return null;

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
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        width: '480px',
        maxWidth: '90vw',
        border: '1px solid #E5E7EB'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Lock Progress Submissions
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            margin: '0 0 8px 0'
          }}>
            Are you sure you want to lock progress submissions?
          </p>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            margin: '0 0 16px 0'
          }}>
            This will prevent new progress submissions.
          </p>

          {/* Yellow Warning Message */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '6px'
          }}>
            <AlertCircle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '14px', color: '#92400E', lineHeight: '1.6' }}>
              <strong style={{ fontWeight: '600' }}>Important:</strong> All users will be unable to submit new progress updates until unlocked.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <button
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 16px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              height: '38px',
              padding: '0 16px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC3910';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FD4314';
            }}
          >
            <LockIcon size={16} />
            Lock
          </button>
        </div>
      </div>
    </div>
  );
}

interface UnlockSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: 'progress' | 'access';
}

export function UnlockSubmissionsModal({ isOpen, onClose, onConfirm, type = 'progress' }: UnlockSubmissionsModalProps) {
  if (!isOpen) return null;

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
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        width: '480px',
        maxWidth: '90vw',
        border: '1px solid #E5E7EB'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Unlock {type === 'progress' ? 'Progress' : 'Access'} Submissions
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px'
        }}>
          {/* Yellow Note/Warning Message */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '14px', color: '#92400E', lineHeight: '1.6' }}>
              <strong style={{ fontWeight: '600' }}>Note:</strong> Users will be able to submit new {type === 'progress' ? 'progress updates' : 'access requests'} after unlocking.
            </div>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            margin: 0
          }}>
            Users will be able to submit {type === 'progress' ? 'progress updates' : 'access requests'} again for this project.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <button
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 16px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              height: '38px',
              padding: '0 16px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC3910';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FD4314';
            }}
          >
            Unlock Submissions
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'approve' | 'reject';
  count: number;
  groupName?: string; // Optional - for grouped actions
  reportingDate?: string; // Optional - for reporting cycle
}

export default function ApprovalConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action,
  count,
  groupName,
  reportingDate
}: ApprovalConfirmationModalProps) {
  if (!isOpen) return null;

  const isApprove = action === 'approve';
  const submissionText = count === 1 ? 'submission' : 'submissions';

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
        border: '1px solid #E5E7EB'
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
            {isApprove ? 'Approve' : 'Reject'} {submissionText.charAt(0).toUpperCase() + submissionText.slice(1)}
          </h2>
          <button
            onClick={onClose}
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
            Are you sure you want to <strong>{action}</strong> {count} {submissionText}
            {groupName ? ` in ${groupName}` : ''}?
          </p>

          {/* Reporting Date Section */}
          {reportingDate && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#E4EEFE',
              border: '1px solid #D8DEE8',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '4px'
              }}>
                Progress Reporting Date
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                {formatDisplayDate(reportingDate)}
              </div>
            </div>
          )}

          {/* Yellow Warning/Note Message */}
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
              {isApprove ? (
                <>
                  <strong style={{ fontWeight: '600' }}>Important:</strong> This will approve the selected progress {submissionText} and cannot be undone.
                </>
              ) : (
                <>
                  <strong style={{ fontWeight: '600' }}>Warning:</strong> This will reject the selected progress {submissionText}. Users may need to resubmit.
                </>
              )}
            </div>
          </div>
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
            onClick={onClose}
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
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: isApprove ? '#10B981' : '#DC2626',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isApprove ? '#059669' : '#B91C1C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isApprove ? '#10B981' : '#DC2626';
            }}
          >
            {isApprove ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
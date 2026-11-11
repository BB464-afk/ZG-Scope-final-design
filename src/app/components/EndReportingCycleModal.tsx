import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';

interface EndReportingCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentReportingDate: string;
}

export default function EndReportingCycleModal({
  isOpen,
  onClose,
  onConfirm,
  currentReportingDate
}: EndReportingCycleModalProps) {
  if (!isOpen) return null;

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
          zIndex: 9998
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          width: '480px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 9999
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                End Reporting Cycle
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>
                Are you sure you want to end the current reporting cycle?
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Current Cycle Info */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              Current Reporting Cycle
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1F2937'
            }}>
              {formatDisplayDate(currentReportingDate)}
            </div>
          </div>

          {/* Warning Note */}
          <div style={{
            padding: '12px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400E'
          }}>
            After ending this cycle, you will need to start a new cycle before approving or rejecting any submissions.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              height: '36px',
              padding: '0 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
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
            onClick={onConfirm}
            style={{
              height: '36px',
              padding: '0 16px',
              backgroundColor: '#FD4314',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E63910'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            End Cycle
          </button>
        </div>
      </div>
    </>
  );
}

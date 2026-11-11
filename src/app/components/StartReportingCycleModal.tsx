import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface StartReportingCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  lastReportingDate: string;
}

export default function StartReportingCycleModal({
  isOpen,
  onClose,
  onConfirm,
  lastReportingDate
}: StartReportingCycleModalProps) {
  const [reportingDate, setReportingDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleConfirm = () => {
    if (!reportingDate) {
      setError('Please select a reporting date');
      return;
    }

    const selectedDate = new Date(reportingDate);
    const lastDate = new Date(lastReportingDate);

    if (selectedDate <= lastDate) {
      setError('Reporting date must be after the last reporting cycle date');
      return;
    }

    onConfirm(reportingDate);
    setReportingDate('');
    setError('');
  };

  const handleCancel = () => {
    setReportingDate('');
    setError('');
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
          zIndex: 9998
        }}
        onClick={handleCancel}
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
              backgroundColor: '#E4EEFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Start Reporting Cycle
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>
                Set the progress reporting date for this cycle
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Last Reporting Cycle */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              Last Reporting Cycle
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1F2937'
            }}>
              {formatDisplayDate(lastReportingDate)}
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Progress Reporting Date <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <input
              type="date"
              value={reportingDate}
              onChange={(e) => {
                setReportingDate(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: error ? '1px solid #DC2626' : '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none'
              }}
            />
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400E'
          }}>
            All approvals and rejections will be associated with this reporting date until you end the cycle.
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
            onClick={handleCancel}
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
            onClick={handleConfirm}
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
            Start Cycle
          </button>
        </div>
      </div>
    </>
  );
}

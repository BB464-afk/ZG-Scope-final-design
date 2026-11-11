import React from 'react';
import { FileSpreadsheet, X } from 'lucide-react';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export default function ExportConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Export Data'
}: ExportConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '480px',
          maxWidth: '90vw',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFF4EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={20} style={{ color: '#FD4314' }} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937'
              }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '24px',
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6'
          }}
        >
          <p style={{ margin: '0 0 16px 0' }}>
            You are about to export <strong>all existing data</strong> from this module to an Excel file.
          </p>
          <p style={{ margin: '0', color: '#6B7280' }}>
            This will include all records currently displayed in the listing, regardless of any active filters or search criteria.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#F9FAFB'
          }}
        >
          <button
            onClick={onClose}
            style={{
              height: '40px',
              padding: '0 20px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              backgroundColor: '#FD4314',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FD4314')}
          >
            Export to Excel
          </button>
        </div>
      </div>
    </>
  );
}

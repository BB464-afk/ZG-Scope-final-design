import React, { ReactNode } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// ENTERPRISE TABLE THEME - Zauner CMP
export const ENTERPRISE_TABLE_THEME = {
  // Colors
  containerBg: '#FAFAFA',
  headerBg: '#E4EEF8',
  rowEven: '#FFFFFF',
  rowOdd: '#F7FAFB', // Soft blue tint for alternate rows
  rowHover: '#EFF6FF',
  rowSelected: '#FFF5F2',
  selectedBorder: '#FD431426',
  borderColor: '#C8D9EE',
  dividerColor: '#E5E7EB',
  
  // Typography
  headerText: '#272721',
  bodyText: '#1F2937',
  mutedText: '#6B7280',
  
  // Spacing
  rowHeight: '52px',
  cellPadding: '12px 16px',
  headerPadding: '14px 16px',
  
  // Weights
  headerWeight: '600',
  bodyWeight: '400'
};

interface EnterpriseTableProps {
  children: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showFilters?: boolean;
  onFilterClick?: () => void;
  bulkActions?: Array<{ label: string; value: string; }>;
  selectedCount?: number;
  onBulkAction?: (action: string) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  viewToggle?: ReactNode;
}

export function EnterpriseTable({
  children,
  showSearch = true,
  searchPlaceholder = 'Search...',
  onSearchChange,
  showFilters = true,
  onFilterClick,
  bulkActions = [],
  selectedCount = 0,
  onBulkAction,
  primaryAction,
  totalRecords,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  viewToggle
}: EnterpriseTableProps) {
  const [bulkActionValue, setBulkActionValue] = React.useState('');

  const handleBulkActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBulkActionValue(value);
    if (value && onBulkAction) {
      onBulkAction(value);
      setBulkActionValue('');
    }
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* TOP CONTROLS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* LEFT: Search */}
        {showSearch && (
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            minWidth: '250px'
          }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                paddingLeft: '38px',
                paddingRight: '12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>
        )}

        {/* SPACER */}
        <div style={{ flex: 1 }} />

        {/* RIGHT: Filters, Bulk Actions, Primary Action, View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Filters */}
          {showFilters && (
            <button 
              onClick={onFilterClick}
              style={{
                height: '38px',
                padding: '0 16px',
                border: '1px solid #D8DEE8',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Filter size={16} />
              Filters
            </button>
          )}

          {/* Bulk Actions Dropdown - Only show when items are selected */}
          {selectedCount > 0 && bulkActions.length > 0 && (
            <select
              value={bulkActionValue}
              onChange={handleBulkActionChange}
              style={{
                height: '38px',
                padding: '0 32px 0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%236B7280\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
            >
              <option value="">Bulk Actions ({selectedCount})</option>
              {bulkActions.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
          )}

          {/* Primary Action */}
          {primaryAction && (
            <button 
              onClick={primaryAction.onClick}
              style={{
                height: '38px',
                padding: '0 16px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              {primaryAction.icon}
              {primaryAction.label}
            </button>
          )}

          {/* View Toggle */}
          {viewToggle}
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div style={{
        backgroundColor: ENTERPRISE_TABLE_THEME.containerBg,
        border: `1px solid ${ENTERPRISE_TABLE_THEME.borderColor}`,
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {children}
      </div>

      {/* BOTTOM CONTROLS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '4px'
      }}>
        {/* LEFT: Total Records */}
        <div style={{
          fontSize: '13px',
          color: '#6B7280',
          fontWeight: '500'
        }}>
          {totalRecords !== undefined && `Total Records: ${totalRecords}`}
        </div>

        {/* RIGHT: Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #D8DEE8',
                backgroundColor: currentPage === 1 ? '#F9FAFB' : '#FFFFFF',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === 1 ? '#D1D5DB' : '#374151'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #D8DEE8',
                backgroundColor: currentPage === totalPages ? '#F9FAFB' : '#FFFFFF',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === totalPages ? '#D1D5DB' : '#374151'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: { bg: '#FEE2E2', text: '#991B1B', button: '#DC2626' },
    warning: { bg: '#FEF3C7', text: '#92400E', button: '#F59E0B' },
    info: { bg: '#DBEAFE', text: '#1E40AF', button: '#3B82F6' }
  };

  const colors = variantColors[variant];

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
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '12px'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              height: '36px',
              padding: '0 16px',
              border: '1px solid #D8DEE8',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              height: '36px',
              padding: '0 16px',
              border: 'none',
              backgroundColor: colors.button,
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format dates to DD/MM/YYYY
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
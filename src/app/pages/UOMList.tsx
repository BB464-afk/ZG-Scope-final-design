import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, FileSpreadsheet, Upload, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ImportFilesModal from '../components/ImportFilesModal';

interface UOM {
  id: string;
  code: string;
  name: string;
  symbol: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

const MOCK_UOMS: UOM[] = [
  { id: '1', code: 'SQM', name: 'Square Meter', symbol: 'm²', createdAt: '20-02-2026', status: 'Active' },
  { id: '2', code: 'CBM', name: 'Cubic Meter', symbol: 'm³', createdAt: '18-02-2026', status: 'Active' },
  { id: '3', code: 'KG', name: 'Kilogram', symbol: 'kg', createdAt: '15-02-2026', status: 'Active' },
  { id: '4', code: 'LM', name: 'Linear Meter', symbol: 'm', createdAt: '12-02-2026', status: 'Active' },
  { id: '5', code: 'EA', name: 'Each', symbol: 'ea', createdAt: '10-02-2026', status: 'Active' },
  { id: '6', code: 'HR', name: 'Hour', symbol: 'hr', createdAt: '08-02-2026', status: 'Inactive' },
];

export default function UOMList() {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | ''>('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [symbolSearch, setSymbolSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Apply filters and sorting
  const filteredData = MOCK_UOMS
    .filter(uom => uom.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(uom => uom.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(uom => uom.symbol.toLowerCase().includes(symbolSearch.toLowerCase()))
    .filter(uom => uom.createdAt.includes(createdAtSearch))
    .filter(uom => uom.status.toLowerCase().includes(statusSearch.toLowerCase()))
    .sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      const aVal = a[sortColumn as keyof typeof a];
      const bVal = b[sortColumn as keyof typeof b];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(filteredData.map(uom => uom.id)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === filteredData.length);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate') => {
    setBulkAction(action);
    setShowConfirmModal(true);
  };

  const confirmBulkAction = () => {
    if (bulkAction === 'activate') {
      toast.success(`${selectedRows.size} UOM(s) marked as Active successfully`);
    } else if (bulkAction === 'deactivate') {
      toast.success(`${selectedRows.size} UOM(s) marked as Inactive successfully`);
    }
    setSelectedRows(new Set());
    setSelectAll(false);
    setShowConfirmModal(false);
    setBulkAction('');
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} style={{ color: '#FD4314' }} /> : 
      <ArrowDown size={14} style={{ color: '#FD4314' }} />;
  };

  const gridTemplateColumns = '48px 150px 280px 140px 160px 140px';

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 4px 0'
          }}>
            UOM Master
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage Units of Measurement
          </p>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Bulk Actions */}
          <button 
            onClick={() => handleBulkAction('activate')}
            disabled={selectedRows.size === 0}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid #10B981',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: selectedRows.size === 0 ? '#9CA3AF' : '#10B981',
              cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedRows.size === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedRows.size > 0) {
                e.currentTarget.style.backgroundColor = '#F0FDF4';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Mark Active
          </button>
          <button 
            onClick={() => handleBulkAction('deactivate')}
            disabled={selectedRows.size === 0}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid #EF4444',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: selectedRows.size === 0 ? '#9CA3AF' : '#EF4444',
              cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedRows.size === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedRows.size > 0) {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Mark Inactive
          </button>

          {/* Utility Actions - Icon Only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
            <button 
              onClick={() => toast.success('Template downloaded')}
              title="Download Template"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Download size={16} />
            </button>
            <button 
              onClick={() => toast.success('Data exported')}
              title="Export to Excel"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <FileSpreadsheet size={16} />
            </button>
            <button 
              onClick={() => setShowImportModal(true)}
              title="Import from Excel"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Upload size={16} />
            </button>
          </div>

          {/* Primary Action - Add UOM */}
          <button 
            onClick={() => navigate('/app/general-settings/uom/add')}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              backgroundColor: '#FD4314',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            <Plus size={16} />
            Add UOM
          </button>
        </div>
      </div>

      {/* Table Container */}
      {/* NOTE: AG Grid will be implemented here, so the look and feel of the table might differ during development */}
      <div style={{
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '4px',
        padding: '8px 12px',
        marginBottom: '12px',
        fontSize: '12px',
        color: '#6B7280'
      }}>
        Note: AG Grid will be implemented here, so the look and feel of the table might differ during development.
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {/* Table Header with Sort */}
        <div style={{
          backgroundColor: '#E4EEF8',
          display: 'grid',
          gridTemplateColumns,
          borderBottom: '1px solid #C8D9EE',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <input 
              type="checkbox" 
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div 
            onClick={() => handleSort('code')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>UOM Code</span>
            {getSortIcon('code')}
          </div>

          <div 
            onClick={() => handleSort('name')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>UOM Name</span>
            {getSortIcon('name')}
          </div>

          <div 
            onClick={() => handleSort('symbol')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Symbol</span>
            {getSortIcon('symbol')}
          </div>

          <div 
            onClick={() => handleSort('createdAt')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Created At</span>
            {getSortIcon('createdAt')}
          </div>

          <div 
            onClick={() => handleSort('status')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Status</span>
            {getSortIcon('status')}
          </div>
        </div>

        {/* Column Search Row with Filter Icons */}
        <div style={{
          backgroundColor: '#FAFBFC',
          display: 'grid',
          gridTemplateColumns,
          borderBottom: '1px solid #C8D9EE'
        }}>
          <div style={{ height: '40px' }} />

          <div style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 28px 0 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter 
              size={14} 
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 28px 0 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter 
              size={14} 
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={symbolSearch}
              onChange={(e) => setSymbolSearch(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 28px 0 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter 
              size={14} 
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={createdAtSearch}
              onChange={(e) => setCreatedAtSearch(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 28px 0 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter 
              size={14} 
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }}
            />
          </div>

          <div style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={statusSearch}
              onChange={(e) => setStatusSearch(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 28px 0 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter 
              size={14} 
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* Table Rows */}
        <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          {filteredData.map((uom, index) => (
            <div
              key={uom.id}
              onClick={() => navigate(`/app/general-settings/uom/edit/${uom.id}`)}
              style={{
                display: 'grid',
                gridTemplateColumns,
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                borderBottom: '1px solid #E2E6ED',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
            >
              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
              >
                <input 
                  type="checkbox" 
                  checked={selectedRows.has(uom.id)}
                  onChange={(e) => handleRowSelect(uom.id, e)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#272721',
                fontWeight: '600'
              }}>
                {uom.code}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#374151'
              }}>
                {uom.name}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280',
                fontWeight: '500'
              }}>
                {uom.symbol}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {uom.createdAt}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#272721'
              }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: uom.status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                  color: uom.status === 'Active' ? '#03543F' : '#9B1C1C',
                  fontWeight: '500'
                }}>
                  {uom.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Record Count */}
        <div style={{
          height: '44px',
          backgroundColor: '#FAFBFC',
          borderTop: '1px solid #C8D9EE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: '13px',
          color: '#5F6B7A'
        }}>
          <div>
            Total Records: {filteredData.length}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button style={{
              padding: '4px 12px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Previous
            </button>
            <span>Page 1 of 1</span>
            <button style={{
              padding: '4px 12px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
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
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              Confirm Status Change
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '20px'
            }}>
              Are you sure you want to update status for selected records?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setBulkAction('');
                }}
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
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAction}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ImportFilesModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}
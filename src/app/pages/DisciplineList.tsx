import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, FileSpreadsheet, Upload, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import DisciplineImportModal from '../components/DisciplineImportModal';
import ExportConfirmationModal from '../components/ExportConfirmationModal';
import { toast } from 'sonner';

// Mock Data
const MOCK_DISCIPLINES = [
  { id: 1, code: 'DISC-001', name: 'Architectural', description: 'Architectural design and planning work', createdAt: '15-01-2024', status: 'Active' },
  { id: 2, code: 'DISC-002', name: 'Structural', description: 'Structural engineering and load calculations', createdAt: '18-01-2024', status: 'Active' },
  { id: 3, code: 'DISC-003', name: 'Mechanical', description: 'HVAC, plumbing, and mechanical systems', createdAt: '20-01-2024', status: 'Active' },
  { id: 4, code: 'DISC-004', name: 'Electrical', description: 'Electrical design, power distribution, and lighting systems', createdAt: '22-01-2024', status: 'Active' },
  { id: 5, code: 'DISC-005', name: 'Civil', description: 'Site work, grading, and civil infrastructure', createdAt: '01-02-2024', status: 'Active' },
  { id: 6, code: 'DISC-006', name: 'Geotechnical', description: 'Soil testing and foundation engineering', createdAt: '03-02-2024', status: 'Inactive' },
  { id: 7, code: 'DISC-007', name: 'Fire Protection', description: 'Fire safety systems and sprinkler design', createdAt: '05-02-2024', status: 'Active' },
  { id: 8, code: 'DISC-008', name: 'Landscaping', description: 'Landscape architecture and site beautification', createdAt: '08-02-2024', status: 'Active' },
  { id: 9, code: 'DISC-009', name: 'Interior Design', description: 'Interior finishes and space planning', createdAt: '10-02-2024', status: 'Inactive' },
  { id: 10, code: 'DISC-010', name: 'Surveying', description: 'Land surveying and topographical mapping', createdAt: '12-02-2024', status: 'Active' },
];

export default function DisciplineList() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | ''>('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    code: true,
    name: true,
    description: false,
    createdAt: true,
    status: true
  });

  // Apply filters and sorting
  const filteredData = MOCK_DISCIPLINES
    .filter(d => d.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(d => d.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(d => d.description.toLowerCase().includes(descriptionSearch.toLowerCase()))
    .filter(d => d.createdAt.includes(createdAtSearch))
    .filter(d => d.status.toLowerCase().includes(statusSearch.toLowerCase()))
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
      setSelectedRows(new Set(filteredData.map(d => d.id)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (rowId: number, e: React.MouseEvent) => {
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

  const handleMarkActive = () => {
    if (selectedRows.size > 0) {
      setBulkAction('activate');
      setShowConfirmModal(true);
    }
  };

  const handleMarkInactive = () => {
    if (selectedRows.size > 0) {
      setBulkAction('deactivate');
      setShowConfirmModal(true);
    }
  };

  const confirmBulkAction = () => {
    if (bulkAction === 'activate') {
      toast.success(`${selectedRows.size} discipline(s) activated successfully`, {
        description: "These disciplines will now be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
        duration: 5000
      });
    } else if (bulkAction === 'deactivate') {
      toast.success(`${selectedRows.size} discipline(s) deactivated successfully`, {
        description: "These disciplines won't be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
        duration: 5000
      });
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

  // Build grid template columns dynamically based on visibility
  const visibleColumns = [];
  if (columnVisibility.code) visibleColumns.push('200px');
  if (columnVisibility.name) visibleColumns.push('1fr');
  if (columnVisibility.description) visibleColumns.push('1fr');
  if (columnVisibility.createdAt) visibleColumns.push('150px');
  if (columnVisibility.status) visibleColumns.push('140px');
  
  const gridTemplateColumns = `48px ${visibleColumns.join(' ')}`;

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
            Discipline Master
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage construction disciplines
          </p>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Bulk Actions */}
          <button 
            onClick={handleMarkActive}
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
            onClick={handleMarkInactive}
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
              onClick={() => setShowExportModal(true)}
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

          {/* Primary Action - Add Discipline */}
          <button 
            onClick={() => navigate('/app/disciplines/add')}
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
            Add Discipline
          </button>
        </div>
      </div>

      {/* AG Grid Container */}
      {/* NOTE: AG Grid will be implemented here, so the look and feel of the table might differ during development */}
      {/* Visible Note for Users */}
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
        position: 'relative'
      }}>
        {/* Main Table Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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

            {columnVisibility.code && (
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
                <span>Discipline Code</span>
                {getSortIcon('code')}
              </div>
            )}

            {columnVisibility.name && (
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
                <span>Discipline Name</span>
                {getSortIcon('name')}
              </div>
            )}

            {columnVisibility.description && (
              <div 
                onClick={() => handleSort('description')}
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
                <span>Description</span>
                {getSortIcon('description')}
              </div>
            )}

            {columnVisibility.createdAt && (
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
            )}

            {columnVisibility.status && (
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
            )}
          </div>

          {/* Column Search Row with Filter Icons */}
          <div style={{
            backgroundColor: '#FAFBFC',
            display: 'grid',
            gridTemplateColumns,
            borderBottom: '1px solid #C8D9EE'
          }}>
            <div style={{
              height: '40px'
            }} />

            {columnVisibility.code && (
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            )}

            {columnVisibility.name && (
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            )}

            {columnVisibility.description && (
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={descriptionSearch}
                  onChange={(e) => setDescriptionSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            )}

            {columnVisibility.createdAt && (
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={createdAtSearch}
                  onChange={(e) => setCreatedAtSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            )}

            {columnVisibility.status && (
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={statusSearch}
                  onChange={(e) => setStatusSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>
            )}
          </div>

          {/* Table Rows */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredData.map((discipline, index) => (
              <div
                key={discipline.id}
                onClick={() => navigate(`/app/disciplines/${discipline.id}`)}
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
                    checked={selectedRows.has(discipline.id)}
                    onChange={(e) => handleRowSelect(discipline.id, e)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                {columnVisibility.code && (
                  <div style={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#6B7280',
                    fontFamily: 'monospace'
                  }}>
                    {discipline.code}
                  </div>
                )}

                {columnVisibility.name && (
                  <div style={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#272721',
                    fontWeight: '500'
                  }}>
                    {discipline.name}
                  </div>
                )}

                {columnVisibility.description && (
                  <div style={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#6B7280'
                  }}>
                    {discipline.description}
                  </div>
                )}

                {columnVisibility.createdAt && (
                  <div style={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#6B7280'
                  }}>
                    {discipline.createdAt}
                  </div>
                )}

                {columnVisibility.status && (
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
                      backgroundColor: discipline.status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                      color: discipline.status === 'Active' ? '#03543F' : '#9B1C1C',
                      fontWeight: '500'
                    }}>
                      {discipline.status}
                    </span>
                  </div>
                )}
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
              {bulkAction === 'deactivate' ? (
                'The selected discipline(s) is used in existing projects and will continue to be used there. It will not be available for selection in new projects. Do you want to continue?'
              ) : (
                `Are you sure you want to activate ${selectedRows.size} selected discipline(s)?`
              )}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <DisciplineImportModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <ExportConfirmationModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => toast.success('Data exported to Excel')}
        title="Export Discipline Master"
      />
    </div>
  );
}
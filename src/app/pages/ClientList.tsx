import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, FileSpreadsheet, Upload, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ImportFilesModal from '../components/ImportFilesModal';

interface Client {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', code: 'CLI-001', name: 'Skyline Properties LLC', contactPerson: 'Ahmed Al Mazrouei', email: 'ahmed@skyline.ae', phone: '+971 4 123 4567', country: 'United Arab Emirates', region: 'Middle East', createdAt: '15-02-2026', status: 'Active' },
  { id: '2', code: 'CLI-002', name: 'Gulf Construction Group', contactPerson: 'Mohammed Hassan', email: 'mohammed@gulfconst.ae', phone: '+971 4 234 5678', country: 'United Arab Emirates', region: 'Middle East', createdAt: '10-02-2026', status: 'Active' },
  { id: '3', code: 'CLI-003', name: 'Petroleum Development Corp', contactPerson: 'Khalid Rahman', email: 'khalid@petro-dev.ae', phone: '+971 2 345 6789', country: 'United Arab Emirates', region: 'Middle East', createdAt: '08-02-2026', status: 'Active' },
  { id: '4', code: 'CLI-004', name: 'Luxury Hospitality Group', contactPerson: 'Sarah Williams', email: 'sarah@luxuryhosp.com', phone: '+971 4 456 7890', country: 'United Arab Emirates', region: 'Middle East', createdAt: '05-02-2026', status: 'Inactive' },
  { id: '5', code: 'CLI-005', name: 'National Infrastructure Authority', contactPerson: 'Abdullah Naser', email: 'abdullah@nia.gov.ae', phone: '+971 2 567 8901', country: 'United Arab Emirates', region: 'Middle East', createdAt: '01-02-2026', status: 'Active' },
];

export default function ClientList() {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | ''>('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [contactPersonSearch, setContactPersonSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Apply filters and sorting
  const filteredData = MOCK_CLIENTS
    .filter(client => client.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(client => client.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(client => client.contactPerson.toLowerCase().includes(contactPersonSearch.toLowerCase()))
    .filter(client => client.email.toLowerCase().includes(emailSearch.toLowerCase()))
    .filter(client => client.phone.includes(phoneSearch))
    .filter(client => client.country.toLowerCase().includes(countrySearch.toLowerCase()))
    .filter(client => client.region.toLowerCase().includes(regionSearch.toLowerCase()))
    .filter(client => client.createdAt.includes(createdAtSearch))
    .filter(client => client.status.toLowerCase().includes(statusSearch.toLowerCase()))
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
      setSelectedRows(new Set(filteredData.map(client => client.id)));
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
      toast.success(`${selectedRows.size} Client(s) marked as Active successfully`);
    } else if (bulkAction === 'deactivate') {
      toast.success(`${selectedRows.size} Client(s) marked as Inactive successfully`);
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

  const gridTemplateColumns = '48px 110px 200px 160px 220px 160px 150px 120px 120px 110px';

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
            Client Master
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage Clients and Organizations
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

          {/* Primary Action - Add Client */}
          <button 
            onClick={() => navigate('/app/general-settings/client/add')}
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
            Add Client
          </button>
        </div>
      </div>

      {/* Table Container */}
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
        overflow: 'hidden'
      }}>
        {/* Scrollable Table Content */}
        <div style={{ 
          overflow: 'auto', 
          maxHeight: 'calc(100vh - 220px)',
          width: '100%'
        }}>
          <div style={{ minWidth: '1458px', width: 'fit-content' }}>
            {/* Table Header with Sort */}
            <div style={{
              backgroundColor: '#E4EEFE',
              display: 'grid',
              gridTemplateColumns,
              borderBottom: '1px solid #C8D9EE',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              width: '100%'
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
              <span>Client Code</span>
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
              <span>Client Name</span>
              {getSortIcon('name')}
            </div>

            <div 
              onClick={() => handleSort('contactPerson')}
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
              <span>Primary Contact</span>
              {getSortIcon('contactPerson')}
            </div>

            <div 
              onClick={() => handleSort('email')}
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
              <span>Email</span>
              {getSortIcon('email')}
            </div>

            <div 
              onClick={() => handleSort('phone')}
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
              <span>Phone</span>
              {getSortIcon('phone')}
            </div>

            <div 
              onClick={() => handleSort('country')}
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
              <span>Country</span>
              {getSortIcon('country')}
            </div>

            <div 
              onClick={() => handleSort('region')}
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
              <span>Region</span>
              {getSortIcon('region')}
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
                cursor: 'pointer',
                backgroundColor: '#E4EEFE'
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
            borderBottom: '1px solid #C8D9EE',
            position: 'sticky',
            top: '40px',
            zIndex: 10,
            width: '100%'
          }}>
            <div style={{ height: '40px' }} />

            {[
              { value: codeSearch, setter: setCodeSearch },
              { value: nameSearch, setter: setNameSearch },
              { value: contactPersonSearch, setter: setContactPersonSearch },
              { value: emailSearch, setter: setEmailSearch },
              { value: phoneSearch, setter: setPhoneSearch },
              { value: countrySearch, setter: setCountrySearch },
              { value: regionSearch, setter: setRegionSearch },
              { value: createdAtSearch, setter: setCreatedAtSearch },
              { value: statusSearch, setter: setStatusSearch }
            ].map((field, idx) => (
              <div key={idx} style={{ height: '40px', padding: '6px 8px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
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
            ))}
          </div>

          {/* Table Rows */}
          <div>
            {filteredData.map((client, index) => (
              <div
                key={client.id}
                onClick={() => navigate(`/app/general-settings/client/edit/${client.id}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                  borderBottom: '1px solid #E2E6ED',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)'}
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
                    checked={selectedRows.has(client.id)}
                    onChange={(e) => handleRowSelect(client.id, e)}
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
                  {client.code}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#272721',
                  fontWeight: '500'
                }}>
                  {client.name}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {client.contactPerson}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  {client.email}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  {client.phone}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {client.country}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {client.region}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  {client.createdAt}
                </div>

                <div style={{
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#272721'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    backgroundColor: client.status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                    color: client.status === 'Active' ? '#03543F' : '#9B1C1C',
                    fontWeight: '500'
                  }}>
                    {client.status}
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
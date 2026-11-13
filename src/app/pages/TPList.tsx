import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, FileSpreadsheet, Upload, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ImportFilesModal from '../components/ImportFilesModal';

interface TradePackage {
  id: string;
  code: string;
  description: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

export default function TPList() {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | ''>('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Mock Data
  const mockTradePackages: TradePackage[] = [
    { id: '1',  code: 'S01-A0101', description: 'Site Clearing / Demolition', createdAt: '01-10-2026', status: 'Active' },
    { id: '2',  code: 'S01-A0102', description: 'Site Earthworks', createdAt: '01-10-2026', status: 'Active' },
    { id: '3',  code: 'S01-A0201', description: 'Site Hardscape', createdAt: '01-10-2026', status: 'Active' },
    { id: '4',  code: 'S01-A0202', description: 'Landscaping', createdAt: '01-10-2026', status: 'Active' },
    { id: '5',  code: 'S01-A0203', description: 'Site Entrances', createdAt: '01-10-2026', status: 'Active' },
    { id: '6',  code: 'S01-A0204', description: 'Site Security & Security Fence', createdAt: '01-10-2026', status: 'Active' },
    { id: '7',  code: 'S01-A0205', description: 'Site Signage', createdAt: '01-10-2026', status: 'Active' },
    { id: '8',  code: 'S01-A0301', description: 'Water Utilities', createdAt: '01-10-2026', status: 'Active' },
    { id: '9',  code: 'S01-A0302', description: 'Sanitary Sewerage Utilities', createdAt: '01-10-2026', status: 'Active' },
    { id: '10', code: 'S01-A0303', description: 'Storm Drainage Utilities', createdAt: '01-10-2026', status: 'Active' },
    { id: '11', code: 'S01-A0400', description: 'MV / HV Electrical Site Improvements', createdAt: '01-10-2026', status: 'Active' },
    { id: '12', code: 'S01-A0401', description: 'Site Electrical Grounding', createdAt: '01-10-2026', status: 'Active' },
    { id: '13', code: 'S01-A0402', description: 'Site Electrical Lightning Protection', createdAt: '01-10-2026', status: 'Active' },
    { id: '14', code: 'S01-A0403', description: 'Site Electrical Branch Wiring', createdAt: '01-10-2026', status: 'Active' },
    { id: '15', code: 'S01-A0404', description: 'Site Electrical Lighting Wiring', createdAt: '01-10-2026', status: 'Active' },
    { id: '16', code: 'S01-A0405', description: 'Site Electrical Lighting Fixtures', createdAt: '01-10-2026', status: 'Active' },
    { id: '17', code: 'S01-A0500', description: 'Site Communications', createdAt: '01-10-2026', status: 'Active' },
    { id: '18', code: 'S02-A1000', description: 'Electric Yard (EYD) Foundations', createdAt: '01-10-2026', status: 'Active' },
    { id: '19', code: 'S02-A1100', description: 'Mechanical Yard (MYD) Foundations', createdAt: '01-10-2026', status: 'Active' },
    { id: '20', code: 'S02-A1200', description: 'Data Center Hall (DCH) Foundations', createdAt: '01-10-2026', status: 'Active' },
    { id: '21', code: 'S02-A1300', description: 'Facility Support Area (FSA) Foundations', createdAt: '01-10-2026', status: 'Active' },
    { id: '22', code: 'S02-A1400', description: 'Perun Substation (SST) Foundations', createdAt: '01-10-2026', status: 'Active' },
    { id: '23', code: 'S02-A1500', description: 'Facility Support Area (FSA) Slab on Grade', createdAt: '01-10-2026', status: 'Active' },
    { id: '24', code: 'S02-A1600', description: 'Data Center Hall (DCH) Slab on Grade', createdAt: '01-10-2026', status: 'Active' },
    { id: '25', code: 'S02-A7100', description: 'Electric Yard (EYD) Foundations Assemblies', createdAt: '01-10-2026', status: 'Active' },
    { id: '26', code: 'S02-A7200', description: 'Mechanical Yard (MYD) Foundations Assemblies', createdAt: '01-10-2026', status: 'Active' },
    { id: '27', code: 'S03-A2000', description: 'Superstructure Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '28', code: 'S03-A3000', description: 'Refuge Room', createdAt: '01-10-2026', status: 'Active' },
    { id: '29', code: 'S03-P1000', description: 'Superstructure Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '30', code: 'S04-A2100', description: 'Precast / Envelope Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '31', code: 'S04-A2200', description: 'External Windows & Doors', createdAt: '01-10-2026', status: 'Active' },
    { id: '32', code: 'S04-P1000', description: 'Precast / Envelope Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '33', code: 'S05-A2000', description: 'Roof', createdAt: '01-10-2026', status: 'Active' },
    { id: '34', code: 'S06-A4000', description: 'Integrated Communication Technology (ICT) Structural', createdAt: '01-10-2026', status: 'Active' },
    { id: '35', code: 'S06-A9000', description: 'Integrated Communication Technology (ICT) OSP / ISP Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '36', code: 'S06-P3000', description: 'Integrated Communication Technology (ICT) OSP / ISP Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '37', code: 'S08-A6100', description: 'Fire Suppression', createdAt: '01-10-2026', status: 'Active' },
    { id: '38', code: 'S10-A4000', description: 'Substation Conveyance Placement - Include USS to the MYD for Perun conveyance', createdAt: '01-10-2026', status: 'Active' },
    { id: '39', code: 'S10-A5000', description: 'Substation Conveyance Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '40', code: 'S10-P2100', description: 'Substation Conveyance Steel Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '41', code: 'S10-P2200', description: 'Substation Conveyance Electrical Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '42', code: 'S11-A4000', description: 'Perun Equipment Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '43', code: 'S11-A5000', description: 'Perun Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '44', code: 'S11-P3000', description: 'Perun Equipment Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '45', code: 'S12-A4000', description: 'EYD Main Distribution Generator Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '46', code: 'S12-A5000', description: 'EYD Main Distribution Generator Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '47', code: 'S12-A6000', description: 'EYD Main Distribution Generator Mechanical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '48', code: 'S12-A7000', description: 'EYD Main Distribution Generator Elevated Walkways', createdAt: '01-10-2026', status: 'Active' },
    { id: '49', code: 'S12-P3000', description: 'EYD Main Distribution Generator & Enclosures Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '50', code: 'S13-A4000', description: 'EYD Generator Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '51', code: 'S13-A5000', description: 'EYD Generator Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '52', code: 'S13-A6000', description: 'EYD Generator Mechanical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '53', code: 'S13-A7000', description: 'EYD Generator Elevated Walkways', createdAt: '01-10-2026', status: 'Active' },
    { id: '54', code: 'S13-P3000', description: 'EYD Generator & Enclosures Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '55', code: 'S14-A4000', description: 'EYD Conveyance Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '56', code: 'S14-A5000', description: 'EYD Conveyance Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '57', code: 'S14-P2100', description: 'EYD Conveyance Steel Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '58', code: 'S14-P2200', description: 'EYD Conveyance Electrical Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '59', code: 'S15-A5000', description: 'EYD Fuel Oil Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '60', code: 'S15-A6000', description: 'EYD Fuel Oil Mechanical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '61', code: 'S15-P2000', description: 'EYD Fuel Oil Pump Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '62', code: 'S17-A4000', description: 'Server Switchgear Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '63', code: 'S17-A5000', description: 'Server Switchgear Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '64', code: 'S17-A6000', description: 'Server Switchgear Mechanical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '65', code: 'S17-A7000', description: 'Server Switchgear Base and Walkway', createdAt: '01-10-2026', status: 'Active' },
    { id: '66', code: 'S17-P3000', description: 'Server Switchgear Enclosure Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '67', code: 'S17-P3100', description: 'Server Switchgear Switchgear Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '68', code: 'S18-A4000', description: 'Server Conveyance Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '69', code: 'S18-A5000', description: 'Server Conveyance Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '70', code: 'S18-P2100', description: 'Server Conveyance Steel Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '71', code: 'S18-P2200', description: 'Server Conveyance Electrical Procurement', createdAt: '01-10-2026', status: 'Active' },
    { id: '72', code: 'S19-A4000', description: 'MYD Secondary Substation Placement', createdAt: '01-10-2026', status: 'Active' },
    { id: '73', code: 'S19-A5000', description: 'MYD Secondary Substation Electrical Assembly', createdAt: '01-10-2026', status: 'Active' },
    { id: '74', code: 'S19-A7000', description: 'MYD Secondary Substation Elevated Walkways', createdAt: '01-10-2026', status: 'Active' },
    { id: '75', code: 'S19-P3000', description: 'MYD Secondary Substation Procurement', createdAt: '01-10-2026', status: 'Active' },
  ];

  // Apply filters and sorting
  const filteredData = mockTradePackages
    .filter(tp => tp.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(tp => tp.description.toLowerCase().includes(descriptionSearch.toLowerCase()))
    .filter(tp => tp.createdAt.includes(createdAtSearch))
    .filter(tp => tp.status.toLowerCase().includes(statusSearch.toLowerCase()))
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
      setSelectedRows(new Set(filteredData.map(tp => tp.id)));
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
      toast.success(`${selectedRows.size} Trade Package(s) marked as Active successfully`);
    } else if (bulkAction === 'deactivate') {
      toast.success(`${selectedRows.size} Trade Package(s) marked as Inactive successfully`);
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

  const gridTemplateColumns = '48px 180px 1fr 140px 120px';

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
            Trade Package Master
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage Trade Packages
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

          {/* Primary Action */}
          <button 
            onClick={() => navigate('/app/general-settings/tp/add')}
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
            Add Trade Package
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
        backgroundColor: '#F9FAFB',
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
            <span>TP Code</span>
            {getSortIcon('code')}
          </div>

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
            <span>Trade Package Name</span>
            {getSortIcon('description')}
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

          <div style={{
            height: '40px',
            padding: '6px 8px',
            position: 'relative'
          }}>
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

          <div style={{
            height: '40px',
            padding: '6px 8px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={descriptionSearch}
              onChange={(e) => setDescriptionSearch(e.target.value)}
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

          <div style={{
            height: '40px',
            padding: '6px 8px',
            position: 'relative'
          }}>
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

          <div style={{
            height: '40px',
            padding: '6px 8px',
            position: 'relative'
          }}>
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
          {filteredData.map((tp, index) => (
            <div
              key={tp.id}
              onClick={() => navigate(`/app/general-settings/tp/edit/${tp.id}`)}
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
                  checked={selectedRows.has(tp.id)}
                  onChange={(e) => handleRowSelect(tp.id, e)}
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
                {tp.code}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#374151'
              }}>
                {tp.description}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {tp.createdAt}
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
                  backgroundColor: tp.status === 'Active' ? '#DEF7EC' : '#FDE8E8',
                  color: tp.status === 'Active' ? '#03543F' : '#9B1C1C',
                  fontWeight: '500'
                }}>
                  {tp.status}
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, FileSpreadsheet, Upload, Plus, Filter, ChevronRight, ChevronDown } from 'lucide-react';
import ImportFilesModal from '../components/ImportFilesModal';
import ExportConfirmationModal from '../components/ExportConfirmationModal';
import { toast } from 'sonner';

// Enhanced Mock Data matching the wireframe structure with sub-steps
const MOCK_ROC_DATA = [
  { 
    id: 1, 
    rocId: 'FO-01', 
    activityName: 'Whitewash', 
    uom: 'SQM',
    step1: { main: 'Prepare / Set Out', weightage: 10, subSteps: [] },
    step2: { main: 'Installation', weightage: 60, subSteps: [] },
    step3: { main: 'QA & Sign Off', weightage: 30, subSteps: [] },
    step4: { main: '', weightage: 0, subSteps: [] },
    total: 100,
    createdAt: '28-08-2023', 
    status: 'Active',
    hasSubSteps: false,
    isInUse: false,
    isQuantityDescriptor: true
  },
  { 
    id: 2, 
    rocId: 'FO-64', 
    activityName: 'Door sets', 
    uom: 'No',
    step1: { 
      main: 'Procurement - place order', 
      weightage: 10,
      subSteps: [
        { name: 'Place Order', weightage: 40 },
        { name: 'Receive Order', weightage: 35 },
        { name: 'Forward to Warehouse', weightage: 25 }
      ]
    },
    step2: { 
      main: 'Delivery', 
      weightage: 20,
      subSteps: [
        { name: 'Load Truck', weightage: 30 },
        { name: 'Transport', weightage: 50 },
        { name: 'Unload', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Installation', 
      weightage: 60,
      subSteps: [
        { name: 'Frame Installation', weightage: 40 },
        { name: 'Door Hanging', weightage: 35 },
        { name: 'Hardware Fitting', weightage: 25 }
      ]
    },
    step4: { 
      main: 'QA & Sign Off', 
      weightage: 10,
      subSteps: [
        { name: 'Inspection', weightage: 60 },
        { name: 'Sign-off Documentation', weightage: 40 }
      ]
    },
    total: 100,
    createdAt: '18-10-2021', 
    status: 'Active',
    hasSubSteps: true,
    isInUse: true,
    isQuantityDescriptor: false
  },
  { 
    id: 3, 
    rocId: 'FO-16', 
    activityName: 'Stairs', 
    uom: 'No',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Machining/Fabrication concrete', weightage: 15, subSteps: [] },
    step3: { main: 'Delivery', weightage: 10, subSteps: [] },
    step4: { main: 'Installation', weightage: 65, subSteps: [] },
    total: 100,
    createdAt: '09-08-2022', 
    status: 'Inactive',
    hasSubSteps: false,
    isInUse: false,
    isQuantityDescriptor: false
  },
  { 
    id: 4, 
    rocId: 'FO-12', 
    activityName: 'Ceilings', 
    uom: 'SQM',
    step1: { 
      main: 'Prepare / Set Out', 
      weightage: 10,
      subSteps: [
        { name: 'Mark Layout', weightage: 50 },
        { name: 'Prepare Tools', weightage: 50 }
      ]
    },
    step2: { 
      main: 'Install Sub-Grid', 
      weightage: 55,
      subSteps: [
        { name: 'Install Main Runners', weightage: 50 },
        { name: 'Install Cross Tees', weightage: 50 }
      ]
    },
    step3: { 
      main: 'Install tiles', 
      weightage: 30,
      subSteps: [
        { name: 'Place Tiles', weightage: 70 },
        { name: 'Trim Edges', weightage: 30 }
      ]
    },
    step4: { 
      main: 'QA & Sign Off', 
      weightage: 5,
      subSteps: [
        { name: 'Level Check', weightage: 60 },
        { name: 'Visual Inspection', weightage: 40 }
      ]
    },
    total: 100,
    createdAt: '18-08-2021', 
    status: 'Active',
    hasSubSteps: true,
    isInUse: true,
    isQuantityDescriptor: true
  },
  { 
    id: 5, 
    rocId: 'FO-21', 
    activityName: 'Process/Chilled Water Distribution (PCW-CWR)', 
    uom: 'M',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Delivery', weightage: 20, subSteps: [] },
    step3: { main: 'Install Pipework and Fittings', weightage: 45, subSteps: [] },
    step4: { main: 'Testing', weightage: 25, subSteps: [] },
    total: 100,
    createdAt: '15-02-2024', 
    status: 'Active',
    hasSubSteps: false,
    isInUse: false,
    isQuantityDescriptor: false
  },
];

export default function ROCList() {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showMarkActiveModal, setShowMarkActiveModal] = useState(false);
  const [showMarkInactiveModal, setShowMarkInactiveModal] = useState(false);
  
  // Column search state
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');

  const toggleExpandRow = (rocId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rocId)) {
      newExpanded.delete(rocId);
    } else {
      newExpanded.add(rocId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelectRow = (rocId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rocId)) {
      newSelected.delete(rocId);
    } else {
      newSelected.add(rocId);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(roc => roc.id)));
    }
  };

  const handleROCClick = (rocId: number) => {
    navigate(`/app/roc/${rocId}`);
  };

  const handleMarkActive = () => {
    setShowMarkActiveModal(true);
  };

  const handleMarkInactive = () => {
    setShowMarkInactiveModal(true);
  };

  const confirmMarkActive = () => {
    toast.success(`${selectedRows.size} record(s) marked as Active`);
    setShowMarkActiveModal(false);
    setSelectedRows(new Set());
  };

  const confirmMarkInactive = () => {
    toast.success(`${selectedRows.size} record(s) marked as Inactive`);
    setShowMarkInactiveModal(false);
    setSelectedRows(new Set());
  };

  const handleBulkAction = (action: 'activate' | 'deactivate') => {
    if (action === 'activate') {
      handleMarkActive();
    } else if (action === 'deactivate') {
      handleMarkInactive();
    }
  };

  // Apply filters
  const filteredData = MOCK_ROC_DATA
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1.main.toLowerCase().includes(step1Search.toLowerCase()))
    .filter(roc => roc.step2.main.toLowerCase().includes(step2Search.toLowerCase()))
    .filter(roc => roc.step3.main.toLowerCase().includes(step3Search.toLowerCase()))
    .filter(roc => roc.step4.main.toLowerCase().includes(step4Search.toLowerCase()))
    .filter(roc => roc.createdAt.includes(createdAtSearch))
    .filter(roc => roc.status.toLowerCase().includes(statusSearch.toLowerCase()));

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
            ROC Library Master
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage global Rules of Credit library
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

          {/* Primary Action - Add ROC */}
          <button 
            onClick={() => navigate('/app/roc/add')}
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
            Add ROC
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
        overflow: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1600px' }}>
          {/* Table Headers */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#272721',
                width: '40px'
              }}></th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#272721',
                width: '40px'
              }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onChange={toggleSelectAll}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#FD4314'
                  }}
                />
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '100px'
              }}>
                ROC ID
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '220px'
              }}>
                Activity Name
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '80px'
              }}>
                UOM
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '160px'
              }}>
                Step 1
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '80px'
              }}>
                Step 1 Weightage
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '160px'
              }}>
                Step 2
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '80px'
              }}>
                Step 2 Weightage
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '160px'
              }}>
                Step 3
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '80px'
              }}>
                Step 3 Weightage
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '160px'
              }}>
                Step 4
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '80px'
              }}>
                Step 4 Weightage
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '70px'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '110px'
              }}>
                Created At
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '100px'
              }}>
                Status
              </th>
            </tr>

            {/* Search Row */}
            <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #C8D9EE' }}>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search ROC ID"
                    value={rocIdSearch}
                    onChange={(e) => setRocIdSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Activity"
                    value={activityNameSearch}
                    onChange={(e) => setActivityNameSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search UOM"
                    value={uomSearch}
                    onChange={(e) => setUomSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Step 1"
                    value={step1Search}
                    onChange={(e) => setStep1Search(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Step 2"
                    value={step2Search}
                    onChange={(e) => setStep2Search(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Step 3"
                    value={step3Search}
                    onChange={(e) => setStep3Search(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Step 4"
                    value={step4Search}
                    onChange={(e) => setStep4Search(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}></td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Date"
                    value={createdAtSearch}
                    onChange={(e) => setCreatedAtSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Status"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={16} style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  No ROC records found.
                </td>
              </tr>
            ) : (
              filteredData.flatMap((roc, rocIndex) => {
                const isSelected = selectedRows.has(roc.id);
                const isExpanded = expandedRows.has(roc.id);
                
                const rows = [
                  // Parent Row
                  <tr 
                    key={roc.id}
                    style={{
                      backgroundColor: rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                      borderBottom: '1px solid #E2E6ED',
                      cursor: 'pointer',
                      boxShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                      position: 'relative',
                      zIndex: isExpanded ? 5 : 'auto'
                    }}
                    onClick={() => handleROCClick(roc.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF4EF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
                    }}
                  >
                    <td 
                      onClick={(e) => roc.hasSubSteps && toggleExpandRow(roc.id, e)}
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        cursor: roc.hasSubSteps ? 'pointer' : 'default'
                      }}
                    >
                      {roc.hasSubSteps && (
                        isExpanded ? 
                          <ChevronDown size={16} style={{ color: '#6B7280' }} /> : 
                          <ChevronRight size={16} style={{ color: '#6B7280' }} />
                      )}
                    </td>
                    <td 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(roc.id, e)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#FD4314'
                        }}
                      />
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721',
                      fontWeight: '500'
                    }}>
                      {roc.rocId}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {roc.activityName}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.uom}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {roc.step1.main}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.step1.weightage}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {roc.step2.main}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.step2.weightage}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {roc.step3.main}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.step3.weightage}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {roc.step4.main}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.step4.weightage}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#272721',
                      fontWeight: '600'
                    }}>
                      {roc.total}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {roc.createdAt}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: roc.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: roc.status === 'Active' ? '#065F46' : '#991B1B'
                      }}>
                        {roc.status}
                      </span>
                    </td>
                  </tr>
                ];

                // Add sub-rows if expanded
                if (isExpanded && roc.hasSubSteps) {
                  // Find the maximum number of sub-steps across all steps
                  const maxSubSteps = Math.max(
                    roc.step1.subSteps.length,
                    roc.step2.subSteps.length,
                    roc.step3.subSteps.length,
                    roc.step4.subSteps.length
                  );

                  // Create a row for each sub-step level
                  for (let i = 0; i < maxSubSteps; i++) {
                    rows.push(
                      <tr 
                        key={`${roc.id}-sub-${i}`}
                        style={{
                          backgroundColor: 'rgba(253, 67, 20, 0.08)',
                          borderBottom: '1px solid #E2E6ED'
                        }}
                      >
                        <td style={{ 
                          padding: '12px',
                          borderLeft: '3px solid #FD4314'
                        }}></td>
                        <td style={{ padding: '12px' }}></td>
                        <td style={{ padding: '12px' }}></td>
                        <td style={{
                          padding: '12px 12px 12px 24px',
                          fontSize: '12px',
                          color: '#6B7280',
                          fontStyle: 'italic'
                        }}>
                          {/* Empty - sub-step names are in their respective columns */}
                        </td>
                        <td style={{ padding: '12px' }}></td>
                        
                        {/* Step 1 Sub-step */}
                        <td style={{
                          padding: '12px',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step1.subSteps[i]?.name || ''}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step1.subSteps[i]?.weightage ? `${roc.step1.subSteps[i].weightage}%` : ''}
                        </td>
                        
                        {/* Step 2 Sub-step */}
                        <td style={{
                          padding: '12px',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step2.subSteps[i]?.name || ''}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step2.subSteps[i]?.weightage ? `${roc.step2.subSteps[i].weightage}%` : ''}
                        </td>
                        
                        {/* Step 3 Sub-step */}
                        <td style={{
                          padding: '12px',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step3.subSteps[i]?.name || ''}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step3.subSteps[i]?.weightage ? `${roc.step3.subSteps[i].weightage}%` : ''}
                        </td>
                        
                        {/* Step 4 Sub-step */}
                        <td style={{
                          padding: '12px',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step4.subSteps[i]?.name || ''}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {roc.step4.subSteps[i]?.weightage ? `${roc.step4.subSteps[i].weightage}%` : ''}
                        </td>
                        
                        {/* Empty Total column for sub-steps */}
                        <td style={{ padding: '12px' }}></td>
                        <td style={{ padding: '12px' }}></td>
                        <td style={{ padding: '12px' }}></td>
                      </tr>
                    );
                  }
                }

                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Import Modal */}
      <ImportFilesModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)} 
      />

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => toast.success('Data exported to Excel')}
        title="Export ROC Library Master"
      />

      {/* Mark Active Confirmation Modal */}
      {showMarkActiveModal && (
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
              Are you sure you want to activate {selectedRows.size} selected record(s)?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMarkActiveModal(false)}
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
                onClick={confirmMarkActive}
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

      {/* Mark Inactive Confirmation Modal */}
      {showMarkInactiveModal && (
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
              Are you sure you want to deactivate {selectedRows.size} selected record(s)?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMarkInactiveModal(false)}
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
                onClick={confirmMarkInactive}
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
    </div>
  );
}
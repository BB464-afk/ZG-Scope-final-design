import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, AlertTriangle, Filter, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import ExportConfirmationModal from '../components/ExportConfirmationModal';
import ImportFilesModal from '../components/ImportFilesModal';

// Mock Data - Project ROCs
const MOCK_PROJECT_ROCS = [
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
    linkedToTask: true,
    usedInTaskCount: 3,
    hasSubSteps: false,
    status: 'Active',
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
    linkedToTask: true,
    usedInTaskCount: 12,
    hasSubSteps: true,
    status: 'Active',
    isQuantityDescriptor: true
  },
  { 
    id: 3, 
    rocId: 'FO-21', 
    activityName: 'Process/Chilled Water Distribution (PCW-CWR)', 
    uom: 'M',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Delivery', weightage: 20, subSteps: [] },
    step3: { main: 'Install Pipework and Fittings', weightage: 45, subSteps: [] },
    step4: { main: 'Testing', weightage: 25, subSteps: [] },
    total: 100,
    linkedToTask: false,
    usedInTaskCount: 0,
    hasSubSteps: false,
    status: 'Active',
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
    linkedToTask: false,
    usedInTaskCount: 0,
    hasSubSteps: true,
    status: 'Inactive',
    isQuantityDescriptor: false
  }
];

export default function ActivitiesSettings() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Check if project is read-only (On Hold)
  const isProjectReadOnly = projectId === '5';

  const [projectROCs] = useState(MOCK_PROJECT_ROCS);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedROCsForStatus, setSelectedROCsForStatus] = useState<any[]>([]);
  const [targetStatus, setTargetStatus] = useState<'Active' | 'Inactive'>('Active');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Column search state
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');
  const [statusSearch, setStatusSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const toggleRow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(roc => roc.id)));
    }
  };

  const toggleSelectRow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkStatusChange = (status: 'Active' | 'Inactive') => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one activity');
      return;
    }

    const selectedROCs = projectROCs.filter(roc => selectedIds.has(roc.id));
    
    // Check if any selected ROC is linked to tasks when trying to set inactive
    if (status === 'Inactive') {
      const linkedROCs = selectedROCs.filter(roc => roc.linkedToTask);
      if (linkedROCs.length > 0) {
        setSelectedROCsForStatus(linkedROCs);
        setTargetStatus(status);
        setShowStatusModal(true);
        return;
      }
    }

    // If no issues, proceed with status change
    toast.success(`${selectedIds.size} ${selectedIds.size === 1 ? 'activity' : 'activities'} marked as ${status}`);
    setSelectedIds(new Set());
  };

  const confirmStatusChange = () => {
    toast.success(`Status change confirmed for selected activities`);
    setShowStatusModal(false);
    setSelectedROCsForStatus([]);
    setSelectedIds(new Set());
  };

  const handleROCClick = (rocId: number) => {
    navigate(`/app/projects/${projectId}/settings/activities/edit/${rocId}`);
  };

  // Apply filters
  const filteredData = projectROCs
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1.main.toLowerCase().includes(step1Search.toLowerCase()))
    .filter(roc => roc.step2.main.toLowerCase().includes(step2Search.toLowerCase()))
    .filter(roc => roc.step3.main.toLowerCase().includes(step3Search.toLowerCase()))
    .filter(roc => roc.step4.main.toLowerCase().includes(step4Search.toLowerCase()))
    .filter(roc => roc.status.toLowerCase().includes(statusSearch.toLowerCase()));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
            Project Activities (ROCs)
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage project-level Rules of Credit
          </p>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Utility Actions - Icon Only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
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
          </div>

          <button
            onClick={() => !isProjectReadOnly && navigate(`/app/projects/${projectId}/settings/activities/add-from-master`)}
            disabled={isProjectReadOnly}
            title={isProjectReadOnly ? "Add disabled - Project is On Hold" : ""}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FD4314',
              color: isProjectReadOnly ? '#9CA3AF' : '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isProjectReadOnly ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = '#FD4314';
              }
            }}
          >
            <Plus size={16} />
            Add from Master
          </button>
        </div>
      </div>

      {/* Bulk Actions Row - Always visible, disabled when no selection */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '16px',
        gap: '12px'
      }}>
        <span style={{
          fontSize: '13px',
          color: '#6B7280',
          marginRight: '8px'
        }}>
          {selectedIds.size} record(s) selected
        </span>
        <button 
          onClick={() => {
            if (selectedIds.size > 0) {
              handleBulkStatusChange('Active');
            }
          }}
          disabled={selectedIds.size === 0}
          style={{
            height: '36px',
            padding: '0 16px',
            border: '1px solid #10B981',
            backgroundColor: selectedIds.size > 0 ? '#FFFFFF' : '#F9FAFB',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            color: selectedIds.size > 0 ? '#10B981' : '#9CA3AF',
            cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (selectedIds.size > 0) {
              e.currentTarget.style.backgroundColor = '#F0FDF4';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedIds.size > 0) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
        >
          Mark Active
        </button>
        <button 
          onClick={() => {
            if (selectedIds.size > 0) {
              handleBulkStatusChange('Inactive');
            }
          }}
          disabled={selectedIds.size === 0}
          style={{
            height: '36px',
            padding: '0 16px',
            border: '1px solid #EF4444',
            backgroundColor: selectedIds.size > 0 ? '#FFFFFF' : '#F9FAFB',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            color: selectedIds.size > 0 ? '#EF4444' : '#9CA3AF',
            cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (selectedIds.size > 0) {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedIds.size > 0) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
        >
          Mark Inactive
        </button>
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1800px' }}>
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
                  checked={selectedIds.size === filteredData.length && filteredData.length > 0}
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
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={15} style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  No ROC records found.
                </td>
              </tr>
            ) : (
              currentItems.flatMap((roc, rocIndex) => {
                const isSelected = selectedIds.has(roc.id);
                const isExpanded = expandedRows.has(roc.id);
                
                const rows = [
                  // Parent Row
                  <tr
                    key={roc.id}
                    title={isProjectReadOnly ? "Edit disabled - Project is On Hold" : ""}
                    style={{
                      backgroundColor: rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                      borderBottom: '1px solid #E2E6ED',
                      cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                      boxShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                      position: 'relative',
                      zIndex: isExpanded ? 5 : 'auto'
                    }}
                    onClick={() => !isProjectReadOnly && handleROCClick(roc.id)}
                    onMouseEnter={(e) => {
                      if (!isProjectReadOnly) {
                        e.currentTarget.style.backgroundColor = '#FFF4EF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
                    }}
                  >
                    <td 
                      onClick={(e) => roc.hasSubSteps && toggleRow(roc.id, e)}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{roc.activityName}</span>
                        {roc.isQuantityDescriptor && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor: '#E0F2FE',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD'
                          }}>
                            Quantity Descriptor
                          </span>
                        )}
                      </div>
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
                        
                        {/* Empty Total, Status columns for sub-steps */}
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

        {/* Footer with Record Count and Pagination */}
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
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                color: currentPage === 1 ? '#9CA3AF' : '#374151'
              }}
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage) || 1}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredData.length / itemsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                color: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? '#9CA3AF' : '#374151'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Warning Modal - For Linked Tasks */}
      {showStatusModal && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={24} color="#F59E0B" />
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: '0 0 8px 0'
                }}>
                  Warning: Linked Activities
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 12px 0'
                }}>
                  The following activities are linked to tasks and currently in use:
                </p>
                <ul style={{
                  margin: '0 0 12px 0',
                  paddingLeft: '20px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {selectedROCsForStatus.map(roc => (
                    <li key={roc.id} style={{ marginBottom: '4px' }}>
                      {roc.rocId} - {roc.activityName} (Used in {roc.usedInTaskCount} task{roc.usedInTaskCount > 1 ? 's' : ''})
                    </li>
                  ))}
                </ul>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0'
                }}>
                  Marking these activities as inactive may affect existing tasks. Do you want to proceed?
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedROCsForStatus([]);
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
                onClick={confirmStatusChange}
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
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => {
          // Add export logic here
          toast.success('Export initiated successfully');
        }}
        title="Export Project Activities"
      />

      {/* Import Files Modal */}
      {showImportModal && (
        <ImportFilesModal
          title="Import Project Activities"
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onUpload={(files) => {
            // Add import logic here
            toast.success('Project Activities imported successfully');
            setShowImportModal(false);
          }}
        />
      )}
    </div>
  );
}
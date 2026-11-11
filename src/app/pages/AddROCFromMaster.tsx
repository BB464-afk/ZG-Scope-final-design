import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Upload, ChevronRight, ChevronDown, X, Filter, Info, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from '../components/Breadcrumbs';

// Mock ROC Master Library Data
const ROC_MASTER_DATA = [
  { 
    id: 101, 
    rocId: 'FO-01', 
    activityName: 'Whitewash', 
    uom: 'SQM',
    step1: { main: 'Prepare / Set Out', weightage: 10, subSteps: [] },
    step2: { main: 'Installation', weightage: 60, subSteps: [] },
    step3: { main: 'QA & Sign Off', weightage: 30, subSteps: [] },
    step4: { main: '', weightage: 0, subSteps: [] },
    total: 100,
    hasSubSteps: false,
    isQuantityDescriptor: true
  },
  { 
    id: 102, 
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
    hasSubSteps: true,
    isQuantityDescriptor: true
  },
  { 
    id: 103, 
    rocId: 'FO-16', 
    activityName: 'Stairs', 
    uom: 'No',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Machining/Fabrication concrete', weightage: 15, subSteps: [] },
    step3: { main: 'Delivery', weightage: 10, subSteps: [] },
    step4: { main: 'Installation', weightage: 65, subSteps: [] },
    total: 100,
    hasSubSteps: false,
    isQuantityDescriptor: false
  },
  { 
    id: 104, 
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
    hasSubSteps: true,
    isQuantityDescriptor: true
  },
  { 
    id: 105, 
    rocId: 'FO-21', 
    activityName: 'Process/Chilled Water Distribution (PCW-CWR)', 
    uom: 'M',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Delivery', weightage: 20, subSteps: [] },
    step3: { main: 'Install Pipework and Fittings', weightage: 45, subSteps: [] },
    step4: { main: 'Testing', weightage: 25, subSteps: [] },
    total: 100,
    hasSubSteps: false,
    isQuantityDescriptor: true
  },
  { 
    id: 106, 
    rocId: 'FO-08', 
    activityName: 'Block walls', 
    uom: 'SQM',
    step1: { main: 'Prepare / Set Out', weightage: 5, subSteps: [] },
    step2: { main: 'Block laying', weightage: 80, subSteps: [] },
    step3: { main: 'QA & Sign Off', weightage: 15, subSteps: [] },
    step4: { main: '', weightage: 0, subSteps: [] },
    total: 100,
    hasSubSteps: false,
    isQuantityDescriptor: true
  }
];

export default function AddROCFromMaster() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [selectedROCs, setSelectedROCs] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(240);
  
  // Search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Detect sidebar width changes
  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('nav');
      if (sidebar) {
        setSidebarWidth(sidebar.getBoundingClientRect().width);
      }
    };

    updateSidebarWidth();
    
    // Create a ResizeObserver to watch for sidebar width changes
    const sidebar = document.querySelector('nav');
    if (sidebar) {
      const observer = new ResizeObserver(updateSidebarWidth);
      observer.observe(sidebar);
      return () => observer.disconnect();
    }
  }, []);

  const toggleRowSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedROCs);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedROCs(newSelection);
  };

  const toggleAllSelection = () => {
    if (selectedROCs.size === filteredData.length) {
      setSelectedROCs(new Set());
    } else {
      setSelectedROCs(new Set(filteredData.map(roc => roc.id)));
    }
  };

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

  const handleNext = () => {
    if (selectedROCs.size === 0) {
      toast.error('Please select at least one ROC');
      return;
    }
    // Navigate to review screen with selected ROCs
    const selectedData = ROC_MASTER_DATA.filter(roc => selectedROCs.has(roc.id));
    navigate(`/app/projects/${projectId}/settings/activities/review-rocs`, {
      state: { selectedROCs: selectedData }
    });
  };

  const handleExport = () => {
    if (selectedROCs.size === 0) {
      toast.error('Please select at least one ROC to export');
      return;
    }
    toast.success(`${selectedROCs.size} ROC(s) exported`);
  };

  const handleCancel = () => {
    navigate(`/app/projects/${projectId}/settings/activities`);
  };

  // Apply filters
  const filteredData = ROC_MASTER_DATA
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1?.main?.toLowerCase().includes(step1Search.toLowerCase()) ?? true)
    .filter(roc => roc.step2?.main?.toLowerCase().includes(step2Search.toLowerCase()) ?? true)
    .filter(roc => roc.step3?.main?.toLowerCase().includes(step3Search.toLowerCase()) ?? true)
    .filter(roc => roc.step4?.main?.toLowerCase().includes(step4Search.toLowerCase()) ?? true);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const breadcrumbItems = [
    { label: 'Project Activities', path: `/app/projects/${projectId}/settings/activities` },
    { label: 'Add from Master' }
  ];

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px 80px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
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
            Add ROC from Master Library
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Select activities from the master library to add to your project
          </p>
        </div>
      </div>

      {/* Selection Bar */}
      {selectedROCs.size > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#272721',
            fontWeight: '500'
          }}>
            {selectedROCs.size}/{filteredData.length} ROC(s) selected
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleExport}
              title="Export Selected"
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
        </div>
      )}

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
              }}>
                <input
                  type="checkbox"
                  checked={selectedROCs.size === filteredData.length && filteredData.length > 0}
                  onChange={toggleAllSelection}
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
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#272721',
                width: '40px'
              }}></th>
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
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={14} style={{
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF4EF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
                    }}
                  >
                    <td 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedROCs.has(roc.id)}
                        onChange={(e) => toggleRowSelection(roc.id, e)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#FD4314'
                        }}
                      />
                    </td>
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

      {/* Fixed Bottom Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: sidebarWidth,
        right: 0,
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #D8DEE8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 48px',
        gap: '12px',
        zIndex: 100
      }}>
        <button
          onClick={handleCancel}
          style={{
            height: '40px',
            padding: '0 24px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
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
          onClick={handleNext}
          disabled={selectedROCs.size === 0}
          style={{
            height: '40px',
            padding: '0 24px',
            border: 'none',
            backgroundColor: selectedROCs.size === 0 ? '#D1D5DB' : '#FD4314',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            cursor: selectedROCs.size === 0 ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (selectedROCs.size > 0) {
              e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedROCs.size > 0) {
              e.currentTarget.style.backgroundColor = '#FD4314';
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
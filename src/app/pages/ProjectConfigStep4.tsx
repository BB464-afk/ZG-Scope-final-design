import React, { useState } from 'react';
import { Download, Upload, ChevronRight, ChevronDown, X, Info, Filter } from 'lucide-react';
import { toast } from 'sonner';

// STEP 4: ACTIVITIES (ROC)
export function ActivitiesStep() {
  const [selectedRocs, setSelectedRocs] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [hasExported, setHasExported] = useState(false);
  const [showWorkflowBanner, setShowWorkflowBanner] = useState(true);
  
  // Search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');

  // Mock ROC data from library master with sub-steps
  const rocData = [
    { 
      id: 1, 
      rocId: 'FO-01', 
      activityName: 'Whitewash', 
      uom: 'SQM',
      isQuantityDescriptor: true,
      step1: { name: 'Prepare / Set Out', weightage: 10, subSteps: [] },
      step2: { 
        name: 'Installation', 
        weightage: 80, 
        subSteps: [
          { name: 'Part 2A', weightage: 20 },
          { name: 'Part 2B', weightage: 40 },
          { name: 'Part 2C', weightage: 20 }
        ]
      },
      step3: { name: 'QA & Sign Off', weightage: 10, subSteps: [] },
      step4: { name: '-', weightage: 0, subSteps: [] },
      total: 100,
      hasSubSteps: true
    },
    { 
      id: 2, 
      rocId: 'FO-04', 
      activityName: 'Door sets', 
      uom: 'No',
      isQuantityDescriptor: false,
      step1: { name: 'Procurement - place order', weightage: 10, subSteps: [] },
      step2: { name: 'Delivery', weightage: 30, subSteps: [] },
      step3: { name: 'Installation', weightage: 55, subSteps: [] },
      step4: { name: 'QA & Sign Off', weightage: 10, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 3, 
      rocId: 'FO-10', 
      activityName: 'Stairs', 
      uom: 'No',
      isQuantityDescriptor: false,
      step1: { name: 'Procurement - place order', weightage: 10, subSteps: [] },
      step2: { name: 'Machining/Fabrication complete', weightage: 90, subSteps: [] },
      step3: { name: 'Delivery', weightage: 10, subSteps: [] },
      step4: { name: 'Installation', weightage: 70, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 4, 
      rocId: 'FO-12', 
      activityName: 'Ceilings', 
      uom: 'SQM',
      isQuantityDescriptor: true,
      step1: { name: 'Prepare / Set Out', weightage: 10, subSteps: [] },
      step2: { name: 'Install Sub-Grid', weightage: 55, subSteps: [] },
      step3: { name: 'Install tiles', weightage: 30, subSteps: [] },
      step4: { name: 'QA & Sign Off', weightage: 5, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 5, 
      rocId: 'FO-21', 
      activityName: 'Process/Chilled Water treatment', 
      uom: 'M',
      isQuantityDescriptor: false,
      step1: { name: 'Procurement - place order', weightage: 10, subSteps: [] },
      step2: { name: 'Delivery', weightage: 20, subSteps: [] },
      step3: { name: 'Install Pipework and Drainage', weightage: 45, subSteps: [] },
      step4: { name: 'Testing', weightage: 25, subSteps: [] },
      total: 100,
      hasSubSteps: false
    }
  ];

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
    const newSelected = new Set(selectedRocs);
    if (newSelected.has(rocId)) {
      newSelected.delete(rocId);
    } else {
      newSelected.add(rocId);
    }
    setSelectedRocs(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRocs.size === filteredData.length) {
      setSelectedRocs(new Set());
    } else {
      setSelectedRocs(new Set(filteredData.map(roc => roc.id)));
    }
  };

  const handleExport = () => {
    setHasExported(true);
    toast.success(`${selectedRocs.size} ROC(s) exported successfully. You can now modify and import.`);
  };

  const handleImport = () => {
    toast.success('Import completed. Project-specific values have been saved.');
    setHasExported(false);
    setSelectedRocs(new Set());
  };

  // Apply filters
  const filteredData = rocData
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1.name.toLowerCase().includes(step1Search.toLowerCase()))
    .filter(roc => roc.step2.name.toLowerCase().includes(step2Search.toLowerCase()))
    .filter(roc => roc.step3.name.toLowerCase().includes(step3Search.toLowerCase()))
    .filter(roc => roc.step4.name.toLowerCase().includes(step4Search.toLowerCase()));

  // When exported, show only selected ROCs
  const displayData = hasExported 
    ? filteredData.filter(roc => selectedRocs.has(roc.id))
    : filteredData;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Page Title and Actions */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#272721',
            margin: 0
          }}>
            Project Activities (ROC Configuration)
          </h2>
          {!showWorkflowBanner && !hasExported && (
            <button
              onClick={() => setShowWorkflowBanner(true)}
              title="Show workflow information"
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FD4314',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Info size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {!hasExported && (
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 20px 0'
        }}>
          Select ROCs from library, export to modify values, and import project-specific configurations.
        </p>
      )}

      {/* Workflow Info Banner */}
      {showWorkflowBanner && !hasExported && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(228, 238, 254, 0.5)',
          border: '1px solid #C8D9EE',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          position: 'relative'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            i
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: '0 0 6px 0',
              fontSize: '14px',
              color: '#272721',
              fontWeight: '600'
            }}>
              Workflow: Select → Export → Modify in Excel → Import
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6B7280',
              lineHeight: '1.5'
            }}>
              Select ROCs from the library below, export to Excel, modify weightage values as needed, then import back. Modified values are project-specific and won't affect the master library.
            </p>
          </div>
          <button
            onClick={() => setShowWorkflowBanner(false)}
            title="Close"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '20px',
              height: '20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
              e.currentTarget.style.color = '#272721';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Selection Count and Export Actions - Hide when exported */}
      {selectedRocs.size > 0 && !hasExported && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#272721'
          }}>
            {selectedRocs.size} ROC{selectedRocs.size > 1 ? 's' : ''} selected
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Export Button - Primary action */}
            <button
              onClick={handleExport}
              style={{
                height: '36px',
                padding: '0 20px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              <Download size={16} />
              Export For Editing
            </button>
          </div>
        </div>
      )}

      {/* ROC Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1600px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#E4EEFE',
                height: '52px'
              }}>
                {!hasExported && (
                  <th style={{
                    padding: '0 16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '40px'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedRocs.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#FD4314' }}
                    />
                  </th>
                )}
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '40px'
                }}></th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '100px'
                }}>
                  ROC ID
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  minWidth: '180px'
                }}>
                  Activity Name
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '80px'
                }}>
                  UOM
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '180px'
                }}>
                  Step 1
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '100px'
                }}>
                  Weightage
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '180px'
                }}>
                  Step 2
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '100px'
                }}>
                  Weightage
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '180px'
                }}>
                  Step 3
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '100px'
                }}>
                  Weightage
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '180px'
                }}>
                  Step 4
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '100px'
                }}>
                  Weightage
                </th>
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '80px'
                }}>
                  Total
                </th>
              </tr>

              {/* Search Row - Hidden when exported */}
              {!hasExported && (
                <tr style={{
                  backgroundColor: '#F9FAFB',
                  height: '44px'
                }}>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={rocIdSearch}
                        onChange={(e) => setRocIdSearch(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={activityNameSearch}
                        onChange={(e) => setActivityNameSearch(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={uomSearch}
                        onChange={(e) => setUomSearch(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={step1Search}
                        onChange={(e) => setStep1Search(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={step2Search}
                        onChange={(e) => setStep2Search(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={step3Search}
                        onChange={(e) => setStep3Search(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={step4Search}
                        onChange={(e) => setStep4Search(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 8px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                  <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                </tr>
              )}
            </thead>

            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={hasExported ? 13 : 14} style={{
                    padding: '40px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6B7280'
                  }}>
                    {hasExported ? 'No ROCs selected for export' : 'No ROCs found matching your search criteria'}
                  </td>
                </tr>
              ) : (
                displayData.flatMap((roc, rocIndex) => {
                  const isSelected = selectedRocs.has(roc.id);
                  const isExpanded = expandedRows.has(roc.id);
                  
                  const rows = [
                    // Parent Row - Main Activity
                    <tr 
                      key={roc.id}
                      style={{
                        backgroundColor: rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                        height: '52px',
                        cursor: hasExported ? 'default' : 'pointer'
                      }}
                      onMouseEnter={(e) => !hasExported && (e.currentTarget.style.backgroundColor = 'rgba(228, 238, 254, 0.5)')}
                      onMouseLeave={(e) => !hasExported && (e.currentTarget.style.backgroundColor = rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)')}
                    >
                      {!hasExported && (
                        <td style={{
                          padding: '0 16px',
                          textAlign: 'center',
                          borderBottom: '1px solid #E2E6ED'
                        }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectRow(roc.id, e)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#FD4314' }}
                          />
                        </td>
                      )}
                      <td style={{
                        padding: '0 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.hasSubSteps && (
                          <button
                            onClick={(e) => toggleExpandRow(roc.id, e)}
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6B7280'
                            }}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        )}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#272721',
                        borderBottom: '1px solid #E2E6ED',
                        whiteSpace: 'nowrap'
                      }}>
                        {roc.rocId}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#272721',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {roc.activityName}
                          {roc.isQuantityDescriptor && (
                            <span style={{
                              padding: '2px 8px',
                              backgroundColor: 'rgba(228, 238, 254, 0.8)',
                              border: '1px solid #C8D9EE',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#1F2937',
                              whiteSpace: 'nowrap'
                            }}>
                              Quantity Descriptor
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.uom}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step1.name}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step1.weightage > 0 ? `${roc.step1.weightage}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step2.name}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step2.weightage > 0 ? `${roc.step2.weightage}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step3.name}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step3.weightage > 0 ? `${roc.step3.weightage}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step4.name}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step4.weightage > 0 ? `${roc.step4.weightage}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#272721',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.total}%
                      </td>
                    </tr>
                  ];

                  // Add sub-step rows when expanded
                  if (isExpanded) {
                    // Collect all sub-steps from all steps
                    const maxSubSteps = Math.max(
                      roc.step1.subSteps.length,
                      roc.step2.subSteps.length,
                      roc.step3.subSteps.length,
                      roc.step4.subSteps.length
                    );

                    for (let i = 0; i < maxSubSteps; i++) {
                      rows.push(
                        <tr 
                          key={`${roc.id}-sub-${i}`}
                          style={{
                            backgroundColor: '#F9FAFB',
                            height: '44px'
                          }}
                        >
                          {!hasExported && <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>}
                          <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                          <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                          <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                          <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                          <td style={{
                            padding: '0 16px 0 32px',
                            fontSize: '13px',
                            color: '#374151',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step1.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151',
                            textAlign: 'center',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step1.subSteps[i]?.weightage ? `${roc.step1.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px 0 32px',
                            fontSize: '13px',
                            color: '#374151',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step2.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151',
                            textAlign: 'center',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step2.subSteps[i]?.weightage ? `${roc.step2.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px 0 32px',
                            fontSize: '13px',
                            color: '#374151',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step3.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151',
                            textAlign: 'center',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step3.subSteps[i]?.weightage ? `${roc.step3.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px 0 32px',
                            fontSize: '13px',
                            color: '#374151',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step4.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151',
                            textAlign: 'center',
                            borderBottom: '1px solid #E2E6ED'
                          }}>
                            {roc.step4.subSteps[i]?.weightage ? `${roc.step4.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
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
      </div>

      {/* Import Button - Only when exported */}
      {hasExported && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleImport}
            style={{
              height: '40px',
              padding: '0 24px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            <Upload size={16} />
            Import Modified ROCs
          </button>
        </div>
      )}
    </div>
  );
}
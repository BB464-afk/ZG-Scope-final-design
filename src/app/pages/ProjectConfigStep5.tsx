import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Upload, Edit2, Filter, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface ROCConfigProps {
  configuredRocs?: any[];
  onSave: (rocs: any[]) => void;
}

// Default mock data for Step 5
const DEFAULT_ROCS = [
  {
    configuredId: 1,
    rocId: 'ROC-2024-001',
    activityName: 'Excavation Works',
    uom: 'Cum',
    isQuantityDescriptor: true,
    step1: { 
      main: 'Planning', 
      weight: 25,
      subSteps: [
        { name: 'Site Survey', weightage: 40 },
        { name: 'Resource Planning', weightage: 35 },
        { name: 'Safety Review', weightage: 25 }
      ]
    },
    step2: { 
      main: 'Execution', 
      weight: 40,
      subSteps: [
        { name: 'Part 2A - Mobilization', weightage: 30 },
        { name: 'Part 2B - Excavation', weightage: 50 },
        { name: 'Part 2C - Material Disposal', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Quality Check', 
      weight: 20,
      subSteps: [
        { name: 'Dimension Verification', weightage: 60 },
        { name: 'Documentation', weightage: 40 }
      ]
    },
    step4: { 
      main: 'Completion', 
      weight: 15,
      subSteps: [
        { name: 'Final Inspection', weightage: 70 },
        { name: 'Handover', weightage: 30 }
      ]
    },
    total: 100
  },
  {
    configuredId: 2,
    rocId: 'ROC-2024-002',
    activityName: 'Concrete Pouring',
    uom: 'Cum',
    isQuantityDescriptor: true,
    step1: { 
      main: 'Preparation', 
      weight: 30,
      subSteps: []
    },
    step2: { 
      main: 'Pouring', 
      weight: 35,
      subSteps: [
        { name: 'Part 2A - Setup', weightage: 25 },
        { name: 'Part 2B - Concrete Pour', weightage: 55 },
        { name: 'Part 2C - Finishing', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Curing', 
      weight: 25,
      subSteps: []
    },
    step4: { 
      main: 'Testing', 
      weight: 10,
      subSteps: []
    },
    total: 100
  },
  {
    configuredId: 3,
    rocId: 'ROC-2024-003',
    activityName: 'Steel Reinforcement',
    uom: 'MT',
    isQuantityDescriptor: true,
    step1: { 
      main: 'Cutting & Bending', 
      weight: 35,
      subSteps: []
    },
    step2: { 
      main: 'Installation', 
      weight: 40,
      subSteps: [
        { name: 'Part 2A - Bar Placement', weightage: 45 },
        { name: 'Part 2B - Binding', weightage: 35 },
        { name: 'Part 2C - Cover Check', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Inspection', 
      weight: 15,
      subSteps: []
    },
    step4: { 
      main: 'Approval', 
      weight: 10,
      subSteps: []
    },
    total: 100
  },
  {
    configuredId: 4,
    rocId: 'ROC-2024-004',
    activityName: 'Formwork Erection',
    uom: 'Sqm',
    isQuantityDescriptor: false,
    step1: { 
      main: 'Design Review', 
      weight: 20,
      subSteps: []
    },
    step2: { 
      main: 'Assembly', 
      weight: 45,
      subSteps: [
        { name: 'Part 2A - Frame Setup', weightage: 40 },
        { name: 'Part 2B - Panel Installation', weightage: 40 },
        { name: 'Part 2C - Alignment', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Quality Check', 
      weight: 25,
      subSteps: []
    },
    step4: { 
      main: 'Sign Off', 
      weight: 10,
      subSteps: []
    },
    total: 100
  },
  {
    configuredId: 5,
    rocId: 'ROC-2024-005',
    activityName: 'Waterproofing Application',
    uom: 'Sqm',
    isQuantityDescriptor: false,
    step1: { 
      main: 'Surface Preparation', 
      weight: 20,
      subSteps: []
    },
    step2: { 
      main: 'Membrane Application', 
      weight: 50,
      subSteps: []
    },
    step3: { 
      main: 'Protection Layer', 
      weight: 20,
      subSteps: []
    },
    step4: { 
      main: 'Testing & Sign Off', 
      weight: 10,
      subSteps: []
    },
    total: 100
  },
  {
    configuredId: 6,
    rocId: 'ROC-2024-006',
    activityName: 'MEP Installation',
    uom: 'LS',
    isQuantityDescriptor: false,
    step1: { 
      main: 'Planning & Coordination', 
      weight: 15,
      subSteps: []
    },
    step2: { 
      main: 'Installation', 
      weight: 60,
      subSteps: []
    },
    step3: { 
      main: 'Testing & Commissioning', 
      weight: 20,
      subSteps: []
    },
    step4: { 
      main: 'Handover', 
      weight: 5,
      subSteps: []
    },
    total: 100
  },
  {
    configuredId: 7,
    rocId: 'ROC-2024-007',
    activityName: 'Ceiling Installation',
    uom: 'Sqm',
    isQuantityDescriptor: false,
    step1: { 
      main: 'Frame Installation', 
      weight: 30,
      subSteps: []
    },
    step2: { 
      main: 'Panel Fixing', 
      weight: 50,
      subSteps: []
    },
    step3: { 
      main: 'Finishing', 
      weight: 15,
      subSteps: []
    },
    step4: { 
      main: 'QA Sign Off', 
      weight: 5,
      subSteps: []
    },
    total: 100
  }
];

export function ROCConfigurationStep({ configuredRocs: initialRocs, onSave }: ROCConfigProps) {
  const navigate = useNavigate();
  const [configuredRocs, setConfiguredRocs] = useState(initialRocs && initialRocs.length > 0 ? initialRocs : DEFAULT_ROCS);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Column search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');

  const toggleExpand = (rocId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rocId)) {
      newExpanded.delete(rocId);
    } else {
      newExpanded.add(rocId);
    }
    setExpandedRows(newExpanded);
  };

  const handleEditROC = (roc: any) => {
    navigate('/app/project-config-roc-edit', { 
      state: { 
        roc, 
        returnPath: window.location.pathname,
        fromStep5: true
      } 
    });
  };

  const handleImportROCs = () => {
    toast.info('Import configured ROCs feature - upload Excel with ROC configurations');
  };

  // Apply filters
  const filteredData = configuredRocs
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1.main.toLowerCase().includes(step1Search.toLowerCase()))
    .filter(roc => roc.step2.main.toLowerCase().includes(step2Search.toLowerCase()))
    .filter(roc => roc.step3.main.toLowerCase().includes(step3Search.toLowerCase()))
    .filter(roc => roc.step4.main.toLowerCase().includes(step4Search.toLowerCase()));

  // Calculate pagination
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle ROC return from edit screen
  React.useEffect(() => {
    const checkForUpdates = () => {
      const updated = sessionStorage.getItem('updatedROC_step5');
      if (updated) {
        const updatedRoc = JSON.parse(updated);
        setConfiguredRocs(prev => prev.map(roc => 
          roc.configuredId === updatedRoc.configuredId ? updatedRoc : roc
        ));
        sessionStorage.removeItem('updatedROC_step5');
        toast.success('ROC configuration updated');
      }
    };
    
    checkForUpdates();
    const handleFocus = () => checkForUpdates();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header with Import Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 4px 0'
          }}>
            Configure ROCs for Your Project
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0
          }}>
            Review and edit ROC configurations. Click Edit to modify any ROC details.
          </p>
        </div>
        <button
          onClick={handleImportROCs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '36px',
            padding: '0 20px',
            backgroundColor: '#FFFFFF',
            color: '#FD4314',
            border: '1px solid #FD4314',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <Upload size={16} />
          Import Configured ROCs
        </button>
      </div>

      {/* ROCs Table */}
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
            minWidth: '1700px'
          }}>
            <thead>
              {/* Header Row */}
              <tr style={{
                backgroundColor: '#E4EEFE',
                height: '52px'
              }}>
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
                <th style={{
                  padding: '0 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '80px'
                }}>
                  Action
                </th>
              </tr>

              {/* Search Row */}
              <tr style={{
                backgroundColor: '#F9FAFB',
                height: '44px'
              }}>
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
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{
                    padding: '40px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6B7280'
                  }}>
                    No ROCs found matching your search criteria
                  </td>
                </tr>
              ) : (
                paginatedData.flatMap((roc, rocIndex) => {
                  const isExpanded = expandedRows.has(roc.configuredId);
                  const hasSubSteps = roc.step1.subSteps.length > 0 || roc.step2.subSteps.length > 0 || 
                                      roc.step3.subSteps.length > 0 || roc.step4.subSteps.length > 0;
                  
                  const rows = [
                    // Parent Row - Main Activity
                    <tr 
                      key={roc.configuredId}
                      style={{
                        backgroundColor: rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                        height: '52px',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(228, 238, 254, 0.5)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)')}
                    >
                      <td style={{
                        padding: '0 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {hasSubSteps && (
                          <button
                            onClick={(e) => toggleExpand(roc.configuredId, e)}
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
                        {roc.step1.main}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step1.weight > 0 ? `${roc.step1.weight}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step2.main}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step2.weight > 0 ? `${roc.step2.weight}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step3.main}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step3.weight > 0 ? `${roc.step3.weight}%` : '-'}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step4.main}
                      </td>
                      <td style={{
                        padding: '0 16px',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        {roc.step4.weight > 0 ? `${roc.step4.weight}%` : '-'}
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
                      <td style={{
                        padding: '0 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        <button
                          onClick={() => handleEditROC(roc)}
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FD4314',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ];

                  // Add sub-step rows when expanded
                  if (isExpanded) {
                    const maxSubSteps = Math.max(
                      roc.step1.subSteps.length,
                      roc.step2.subSteps.length,
                      roc.step3.subSteps.length,
                      roc.step4.subSteps.length
                    );

                    for (let i = 0; i < maxSubSteps; i++) {
                      rows.push(
                        <tr 
                          key={`${roc.configuredId}-sub-${i}`}
                          style={{
                            backgroundColor: 'rgba(253, 67, 20, 0.08)',
                            height: '44px',
                            borderBottom: '1px solid #E2E6ED'
                          }}
                        >
                          <td style={{
                            padding: '0 16px',
                            borderLeft: '3px solid #FD4314'
                          }}></td>
                          <td style={{ padding: '0 16px' }}></td>
                          <td style={{ padding: '0 16px' }}></td>
                          <td style={{ padding: '0 16px' }}></td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280'
                          }}>
                            {roc.step1.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280',
                            textAlign: 'center'
                          }}>
                            {roc.step1.subSteps[i]?.weightage ? `${roc.step1.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280'
                          }}>
                            {roc.step2.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280',
                            textAlign: 'center'
                          }}>
                            {roc.step2.subSteps[i]?.weightage ? `${roc.step2.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280'
                          }}>
                            {roc.step3.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280',
                            textAlign: 'center'
                          }}>
                            {roc.step3.subSteps[i]?.weightage ? `${roc.step3.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280'
                          }}>
                            {roc.step4.subSteps[i]?.name || ''}
                          </td>
                          <td style={{
                            padding: '0 16px',
                            fontSize: '12px',
                            color: '#6B7280',
                            textAlign: 'center'
                          }}>
                            {roc.step4.subSteps[i]?.weightage ? `${roc.step4.subSteps[i].weightage}%` : ''}
                          </td>
                          <td style={{ padding: '0 16px' }}></td>
                          <td style={{ padding: '0 16px' }}></td>
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

        {/* Pagination Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderTop: '1px solid #E2E6ED',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#6B7280'
          }}>
            Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords} records
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
                width: '32px',
                height: '32px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === 1 ? '#9CA3AF' : '#374151'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  backgroundColor: currentPage === page ? '#FD4314' : '#FFFFFF',
                  color: currentPage === page ? '#FFFFFF' : '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentPage === totalPages ? '#9CA3AF' : '#374151'
              }}
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
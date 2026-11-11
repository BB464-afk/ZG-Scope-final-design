import React, { useState } from 'react';
import { Download, Upload, ChevronRight, ChevronDown, X, Info, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';

// STEP 4: ACTIVITIES (ROC) - Edit Mode
export function EditActivitiesStep() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showAddRocModal, setShowAddRocModal] = useState(false);
  
  // Search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');

  // Extended ROC data with 14 total rows
  const rocData = [
    { 
      id: 1, 
      rocId: 'DC-001', 
      activityName: 'Server Rack Installation', 
      uom: 'No',
      step1: { main: 'Procurement', weightage: 15, subSteps: [] },
      step2: { main: 'Delivery & Staging', weightage: 10, subSteps: [] },
      step3: { main: 'Installation', weightage: 60, subSteps: [] },
      step4: { main: 'Testing & Commissioning', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 2, 
      rocId: 'DC-002', 
      activityName: 'Cooling System Installation', 
      uom: 'Unit',
      step1: { 
        main: 'Procurement', 
        weightage: 10,
        subSteps: [
          { name: 'Place Order', weightage: 40 },
          { name: 'Receive Equipment', weightage: 35 },
          { name: 'Quality Check', weightage: 25 }
        ]
      },
      step2: { 
        main: 'Delivery', 
        weightage: 15,
        subSteps: [
          { name: 'Load & Transport', weightage: 50 },
          { name: 'Unload & Store', weightage: 50 }
        ]
      },
      step3: { 
        main: 'Installation', 
        weightage: 50,
        subSteps: [
          { name: 'Unit Positioning', weightage: 30 },
          { name: 'Piping Connection', weightage: 40 },
          { name: 'Electrical Connection', weightage: 30 }
        ]
      },
      step4: { 
        main: 'Commissioning', 
        weightage: 25,
        subSteps: [
          { name: 'System Testing', weightage: 60 },
          { name: 'Performance Verification', weightage: 40 }
        ]
      },
      total: 100,
      hasSubSteps: true
    },
    { 
      id: 3, 
      rocId: 'DC-003', 
      activityName: 'Power Distribution Unit', 
      uom: 'No',
      step1: { main: 'Procurement', weightage: 20, subSteps: [] },
      step2: { main: 'Delivery', weightage: 10, subSteps: [] },
      step3: { main: 'Installation & Wiring', weightage: 55, subSteps: [] },
      step4: { main: 'Testing & Certification', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 4, 
      rocId: 'DC-004', 
      activityName: 'Cable Tray System', 
      uom: 'M',
      step1: { main: 'Material Procurement', weightage: 15, subSteps: [] },
      step2: { main: 'Fabrication', weightage: 20, subSteps: [] },
      step3: { main: 'Installation', weightage: 50, subSteps: [] },
      step4: { main: 'Inspection', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 5, 
      rocId: 'DC-005', 
      activityName: 'Fire Suppression System', 
      uom: 'System',
      step1: { 
        main: 'Procurement', 
        weightage: 15,
        subSteps: [
          { name: 'Equipment Order', weightage: 50 },
          { name: 'Material Delivery', weightage: 50 }
        ]
      },
      step2: { 
        main: 'Installation', 
        weightage: 40,
        subSteps: [
          { name: 'Cylinder Installation', weightage: 30 },
          { name: 'Piping Installation', weightage: 40 },
          { name: 'Nozzle Installation', weightage: 30 }
        ]
      },
      step3: { 
        main: 'Integration', 
        weightage: 25,
        subSteps: [
          { name: 'Control Panel Setup', weightage: 60 },
          { name: 'Sensor Integration', weightage: 40 }
        ]
      },
      step4: { 
        main: 'Testing & Certification', 
        weightage: 20,
        subSteps: [
          { name: 'System Testing', weightage: 70 },
          { name: 'Authority Approval', weightage: 30 }
        ]
      },
      total: 100,
      hasSubSteps: true
    },
    { 
      id: 6, 
      rocId: 'DC-006', 
      activityName: 'Raised Floor System', 
      uom: 'SQM',
      step1: { main: 'Material Procurement', weightage: 10, subSteps: [] },
      step2: { main: 'Site Preparation', weightage: 15, subSteps: [] },
      step3: { main: 'Floor Installation', weightage: 60, subSteps: [] },
      step4: { main: 'Finishing & QA', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 7, 
      rocId: 'DC-007', 
      activityName: 'UPS System', 
      uom: 'Unit',
      step1: { main: 'Procurement', weightage: 20, subSteps: [] },
      step2: { main: 'Transportation', weightage: 10, subSteps: [] },
      step3: { main: 'Installation & Setup', weightage: 50, subSteps: [] },
      step4: { main: 'Testing & Commissioning', weightage: 20, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 8, 
      rocId: 'DC-008', 
      activityName: 'Network Cabling', 
      uom: 'M',
      step1: { main: 'Material Procurement', weightage: 10, subSteps: [] },
      step2: { main: 'Cable Pulling', weightage: 45, subSteps: [] },
      step3: { main: 'Termination', weightage: 30, subSteps: [] },
      step4: { main: 'Testing & Documentation', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 9, 
      rocId: 'DC-009', 
      activityName: 'Building Management System', 
      uom: 'System',
      step1: { 
        main: 'Procurement', 
        weightage: 15,
        subSteps: [
          { name: 'Hardware Procurement', weightage: 60 },
          { name: 'Software Licensing', weightage: 40 }
        ]
      },
      step2: { 
        main: 'Installation', 
        weightage: 30,
        subSteps: [
          { name: 'Server Setup', weightage: 40 },
          { name: 'Sensor Installation', weightage: 60 }
        ]
      },
      step3: { 
        main: 'Programming', 
        weightage: 35,
        subSteps: [
          { name: 'System Configuration', weightage: 50 },
          { name: 'Interface Setup', weightage: 50 }
        ]
      },
      step4: { 
        main: 'Commissioning', 
        weightage: 20,
        subSteps: [
          { name: 'System Testing', weightage: 60 },
          { name: 'User Training', weightage: 40 }
        ]
      },
      total: 100,
      hasSubSteps: true
    },
    { 
      id: 10, 
      rocId: 'DC-010', 
      activityName: 'Emergency Generator', 
      uom: 'Unit',
      step1: { main: 'Procurement', weightage: 25, subSteps: [] },
      step2: { main: 'Foundation & Rigging', weightage: 20, subSteps: [] },
      step3: { main: 'Installation', weightage: 40, subSteps: [] },
      step4: { main: 'Testing & Load Bank', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 11, 
      rocId: 'DC-011', 
      activityName: 'Access Control System', 
      uom: 'System',
      step1: { main: 'Equipment Procurement', weightage: 15, subSteps: [] },
      step2: { main: 'Wiring & Infrastructure', weightage: 25, subSteps: [] },
      step3: { main: 'Device Installation', weightage: 40, subSteps: [] },
      step4: { main: 'Programming & Testing', weightage: 20, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 12, 
      rocId: 'DC-012', 
      activityName: 'CCTV Surveillance', 
      uom: 'No',
      step1: { main: 'Equipment Procurement', weightage: 15, subSteps: [] },
      step2: { main: 'Infrastructure Setup', weightage: 20, subSteps: [] },
      step3: { main: 'Camera Installation', weightage: 45, subSteps: [] },
      step4: { main: 'Configuration & Testing', weightage: 20, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 13, 
      rocId: 'DC-013', 
      activityName: 'Electrical Panels', 
      uom: 'No',
      step1: { main: 'Panel Fabrication', weightage: 20, subSteps: [] },
      step2: { main: 'Delivery & Inspection', weightage: 10, subSteps: [] },
      step3: { main: 'Installation & Wiring', weightage: 55, subSteps: [] },
      step4: { main: 'Testing & Energization', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 14, 
      rocId: 'DC-014', 
      activityName: 'Grounding System', 
      uom: 'System',
      step1: { main: 'Material Procurement', weightage: 10, subSteps: [] },
      step2: { main: 'Excavation & Preparation', weightage: 20, subSteps: [] },
      step3: { main: 'Installation', weightage: 50, subSteps: [] },
      step4: { main: 'Testing & Certification', weightage: 20, subSteps: [] },
      total: 100,
      hasSubSteps: false
    }
  ];

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExport = () => {
    toast.success('ROC configuration exported successfully');
  };

  const handleImport = () => {
    toast.success('ROC configuration imported successfully');
  };

  // Filter data based on search
  const filteredData = rocData.filter(row => {
    return (
      row.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()) &&
      row.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()) &&
      row.uom.toLowerCase().includes(uomSearch.toLowerCase()) &&
      row.step1.main.toLowerCase().includes(step1Search.toLowerCase()) &&
      row.step2.main.toLowerCase().includes(step2Search.toLowerCase()) &&
      row.step3.main.toLowerCase().includes(step3Search.toLowerCase()) &&
      row.step4.main.toLowerCase().includes(step4Search.toLowerCase())
    );
  });

  // Render all rows including sub-steps
  const renderRows = () => {
    const allRows: JSX.Element[] = [];
    
    filteredData.forEach((row, index) => {
      // Main Row
      allRows.push(
        <tr
          key={`main-${row.id}`}
          style={{
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
            height: '52px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFF4EF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
          }}
        >
          <td style={{
            padding: '0 12px',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.hasSubSteps && (
              <button
                onClick={() => toggleRow(row.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6B7280'
                }}
              >
                {expandedRows.has(row.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.rocId}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.activityName}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.uom}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step1.main}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step1.weightage}%
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step2.main}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step2.weightage}%
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step3.main}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step3.weightage}%
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            color: '#272721',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step4.main}
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.step4.weightage}%
          </td>
          <td style={{
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#272721',
            textAlign: 'center',
            borderBottom: '1px solid #E2E6ED'
          }}>
            {row.total}%
          </td>
        </tr>
      );

      // Sub-step Rows
      if (expandedRows.has(row.id) && row.hasSubSteps) {
        // Step 1 sub-steps
        row.step1.subSteps.forEach((subStep: any, subIndex: number) => {
          allRows.push(
            <tr key={`${row.id}-step1-${subIndex}`} style={{
              backgroundColor: 'rgba(253, 67, 20, 0.08)',
              height: '44px'
            }}>
              <td colSpan={4} style={{ padding: '0 12px 0 48px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED' }}>
                {subStep.name}
              </td>
              <td style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED' }}>
                Sub-step
              </td>
              <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
                {subStep.weightage}%
              </td>
              <td colSpan={7} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
            </tr>
          );
        });

        // Step 2 sub-steps
        row.step2.subSteps.forEach((subStep: any, subIndex: number) => {
          allRows.push(
            <tr key={`${row.id}-step2-${subIndex}`} style={{
              backgroundColor: 'rgba(253, 67, 20, 0.08)',
              height: '44px'
            }}>
              <td colSpan={6} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              <td style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED' }}>
                Sub-step: {subStep.name}
              </td>
              <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
                {subStep.weightage}%
              </td>
              <td colSpan={5} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
            </tr>
          );
        });

        // Step 3 sub-steps
        row.step3.subSteps.forEach((subStep: any, subIndex: number) => {
          allRows.push(
            <tr key={`${row.id}-step3-${subIndex}`} style={{
              backgroundColor: 'rgba(253, 67, 20, 0.08)',
              height: '44px'
            }}>
              <td colSpan={8} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              <td style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED' }}>
                Sub-step: {subStep.name}
              </td>
              <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
                {subStep.weightage}%
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
            </tr>
          );
        });

        // Step 4 sub-steps
        row.step4.subSteps.forEach((subStep: any, subIndex: number) => {
          allRows.push(
            <tr key={`${row.id}-step4-${subIndex}`} style={{
              backgroundColor: 'rgba(253, 67, 20, 0.08)',
              height: '44px'
            }}>
              <td colSpan={10} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              <td style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED' }}>
                Sub-step: {subStep.name}
              </td>
              <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
                {subStep.weightage}%
              </td>
              <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
            </tr>
          );
        });
      }
    });

    return allRows;
  };

  return (
    <div style={{
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Table Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #D8DEE8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              Activities Configuration
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: 0
            }}>
              {filteredData.length} activities configured
            </p>
          </div>

          <button
            onClick={() => setShowAddRocModal(true)}
            style={{
              height: '40px',
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
            <Plus size={16} />
            Add ROC
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              {/* Header Row */}
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '40px'
                }}></th>
                <th style={{
                  padding: '12px',
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
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '250px'
                }}>
                  Activity Name
                </th>
                <th style={{
                  padding: '12px',
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
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  Step 1
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '60px'
                }}>
                  %
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  Step 2
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '60px'
                }}>
                  %
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  Step 3
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '60px'
                }}>
                  %
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  Step 4
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #C8D9EE',
                  width: '60px'
                }}>
                  %
                </th>
                <th style={{
                  padding: '12px',
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
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
                        border: '1px solid #D8DEE8',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
                  </div>
                </td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
              </tr>
            </thead>

            <tbody>
              {renderRows()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add ROC Modal */}
      {showAddRocModal && (
        <AddRocModal 
          onClose={() => setShowAddRocModal(false)}
          onAdd={(selectedRocs) => {
            toast.success(`${selectedRocs.length} ROC(s) added to project`);
            setShowAddRocModal(false);
          }}
        />
      )}
    </div>
  );
}

// ADD ROC MODAL COMPONENT  
function AddRocModal({ onClose, onAdd }: { onClose: () => void; onAdd: (selectedRocs: number[]) => void }) {
  const [selectedRocs, setSelectedRocs] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showWorkflowBanner, setShowWorkflowBanner] = useState(true);
  
  // Search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');

  // ROC Library Master Data (6 items from library)
  const rocMasterData = [
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
      hasSubSteps: false
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
      hasSubSteps: true
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
      hasSubSteps: false
    },
    { 
      id: 104, 
      rocId: 'FO-12', 
      activityName: 'Ceilings', 
      uom: 'SQM',
      step1: { main: 'Prepare / Set Out', weightage: 10, subSteps: [] },
      step2: { main: 'Install Sub-Grid', weightage: 55, subSteps: [] },
      step3: { main: 'Install tiles', weightage: 30, subSteps: [] },
      step4: { main: 'QA & Sign Off', weightage: 5, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 105, 
      rocId: 'FO-22', 
      activityName: 'Wall Plastering', 
      uom: 'SQM',
      step1: { main: 'Surface Preparation', weightage: 15, subSteps: [] },
      step2: { main: 'First Coat Application', weightage: 35, subSteps: [] },
      step3: { main: 'Second Coat Application', weightage: 35, subSteps: [] },
      step4: { main: 'Finishing & QA', weightage: 15, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 106, 
      rocId: 'FO-33', 
      activityName: 'Windows', 
      uom: 'No',
      step1: { main: 'Procurement', weightage: 15, subSteps: [] },
      step2: { main: 'Frame Installation', weightage: 35, subSteps: [] },
      step3: { main: 'Glass Fitting', weightage: 40, subSteps: [] },
      step4: { main: 'Sealing & QA', weightage: 10, subSteps: [] },
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
    if (selectedRocs.size === filteredData.length && filteredData.length > 0) {
      setSelectedRocs(new Set());
    } else {
      setSelectedRocs(new Set(filteredData.map(roc => roc.id)));
    }
  };

  const handleExport = () => {
    toast.success(`${selectedRocs.size} ROC(s) exported successfully. You can now modify and import.`);
  };

  const handleImport = () => {
    toast.success('Import completed. Project-specific values have been saved.');
  };

  const handleAddSelected = () => {
    onAdd(Array.from(selectedRocs));
  };

  // Apply filters
  const filteredData = rocMasterData.filter(row => {
    return (
      row.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()) &&
      row.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()) &&
      row.uom.toLowerCase().includes(uomSearch.toLowerCase())
    );
  });

  // Render rows
  const renderRows = () => {
    const allRows: JSX.Element[] = [];
    
    filteredData.forEach((row, index) => {
      const isSelected = selectedRocs.has(row.id);
      
      allRows.push(
        <tr
          key={`main-${row.id}`}
          onClick={(e) => toggleSelectRow(row.id, e)}
          style={{
            backgroundColor: isSelected ? '#FFF4EF' : (index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)'),
            height: '52px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(228, 238, 254, 0.5)';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
            }
          }}
        >
          <td style={{ padding: '0 12px', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => toggleSelectRow(row.id, e as any)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#FD4314' }}
            />
          </td>
          <td style={{ padding: '0 12px', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>
            {row.hasSubSteps && (
              <button onClick={(e) => toggleExpandRow(row.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#6B7280' }}>
                {expandedRows.has(row.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.rocId}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.activityName}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.uom}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.step1.main}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '600', color: '#272721', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{row.step1.weightage}%</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.step2.main}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '600', color: '#272721', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{row.step2.weightage}%</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.step3.main}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '600', color: '#272721', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{row.step3.weightage}%</td>
          <td style={{ padding: '0 12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E2E6ED' }}>{row.step4.main}</td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '600', color: '#272721', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{row.step4.weightage}%</td>
          <td style={{ padding: '0 12px', fontSize: '13px', fontWeight: '700', color: '#272721', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{row.total}%</td>
        </tr>
      );

      // Render sub-steps if expanded
      if (expandedRows.has(row.id) && row.hasSubSteps) {
        if (row.step1.subSteps.length > 0) {
          row.step1.subSteps.forEach((subStep, subIndex) => {
            allRows.push(
              <tr key={`${row.id}-step1-sub-${subIndex}`} style={{ backgroundColor: '#F9FAFB', height: '44px' }}>
                <td colSpan={5} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                <td style={{ padding: '0 12px 0 32px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED', fontStyle: 'italic' }}>└ {subStep.name}</td>
                <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{subStep.weightage}%</td>
                <td colSpan={7} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              </tr>
            );
          });
        }
        if (row.step2.subSteps.length > 0) {
          row.step2.subSteps.forEach((subStep, subIndex) => {
            allRows.push(
              <tr key={`${row.id}-step2-sub-${subIndex}`} style={{ backgroundColor: '#F9FAFB', height: '44px' }}>
                <td colSpan={7} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                <td style={{ padding: '0 12px 0 32px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED', fontStyle: 'italic' }}>└ {subStep.name}</td>
                <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{subStep.weightage}%</td>
                <td colSpan={5} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              </tr>
            );
          });
        }
        if (row.step3.subSteps.length > 0) {
          row.step3.subSteps.forEach((subStep, subIndex) => {
            allRows.push(
              <tr key={`${row.id}-step3-sub-${subIndex}`} style={{ backgroundColor: '#F9FAFB', height: '44px' }}>
                <td colSpan={9} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                <td style={{ padding: '0 12px 0 32px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED', fontStyle: 'italic' }}>└ {subStep.name}</td>
                <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{subStep.weightage}%</td>
                <td colSpan={3} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              </tr>
            );
          });
        }
        if (row.step4.subSteps.length > 0) {
          row.step4.subSteps.forEach((subStep, subIndex) => {
            allRows.push(
              <tr key={`${row.id}-step4-sub-${subIndex}`} style={{ backgroundColor: '#F9FAFB', height: '44px' }}>
                <td colSpan={11} style={{ borderBottom: '1px solid #E2E6ED' }}></td>
                <td style={{ padding: '0 12px 0 32px', fontSize: '12px', color: '#6B7280', borderBottom: '1px solid #E2E6ED', fontStyle: 'italic' }}>└ {subStep.name}</td>
                <td style={{ padding: '0 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E2E6ED' }}>{subStep.weightage}%</td>
                <td style={{ borderBottom: '1px solid #E2E6ED' }}></td>
              </tr>
            );
          });
        }
      }
    });

    return allRows;
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', width: '90%', maxWidth: '1400px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #D8DEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#272721', margin: '0 0 4px 0' }}>Add ROC from Library</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Select activities from ROC Library Master to add to your project</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#6B7280' }}><X size={24} /></button>
        </div>

        {/* Workflow Banner */}
        {showWorkflowBanner && (
          <div style={{ backgroundColor: 'rgba(228, 238, 254, 0.5)', border: '1px solid #E4EEFE', borderTop: 'none', padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#272721', display: 'block', marginBottom: '8px' }}>Export-Modify-Import Workflow</span>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px 0', lineHeight: '1.5' }}>Select ROCs, export to Excel to customize weightages and sub-steps, then import back.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleExport} disabled={selectedRocs.size === 0} style={{ height: '36px', padding: '0 16px', border: '1px solid #D8DEE8', backgroundColor: selectedRocs.size === 0 ? '#F9FAFB' : '#FFFFFF', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: selectedRocs.size === 0 ? '#9CA3AF' : '#374151', cursor: selectedRocs.size === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: selectedRocs.size === 0 ? 0.5 : 1 }}>
                  <Download size={14} />Export {selectedRocs.size > 0 ? `(${selectedRocs.size})` : ''}
                </button>
                <button onClick={handleImport} style={{ height: '36px', padding: '0 16px', border: '1px solid #D8DEE8', backgroundColor: '#FFFFFF', borderRadius: '4px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={14} />Import from Excel
                </button>
              </div>
            </div>
            <button onClick={() => setShowWorkflowBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#6B7280' }}><X size={18} /></button>
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F9FAFB', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '40px' }}>
                  <input type="checkbox" checked={selectedRocs.size === filteredData.length && filteredData.length > 0} onChange={toggleSelectAll} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#FD4314' }} />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '40px' }}></th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '100px' }}>ROC ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '250px' }}>Activity Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '80px' }}>UOM</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE' }}>Step 1</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '60px' }}>%</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE' }}>Step 2</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '60px' }}>%</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE' }}>Step 3</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '60px' }}>%</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE' }}>Step 4</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '60px' }}>%</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderBottom: '1px solid #C8D9EE', width: '80px' }}>Total</th>
              </tr>
              <tr style={{ height: '44px' }}>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="text" placeholder="Search..." value={rocIdSearch} onChange={(e) => setRocIdSearch(e.target.value)} style={{ width: '100%', height: '28px', padding: '0 8px', border: '1px solid #D8DEE8', borderRadius: '3px', fontSize: '12px' }} />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
                  </div>
                </td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="text" placeholder="Search..." value={activityNameSearch} onChange={(e) => setActivityNameSearch(e.target.value)} style={{ width: '100%', height: '28px', padding: '0 8px', border: '1px solid #D8DEE8', borderRadius: '3px', fontSize: '12px' }} />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
                  </div>
                </td>
                <td style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="text" placeholder="Search..." value={uomSearch} onChange={(e) => setUomSearch(e.target.value)} style={{ width: '100%', height: '28px', padding: '0 8px', border: '1px solid #D8DEE8', borderRadius: '3px', fontSize: '12px' }} />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
                  </div>
                </td>
                <td colSpan={9} style={{ padding: '0 8px', borderBottom: '1px solid #C8D9EE' }}></td>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #D8DEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>{selectedRocs.size} item{selectedRocs.size !== 1 ? 's' : ''} selected</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{ height: '40px', padding: '0 20px', border: '1px solid #D8DEE8', backgroundColor: '#FFFFFF', borderRadius: '4px', fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleAddSelected} disabled={selectedRocs.size === 0} style={{ height: '40px', padding: '0 20px', border: 'none', backgroundColor: selectedRocs.size === 0 ? '#E5E7EB' : '#FD4314', borderRadius: '4px', fontSize: '14px', fontWeight: '500', color: '#FFFFFF', cursor: selectedRocs.size === 0 ? 'not-allowed' : 'pointer', opacity: selectedRocs.size === 0 ? 0.5 : 1 }}>
              Add Selected ({selectedRocs.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
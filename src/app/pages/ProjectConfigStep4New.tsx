import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Download, Upload, ChevronRight, ChevronDown, Info, Plus, Trash2, FileSpreadsheet, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ProjectConfigROCPreview from './ProjectConfigROCPreview';

export interface ActivitiesStepRef {
  getSelectedRocs: () => any[];
}

// STEP 4: ACTIVITIES (ROC)
export const ActivitiesStep = React.forwardRef<ActivitiesStepRef, {}>((props, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRocs, setSelectedRocs] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [expandedConfiguredRows, setExpandedConfiguredRows] = useState<Set<number>>(new Set());
  const [configuredRocs, setConfiguredRocs] = useState<any[]>([]);
  const [showExportFlow, setShowExportFlow] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [pendingExport, setPendingExport] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewRocs, setPreviewRocs] = useState<any[]>([]);

  // Expose method to parent via ref
  React.useImperativeHandle(ref, () => ({
    getSelectedRocs: () => {
      const selected = rocData.filter(roc => selectedRocs.has(roc.id));
      const configured = selected.map((roc, idx) => ({
        ...roc,
        configuredId: Date.now() + idx,
        source: 'library',
        // Map weightage to weight for Step 5 compatibility
        step1: { ...roc.step1, weight: roc.step1.weightage },
        step2: { ...roc.step2, weight: roc.step2.weightage },
        step3: { ...roc.step3, weight: roc.step3.weightage },
        step4: { ...roc.step4, weight: roc.step4.weightage }
      }));
      // Also map weightage to weight for configuredRocs
      const mappedConfiguredRocs = configuredRocs.map(roc => ({
        ...roc,
        step1: { ...roc.step1, weight: roc.step1.weightage },
        step2: { ...roc.step2, weight: roc.step2.weightage },
        step3: { ...roc.step3, weight: roc.step3.weightage },
        step4: { ...roc.step4, weight: roc.step4.weightage }
      }));
      return [...mappedConfiguredRocs, ...configured];
    }
  }));

  // Handle return from Edit ROC screen
  React.useEffect(() => {
    if (location.state?.updatedRoc) {
      const updatedRoc = location.state.updatedRoc;
      setPreviewRocs(prev => prev.map(roc => 
        roc.id === updatedRoc.id ? updatedRoc : roc
      ));
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [configuredCurrentPage, setConfiguredCurrentPage] = useState(1);
  const rowsPerPage = 25;
  
  // Search filters
  const [rocIdSearch, setRocIdSearch] = useState('');
  const [activityNameSearch, setActivityNameSearch] = useState('');
  const [uomSearch, setUomSearch] = useState('');
  const [step1Search, setStep1Search] = useState('');
  const [step2Search, setStep2Search] = useState('');
  const [step3Search, setStep3Search] = useState('');
  const [step4Search, setStep4Search] = useState('');

  // Mock ROC data from library master
  const rocData = [
    { 
      id: 1, 
      rocId: 'FO-01', 
      activityName: 'Whitewash', 
      uom: 'SQM',
      step1: { main: 'Prepare / Set Out', weightage: 10, subSteps: [] },
      step2: { 
        main: 'Installation', 
        weightage: 80, 
        subSteps: [
          { name: 'Part 2A', weightage: 20 },
          { name: 'Part 2B', weightage: 40 },
          { name: 'Part 2C', weightage: 20 }
        ]
      },
      step3: { main: 'QA & Sign Off', weightage: 10, subSteps: [] },
      step4: { main: '', weightage: 0, subSteps: [] },
      total: 100,
      hasSubSteps: true
    },
    { 
      id: 2, 
      rocId: 'FO-04', 
      activityName: 'Door sets', 
      uom: 'No',
      step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
      step2: { main: 'Delivery', weightage: 20, subSteps: [] },
      step3: { main: 'Installation', weightage: 60, subSteps: [] },
      step4: { main: 'QA & Sign Off', weightage: 10, subSteps: [] },
      total: 100,
      hasSubSteps: false
    },
    { 
      id: 3, 
      rocId: 'FO-10', 
      activityName: 'Stairs', 
      uom: 'No',
      step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
      step2: { main: 'Machining/Fabrication complete', weightage: 90, subSteps: [] },
      step3: { main: 'Delivery', weightage: 10, subSteps: [] },
      step4: { main: 'Installation', weightage: 70, subSteps: [] },
      total: 100,
      hasSubSteps: false
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
      hasSubSteps: true
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

  const toggleExpandConfiguredRow = (configuredId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedConfiguredRows);
    if (newExpanded.has(configuredId)) {
      newExpanded.delete(configuredId);
    } else {
      newExpanded.add(configuredId);
    }
    setExpandedConfiguredRows(newExpanded);
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

  // Direct add to project without editing
  const handleDirectAdd = () => {
    const selected = rocData.filter(roc => selectedRocs.has(roc.id));
    const newConfigured = [...configuredRocs, ...selected.map(roc => ({
      ...roc,
      configuredId: Date.now() + roc.id,
      source: 'direct'
    }))];
    setConfiguredRocs(newConfigured);
    setSelectedRocs(new Set());
    toast.success(`${selected.length} ROC(s) added to project configuration`);
  };

  const handlePreviewBack = () => {
    setShowPreview(false);
  };

  const handlePreviewComplete = () => {
    const newConfigured = [...configuredRocs, ...previewRocs.map(roc => ({
      ...roc,
      configuredId: Date.now() + roc.id,
      source: 'preview'
    }))];
    setConfiguredRocs(newConfigured);
    setSelectedRocs(new Set());
    setShowPreview(false);
    setPreviewRocs([]);
    toast.success(`${previewRocs.length} ROC(s) added to project configuration`);
  };

  const handleEditROC = (roc: any) => {
    navigate('/app/project-config-roc-edit', { state: { roc, returnPath: window.location.pathname } });
  };

  const handleAddMoreFromPreview = () => {
    setShowPreview(false);
  };

  const handleRemoveConfigured = (configuredId: number) => {
    setConfiguredRocs(configuredRocs.filter(roc => roc.configuredId !== configuredId));
    toast.success('ROC removed from configuration');
  };

  // Apply filters
  const filteredData = rocData
    .filter(roc => !configuredRocs.some(c => c.id === roc.id)) // Hide already configured
    .filter(roc => roc.rocId.toLowerCase().includes(rocIdSearch.toLowerCase()))
    .filter(roc => roc.activityName.toLowerCase().includes(activityNameSearch.toLowerCase()))
    .filter(roc => roc.uom.toLowerCase().includes(uomSearch.toLowerCase()))
    .filter(roc => roc.step1.main.toLowerCase().includes(step1Search.toLowerCase()))
    .filter(roc => roc.step2.main.toLowerCase().includes(step2Search.toLowerCase()))
    .filter(roc => roc.step3.main.toLowerCase().includes(step3Search.toLowerCase()))
    .filter(roc => roc.step4.main.toLowerCase().includes(step4Search.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const configuredTotalPages = Math.ceil(configuredRocs.length / rowsPerPage);
  const paginatedConfigured = configuredRocs.slice(
    (configuredCurrentPage - 1) * rowsPerPage,
    configuredCurrentPage * rowsPerPage
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {showPreview ? (
        <ProjectConfigROCPreview
          selectedRocs={previewRocs}
          onBack={handlePreviewBack}
          onComplete={handlePreviewComplete}
          onEdit={handleEditROC}
          onAddMore={handleAddMoreFromPreview}
        />
      ) : (
        <>
      {/* Page Title */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 8px 0'
        }}>
          Project Activities (ROC Configuration)
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0
        }}>
          Add ROCs from the master library - use default values or customize through export/import
        </p>
      </div>

      {/* Export Button and Selected Count - Above table */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        {selectedRocs.size > 0 && (
          <span style={{
            fontSize: '13px',
            color: '#6B7280'
          }}>
            {selectedRocs.size} record(s) selected
          </span>
        )}
        <button
          onClick={() => {
            const selected = rocData.filter(roc => selectedRocs.has(roc.id));
            toast.success(`Exporting ${selected.length} selected ROC(s) to Excel`);
          }}
          title="Export Selected"
          disabled={selectedRocs.size === 0}
          style={{
            height: '32px',
            width: '32px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            cursor: selectedRocs.size === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: selectedRocs.size === 0 ? '#D1D5DB' : '#374151',
            opacity: selectedRocs.size === 0 ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (selectedRocs.size > 0) {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.color = '#FD4314';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedRocs.size > 0) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#374151';
            }
          }}
        >
          <FileSpreadsheet size={16} />
        </button>
      </div>

      {/* ROC Master Library Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        {/* ROC Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1800px'
          }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              {/* Column Headers */}
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
                    checked={selectedRocs.size === filteredData.length && filteredData.length > 0}
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
                  width: '120px'
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
                  width: '120px'
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
                  width: '120px'
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
                  width: '120px'
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
                      onChange={(e) => {
                        setRocIdSearch(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setActivityNameSearch(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setUomSearch(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setStep1Search(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setStep2Search(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setStep3Search(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(e) => {
                        setStep4Search(e.target.value);
                        setCurrentPage(1);
                      }}
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
              {paginatedData.length === 0 ? (
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
                paginatedData.flatMap((roc, rocIndex) => {
                  const isExpanded = expandedRows.has(roc.id);
                  const rows = [
                    // Parent Row
                    <tr
                      key={roc.id}
                      style={{
                        backgroundColor: rocIndex % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                        borderBottom: '1px solid #E2E6ED',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => toggleSelectRow(roc.id, e)}
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
                          checked={selectedRocs.has(roc.id)}
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
                          <td style={{ padding: '12px' }}></td>
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
        </div>

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
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage >= totalPages ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                color: currentPage >= totalPages ? '#9CA3AF' : '#374151'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
});
import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface ImportFilesModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: FileList) => void;
  projectId?: string;
}

interface ImportRow {
  row: number;
  taskName: string;
  activityName: string;
  status: string;
  projectScope: string;
  discipline: string;
  tradePackage: string;
  subContractor: string;
  area: string;
  workPackage: string;
  spa: string;
  costType: string;
  building: string;
  tranche: string;
  floor: string;
  zone: string;
  budgetCost: string;
  budgetQty: string;
  budgetManHours: string;
  baselineStart: string;
  baselineEnd: string;
  isValid: boolean;
  error?: string;
}

// Mock data for preview
const MOCK_IMPORT_DATA: ImportRow[] = [
  {
    row: 1,
    taskName: 'PCW Distribution – B1 – T1 – R1.1',
    activityName: 'FO21 – Process/Chilled Water Distribution',
    status: 'On Hold',
    projectScope: 'Phase 1',
    discipline: 'ARCH – Architectural',
    tradePackage: 'TP-MEP-001',
    subContractor: 'ABC Contractors',
    area: 'ZA01 – Zone A Basement',
    workPackage: 'WP001 – MEP Installation',
    spa: 'SPA001 – Structural Works',
    costType: 'CAPEX – Capital Expenditure',
    building: 'BLD-A – Building A',
    tranche: 'T1 – Tranche 1',
    floor: 'B1 – Basement Level 1',
    zone: 'ZA – Zone A',
    budgetCost: '125000',
    budgetQty: '150',
    budgetManHours: '320',
    baselineStart: '01/03/2026',
    baselineEnd: '15/04/2026',
    isValid: true
  },
  {
    row: 2,
    taskName: 'HVAC Installation',
    activityName: '',
    status: 'Not Started',
    projectScope: 'Phase 2',
    discipline: '',
    tradePackage: 'TP-MEP-002',
    subContractor: 'BuildTech Solutions',
    area: 'ZB02 – Zone B Level 2',
    workPackage: 'WP002 – HVAC Systems',
    spa: '',
    costType: 'OPEX – Operational Expenditure',
    building: 'BLD-B – Building B',
    tranche: 'T2 – Tranche 2',
    floor: 'L2 – Level 2',
    zone: 'ZB – Zone B',
    budgetCost: '85000',
    budgetQty: '100',
    budgetManHours: '250',
    baselineStart: '10/03/2026',
    baselineEnd: '25/04/2026',
    isValid: false,
    error: 'Activity Name, Discipline, and SPA are required'
  },
  {
    row: 3,
    taskName: 'Electrical Wiring – Floor 3',
    activityName: 'EL08 – Power Distribution',
    status: 'Void',
    projectScope: 'Phase 1',
    discipline: 'ELEC – Electrical',
    tradePackage: 'TP-ELE-001',
    subContractor: 'ElectroPro Ltd',
    area: '',
    workPackage: 'WP003 – Electrical Works',
    spa: 'SPA003 – MEP Infrastructure',
    costType: 'CAPEX – Capital Expenditure',
    building: 'BLD-A – Building A',
    tranche: 'T1 – Tranche 1',
    floor: 'L3 – Level 3',
    zone: 'ZC – Zone C',
    budgetCost: '',
    budgetQty: '200',
    budgetManHours: '400',
    baselineStart: '05/03/2026',
    baselineEnd: '20/04/2026',
    isValid: false,
    error: 'Area and Budget Cost are required'
  },
  {
    row: 4,
    taskName: 'Ceiling Installation – Lobby',
    activityName: 'FO12 – Ceilings',
    status: 'On Hold',
    projectScope: 'Phase 1',
    discipline: 'ARCH – Architectural',
    tradePackage: 'TP-FIN-001',
    subContractor: 'FinishWorks Inc',
    area: 'ZL00 – Lobby Ground Floor',
    workPackage: '',
    spa: 'SPA001 – Structural Works',
    costType: 'CAPEX – Capital Expenditure',
    building: 'BLD-A – Building A',
    tranche: 'T1 – Tranche 1',
    floor: 'GF – Ground Floor',
    zone: 'LB – Lobby',
    budgetCost: '45000',
    budgetQty: '80',
    budgetManHours: '180',
    baselineStart: '01/02/2026',
    baselineEnd: '28/02/2026',
    isValid: false,
    error: 'Work Package is required'
  },
  {
    row: 5,
    taskName: '',
    activityName: 'ME15 – HVAC Systems',
    status: 'Not Started',
    projectScope: 'Phase 2',
    discipline: 'MECH – Mechanical',
    tradePackage: 'TP-MEP-002',
    subContractor: 'MechTech Solutions',
    area: 'ZD04 – Zone D Level 4',
    workPackage: 'WP004 – Mechanical Systems',
    spa: 'SPA004 – HVAC Infrastructure',
    costType: 'OPEX – Operational Expenditure',
    building: 'BLD-B – Building B',
    tranche: 'T2 – Tranche 2',
    floor: 'L4 – Level 4',
    zone: 'ZD – Zone D',
    budgetCost: '95000',
    budgetQty: '120',
    budgetManHours: '280',
    baselineStart: '15/03/2026',
    baselineEnd: '30/04/2026',
    isValid: false,
    error: 'Task Name is required'
  }
];

const CODING_DIMENSION_HEADERS = ['Area', 'Work Package', 'SPA', 'Cost Type', 'Building', 'Tranche', 'Floor', 'Zone'];

export default function ImportFilesModal({ title = 'Import Tasks', isOpen, onClose, projectId }: ImportFilesModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'upload' | 'validating' | 'preview'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    // Start validation
    setCurrentStep('validating');

    // Simulate validation delay
    setTimeout(() => {
      setImportData(MOCK_IMPORT_DATA);
      setCurrentStep('preview');
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // In real implementation, this would download an Excel template
    console.log('Downloading template...');
  };

  const handleCancel = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setImportData([]);
    onClose();
  };

  const handleConfirmImport = () => {
    // Filter valid records
    const validRecords = importData.filter(row => row.isValid);
    console.log('Importing valid records:', validRecords);
    
    // Show success toast
    toast.success(`Successfully imported ${validRecords.length} task${validRecords.length === 1 ? '' : 's'}`, {
      duration: 4000,
      position: 'top-right'
    });
    
    // Close modal and reset state
    handleCancel();
    
    // Navigate to task listing if projectId is provided
    if (projectId) {
      navigate(`/app/projects/${projectId}/tasks`);
    }
  };

  if (!isOpen) return null;

  const validCount = importData.filter(row => row.isValid).length;
  const invalidCount = importData.length - validCount;

  return (
    <div 
      style={{
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
      }}
      onClick={handleCancel}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: currentStep === 'preview' ? '95%' : '560px',
          maxWidth: currentStep === 'preview' ? '1400px' : '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #E2E6ED'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            {currentStep === 'preview' ? 'Import Preview' : title}
          </h2>
          <button 
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: currentStep === 'preview' ? '0' : '24px'
        }}>
          {currentStep === 'upload' && (
            <>
              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                Upload your task data from .xlsx or .csv files.
              </p>

              {/* File input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #D1D5DB',
                  borderRadius: '8px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: '#F9FAFB',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FD4314';
                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
              >
                {/* Upload Icon */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={28} style={{ color: '#6B7280' }} />
                  </div>
                </div>

                {/* Upload Text */}
                {selectedFile ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <FileSpreadsheet size={20} style={{ color: '#FD4314' }} />
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      margin: 0
                    }}>
                      {selectedFile.name}
                    </p>
                  </div>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    Drag and drop files here or <span style={{ color: '#FD4314' }}>click to browse</span>
                  </p>
                )}

                {/* File Types */}
                <p style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: 0
                }}>
                  <FileSpreadsheet size={16} />
                  Supported file types: .xlsx, .csv
                </p>
              </div>
            </>
          )}

          {currentStep === 'validating' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px'
            }}>
              <Loader2 
                size={48} 
                style={{ 
                  color: '#FD4314',
                  animation: 'spin 1s linear infinite'
                }} 
              />
              <p style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                marginTop: '24px',
                margin: '24px 0 8px 0'
              }}>
                Validating file...
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Please wait while we process your data
              </p>
            </div>
          )}

          {currentStep === 'preview' && (
            <div style={{
              padding: '24px',
              overflow: 'auto'
            }}>
              {/* KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {/* Total Records */}
                <div style={{
                  padding: '24px',
                  backgroundColor: '#E4EEFE',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1E40AF',
                    marginBottom: '8px'
                  }}>
                    {importData.length}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#5F6B7A',
                    fontWeight: '500'
                  }}>
                    Total Records
                  </div>
                </div>

                {/* Valid Records */}
                <div style={{
                  padding: '24px',
                  backgroundColor: '#D1FAE5',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#065F46',
                    marginBottom: '8px'
                  }}>
                    {validCount}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#5F6B7A',
                    fontWeight: '500'
                  }}>
                    Valid Records
                  </div>
                </div>

                {/* Error Records */}
                <div style={{
                  padding: '24px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#991B1B',
                    marginBottom: '8px'
                  }}>
                    {invalidCount}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#5F6B7A',
                    fontWeight: '500'
                  }}>
                    Error Records
                  </div>
                </div>
              </div>

              {/* Import Preview Table */}
              <div style={{ 
                overflow: 'auto',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px'
                }}>
                  <thead>
                    {/* First header row - Group headers */}
                    <tr>
                      <th 
                        rowSpan={2}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: '#E4EEFE',
                          zIndex: 2,
                          minWidth: '60px'
                        }}
                      >
                        Row
                      </th>
                      <th 
                        colSpan={3}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE'
                        }}
                      >
                        Task Overview
                      </th>
                      <th 
                        colSpan={4}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE'
                        }}
                      >
                        Scope
                      </th>
                      <th 
                        colSpan={8}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE'
                        }}
                      >
                        Coding Dimensions
                      </th>
                      <th 
                        colSpan={3}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE'
                        }}
                      >
                        Budget
                      </th>
                      <th 
                        colSpan={2}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE'
                        }}
                      >
                        Planning
                      </th>
                      <th 
                        rowSpan={2}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          backgroundColor: '#E4EEFE',
                          minWidth: '200px'
                        }}
                      >
                        Result
                      </th>
                    </tr>
                    
                    {/* Second header row - Column headers */}
                    <tr>
                      {/* Task Overview */}
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '180px'
                      }}>
                        Task Name<span style={{ color: '#EF4444' }}>*</span>
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '180px'
                      }}>
                        Activity Name<span style={{ color: '#EF4444' }}>*</span>
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Status<span style={{ color: '#EF4444' }}>*</span>
                      </th>

                      {/* Scope */}
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Project Scope
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Discipline<span style={{ color: '#EF4444' }}>*</span>
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Trade Package
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '140px'
                      }}>
                        Sub-Contractor
                      </th>

                      {/* Coding Dimensions */}
                      {CODING_DIMENSION_HEADERS.map((header, i) => (
                        <th key={i} style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontWeight: '500',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          backgroundColor: 'rgba(228, 238, 254, 0.4)',
                          minWidth: '140px'
                        }}>
                          {header}{(header === 'Area' || header === 'Work Package' || header === 'SPA') ? <span style={{ color: '#EF4444' }}>*</span> : ''}
                        </th>
                      ))}

                      {/* Budget */}
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Budget Cost<span style={{ color: '#EF4444' }}>*</span>
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Budget Qty.<span style={{ color: '#EF4444' }}>*</span>
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '140px'
                      }}>
                        Budget Man-hours<span style={{ color: '#EF4444' }}>*</span>
                      </th>

                      {/* Planning */}
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Baseline Start
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: '500',
                        color: '#272721',
                        borderBottom: '1px solid #E5E7EB',
                        borderRight: '1px solid #E5E7EB',
                        backgroundColor: 'rgba(228, 238, 254, 0.4)',
                        minWidth: '120px'
                      }}>
                        Baseline End
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((row, index) => (
                      <tr 
                        key={index}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#E4EEFE'
                        }}
                      >
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#E4EEFE',
                          zIndex: 1
                        }}>
                          {row.row}
                        </td>
                        
                        {/* Task Overview */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.taskName ? '#272721' : '#EF4444'
                        }}>
                          {row.taskName || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.activityName ? '#272721' : '#EF4444'
                        }}>
                          {row.activityName || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.status}
                        </td>

                        {/* Scope */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.projectScope}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.discipline ? '#272721' : '#EF4444'
                        }}>
                          {row.discipline || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.tradePackage}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.subContractor}
                        </td>

                        {/* Coding Dimensions */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.area ? '#272721' : '#EF4444'
                        }}>
                          {row.area || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.workPackage ? '#272721' : '#EF4444'
                        }}>
                          {row.workPackage || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.spa ? '#272721' : '#EF4444'
                        }}>
                          {row.spa || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.costType}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.building}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.tranche}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.floor}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.zone}
                        </td>

                        {/* Budget */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: row.budgetCost ? '#272721' : '#EF4444'
                        }}>
                          {row.budgetCost || '—'}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.budgetQty}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.budgetManHours}
                        </td>

                        {/* Planning */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.baselineStart}
                        </td>
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB',
                          color: '#272721'
                        }}>
                          {row.baselineEnd}
                        </td>

                        {/* Result */}
                        <td style={{
                          padding: '12px',
                          borderBottom: '1px solid #E5E7EB'
                        }}>
                          {row.isValid ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: '#10B981'
                            }}>
                              <CheckCircle size={16} />
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>Valid</span>
                            </div>
                          ) : (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: '#EF4444'
                            }}>
                              <AlertCircle size={16} />
                              <span style={{ fontSize: '13px' }}>{row.error}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: currentStep === 'upload' ? 'space-between' : 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid #E2E6ED',
          backgroundColor: '#FAFBFC'
        }}>
          {currentStep === 'upload' && (
            <>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <Download size={16} />
                Download Template
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleCancel}
                  style={{
                    padding: '8px 20px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUploadClick}
                  disabled={!selectedFile}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: selectedFile ? 'pointer' : 'not-allowed',
                    backgroundColor: selectedFile ? '#FD4314' : '#D1D5DB',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFile) {
                      e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFile) {
                      e.currentTarget.style.backgroundColor = '#FD4314';
                    }
                  }}
                >
                  Upload
                </button>
              </div>
            </>
          )}

          {currentStep === 'preview' && (
            <>
              <button 
                onClick={handleCancel}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => console.log('Downloading error report...')}
                disabled={invalidCount === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: invalidCount > 0 ? '#FFFFFF' : '#F3F4F6',
                  color: invalidCount > 0 ? '#374151' : '#9CA3AF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: invalidCount > 0 ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (invalidCount > 0) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (invalidCount > 0) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                <Download size={16} />
                Download Error Report
              </button>
              <button 
                onClick={handleConfirmImport}
                disabled={validCount === 0}
                style={{
                  padding: '8px 20px',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: validCount > 0 ? 'pointer' : 'not-allowed',
                  backgroundColor: validCount > 0 ? '#FD4314' : '#D1D5DB',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (validCount > 0) {
                    e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (validCount > 0) {
                    e.currentTarget.style.backgroundColor = '#FD4314';
                  }
                }}
              >
                Import Valid Record(s)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spinner animation CSS */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
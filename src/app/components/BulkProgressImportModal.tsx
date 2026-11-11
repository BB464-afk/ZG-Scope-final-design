import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';

// Sub-step interface
interface SubStep {
  name: string;
  weightage: number;
  lastApproved: number;
  pending: number;
  newValue: string;
  isValid: boolean;
  errorMessage?: string;
}

// Parent step interface
interface ParentStep {
  name: string;
  weightage: number;
  subSteps?: SubStep[];
  lastApproved?: number;
  pending?: number;
  newValue?: string;
  isValid?: boolean;
  errorMessage?: string;
}

// Task import record
interface TaskImportRecord {
  taskId: string;
  taskName: string;
  totalQty: number;
  uom: string;
  steps: ParentStep[];
  hasErrors: boolean;
}

interface BulkProgressImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (records: TaskImportRecord[]) => void;
}

type ModalStep = 'upload' | 'preview' | 'success' | 'invalid-template';

export default function BulkProgressImportModal({ isOpen, onClose, onImportComplete }: BulkProgressImportModalProps) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [step, setStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importRecords, setImportRecords] = useState<TaskImportRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, error: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock validation - in real app this would call an API to parse Excel
  const validateFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      
      // Simulate validation delay
      setTimeout(() => {
        setIsUploading(false);
        
        // Mock: Check if valid template (in real app, parse Excel)
        const isValidTemplate = Math.random() > 0.1; // 90% chance of valid template
        
        if (!isValidTemplate) {
          setStep('invalid-template');
          reject(new Error('Invalid template'));
          return;
        }

        // Mock parsed data with some errors
        const mockRecords: TaskImportRecord[] = [
          {
            taskId: 'TASK-1733-1',
            taskName: 'Door Sets – Level 1 – East Wing – Units 101-115',
            totalQty: 150,
            uom: 'Units',
            hasErrors: false,
            steps: [
              {
                name: 'Procurement - place order',
                weightage: 10,
                subSteps: [
                  { name: 'Place Order', weightage: 40, lastApproved: 30, pending: 10, newValue: '45', isValid: true },
                  { name: 'Receive Order', weightage: 35, lastApproved: 20, pending: 5, newValue: '30', isValid: true },
                  { name: 'Forward to Warehouse', weightage: 25, lastApproved: 15, pending: 0, newValue: '20', isValid: true }
                ]
              },
              {
                name: 'Delivery',
                weightage: 20,
                subSteps: [
                  { name: 'Load Truck', weightage: 30, lastApproved: 10, pending: 0, newValue: '15', isValid: true },
                  { name: 'Transport', weightage: 50, lastApproved: 5, pending: 0, newValue: '10', isValid: true },
                  { name: 'Unload', weightage: 20, lastApproved: 0, pending: 0, newValue: '5', isValid: true }
                ]
              },
              {
                name: 'Installation',
                weightage: 40,
                subSteps: [
                  { name: 'Frame Installation', weightage: 40, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Door Hanging', weightage: 35, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Hardware Fitting', weightage: 25, lastApproved: 0, pending: 0, newValue: '0', isValid: true }
                ]
              },
              {
                name: 'QA & Sign Off',
                weightage: 30,
                subSteps: [
                  { name: 'Inspection', weightage: 60, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Sign-off Documentation', weightage: 40, lastApproved: 0, pending: 0, newValue: '0', isValid: true }
                ]
              }
            ]
          },
          {
            taskId: 'TASK-1733-5',
            taskName: 'Door Sets – Level 1 – West Wing – Units 116-130',
            totalQty: 120,
            uom: 'Units',
            hasErrors: true,
            steps: [
              {
                name: 'Procurement - place order',
                weightage: 10,
                subSteps: [
                  { name: 'Place Order', weightage: 40, lastApproved: 50, pending: 20, newValue: '110', isValid: false, errorMessage: 'Progress value (110) exceeds maximum allowed (100%)' },
                  { name: 'Receive Order', weightage: 35, lastApproved: 60, pending: 10, newValue: '80', isValid: true },
                  { name: 'Forward to Warehouse', weightage: 25, lastApproved: 45, pending: 0, newValue: '50', isValid: true }
                ]
              },
              {
                name: 'Delivery',
                weightage: 20,
                subSteps: [
                  { name: 'Load Truck', weightage: 30, lastApproved: 25, pending: 0, newValue: '20', isValid: false, errorMessage: 'New value (20) cannot be less than Last Approved (25)' },
                  { name: 'Transport', weightage: 50, lastApproved: 30, pending: 0, newValue: '35', isValid: true },
                  { name: 'Unload', weightage: 20, lastApproved: 10, pending: 0, newValue: '15', isValid: true }
                ]
              },
              {
                name: 'Installation',
                weightage: 40,
                subSteps: [
                  { name: 'Frame Installation', weightage: 40, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Door Hanging', weightage: 35, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Hardware Fitting', weightage: 25, lastApproved: 0, pending: 0, newValue: '0', isValid: true }
                ]
              },
              {
                name: 'QA & Sign Off',
                weightage: 30,
                subSteps: [
                  { name: 'Inspection', weightage: 60, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Sign-off Documentation', weightage: 40, lastApproved: 0, pending: 0, newValue: '0', isValid: true }
                ]
              }
            ]
          },
          {
            taskId: 'TASK-1733-12',
            taskName: 'Door Sets – Level 2 – North Wing – Units 201-220',
            totalQty: 180,
            uom: 'Units',
            hasErrors: true,
            steps: [
              {
                name: 'Procurement - place order',
                weightage: 10,
                subSteps: [
                  { name: 'Place Order', weightage: 40, lastApproved: 100, pending: 0, newValue: '100', isValid: true },
                  { name: 'Receive Order', weightage: 35, lastApproved: 85, pending: 0, newValue: '90', isValid: true },
                  { name: 'Forward to Warehouse', weightage: 25, lastApproved: 75, pending: 0, newValue: '80', isValid: true }
                ]
              },
              {
                name: 'Delivery',
                weightage: 20,
                subSteps: [
                  { name: 'Load Truck', weightage: 30, lastApproved: 65, pending: 0, newValue: '70', isValid: true },
                  { name: 'Transport', weightage: 50, lastApproved: 60, pending: 0, newValue: '65', isValid: true },
                  { name: 'Unload', weightage: 20, lastApproved: 50, pending: 0, newValue: '55', isValid: true }
                ]
              },
              {
                name: 'Installation',
                weightage: 40,
                subSteps: [
                  { name: 'Frame Installation', weightage: 40, lastApproved: 15, pending: 5, newValue: '25', isValid: true },
                  { name: 'Door Hanging', weightage: 35, lastApproved: 10, pending: 0, newValue: 'abc', isValid: false, errorMessage: 'Invalid numeric value: "abc" is not a valid number' },
                  { name: 'Hardware Fitting', weightage: 25, lastApproved: 5, pending: 0, newValue: '10', isValid: true }
                ]
              },
              {
                name: 'QA & Sign Off',
                weightage: 30,
                subSteps: [
                  { name: 'Inspection', weightage: 60, lastApproved: 0, pending: 0, newValue: '0', isValid: true },
                  { name: 'Sign-off Documentation', weightage: 40, lastApproved: 0, pending: 0, newValue: '0', isValid: true }
                ]
              }
            ]
          }
        ];

        // Calculate stats
        let validCount = 0;
        let errorCount = 0;
        mockRecords.forEach(record => {
          record.steps.forEach(step => {
            if (step.subSteps) {
              step.subSteps.forEach(subStep => {
                if (subStep.newValue) {
                  if (subStep.isValid) validCount++;
                  else errorCount++;
                }
              });
            } else {
              if (step.newValue) {
                if (step.isValid) validCount++;
                else errorCount++;
              }
            }
          });
        });

        setImportRecords(mockRecords);
        setStats({
          total: validCount + errorCount,
          valid: validCount,
          error: errorCount
        });
        setStep('preview');
        resolve();
      }, 1500);
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Invalid file format. Please upload an Excel file (.xlsx)');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadErrorReport = () => {
    toast.success('Error report downloaded successfully');
  };

  const handleDownloadTemplate = () => {
    toast.success('Template downloaded successfully');
  };

  const handleSubmitProgress = () => {
    if (onImportComplete) {
      onImportComplete(importRecords);
    }
    toast.success(`Progress data submitted successfully`, {
      duration: 3000
    });
    
    // Redirect to task listing
    setTimeout(() => {
      navigate(`/app/projects/${projectId}/tasks`);
      handleCloseModal();
    }, 1000);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setStep('upload');
    setImportRecords([]);
    setStats({ total: 0, valid: 0, error: 0 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        width: step === 'preview' ? '95%' : '560px',
        maxWidth: step === 'preview' ? '1400px' : '560px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E6ED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
            {step === 'upload' && 'Import Progress Data'}
            {step === 'preview' && 'Import Preview'}
            {step === 'success' && 'Import Successful'}
            {step === 'invalid-template' && 'Invalid Template'}
          </h2>
          <button
            onClick={handleCloseModal}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <>
              <p style={{ fontSize: '14px', color: '#5F6B7A', marginBottom: '12px', margin: '0 0 12px 0' }}>
                Upload your bulk progress data from an Excel file (.xlsx). Make sure to use the template provided.
              </p>

              {/* Note about Submit for Review */}
              <div style={{
                padding: '12px',
                backgroundColor: '#FEF3C7',
                borderLeft: '4px solid #F59E0B',
                borderRadius: '4px',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '13px', color: '#92400E', margin: 0, fontWeight: '500' }}>
                  <strong>Note:</strong> {projectId === '1'
                    ? 'Progress Updates are Currently Locked. Any progress submitted will be automatically saved as draft and will not be submitted for approval until the lock is removed.'
                    : 'Uploading the bulk progress here will submit it for review directly, not save it as draft.'}
                </p>
              </div>

              {/* File Upload Area */}
              {!selectedFile && !isUploading && (
                <div
                  onClick={handleBrowseClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  style={{
                    border: `2px dashed ${isDragging ? '#FD4314' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    backgroundColor: isDragging ? '#FEF2F2' : '#F9FAFB',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
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

                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', margin: '0 0 8px 0' }}>
                    Drag and drop file here or <span style={{ color: '#FD4314' }}>click to browse</span>
                  </p>

                  <p style={{ fontSize: '13px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}>
                    <FileSpreadsheet size={16} />
                    Supported file type: .xlsx
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {/* Loading Spinner */}
              {isUploading && (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #E5E7EB',
                    borderTopColor: '#FD4314',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: '0 0 4px 0' }}>
                    Processing file...
                  </p>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
                    Validating progress data
                  </p>
                </div>
              )}

              {/* Selected File Display */}
              {selectedFile && !isUploading && step === 'upload' && (
                <div style={{
                  padding: '16px',
                  border: '1px solid #E2E6ED',
                  borderRadius: '6px',
                  backgroundColor: '#F9FAFB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileSpreadsheet size={24} style={{ color: '#059669' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#272721', margin: '0 0 4px 0' }}>
                        {selectedFile.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #DC2626',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Remove
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: Preview */}
          {step === 'preview' && (
            <>
              {/* Stats Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  border: '1px solid #E2E6ED',
                  borderRadius: '6px',
                  backgroundColor: '#F9FAFB'
                }}>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>Total Records</p>
                  <p style={{ fontSize: '24px', fontWeight: '600', color: '#272721', margin: 0 }}>{stats.total}</p>
                </div>
                <div style={{
                  padding: '16px',
                  border: '1px solid #10B981',
                  borderRadius: '6px',
                  backgroundColor: '#ECFDF5'
                }}>
                  <p style={{ fontSize: '12px', color: '#065F46', margin: '0 0 4px 0' }}>Valid Records</p>
                  <p style={{ fontSize: '24px', fontWeight: '600', color: '#059669', margin: 0 }}>{stats.valid}</p>
                </div>
                <div style={{
                  padding: '16px',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  backgroundColor: '#FEF2F2'
                }}>
                  <p style={{ fontSize: '12px', color: '#991B1B', margin: '0 0 4px 0' }}>Errors</p>
                  <p style={{ fontSize: '24px', fontWeight: '600', color: '#DC2626', margin: 0 }}>{stats.error}</p>
                </div>
              </div>

              {/* Preview Table */}
              <div style={{
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'auto',
                backgroundColor: '#FFFFFF'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '2410px'
                }}>
                  <thead>
                    {importRecords.map((task, taskIndex) => {
                      return (
                        <React.Fragment key={taskIndex}>
                          {/* First Header Row - Parent Steps */}
                          {taskIndex === 0 && (
                            <tr style={{
                              backgroundColor: '#E4EEF8',
                              borderBottom: '1px solid #C8D9EE'
                            }}>
                              <th rowSpan={3} style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                width: '60px',
                                borderRight: '1px solid #C8D9EE',
                                backgroundColor: '#E4EEF8'
                              }}>
                                Row
                              </th>
                              <th rowSpan={3} style={{
                                padding: '12px',
                                textAlign: 'left',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                width: '120px',
                                borderRight: '1px solid #C8D9EE',
                                backgroundColor: '#E4EEF8'
                              }}>
                                Task ID
                              </th>
                              <th rowSpan={3} style={{
                                padding: '12px',
                                textAlign: 'left',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                width: '700px',
                                borderRight: '1px solid #C8D9EE',
                                backgroundColor: '#E4EEF8'
                              }}>
                                Task Name
                              </th>
                              <th rowSpan={3} style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                width: '130px',
                                borderRight: '2px solid #9CA3AF'
                              }}>
                                Total Quantity
                              </th>
                              {task.steps.map((step, stepIndex) => {
                                const colSpan = step.subSteps ? step.subSteps.length * 2 : 2;

                                return (
                                  <th
                                    key={stepIndex}
                                    colSpan={colSpan}
                                    style={{
                                      padding: '12px',
                                      textAlign: 'center',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: '#272721',
                                      borderRight: stepIndex < task.steps.length - 1 ? '2px solid #9CA3AF' : '1px solid #C8D9EE',
                                      backgroundColor: '#E4EEFE'
                                    }}
                                  >
                                    {step.name}
                                  </th>
                                );
                              })}
                              <th rowSpan={3} style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                width: '400px',
                                borderRight: '1px solid #C8D9EE',
                                backgroundColor: '#E4EEF8'
                              }}>
                                Result
                              </th>
                            </tr>
                          )}

                          {/* Second Header Row - Substep Names */}
                          {taskIndex === 0 && (
                            <tr style={{
                              backgroundColor: '#EDF4FB',
                              borderBottom: '1px solid #C8D9EE'
                            }}>
                              {task.steps.flatMap((step, stepIndex) => {
                                const steps = step.subSteps || [step];
                                const isLastParent = stepIndex === task.steps.length - 1;

                                return steps.map((subStep, subIndex) => {
                                  const isLastStep = subIndex === steps.length - 1;

                                  return (
                                    <th
                                      key={`${stepIndex}-${subIndex}-substep`}
                                      colSpan={2}
                                      style={{
                                        padding: '8px 12px',
                                        textAlign: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        borderRight: !(isLastParent && isLastStep) ? '2px solid #9CA3AF' : '1px solid #C8D9EE',
                                        backgroundColor: '#EDF4FB'
                                      }}
                                    >
                                      {subStep.name} ({subStep.weightage}%)
                                    </th>
                                  );
                                });
                              })}
                            </tr>
                          )}

                          {/* Third Header Row - Column Labels */}
                          {taskIndex === 0 && (
                            <tr style={{
                              backgroundColor: '#F3F6FA',
                              borderBottom: '1px solid #C8D9EE'
                            }}>
                              {task.steps.flatMap((step, stepIndex) => {
                                const steps = step.subSteps || [step];
                                const isLastParent = stepIndex === task.steps.length - 1;

                                return steps.flatMap((subStep, subIndex) => {
                                  const isLastStep = subIndex === steps.length - 1;

                                  return [
                                    <th key={`${stepIndex}-${subIndex}-approved`} style={{
                                      padding: '8px 12px',
                                      textAlign: 'center',
                                      fontSize: '11px',
                                      fontWeight: '500',
                                      color: '#6B7280',
                                      borderRight: '1px solid #C8D9EE',
                                      width: '110px',
                                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                                    }}>
                                      Last Approved
                                    </th>,
                                    <th key={`${stepIndex}-${subIndex}-new`} style={{
                                      padding: '8px 12px',
                                      textAlign: 'center',
                                      fontSize: '11px',
                                      fontWeight: '500',
                                      color: '#6B7280',
                                      borderRight: !(isLastParent && isLastStep) ? '2px solid #9CA3AF' : '1px solid #C8D9EE',
                                      width: '110px',
                                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                                    }}>
                                      New Value (%)
                                    </th>
                                  ];
                                });
                              })}
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </thead>

                  <tbody>
                    {importRecords.map((task, taskIndex) => {
                      // Collect all errors for this task
                      const taskErrors: string[] = [];
                      task.steps.forEach(step => {
                        if (step.subSteps) {
                          step.subSteps.forEach(subStep => {
                            if (!subStep.isValid && subStep.errorMessage) {
                              taskErrors.push(`${subStep.name}: ${subStep.errorMessage}`);
                            }
                          });
                        }
                      });

                      return (
                        <tr
                          key={taskIndex}
                          style={{
                            backgroundColor: taskIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                            borderBottom: '1px solid #E2E6ED'
                          }}
                        >
                          {/* Row */}
                          <td style={{
                            padding: '12px',
                            fontSize: '13px',
                            color: '#272721',
                            textAlign: 'center',
                            borderRight: '1px solid #C8D9EE',
                            verticalAlign: 'middle'
                          }}>
                            {taskIndex + 5}
                          </td>

                          {/* Task ID */}
                          <td style={{
                            padding: '12px',
                            fontSize: '13px',
                            color: '#272721',
                            borderRight: '1px solid #C8D9EE',
                            verticalAlign: 'middle'
                          }}>
                            {task.taskId}
                          </td>

                          {/* Task Name */}
                          <td style={{
                            padding: '12px',
                            fontSize: '13px',
                            color: '#272721',
                            borderRight: '1px solid #C8D9EE',
                            verticalAlign: 'middle'
                          }}>
                            {task.taskName}
                          </td>

                          {/* Total Qty */}
                          <td style={{
                            padding: '12px',
                            fontSize: '13px',
                            color: '#272721',
                            textAlign: 'center',
                            borderRight: '2px solid #9CA3AF',
                            verticalAlign: 'middle'
                          }}>
                            {task.totalQty > 0 ? `${task.totalQty} ${task.uom}` : 'N/A'}
                          </td>

                          {/* All step columns - display all substeps in a single row */}
                          {task.steps.flatMap((step, stepIndex) => {
                            const steps = step.subSteps || [step];
                            const isLastParent = stepIndex === task.steps.length - 1;

                            return steps.flatMap((subStep, subIndex) => {
                              const isLastSub = subIndex === steps.length - 1;

                              return [
                                <td key={`${stepIndex}-${subIndex}-approved`} style={{
                                  padding: '8px 12px',
                                  fontSize: '12px',
                                  color: '#6B7280',
                                  textAlign: 'center',
                                  borderRight: '1px solid #C8D9EE',
                                  verticalAlign: 'middle'
                                }}>
                                  {subStep.lastApproved || 0}
                                </td>,
                                <td key={`${stepIndex}-${subIndex}-new`} style={{
                                  padding: '8px 12px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: subStep.isValid ? '#059669' : '#DC2626',
                                  textAlign: 'center',
                                  borderRight: !(isLastParent && isLastSub) ? '2px solid #9CA3AF' : '1px solid #C8D9EE',
                                  verticalAlign: 'middle'
                                }}>
                                  {subStep.newValue || '0'}
                                </td>
                              ];
                            });
                          })}

                          {/* Result column */}
                          <td style={{
                            padding: '12px',
                            fontSize: '12px',
                            color: taskErrors.length > 0 ? '#DC2626' : '#059669',
                            borderRight: '1px solid #C8D9EE',
                            verticalAlign: 'middle'
                          }}>
                            {taskErrors.length > 0 ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px'
                              }}>
                                <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {taskErrors.map((error, idx) => (
                                    <span key={idx} style={{ fontSize: '11px' }}>{error}</span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}>
                                <CheckCircle size={14} />
                                <span>Valid</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle size={32} style={{ color: '#10B981' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' }}>
                Import Successful!
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>
                {stats.valid} progress entries have been imported successfully.
              </p>
              {stats.error > 0 && (
                <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>
                  {stats.error} record(s) were skipped due to errors.
                </p>
              )}
            </div>
          )}

          {/* STEP 4: Invalid Template */}
          {step === 'invalid-template' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <AlertCircle size={32} style={{ color: '#EF4444' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' }}>
                Invalid Template
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>
                The uploaded file does not match the required template format. Please download the template and try again.
              </p>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
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
                <Download size={16} />
                Download Template
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E6ED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: '#FAFBFC'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {step === 'upload' && (
              <>
                <button
                  onClick={handleDownloadTemplate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
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
                  <Download size={16} />
                  Download Template
                </button>
                <button
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
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
              </>
            )}
            {step === 'preview' && (
              <button
                onClick={() => {
                  setStep('upload');
                  setSelectedFile(null);
                  setImportRecords([]);
                  setStats({ total: 0, valid: 0, error: 0 });
                }}
                style={{
                  padding: '10px 20px',
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
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {step === 'upload' && (
              <button
                onClick={() => {
                  if (selectedFile) {
                    validateFile(selectedFile).catch(() => {
                      // Error handled by setting step to 'invalid-template'
                    });
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: selectedFile ? '#FD4314' : '#D1D5DB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: selectedFile ? 'pointer' : 'not-allowed'
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
                disabled={!selectedFile}
              >
                <Upload size={16} />
                Upload
              </button>
            )}
            {step === 'preview' && stats.error > 0 && (
              <button
                onClick={handleDownloadErrorReport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: '1px solid #DC2626',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#DC2626',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <Download size={16} />
                Download Error Report
              </button>
            )}
            {step === 'preview' && (
              <button
                onClick={handleSubmitProgress}
                disabled={stats.error > 0}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: stats.error > 0 ? '#D1D5DB' : '#FD4314',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: stats.error > 0 ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (stats.error === 0) {
                    e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (stats.error === 0) {
                    e.currentTarget.style.backgroundColor = '#FD4314';
                  }
                }}
              >
                Submit Progress
              </button>
            )}
            {(step === 'success' || step === 'invalid-template') && (
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
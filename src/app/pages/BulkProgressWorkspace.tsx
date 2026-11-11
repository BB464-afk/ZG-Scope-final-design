import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Upload, X, Download, File as FileIcon, FileText } from 'lucide-react';
import { Clock } from 'lucide-react';
import BulkProgressImportModal from '../components/BulkProgressImportModal';

// Activity options mapping
const ACTIVITY_MAPPING: Record<string, string> = {
  'FO-01': 'FO-01 - Whitewash',
  'FO-64': 'FO-64 - Door sets',
  'FO-21': 'FO-21 - Process/Chilled Water Distribution (PCW-CWR)',
  'FO-12': 'FO-12 - Ceilings',
  'ME-15': 'ME-15 - HVAC Systems',
  'EL-08': 'EL-08 - Power Distribution',
};

// Sub-step interface
interface SubStep {
  name: string;
  weightage: number;
  measurementType: '%' | 'Qty.';
}

// Parent step interface
interface ParentStep {
  name: string;
  weightage: number;
  measurementType: '%' | 'Qty.';
  subSteps?: SubStep[];
}

// Mock ROC steps for different activities - now supporting sub-steps
const ACTIVITY_ROC_STEPS: Record<string, ParentStep[]> = {
  'FO-01': [
    { name: 'Prepare / Set Out', weightage: 10, measurementType: '%' },
    { name: 'Installation', weightage: 60, measurementType: 'Qty.' },
    { name: 'QA & Sign Off', weightage: 30, measurementType: '%' }
  ],
  'FO-64': [
    {
      name: 'Procurement - place order',
      weightage: 10,
      measurementType: '%',
      subSteps: [
        { name: 'Place Order', weightage: 40, measurementType: '%' },
        { name: 'Receive Order', weightage: 35, measurementType: '%' },
        { name: 'Forward to Warehouse', weightage: 25, measurementType: '%' }
      ]
    },
    {
      name: 'Delivery',
      weightage: 20,
      measurementType: '%',
      subSteps: [
        { name: 'Load Truck', weightage: 30, measurementType: '%' },
        { name: 'Transport', weightage: 50, measurementType: '%' },
        { name: 'Unload', weightage: 20, measurementType: '%' }
      ]
    },
    {
      name: 'Installation',
      weightage: 60,
      measurementType: 'Qty.',
      subSteps: [
        { name: 'Frame Installation', weightage: 40, measurementType: 'Qty.' },
        { name: 'Door Hanging', weightage: 35, measurementType: 'Qty.' },
        { name: 'Hardware Fitting', weightage: 25, measurementType: 'Qty.' }
      ]
    },
    {
      name: 'QA & Sign Off',
      weightage: 10,
      measurementType: '%',
      subSteps: [
        { name: 'Inspection', weightage: 60, measurementType: '%' },
        { name: 'Sign-off Documentation', weightage: 40, measurementType: '%' }
      ]
    }
  ],
  'FO-21': [
    { name: 'Procurement - place order', weightage: 10, measurementType: '%' },
    { name: 'Delivery', weightage: 20, measurementType: '%' },
    { name: 'Install Pipework and Fittings', weightage: 45, measurementType: 'Qty.' },
    { name: 'Testing', weightage: 25, measurementType: '%' }
  ],
  'FO-12': [
    { name: 'Prepare / Set Out', weightage: 10, measurementType: '%' },
    { name: 'Install Sub-Grid', weightage: 55, measurementType: 'Qty.' },
    { name: 'Install tiles', weightage: 30, measurementType: 'Qty.' },
    { name: 'QA & Sign Off', weightage: 5, measurementType: '%' }
  ],
  'ME-15': [
    { name: 'Procurement', weightage: 15, measurementType: '%' },
    { name: 'Installation', weightage: 55, measurementType: 'Qty.' },
    { name: 'Testing', weightage: 30, measurementType: '%' }
  ],
  'EL-08': [
    { name: 'Material Delivery', weightage: 10, measurementType: '%' },
    { name: 'Conduit Installation', weightage: 40, measurementType: 'Qty.' },
    { name: 'Wiring', weightage: 35, measurementType: 'Qty.' },
    { name: 'Testing & Commissioning', weightage: 15, measurementType: '%' }
  ]
};

interface EvidenceFile {
  name: string;
  url?: string;
  type?: 'pdf' | 'image' | 'excel' | 'word' | 'document';
}

interface StepProgressData {
  stepName: string;
  weightage: number;
  lastApproved: number | string;
  pending: number | string;
  newValue: number | string;
  uploadedFiles?: File[];
  existingEvidence?: EvidenceFile[];
  isSubStep?: boolean;
  parentStepName?: string;
}

interface TaskProgressData {
  id: string;
  taskId: string;
  taskName: string;
  measurementType: 'Percentage Based' | 'Quantity Based';
  totalQuantity: number;
  uom: string;
  steps: StepProgressData[];
}

// Helper function to flatten steps (including sub-steps) into a single array
const flattenSteps = (parentSteps: ParentStep[]): StepProgressData[] => {
  const flattened: StepProgressData[] = [];

  parentSteps.forEach(parent => {
    if (parent.subSteps && parent.subSteps.length > 0) {
      // Add sub-steps
      parent.subSteps.forEach(subStep => {
        flattened.push({
          stepName: subStep.name,
          weightage: subStep.weightage,
          lastApproved: 0,
          pending: 0,
          newValue: '',
          uploadedFiles: [],
          existingEvidence: [],
          isSubStep: true,
          parentStepName: parent.name
        });
      });
    } else {
      // Add parent step as regular step
      flattened.push({
        stepName: parent.name,
        weightage: parent.weightage,
        lastApproved: 0,
        pending: 0,
        newValue: '',
        uploadedFiles: [],
        existingEvidence: [],
        isSubStep: false
      });
    }
  });

  return flattened;
};

export default function BulkProgressWorkspace() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedActivity = searchParams.get('activity') || 'FO-64';

  // Check if progress is locked for this project (PRJ-2026-001 has id = 1)
  const isProgressLocked = projectId === '1';

  // Get ROC steps for selected activity
  const rocSteps = ACTIVITY_ROC_STEPS[selectedActivity] || ACTIVITY_ROC_STEPS['FO-64'];
  
  // Draft tracking
  const [hasDraft, setHasDraft] = useState(false);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);

  // File viewing modal state
  const [viewingFiles, setViewingFiles] = useState<{
    taskId: string;
    taskName: string;
    stepIndex: number;
    stepName: string;
  } | null>(null);

  // Mock task data filtered by activity
  const [tasks, setTasks] = useState<TaskProgressData[]>([
    {
      id: '1',
      taskId: 'TASK-1733-1',
      taskName: 'Door Sets – Level 1 – East Wing – Units 101-115',
      measurementType: 'Quantity Based',
      totalQuantity: 150,
      uom: 'Units',
      steps: flattenSteps(rocSteps)
    },
    {
      id: '2',
      taskId: 'TASK-1733-5',
      taskName: 'Door Sets – Level 1 – West Wing – Units 116-130',
      measurementType: 'Quantity Based',
      totalQuantity: 120,
      uom: 'Units',
      steps: flattenSteps(rocSteps).map((step, idx) => ({
        ...step,
        lastApproved: idx === 0 ? 50 : idx === 6 ? 60 : 0,
        pending: idx === 1 ? 55 : idx === 3 ? 75 : 0,
        newValue: ''
      }))
    },
    {
      id: '3',
      taskId: 'TASK-1733-12',
      taskName: 'Door Sets – Level 2 – North Wing – Units 201-220',
      measurementType: 'Percentage Based',
      totalQuantity: 0,
      uom: '',
      steps: flattenSteps(rocSteps)
    },
    {
      id: '4',
      taskId: 'TASK-1733-18',
      taskName: 'Door Sets – Level 2 – South Wing – Units 221-240',
      measurementType: 'Percentage Based',
      totalQuantity: 0,
      uom: '',
      steps: flattenSteps(rocSteps).map((step, idx) => ({
        ...step,
        lastApproved: idx === 1 ? 100 : idx === 4 ? 50 : 0,
        newValue: idx === 4 ? 65 : ''
      }))
    },
    {
      id: '5',
      taskId: 'TASK-1733-22',
      taskName: 'Door Sets – Level 3 – Central Corridor – Units 301-325',
      measurementType: 'Quantity Based',
      totalQuantity: 180,
      uom: 'Units',
      steps: flattenSteps(rocSteps).map((step, idx) => ({
        ...step,
        lastApproved: idx === 2 ? 80 : idx === 5 ? 90 : 0,
        newValue: ''
      }))
    }
  ]);

  const handleNewValueChange = (taskId: string, stepIndex: number, value: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = [...task.steps];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            newValue: value
          };
          return { ...task, steps: updatedSteps };
        }
        return task;
      })
    );
  };

  const handleFileUpload = (taskId: string, stepIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = [...task.steps];
          const currentFiles = updatedSteps[stepIndex].uploadedFiles || [];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            uploadedFiles: [...currentFiles, ...newFiles]
          };
          return { ...task, steps: updatedSteps };
        }
        return task;
      })
    );

    toast.success(`${newFiles.length} file(s) uploaded successfully`, {
      duration: 2000,
      position: 'top-right'
    });
  };

  const handleRemoveUploadedFile = (taskId: string, stepIndex: number, fileIndex: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = [...task.steps];
          const currentFiles = updatedSteps[stepIndex].uploadedFiles || [];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            uploadedFiles: currentFiles.filter((_, idx) => idx !== fileIndex)
          };
          return { ...task, steps: updatedSteps };
        }
        return task;
      })
    );
  };

  const handleRemoveExistingEvidence = (taskId: string, stepIndex: number, fileName: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = [...task.steps];
          const currentEvidence = updatedSteps[stepIndex].existingEvidence || [];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            existingEvidence: currentEvidence.filter(e => e.name !== fileName)
          };
          return { ...task, steps: updatedSteps };
        }
        return task;
      })
    );
    toast.success('File removed successfully', {
      duration: 2000,
      position: 'top-right'
    });
  };

  const getTotalFiles = (step: StepProgressData) => {
    return (step.existingEvidence?.length || 0) + (step.uploadedFiles?.length || 0);
  };

  const getFileIcon = (type?: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} style={{ color: '#DC2626' }} />;
      case 'excel':
        return <FileIcon size={16} style={{ color: '#059669' }} />;
      case 'word':
        return <FileText size={16} style={{ color: '#2563EB' }} />;
      case 'image':
        return <FileText size={16} style={{ color: '#FD4314' }} />;
      default:
        return <FileIcon size={16} style={{ color: '#6B7280' }} />;
    }
  };

  const validateInput = (task: TaskProgressData, stepIndex: number, value: string, showToast: boolean = true): boolean => {
    if (!value) return true; // Empty is valid (optional)
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      if (showToast) toast.error('Please enter a valid number');
      return false;
    }

    const step = task.steps[stepIndex];
    const lastApprovedValue = parseFloat(step.lastApproved as string) || 0;

    // Check if value is less than last approved
    if (numValue < lastApprovedValue) {
      if (showToast) toast.error(`Value cannot be less than Last Approved value (${lastApprovedValue})`);
      return false;
    }

    if (task.measurementType === 'Percentage Based') {
      if (numValue < 0 || numValue > 100) {
        if (showToast) toast.error('Percentage must be between 0 and 100');
        return false;
      }
    } else if (task.measurementType === 'Quantity Based') {
      if (numValue < 0) {
        if (showToast) toast.error('Quantity cannot be negative');
        return false;
      }
      if (numValue > task.totalQuantity) {
        if (showToast) toast.error(`Installed Qty cannot exceed Total Quantity (${task.totalQuantity} ${task.uom})`);
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = () => {
    // Check if there are any values entered
    const hasAnyValues = tasks.some(task => 
      task.steps.some(step => step.newValue !== '')
    );

    if (!hasAnyValues) {
      toast.error('Please enter at least one progress value');
      return;
    }

    // Validate all inputs without showing individual toasts
    let isValid = true;
    let firstError = '';
    
    for (const task of tasks) {
      for (let idx = 0; idx < task.steps.length; idx++) {
        const step = task.steps[idx];
        if (step.newValue !== '') {
          const valid = validateInput(task, idx, step.newValue as string, false);
          if (!valid && isValid) {
            // Capture the first error
            const value = step.newValue as string;
            const numValue = parseFloat(value);
            const lastApprovedValue = parseFloat(step.lastApproved as string) || 0;
            
            if (isNaN(numValue)) {
              firstError = 'Please enter a valid number';
            } else if (numValue < lastApprovedValue) {
              firstError = `Value cannot be less than Last Approved value (${lastApprovedValue})`;
            } else if (task.measurementType === 'Percentage Based' && (numValue < 0 || numValue > 100)) {
              firstError = 'Percentage must be between 0 and 100';
            } else if (task.measurementType === 'Quantity Based') {
              if (numValue < 0) {
                firstError = 'Quantity cannot be negative';
              } else if (numValue > task.totalQuantity) {
                firstError = `Installed Qty cannot exceed Total Quantity (${task.totalQuantity} ${task.uom})`;
              }
            }
            isValid = false;
          }
        }
      }
    }

    if (!isValid) {
      toast.error(firstError);
      return;
    }

    toast.success('Progress saved as draft', {
      description: 'You can continue editing this draft later',
      duration: 4000
    });

    // Mark that a draft has been saved
    setHasDraft(true);
  };

  const handleDiscardDraft = () => {
    // Clear all new values and uploaded files
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        steps: task.steps.map(step => ({
          ...step,
          newValue: '',
          uploadedFiles: []
        }))
      }))
    );

    setHasDraft(false);

    toast.info('Draft discarded successfully', {
      description: 'All unsaved changes have been cleared',
      duration: 3000
    });
  };

  const handleSubmitForReview = () => {
    // Check if there are any values entered
    const hasAnyValues = tasks.some(task => 
      task.steps.some(step => step.newValue !== '')
    );

    if (!hasAnyValues) {
      toast.error('Please enter at least one progress value');
      return;
    }

    // Validate all inputs without showing individual toasts
    let isValid = true;
    let firstError = '';
    
    for (const task of tasks) {
      for (let idx = 0; idx < task.steps.length; idx++) {
        const step = task.steps[idx];
        if (step.newValue !== '') {
          const valid = validateInput(task, idx, step.newValue as string, false);
          if (!valid && isValid) {
            // Capture the first error
            const value = step.newValue as string;
            const numValue = parseFloat(value);
            const lastApprovedValue = parseFloat(step.lastApproved as string) || 0;
            
            if (isNaN(numValue)) {
              firstError = 'Please enter a valid number';
            } else if (numValue < lastApprovedValue) {
              firstError = `Value cannot be less than Last Approved value (${lastApprovedValue})`;
            } else if (task.measurementType === 'Percentage Based' && (numValue < 0 || numValue > 100)) {
              firstError = 'Percentage must be between 0 and 100';
            } else if (task.measurementType === 'Quantity Based') {
              if (numValue < 0) {
                firstError = 'Quantity cannot be negative';
              } else if (numValue > task.totalQuantity) {
                firstError = `Installed Qty cannot exceed Total Quantity (${task.totalQuantity} ${task.uom})`;
              }
            }
            isValid = false;
          }
        }
      }
    }

    if (!isValid) {
      toast.error(firstError);
      return;
    }

    // If progress is locked, save as draft instead
    if (isProgressLocked) {
      toast.success('Progress saved as draft', {
        description: 'Progress is currently locked. Your submission has been saved as draft instead of being submitted for review.',
        duration: 5000
      });
    } else {
      toast.success('Progress submitted for review', {
        description: 'Your submission will be reviewed by the approver',
        duration: 4000
      });
    }

    // Navigate back to task listing after short delay
    setTimeout(() => {
      navigate(`/app/projects/${projectId}/tasks`);
    }, 1500);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumbs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '16px'
      }}>
        <span 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate(`/app/projects/${projectId}/tasks`)}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1F2937'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
        >
          Task Listing
        </span>
        <span>›</span>
        <span style={{ fontWeight: '500', color: '#272721' }}>Bulk Progress Update</span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1F2937',
        margin: '0 0 16px 0'
      }}>
        Bulk Progress Update
      </h1>

      {/* Activity Information */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '16px 24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#6B7280'
            }}>
              Activity:
            </span>
          </div>
          <div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#272721'
            }}>
              {ACTIVITY_MAPPING[selectedActivity] || selectedActivity}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Lock Warning Banner */}
      {isProgressLocked && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            !
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#92400E',
              margin: '0 0 4px 0'
            }}>
              Progress Updates are Currently Locked
            </p>
            <p style={{
              fontSize: '13px',
              color: '#92400E',
              margin: '0'
            }}>
              Any progress submitted will be automatically saved as draft and will not be submitted for approval until the lock is removed.
            </p>
          </div>
        </div>
      )}

      {/* Draft Banner */}
      {hasDraft && (
        <div style={{
          backgroundColor: '#DBEAFE',
          border: '1px solid #3B82F6',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            padding: '4px 12px',
            backgroundColor: '#3B82F6',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            DRAFT
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#1E40AF',
              margin: '0'
            }}>
              You have unsaved draft changes. Continue editing or discard the draft to start fresh.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons - Top */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
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
        <button
          onClick={handleSaveDraft}
          style={{
            height: '40px',
            padding: '0 20px',
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
          Save Draft
        </button>
        <button
          onClick={handleDiscardDraft}
          style={{
            height: '40px',
            padding: '0 20px',
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
          Discard Draft
        </button>
        <button
          onClick={handleSubmitForReview}
          style={{
            height: '40px',
            padding: '0 20px',
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
          Submit for Review
        </button>
      </div>

      {/* Bulk Progress Workspace Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto',
        position: 'relative'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '1400px'
        }}>
          {/* Table Headers */}
          <thead>
            {/* First Header Row - Parent Steps */}
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721',
                width: '150px',
                backgroundColor: '#E4EEF8',
                borderRight: '1px solid #C8D9EE'
              }}>
                Task ID
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721',
                width: '700px',
                backgroundColor: '#E4EEF8',
                borderRight: '1px solid #C8D9EE'
              }}>
                Task Name
              </th>
              <th style={{
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

              {/* Parent Step Headers */}
              {rocSteps.map((parentStep, idx) => {
                const colSpan = parentStep.subSteps
                  ? parentStep.subSteps.length * 4
                  : 4;

                return (
                  <th
                    key={idx}
                    colSpan={colSpan}
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#272721',
                      borderRight: idx < rocSteps.length - 1 ? '2px solid #9CA3AF' : 'none',
                      backgroundColor: '#E4EEFE'
                    }}
                  >
                    {parentStep.name} ({parentStep.weightage}%)
                  </th>
                );
              })}
            </tr>

            {/* Second Header Row - Sub-Steps */}
            <tr style={{
              backgroundColor: '#F3F6FA',
              borderBottom: '1px solid #C8D9EE'
            }}>
              {/* Empty cells for Task ID, Task Name, Total Quantity */}
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                backgroundColor: '#F3F6FA',
                borderRight: '1px solid #C8D9EE'
              }}></th>
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                backgroundColor: '#F3F6FA',
                borderRight: '1px solid #C8D9EE'
              }}></th>
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                borderRight: '2px solid #9CA3AF'
              }}></th>

              {/* Sub-step headers or empty headers for steps without sub-steps */}
              {rocSteps.map((parentStep, parentIdx) => {
                if (parentStep.subSteps && parentStep.subSteps.length > 0) {
                  // Show sub-step names
                  return parentStep.subSteps.map((subStep, subIdx) => (
                    <th
                      key={`${parentIdx}-${subIdx}`}
                      colSpan={4}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#272721',
                        borderRight:
                          subIdx === parentStep.subSteps!.length - 1 && parentIdx < rocSteps.length - 1
                            ? '2px solid #9CA3AF'
                            : '1px solid #E2E6ED',
                        backgroundColor: 'rgba(228, 238, 254, 0.5)'
                      }}
                    >
                      {subStep.name} ({subStep.weightage}%)
                    </th>
                  ));
                } else {
                  // For steps without sub-steps, show empty header with colspan 4
                  return (
                    <th
                      key={`${parentIdx}-nosub`}
                      colSpan={4}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6B7280',
                        borderRight: parentIdx < rocSteps.length - 1 ? '2px solid #9CA3AF' : 'none',
                        backgroundColor: 'rgba(228, 238, 254, 0.5)'
                      }}
                    ></th>
                  );
                }
              })}
            </tr>

            {/* Third Header Row - Last Approved | New Value | Upload Evidence */}
            <tr style={{
              backgroundColor: '#F3F6FA',
              borderBottom: '1px solid #C8D9EE'
            }}>
              {/* Empty cells for Task ID, Task Name, Total Quantity */}
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                backgroundColor: '#F3F6FA',
                borderRight: '1px solid #C8D9EE'
              }}></th>
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                backgroundColor: '#F3F6FA',
                borderRight: '1px solid #C8D9EE'
              }}></th>
              <th style={{
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                borderRight: '2px solid #9CA3AF'
              }}></th>

              {/* Column headers for each step/sub-step */}
              {rocSteps.map((parentStep, parentIdx) => {
                const steps = parentStep.subSteps || [parentStep];
                const isLastParent = parentIdx === rocSteps.length - 1;

                return steps.map((step, stepIdx) => {
                  const isLastStep = stepIdx === steps.length - 1;
                  const measurementType = step.measurementType || parentStep.measurementType;

                  return [
                    <th key={`${parentIdx}-${stepIdx}-approved`} style={{
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#6B7280',
                      borderRight: '1px solid #E2E6ED',
                      width: '110px',
                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                    }}>
                      Last Approved
                    </th>,
                    <th key={`${parentIdx}-${stepIdx}-pending`} style={{
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#6B7280',
                      borderRight: '1px solid #E2E6ED',
                      width: '110px',
                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                    }}>
                      Pending
                    </th>,
                    <th key={`${parentIdx}-${stepIdx}-new`} style={{
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#6B7280',
                      borderRight: '1px solid #E2E6ED',
                      width: '110px',
                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                    }}>
                      New Value ({measurementType})
                    </th>,
                    <th key={`${parentIdx}-${stepIdx}-upload`} style={{
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#6B7280',
                      borderRight: !(isLastParent && isLastStep) ? '2px solid #9CA3AF' : 'none',
                      width: '110px',
                      backgroundColor: 'rgba(243, 246, 250, 0.8)'
                    }}>
                      Upload Evidence
                    </th>
                  ];
                });
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tasks.map((task, taskIdx) => (
              <tr
                key={task.id}
                style={{
                  backgroundColor: taskIdx % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                  borderBottom: '1px solid #E2E6ED'
                }}
              >
                {/* Task ID */}
                <td style={{
                  padding: '12px',
                  fontSize: '13px',
                  color: '#272721',
                  fontWeight: '500',
                  backgroundColor: taskIdx % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                  borderRight: '1px solid #E2E6ED'
                }}>
                  {task.taskId}
                </td>

                {/* Task Name */}
                <td style={{
                  padding: '12px',
                  fontSize: '13px',
                  color: '#272721',
                  backgroundColor: taskIdx % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                  borderRight: '1px solid #E2E6ED'
                }}>
                  {task.taskName}
                </td>

                {/* Total Quantity */}
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#272721',
                  fontWeight: '500',
                  borderRight: '2px solid #9CA3AF'
                }}>
                  {task.measurementType === 'Quantity Based'
                    ? `${task.totalQuantity} ${task.uom}`
                    : '-'}
                </td>

                {/* Step/Sub-step Values */}
                {task.steps.map((step, stepIdx) => {
                  // Determine if this is the last step overall
                  const isLastStepOverall = stepIdx === task.steps.length - 1;

                  return [
                    // Last Approved - Read Only
                    <td key={`${stepIdx}-approved`} style={{
                      padding: '8px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#6B7280',
                      backgroundColor: 'rgba(243, 246, 250, 0.8)',
                      borderRight: '1px solid #E2E6ED'
                    }}>
                      {step.lastApproved || '-'}
                    </td>,

                    // Pending - Read Only (shown in yellow/orange tint)
                    <td key={`${stepIdx}-pending`} style={{
                      padding: '8px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: step.pending ? '#D97706' : '#6B7280',
                      backgroundColor: step.pending ? 'rgba(251, 191, 36, 0.1)' : 'rgba(243, 246, 250, 0.8)',
                      fontWeight: step.pending ? '500' : 'normal',
                      borderRight: '1px solid #E2E6ED'
                    }}>
                      {step.pending || '-'}
                    </td>,

                    // New Value - Editable
                    <td key={`${stepIdx}-new`} style={{
                      padding: '8px',
                      textAlign: 'center',
                      borderRight: '1px solid #E2E6ED'
                    }}>
                      {(() => {
                        const lastApprovedValue = parseFloat(step.lastApproved as string) || 0;
                        const isDisabled = task.measurementType === 'Percentage Based' && lastApprovedValue === 100;

                        return (
                          <input
                            type="text"
                            value={step.newValue}
                            onChange={(e) => handleNewValueChange(task.id, stepIdx, e.target.value)}
                            disabled={isDisabled}
                            placeholder={isDisabled ? "100%" : "-"}
                            style={{
                              width: '90px',
                              height: '32px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '3px',
                              padding: '0 8px',
                              fontSize: '13px',
                              textAlign: 'center',
                              outline: 'none',
                              fontFamily: 'inherit',
                              backgroundColor: isDisabled ? '#F9FAFB' : '#FFFFFF',
                              color: isDisabled ? '#9CA3AF' : '#272721',
                              cursor: isDisabled ? 'not-allowed' : 'text'
                            }}
                            onFocus={(e) => !isDisabled && (e.target.style.borderColor = '#FD4314')}
                            onBlur={(e) => !isDisabled && (e.target.style.borderColor = '#D1D5DB')}
                          />
                        );
                      })()}
                    </td>,

                    // Upload Evidence
                    <td key={`${stepIdx}-upload`} style={{
                      padding: '8px',
                      textAlign: 'center',
                      borderRight: !isLastStepOverall ? '2px solid #9CA3AF' : 'none'
                    }}>
                      {(() => {
                        const lastApprovedValue = parseFloat(step.lastApproved as string) || 0;
                        const isCompleted = task.measurementType === 'Percentage Based'
                          ? lastApprovedValue === 100
                          : lastApprovedValue >= task.totalQuantity;

                        return (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}>
                            <label
                              htmlFor={isCompleted ? undefined : `upload-${task.id}-${stepIdx}`}
                              style={{
                                padding: '4px 8px',
                                border: '1px solid #FD4314',
                                backgroundColor: 'transparent',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '500',
                                color: isCompleted ? '#9CA3AF' : '#FD4314',
                                borderColor: isCompleted ? '#D1D5DB' : '#FD4314',
                                cursor: isCompleted ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: isCompleted ? 0.5 : 1,
                                pointerEvents: isCompleted ? 'none' : 'auto'
                              }}
                              onMouseEnter={(e) => {
                                if (!isCompleted) {
                                  e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isCompleted) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <Upload size={12} />
                              Upload
                              {!isCompleted && (
                                <input
                                  type="file"
                                  id={`upload-${task.id}-${stepIdx}`}
                                  multiple
                                  onChange={(e) => handleFileUpload(task.id, stepIdx, e.target.files)}
                                  style={{
                                    display: 'none'
                                  }}
                                />
                              )}
                            </label>

                            {getTotalFiles(step) > 0 && (
                              <button
                                onClick={() => setViewingFiles({
                                  taskId: task.id,
                                  taskName: task.taskName,
                                  stepIndex: stepIdx,
                                  stepName: step.stepName
                                })}
                                style={{
                                  padding: '4px 8px',
                                  border: '1px solid #D8DEE8',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  color: '#272721',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                              >
                                <FileIcon size={12} />
                                {`${getTotalFiles(step)} File${getTotalFiles(step) > 1 ? 's' : ''}`}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                  ];
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Import Files Modal */}
      <BulkProgressImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={(records) => {
          // In a real app, this would update the tasks with imported data
          console.log('Imported records:', records);
        }}
      />

      {/* File Viewing Modal */}
      {viewingFiles && (() => {
        const task = tasks.find(t => t.id === viewingFiles.taskId);
        const step = task?.steps[viewingFiles.stepIndex];
        if (!task || !step) return null;

        return (
          <div
            onClick={() => setViewingFiles(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                width: '700px',
                maxWidth: '95%',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E6ED',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Attached Files
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    {viewingFiles.stepName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0 0' }}>
                    {viewingFiles.taskName}
                  </p>
                </div>
                <button
                  onClick={() => setViewingFiles(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={20} style={{ color: '#6B7280' }} />
                </button>
              </div>

              {/* Files List */}
              <div style={{ overflow: 'auto', flex: 1, padding: '16px 24px' }}>
                {/* Existing Evidence Files */}
                {step.existingEvidence && step.existingEvidence.length > 0 && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                      Approved Evidence
                    </div>
                    {step.existingEvidence.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                          border: '1px solid #E2E6ED',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          {getFileIcon(file.type)}
                          <span style={{ fontSize: '13px', color: '#272721', fontWeight: '500' }}>
                            {file.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              toast.success('File download started', { duration: 2000, position: 'top-right' });
                            }}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #D8DEE8',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#272721',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                          >
                            <Download size={14} />
                            Download
                          </button>
                          <button
                            onClick={() => handleRemoveExistingEvidence(task.id, viewingFiles.stepIndex, file.name)}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #DC2626',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#DC2626',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                          >
                            <X size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Newly Uploaded Files (Draft) */}
                {step.uploadedFiles && step.uploadedFiles.length > 0 && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginTop: step.existingEvidence && step.existingEvidence.length > 0 ? '16px' : '0', marginBottom: '8px' }}>
                      Newly Uploaded (Draft)
                    </div>
                    {step.uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          backgroundColor: '#FFF4ED',
                          border: '1px solid #FD4314',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <FileIcon size={16} style={{ color: '#FD4314' }} />
                          <span style={{ fontSize: '13px', color: '#272721', fontWeight: '500' }}>
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleRemoveUploadedFile(task.id, viewingFiles.stepIndex, idx);
                          }}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #DC2626',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {getTotalFiles(step) === 0 && (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '13px'
                  }}>
                    No files attached to this step
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '12px 24px',
                borderTop: '1px solid #E2E6ED',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setViewingFiles(null)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#272721',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { AlertCircle, Upload, X, Clock, ChevronDown, ChevronRight, Download, File, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EvidenceFile {
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'excel' | 'word' | 'document';
}

interface StepData {
  id: number;
  stepNumber: string;
  stepName: string;
  weightage: number;
  measurementType: string;
  lastApprovedValue: number;
  lastApprovedUnit: string;
  pendingValue: number | null;
  newAchievedValue: string;
  calculatedCompletion: number;
  evidence: File[];
  existingEvidence?: EvidenceFile[];
  totalQty: number;
}

interface VersionStepDetail {
  stepNumber: string;
  stepName: string;
  progressValue: number;
  unit: string;
  evidences: EvidenceFile[];
}

interface VersionHistory {
  version: string;
  progress: number;
  status: 'In Review' | 'Approved' | 'Rejected';
  submittedBy: string;
  date: string;
  steps: VersionStepDetail[];
}

const MOCK_VERSION_HISTORY: VersionHistory[] = [
  { 
    version: 'V4', 
    progress: 75, 
    status: 'In Review', 
    submittedBy: 'John Martinez', 
    date: '02 Mar 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 1600, 
        unit: 'SQM',
        evidences: [
          { name: 'v4-foundation-work.jpg', url: '#', type: 'image' },
          { name: 'v4-site-report.pdf', url: '#', type: 'pdf' }
        ]
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 60, 
        unit: '%',
        evidences: []
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 1500, 
        unit: 'SQM',
        evidences: [
          { name: 'v4-steel-inspection.xlsx', url: '#', type: 'excel' }
        ]
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 1400, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.5', 
        stepName: 'Finishing Works', 
        progressValue: 35, 
        unit: '%',
        evidences: []
      }
    ]
  },
  { 
    version: 'V3', 
    progress: 65, 
    status: 'Approved', 
    submittedBy: 'Sarah Chen', 
    date: '01 Mar 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 1500, 
        unit: 'SQM',
        evidences: [
          { name: 'v3-site-photo-1.jpg', url: '#', type: 'image' },
          { name: 'v3-site-photo-2.jpg', url: '#', type: 'image' }
        ]
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 45, 
        unit: '%',
        evidences: [
          { name: 'v3-foundation-report.docx', url: '#', type: 'word' }
        ]
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 1200, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 1000, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.5', 
        stepName: 'Finishing Works', 
        progressValue: 20, 
        unit: '%',
        evidences: []
      }
    ]
  },
  { 
    version: 'V2', 
    progress: 38, 
    status: 'Rejected', 
    submittedBy: 'Sarah Chen', 
    date: '28 Feb 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 900, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 30, 
        unit: '%',
        evidences: []
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 800, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 600, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.5', 
        stepName: 'Finishing Works', 
        progressValue: 10, 
        unit: '%',
        evidences: []
      }
    ]
  }
];

const MOCK_STEP_DATA: StepData[] = [
  {
    id: 1,
    stepNumber: '1.1',
    stepName: 'Site Preparation',
    weightage: 15,
    measurementType: 'Quantity',
    lastApprovedValue: 1200,
    lastApprovedUnit: 'SQM',
    pendingValue: 1500,
    newAchievedValue: '1600',
    calculatedCompletion: 80,
    evidence: [],
    existingEvidence: [
      { name: 'foundation-work.jpg', url: '#', type: 'image' },
      { name: 'site-plan.pdf', url: '#', type: 'pdf' },
      { name: 'material-list.xlsx', url: '#', type: 'excel' }
    ],
    totalQty: 2000
  },
  {
    id: 2,
    stepNumber: '1.2',
    stepName: 'Foundation Work',
    weightage: 25,
    measurementType: 'Percentage',
    lastApprovedValue: 45,
    lastApprovedUnit: '%',
    pendingValue: null,
    newAchievedValue: '60',
    calculatedCompletion: 60,
    evidence: [],
    existingEvidence: [
      { name: 'foundation-report.docx', url: '#', type: 'word' }
    ],
    totalQty: 100
  },
  {
    id: 3,
    stepNumber: '1.3',
    stepName: 'Structural Steel Erection',
    weightage: 30,
    measurementType: 'Quantity',
    lastApprovedValue: 1200,
    lastApprovedUnit: 'SQM',
    pendingValue: null,
    newAchievedValue: '1500',
    calculatedCompletion: 75,
    evidence: [],
    existingEvidence: [
      { name: 'steel-frame.jpg', url: '#', type: 'image' },
      { name: 'steel-inspection.pdf', url: '#', type: 'pdf' }
    ],
    totalQty: 2000
  },
  {
    id: 4,
    stepNumber: '1.4',
    stepName: 'Concrete Pouring',
    weightage: 20,
    measurementType: 'Quantity',
    lastApprovedValue: 1000,
    lastApprovedUnit: 'SQM',
    pendingValue: null,
    newAchievedValue: '1400',
    calculatedCompletion: 70,
    evidence: [],
    existingEvidence: [],
    totalQty: 2000
  },
  {
    id: 5,
    stepNumber: '1.5',
    stepName: 'Finishing Works',
    weightage: 10,
    measurementType: 'Percentage',
    lastApprovedValue: 20,
    lastApprovedUnit: '%',
    pendingValue: null,
    newAchievedValue: '35',
    calculatedCompletion: 35,
    evidence: [],
    existingEvidence: [],
    totalQty: 100
  }
];

export default function UpdateProgressWorkspace() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const [searchParams] = useSearchParams();
  const fromSource = searchParams.get('from') || 'details';
  
  const isProgressLocked = projectId === '1';
  const hasVersionInReview = MOCK_VERSION_HISTORY.some(v => v.status === 'In Review');
  
  const [steps, setSteps] = useState<StepData[]>(MOCK_STEP_DATA);
  const [globalStartDate, setGlobalStartDate] = useState('2024-02-01');
  const [globalEndDate, setGlobalEndDate] = useState('2024-02-24');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [expandedVersionSteps, setExpandedVersionSteps] = useState<Set<string>>(new Set());
  const [viewingStepFiles, setViewingStepFiles] = useState<StepData | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showLockedSubmissionModal, setShowLockedSubmissionModal] = useState(false);

  const lastApprovedProgress = steps.reduce((sum, step) => {
    return sum + (step.lastApprovedValue / step.totalQty) * step.weightage;
  }, 0);

  const newDraftProgress = steps.reduce((sum, step) => {
    const newValue = parseFloat(step.newAchievedValue) || 0;
    return sum + (newValue / step.totalQty) * step.weightage;
  }, 0);

  const toggleVersionExpand = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const toggleVersionStepExpand = (versionStep: string) => {
    const newExpanded = new Set(expandedVersionSteps);
    if (newExpanded.has(versionStep)) {
      newExpanded.delete(versionStep);
    } else {
      newExpanded.add(versionStep);
    }
    setExpandedVersionSteps(newExpanded);
  };

  const handleValueChange = (stepId: number, value: string) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            newAchievedValue: value,
            calculatedCompletion: parseFloat(value) ? (parseFloat(value) / step.totalQty) * 100 : 0
          } 
        : step
    ));
  };

  const handleFileUpload = (stepId: number, files: FileList) => {
    const newFiles = Array.from(files);
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, evidence: [...step.evidence, ...newFiles] } 
        : step
    ));
    toast.success(`${newFiles.length} file(s) uploaded successfully`, {
      duration: 2000,
      position: 'top-right'
    });
  };

  const removeExistingEvidence = (stepId: number, fileName: string) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            existingEvidence: step.existingEvidence?.filter(e => e.name !== fileName) 
          } 
        : step
    ));
    toast.success('File removed successfully', {
      duration: 2000,
      position: 'top-right'
    });
  };

  const removeEvidence = (stepId: number, fileIndex: number) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, evidence: step.evidence.filter((_, i) => i !== fileIndex) } 
        : step
    ));
  };

  const getValidationStatus = (step: StepData) => {
    const newValue = parseFloat(step.newAchievedValue) || 0;
    
    if (newValue > step.totalQty) {
      return { type: 'error', message: 'Value exceeds total quantity', blocking: true };
    }
    
    if (newValue < step.lastApprovedValue) {
      return { type: 'error', message: 'Progress cannot decrease from approved value', blocking: true };
    }
    
    return null;
  };

  const getStepStatus = (step: StepData): 'Not started' | 'In progress' | 'Completed' => {
    if (step.calculatedCompletion >= 100) return 'Completed';
    if (step.lastApprovedValue > 0 || parseFloat(step.newAchievedValue) > 0) return 'In progress';
    return 'Not started';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} style={{ color: '#DC2626' }} />;
      case 'excel':
        return <File size={16} style={{ color: '#059669' }} />;
      case 'word':
        return <FileText size={16} style={{ color: '#2563EB' }} />;
      case 'image':
        return <FileText size={16} style={{ color: '#FD4314' }} />;
      default:
        return <File size={16} style={{ color: '#6B7280' }} />;
    }
  };

  const handleSaveDraft = () => {
    toast.success('Progress draft saved successfully', {
      duration: 3000,
      position: 'top-right'
    });
  };

  const handleSubmitForReview = () => {
    const hasBlockingErrors = steps.some(step => {
      const validation = getValidationStatus(step);
      return validation?.blocking;
    });

    if (hasBlockingErrors) {
      toast.error('Please fix all errors before submitting', {
        duration: 4000,
        position: 'top-right'
      });
      return;
    }

    // Check if progress submissions are locked for this project
    if (isProgressLocked) {
      setShowLockedSubmissionModal(true);
    } else {
      // Show confirmation modal before submitting
      setShowSubmitConfirmation(true);
    }
  };

  const confirmSubmitForReview = () => {
    setShowSubmitConfirmation(false);

    toast.success('Progress submitted for review successfully', {
      duration: 3000,
      position: 'top-right'
    });
    navigate(`/app/projects/${projectId}/tasks/${taskId}`);
  };

  const confirmLockedSubmission = () => {
    setShowLockedSubmissionModal(false);

    toast.success('Progress saved as draft', {
      description: 'Submissions are currently locked for this project. Your progress has been saved as draft.',
      duration: 5000,
      position: 'top-right'
    });
    navigate(`/app/projects/${projectId}/tasks/${taskId}`);
  };

  const totalExistingFiles = (step: StepData) => {
    return (step.existingEvidence?.length || 0) + step.evidence.length;
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Page Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E6ED',
        padding: '24px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '13px',
          color: '#5F6B7A',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/app/projects/${projectId}/tasks`)}
          >
            Task Listing
          </span>
          {fromSource === 'details' && (
            <>
              <span>/</span>
              <span 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/app/projects/${projectId}/tasks/${taskId}`)}
              >
                Task Details
              </span>
            </>
          )}
          <span>/</span>
          <span style={{ color: '#272721', fontWeight: '500' }}>Update Progress</span>
        </div>

        {/* Title & Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              Update Progress — PCW Distribution - B1 - T1 - R1.1.1
            </h1>
            <span style={{
              padding: '4px 10px',
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '4px',
              border: '1px solid #D1D5DB'
            }}>
              Draft
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#6B7280'
          }}>
            <span>Version 2.1</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '24px 32px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        {/* Progress Lock Warning Banner */}
        {isProgressLocked && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
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

        {/* Warning Banner for Pending Review */}
        {hasVersionInReview && (
          <div style={{
            backgroundColor: '#FFF4ED',
            border: '1px solid #FD4314',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} style={{ color: '#FD4314', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#7C2D12',
                margin: '0'
              }}>
                One version of progress update for this task is currently under review. Submitting new progress will supersede that version.
              </p>
            </div>
          </div>
        )}

        {/* Task Progress Overview */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E6ED',
          borderRadius: '6px',
          padding: '20px 24px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 16px 0'
          }}>
            Task Progress Overview
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '13px'
              }}>
                <span style={{ color: '#6B7280' }}>
                  Last Approved: <strong style={{ color: '#272721' }}>{lastApprovedProgress.toFixed(1)}%</strong>
                </span>
                <span style={{ color: '#272721', fontWeight: '600' }}>
                  New Draft: <strong style={{ color: '#FD4314' }}>{newDraftProgress.toFixed(1)}%</strong>
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                position: 'relative',
                height: '24px',
                backgroundColor: '#F3F4F6',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${lastApprovedProgress}%`,
                  backgroundColor: '#9CA3AF',
                  transition: 'width 0.3s ease'
                }} />
                
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${newDraftProgress}%`,
                  backgroundColor: '#FD4314',
                  opacity: 0.8,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step Progress Workspace */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          {/* Header with Version History Icon */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #C8D9EE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#272721',
              margin: 0
            }}>
              Step Progress Workspace
            </h3>
            <button
              onClick={() => setShowVersionHistory(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
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
              <Clock size={14} />
              Version History
            </button>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div style={{ overflowX: 'auto' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 200px 80px 120px 100px 120px 100px 140px 100px 180px 120px',
              padding: '12px 24px',
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              minWidth: '1350px'
            }}>
              <div style={{ paddingRight: '12px' }}>Step #</div>
              <div style={{ paddingRight: '12px' }}>Step Name</div>
              <div style={{ textAlign: 'center', paddingRight: '12px' }}>Weight %</div>
              <div style={{ paddingRight: '12px' }}>Type</div>
              <div style={{ textAlign: 'center', paddingRight: '12px' }}>Total</div>
              <div style={{ textAlign: 'center', paddingRight: '12px' }}>Last Approved</div>
              <div style={{ textAlign: 'center', paddingRight: '12px' }}>Pending</div>
              <div style={{ paddingRight: '12px' }}>New Value</div>
              <div style={{ paddingRight: '12px' }}>Completion %</div>
              <div style={{ paddingRight: '12px' }}>Evidence</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            {steps.map((step, index) => {
              const validation = getValidationStatus(step);
              const isCompleted = step.calculatedCompletion >= 100;
              const status = getStepStatus(step);

              return (
                <div key={step.id}>
                  {/* Main Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 200px 80px 120px 100px 120px 100px 140px 100px 180px 120px',
                      padding: '16px 24px',
                      borderBottom: '1px solid #C8D9EE',
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                      alignItems: 'center',
                      fontSize: '13px',
                      opacity: isCompleted ? 0.6 : 1,
                      minWidth: '1350px'
                    }}
                  >
                    <div style={{
                      color: '#272721',
                      fontWeight: '500',
                      paddingRight: '12px'
                    }}>
                      {step.stepNumber}
                    </div>
                    <div style={{ color: '#272721', fontWeight: '500', paddingRight: '12px' }}>{step.stepName}</div>
                    <div style={{ color: '#5F6B7A', textAlign: 'center', paddingRight: '12px' }}>{step.weightage}%</div>
                    <div style={{ color: '#5F6B7A', paddingRight: '12px' }}>{step.measurementType}</div>
                    <div style={{ color: '#272721', fontWeight: '500', textAlign: 'center', paddingRight: '12px' }}>
                      {step.measurementType === 'Percentage' ? '–' : `${step.totalQty} ${step.lastApprovedUnit}`}
                    </div>
                    <div style={{ color: '#272721', fontWeight: '500', textAlign: 'center', paddingRight: '12px' }}>
                      {step.lastApprovedValue}
                    </div>
                    <div style={{ color: step.pendingValue ? '#F59E0B' : '#9CA3AF', fontWeight: '500', textAlign: 'center', paddingRight: '12px' }}>
                      {step.pendingValue || '–'}
                    </div>
                    <div style={{ paddingRight: '12px' }}>
                      <input
                        type="number"
                        value={step.newAchievedValue}
                        onChange={(e) => handleValueChange(step.id, e.target.value)}
                        disabled={isCompleted}
                        style={{
                          width: '100%',
                          height: '32px',
                          padding: '0 8px',
                          border: `1px solid ${validation?.blocking ? '#DC2626' : '#D8DEE8'}`,
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: 'transparent',
                          outline: 'none',
                          cursor: isCompleted ? 'not-allowed' : 'text',
                          opacity: isCompleted ? 0.5 : 1
                        }}
                      />
                    </div>
                    <div style={{ paddingRight: '12px' }}>
                      {/* Mini Progress Bar */}
                      <div style={{
                        position: 'relative',
                        height: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${(step.lastApprovedValue / step.totalQty) * 100}%`,
                          backgroundColor: '#9CA3AF'
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${step.calculatedCompletion}%`,
                          backgroundColor: '#FD4314',
                          opacity: 0.8
                        }} />
                        <span style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          {step.calculatedCompletion.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ paddingRight: '12px' }}>
                      {/* Evidence Section - NEW DESIGN: Attached Files & Upload Buttons */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: totalExistingFiles(step) === 0 ? 'center' : 'flex-start' }}>
                        {totalExistingFiles(step) > 0 && (
                          <button
                            onClick={() => setViewingStepFiles(step)}
                            style={{
                              width: '75px',
                              padding: '4px 8px',
                              border: '1px solid #D8DEE8',
                              backgroundColor: 'transparent',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#272721',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <File size={12} />
                            {`${totalExistingFiles(step)} File${totalExistingFiles(step) > 1 ? 's' : ''}`}
                          </button>
                        )}
                        
                        <label style={{
                          padding: '4px 8px',
                          border: '1px solid #FD4314',
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#FD4314',
                          cursor: isCompleted ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          pointerEvents: isCompleted ? 'none' : 'auto',
                          opacity: isCompleted ? 0.5 : 1
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
                          <input
                            type="file"
                            multiple
                            disabled={isCompleted}
                            onChange={(e) => e.target.files && handleFileUpload(step.id, e.target.files)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: 
                          status === 'Completed' ? '#D1FAE5' : 
                          status === 'In progress' ? '#FEF3C7' : 
                          '#FEE2E2',
                        color: 
                          status === 'Completed' ? '#065F46' : 
                          status === 'In progress' ? '#92400E' : 
                          '#991B1B',
                        fontSize: '11px',
                        fontWeight: '500',
                        borderRadius: '12px'
                      }}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Preview (if any newly uploaded) */}
                  {step.evidence.length > 0 && (
                    <div style={{
                      padding: '12px 24px',
                      backgroundColor: '#F9FAFB',
                      borderBottom: '1px solid #C8D9EE',
                      minWidth: '1320px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#5F6B7A',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        Newly Uploaded (Draft):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {step.evidence.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D8DEE8',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: '#272721'
                            }}
                          >
                            {file.name}
                            <X
                              size={14}
                              style={{ cursor: 'pointer', color: '#DC2626' }}
                              onClick={() => removeEvidence(step.id, fileIndex)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Message (if any) */}
                  {validation && (
                    <div style={{
                      padding: '12px 24px',
                      backgroundColor: '#FEE2E2',
                      borderBottom: '1px solid #C8D9EE',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '1320px'
                    }}>
                      <AlertCircle
                        size={16}
                        style={{ color: '#DC2626', flexShrink: 0 }}
                      />
                      <div style={{
                        fontSize: '12px',
                        color: '#991B1B'
                      }}>
                        {validation.message}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E6ED',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <button
          onClick={() => navigate(`/app/projects/${projectId}/tasks/${taskId}`)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#272721',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          Cancel
        </button>

        <div style={{
          fontSize: '12px',
          color: '#6B7280',
          fontStyle: 'italic'
        }}>
          Submission creates a new version for approval
        </div>

        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
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
              color: '#272721',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Save as Draft
          </button>

          <button
            onClick={handleSubmitForReview}
            style={{
              height: '40px',
              padding: '0 24px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E03A12'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Submit for Review
          </button>
        </div>
      </div>

      {/* Version History Modal with Accordion */}
      {showVersionHistory && (
        <div
          onClick={() => setShowVersionHistory(false)}
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
              width: '1100px',
              maxWidth: '95%',
              maxHeight: '85vh',
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
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Version History
              </h2>
              <button
                onClick={() => setShowVersionHistory(false)}
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

            {/* Modal Content - Table View */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 100px 100px 150px 200px 150px 80px',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: '#E4EEF8',
                borderBottom: '1px solid #C8D9EE',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721',
                alignItems: 'center'
              }}>
                <div></div>
                <div>Version</div>
                <div>Progress</div>
                <div>Status</div>
                <div>Submitted By</div>
                <div>Date</div>
                <div>Steps</div>
              </div>

              {/* Table Body */}
              {MOCK_VERSION_HISTORY.map((version, versionIndex) => {
                const isExpanded = expandedVersions.has(version.version);
                
                return (
                  <div 
                    key={version.version}
                    style={{
                      borderBottom: '1px solid #E2E6ED'
                    }}
                  >
                    {/* Version Summary Row */}
                    <div
                      onClick={() => toggleVersionExpand(version.version)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 100px 100px 150px 200px 150px 80px',
                        gap: '12px',
                        padding: '14px 24px',
                        backgroundColor: versionIndex % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        cursor: 'pointer',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#272721',
                        minHeight: '52px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F6FA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = versionIndex % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
                    >
                      <div>
                        {isExpanded ? (
                          <ChevronDown size={18} style={{ color: '#6B7280' }} />
                        ) : (
                          <ChevronRight size={18} style={{ color: '#6B7280' }} />
                        )}
                      </div>
                      <div style={{ fontWeight: '600' }}>
                        {version.version}
                      </div>
                      <div style={{ fontWeight: '600', color: '#FD4314' }}>
                        {version.progress}%
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: 
                            version.status === 'Approved' ? '#D1FAE5' : 
                            version.status === 'In Review' ? '#FEF3C7' : 
                            '#FEE2E2',
                          color: 
                            version.status === 'Approved' ? '#065F46' : 
                            version.status === 'In Review' ? '#92400E' : 
                            '#991B1B',
                          fontSize: '11px',
                          fontWeight: '500',
                          borderRadius: '12px'
                        }}>
                          {version.status}
                        </span>
                      </div>
                      <div>
                        {version.submittedBy}
                      </div>
                      <div style={{ color: '#5F6B7A' }}>
                        {version.date}
                      </div>
                      <div style={{ color: '#6B7280', fontWeight: '500' }}>
                        {version.steps.length}
                      </div>
                    </div>

                    {/* Expanded Step Details - Nested Table */}
                    {isExpanded && (
                      <div style={{
                        backgroundColor: '#F9FAFB',
                        borderTop: '1px solid #E2E6ED'
                      }}>
                        {/* Nested Table Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '40px 80px minmax(200px, 1fr) 120px 100px 150px',
                          gap: '12px',
                          padding: '10px 24px 10px 80px',
                          backgroundColor: '#E8EDF3',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#5F6B7A',
                          alignItems: 'center'
                        }}>
                          <div></div>
                          <div>Step</div>
                          <div>Step Name</div>
                          <div>Measurement</div>
                          <div>Progress</div>
                          <div>Evidence</div>
                        </div>

                        {/* Nested Table Rows - Steps */}
                        {version.steps.map((step, stepIndex) => {
                          const stepKey = `${version.version}-${stepIndex}`;
                          const isStepExpanded = expandedVersionSteps.has(stepKey);
                          
                          return (
                            <div key={stepIndex}>
                              {/* Step Row */}
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '40px 80px minmax(200px, 1fr) 120px 100px 150px',
                                  gap: '12px',
                                  padding: '12px 24px 12px 80px',
                                  backgroundColor: stepIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                                  borderBottom: '1px solid #E5E7EB',
                                  fontSize: '13px',
                                  color: '#272721',
                                  alignItems: 'center',
                                  minHeight: '52px'
                                }}
                              >
                                <div>
                                  {step.evidences.length > 0 && (
                                    <button
                                      onClick={() => toggleVersionStepExpand(stepKey)}
                                      style={{
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#6B7280'
                                      }}
                                    >
                                      {isStepExpanded ? (
                                        <ChevronDown size={16} />
                                      ) : (
                                        <ChevronRight size={16} />
                                      )}
                                    </button>
                                  )}
                                </div>
                                <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                  {step.stepNumber}
                                </div>
                                <div>
                                  {step.stepName}
                                </div>
                                <div style={{ color: '#6B7280' }}>
                                  {step.unit}
                                </div>
                                <div style={{ fontWeight: '600', color: '#FD4314' }}>
                                  {step.progressValue} {step.unit}
                                </div>
                                <div>
                                  {step.evidences.length > 0 ? (
                                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                      {step.evidences.length} {step.evidences.length === 1 ? 'file' : 'files'}
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                                      No files
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Evidence Section - Nested within Step */}
                              {isStepExpanded && step.evidences.length > 0 && (
                                <div style={{
                                  padding: '12px 24px 12px 136px',
                                  backgroundColor: '#F3F6FA',
                                  borderBottom: '1px solid #E5E7EB'
                                }}>
                                  <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#6B7280',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    Attached Evidence
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {step.evidences.map((file, fileIdx) => (
                                      <div
                                        key={fileIdx}
                                        style={{
                                          padding: '8px 12px',
                                          backgroundColor: '#FFFFFF',
                                          border: '1px solid #E2E6ED',
                                          borderRadius: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                          {getFileIcon(file.type)}
                                          <span style={{ fontSize: '12px', color: '#272721' }}>
                                            {file.name}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            toast.success('File download started', { duration: 2000, position: 'top-right' });
                                          }}
                                          style={{
                                            padding: '4px 10px',
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
                                          <Download size={12} />
                                          Download
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step Files Popup (Attached Files from Workspace Table) */}
      {viewingStepFiles && (
        <div
          onClick={() => setViewingStepFiles(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1100,
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
              width: '600px',
              maxWidth: '90%',
              maxHeight: '70vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Popup Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                  Attached Files
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  {viewingStepFiles.stepNumber} - {viewingStepFiles.stepName}
                </p>
              </div>
              <button
                onClick={() => setViewingStepFiles(null)}
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
              {viewingStepFiles.existingEvidence && viewingStepFiles.existingEvidence.length > 0 && (
                <>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                    Approved Evidence
                  </div>
                  {viewingStepFiles.existingEvidence.map((file, idx) => (
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
                          onClick={() => removeExistingEvidence(viewingStepFiles.id, file.name)}
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
              {viewingStepFiles.evidence.length > 0 && (
                <>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginTop: viewingStepFiles.existingEvidence && viewingStepFiles.existingEvidence.length > 0 ? '16px' : '0', marginBottom: '8px' }}>
                    Newly Uploaded (Draft)
                  </div>
                  {viewingStepFiles.evidence.map((file, idx) => (
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
                        <File size={16} style={{ color: '#FD4314' }} />
                        <span style={{ fontSize: '13px', color: '#272721', fontWeight: '500' }}>
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          removeEvidence(viewingStepFiles.id, idx);
                          // Update the viewing state
                          setViewingStepFiles({
                            ...viewingStepFiles,
                            evidence: viewingStepFiles.evidence.filter((_, i) => i !== idx)
                          });
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

              {totalExistingFiles(viewingStepFiles) === 0 && (
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
                onClick={() => setViewingStepFiles(null)}
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
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div
          onClick={() => setShowSubmitConfirmation(false)}
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
              width: '480px',
              maxWidth: '95%',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Confirm Submission
              </h2>
            </div>

            {/* Modal Body */}
            <div style={{
              padding: '24px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                margin: 0
              }}>
                By submitting this progress update, the version currently in review will be superseded. Do you want to proceed?
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowSubmitConfirmation(false)}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
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
                onClick={confirmSubmitForReview}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E03A12'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Yes, Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Submission Modal */}
      {showLockedSubmissionModal && (
        <div
          onClick={() => setShowLockedSubmissionModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
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
              width: '520px',
              maxWidth: '95%',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Progress Submissions Locked
              </h2>
            </div>

            {/* Modal Body */}
            <div style={{
              padding: '24px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                margin: 0
              }}>
                Progress submissions for project <strong>PRJ-2026-001 "North Terminal Expansion"</strong> are currently locked. Your progress will be saved as a draft and you will need to submit it again once submissions are reopened.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowLockedSubmissionModal(false)}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
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
                onClick={confirmLockedSubmission}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E03A12'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

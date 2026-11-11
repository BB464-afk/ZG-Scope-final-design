import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { AlertCircle, Upload, X, ChevronDown, ChevronRight, Clock, Download, File, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EvidenceFile {
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'excel' | 'word' | 'document';
}

interface SubStepData {
  id: number;
  subStepName: string;
  weightage: number;
  lastApprovedValue: number;
  newAchievedValue: string;
  calculatedCompletion: number;
  evidence: File[];
  existingEvidence?: EvidenceFile[];
  pendingValue: number | null;
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
  hasSubSteps: boolean;
  subSteps?: SubStepData[];
  isExpanded?: boolean;
}

interface VersionStepDetail {
  stepNumber: string;
  stepName: string;
  progressValue: number;
  unit: string;
  evidences: EvidenceFile[];
  hasSubSteps?: boolean;
  subSteps?: {
    subStepNumber: string;
    subStepName: string;
    progressValue: number;
    evidences: EvidenceFile[];
  }[];
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
    version: 'V3', 
    progress: 68, 
    status: 'In Review', 
    submittedBy: 'Sarah Chen', 
    date: '03 Mar 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 1500, 
        unit: 'SQM',
        evidences: [
          { name: 'site-prep-v3.jpg', url: '#', type: 'image' },
          { name: 'site-report-v3.pdf', url: '#', type: 'pdf' }
        ]
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 0, 
        unit: '—',
        evidences: [],
        hasSubSteps: true,
        subSteps: [
          {
            subStepNumber: '1.2.1',
            subStepName: 'Excavation & Earthwork',
            progressValue: 55,
            evidences: [
              { name: 'excavation-v3.pdf', url: '#', type: 'pdf' },
              { name: 'earthwork-v3.jpg', url: '#', type: 'image' }
            ]
          },
          {
            subStepNumber: '1.2.2',
            subStepName: 'Reinforcement Installation',
            progressValue: 50,
            evidences: [
              { name: 'reinforcement-v3.xlsx', url: '#', type: 'excel' }
            ]
          },
          {
            subStepNumber: '1.2.3',
            subStepName: 'Formwork Setup',
            progressValue: 35,
            evidences: []
          }
        ]
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 1500, 
        unit: 'Meter',
        evidences: [
          { name: 'steel-erection-v3.jpg', url: '#', type: 'image' }
        ]
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 65, 
        unit: '%',
        evidences: []
      },
      { 
        stepNumber: '1.5', 
        stepName: 'Finishing Works', 
        progressValue: 40, 
        unit: '%',
        evidences: [
          { name: 'finishing-inspection-v3.pdf', url: '#', type: 'pdf' }
        ]
      }
    ]
  },
  { 
    version: 'V2', 
    progress: 52, 
    status: 'Approved', 
    submittedBy: 'John Martinez', 
    date: '01 Mar 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 1200, 
        unit: 'SQM',
        evidences: [
          { name: 'site-v2-photo1.jpg', url: '#', type: 'image' },
          { name: 'site-v2-photo2.jpg', url: '#', type: 'image' }
        ]
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 0, 
        unit: '—',
        evidences: [],
        hasSubSteps: true,
        subSteps: [
          {
            subStepNumber: '1.2.1',
            subStepName: 'Excavation & Earthwork',
            progressValue: 45,
            evidences: [
              { name: 'excavation-v2.docx', url: '#', type: 'word' }
            ]
          },
          {
            subStepNumber: '1.2.2',
            subStepName: 'Reinforcement Installation',
            progressValue: 38,
            evidences: []
          },
          {
            subStepNumber: '1.2.3',
            subStepName: 'Formwork Setup',
            progressValue: 25,
            evidences: [
              { name: 'formwork-v2.pdf', url: '#', type: 'pdf' }
            ]
          }
        ]
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 1200, 
        unit: 'Meter',
        evidences: []
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 45, 
        unit: '%',
        evidences: []
      },
      { 
        stepNumber: '1.5', 
        stepName: 'Finishing Works', 
        progressValue: 25, 
        unit: '%',
        evidences: []
      }
    ]
  },
  { 
    version: 'V1', 
    progress: 28, 
    status: 'Approved', 
    submittedBy: 'John Martinez', 
    date: '25 Feb 2026',
    steps: [
      { 
        stepNumber: '1.1', 
        stepName: 'Site Preparation', 
        progressValue: 800, 
        unit: 'SQM',
        evidences: []
      },
      { 
        stepNumber: '1.2', 
        stepName: 'Foundation Work', 
        progressValue: 0, 
        unit: '—',
        evidences: [],
        hasSubSteps: true,
        subSteps: [
          {
            subStepNumber: '1.2.1',
            subStepName: 'Excavation & Earthwork',
            progressValue: 25,
            evidences: []
          },
          {
            subStepNumber: '1.2.2',
            subStepName: 'Reinforcement Installation',
            progressValue: 18,
            evidences: []
          },
          {
            subStepNumber: '1.2.3',
            subStepName: 'Formwork Setup',
            progressValue: 12,
            evidences: []
          }
        ]
      },
      { 
        stepNumber: '1.3', 
        stepName: 'Structural Steel Erection', 
        progressValue: 800, 
        unit: 'Meter',
        evidences: []
      },
      { 
        stepNumber: '1.4', 
        stepName: 'Concrete Pouring', 
        progressValue: 15, 
        unit: '%',
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
    newAchievedValue: '1500',
    calculatedCompletion: 75,
    evidence: [],
    existingEvidence: [
      { name: 'site-plan.pdf', url: '#', type: 'pdf' },
      { name: 'excavation-photo.jpg', url: '#', type: 'image' }
    ],
    totalQty: 2000,
    hasSubSteps: false
  },
  {
    id: 2,
    stepNumber: '1.2',
    stepName: 'Foundation Work',
    weightage: 25,
    measurementType: 'Percentage',
    lastApprovedValue: 0,
    lastApprovedUnit: '%',
    pendingValue: null,
    newAchievedValue: '',
    calculatedCompletion: 0,
    evidence: [],
    existingEvidence: [],
    totalQty: 100,
    hasSubSteps: true,
    isExpanded: false,
    subSteps: [
      {
        id: 1,
        subStepName: 'Excavation & Earthwork',
        weightage: 40,
        lastApprovedValue: 30,
        pendingValue: null,
        newAchievedValue: '50',
        calculatedCompletion: 50,
        evidence: [],
        existingEvidence: [
          { name: 'excavation-report.pdf', url: '#', type: 'pdf' }
        ]
      },
      {
        id: 2,
        subStepName: 'Reinforcement Installation',
        weightage: 35,
        lastApprovedValue: 20,
        pendingValue: null,
        newAchievedValue: '45',
        calculatedCompletion: 45,
        evidence: [],
        existingEvidence: []
      },
      {
        id: 3,
        subStepName: 'Formwork Setup',
        weightage: 25,
        lastApprovedValue: 15,
        pendingValue: 25,
        newAchievedValue: '30',
        calculatedCompletion: 30,
        evidence: [],
        existingEvidence: [
          { name: 'formwork-inspection.xlsx', url: '#', type: 'excel' }
        ]
      }
    ]
  },
  {
    id: 3,
    stepNumber: '1.3',
    stepName: 'Structural Steel Erection',
    weightage: 30,
    measurementType: 'Quantity',
    lastApprovedValue: 500,
    lastApprovedUnit: 'Meter',
    pendingValue: null,
    newAchievedValue: '1500',
    calculatedCompletion: 75,
    evidence: [],
    existingEvidence: [
      { name: 'steel-frame.jpg', url: '#', type: 'image' },
      { name: 'steel-inspection.pdf', url: '#', type: 'pdf' }
    ],
    totalQty: 2000,
    hasSubSteps: false
  },
  {
    id: 4,
    stepNumber: '1.4',
    stepName: 'Concrete Pouring',
    weightage: 20,
    measurementType: 'Percentage',
    lastApprovedValue: 45,
    lastApprovedUnit: '%',
    pendingValue: null,
    newAchievedValue: '60',
    calculatedCompletion: 60,
    evidence: [],
    existingEvidence: [],
    totalQty: 100,
    hasSubSteps: false
  },
  {
    id: 5,
    stepNumber: '1.5',
    stepName: 'Finishing Works',
    weightage: 10,
    measurementType: 'Percentage',
    lastApprovedValue: 25,
    lastApprovedUnit: '%',
    pendingValue: null,
    newAchievedValue: '35',
    calculatedCompletion: 35,
    evidence: [],
    existingEvidence: [],
    totalQty: 100,
    hasSubSteps: false
  }
];

export default function UpdateProgressWorkspaceSubsteps() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const [searchParams] = useSearchParams();
  const fromSource = searchParams.get('from') || 'details';
  
  const isProgressLocked = projectId === '1';
  const hasVersionInReview = MOCK_VERSION_HISTORY.some(v => v.status === 'In Review');
  
  // Calculate next version number (integer only)
  const getNextVersionNumber = () => {
    if (MOCK_VERSION_HISTORY.length === 0) return 1;
    const lastVersion = MOCK_VERSION_HISTORY[0].version; // V3, V2, V1, etc.
    const versionNumber = parseInt(lastVersion.substring(1)); // Extract number from "V3" -> 3
    return versionNumber + 1;
  };
  const nextVersion = getNextVersionNumber();
  
  const [steps, setSteps] = useState<StepData[]>(MOCK_STEP_DATA);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [expandedVersionSteps, setExpandedVersionSteps] = useState<Set<string>>(new Set());
  const [viewingStepFiles, setViewingStepFiles] = useState<{ step: StepData, subStep?: SubStepData } | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showLockedSubmissionModal, setShowLockedSubmissionModal] = useState(false);

  const lastApprovedProgress = steps.reduce((sum, step) => {
    if (step.hasSubSteps && step.subSteps) {
      const subStepProgress = step.subSteps.reduce((subSum, subStep) => 
        subSum + (subStep.lastApprovedValue / 100) * subStep.weightage, 0
      );
      return sum + (subStepProgress / 100) * step.weightage;
    }
    return sum + (step.lastApprovedValue / step.totalQty) * step.weightage;
  }, 0);

  const newDraftProgress = steps.reduce((sum, step) => {
    if (step.hasSubSteps && step.subSteps) {
      const subStepProgress = step.subSteps.reduce((subSum, subStep) => {
        const newValue = parseFloat(subStep.newAchievedValue) || 0;
        return subSum + (newValue / 100) * subStep.weightage;
      }, 0);
      return sum + (subStepProgress / 100) * step.weightage;
    }
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

  const toggleStepExpansion = (stepId: number) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, isExpanded: !step.isExpanded } 
        : step
    ));
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

  const handleSubStepValueChange = (stepId: number, subStepId: number, value: string) => {
    setSteps(steps.map(step =>
      step.id === stepId && step.subSteps
        ? {
            ...step,
            subSteps: step.subSteps.map(subStep =>
              subStep.id === subStepId
                ? {
                    ...subStep,
                    newAchievedValue: value,
                    calculatedCompletion: parseFloat(value) || 0
                  }
                : subStep
            )
          }
        : step
    ));
  };

  const handleFileUpload = (stepId: number, files: FileList, subStepId?: number) => {
    const newFiles = Array.from(files);
    
    if (subStepId !== undefined) {
      setSteps(steps.map(step => 
        step.id === stepId && step.subSteps
          ? {
              ...step,
              subSteps: step.subSteps.map(subStep =>
                subStep.id === subStepId
                  ? { ...subStep, evidence: [...subStep.evidence, ...newFiles] }
                  : subStep
              )
            }
          : step
      ));
    } else {
      setSteps(steps.map(step => 
        step.id === stepId 
          ? { ...step, evidence: [...step.evidence, ...newFiles] } 
          : step
      ));
    }
    toast.success(`${newFiles.length} file(s) uploaded successfully`, {
      duration: 2000,
      position: 'top-right'
    });
  };

  const removeExistingEvidence = (stepId: number, fileName: string, subStepId?: number) => {
    if (subStepId !== undefined) {
      setSteps(steps.map(step => 
        step.id === stepId && step.subSteps
          ? {
              ...step,
              subSteps: step.subSteps.map(subStep =>
                subStep.id === subStepId
                  ? { ...subStep, existingEvidence: subStep.existingEvidence?.filter(e => e.name !== fileName) }
                  : subStep
              )
            }
          : step
      ));
    } else {
      setSteps(steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              existingEvidence: step.existingEvidence?.filter(e => e.name !== fileName) 
            } 
          : step
      ));
    }
    toast.success('File removed successfully', {
      duration: 2000,
      position: 'top-right'
    });
  };

  const removeEvidence = (stepId: number, fileIndex: number, subStepId?: number) => {
    if (subStepId !== undefined) {
      setSteps(steps.map(step => 
        step.id === stepId && step.subSteps
          ? {
              ...step,
              subSteps: step.subSteps.map(subStep =>
                subStep.id === subStepId
                  ? { ...subStep, evidence: subStep.evidence.filter((_, i) => i !== fileIndex) }
                  : subStep
              )
            }
          : step
      ));
    } else {
      setSteps(steps.map(step => 
        step.id === stepId 
          ? { ...step, evidence: step.evidence.filter((_, i) => i !== fileIndex) } 
          : step
      ));
    }
  };

  const getStepStatus = (completion: number, lastApproved: number, newValue: string): 'Not started' | 'In progress' | 'Completed' => {
    // Status should only be "Completed" when the entire task is approved (not when step reaches 100%)
    // When submitted for review, status is "In Progress"
    if (lastApproved > 0 || parseFloat(newValue) > 0) return 'In progress';
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

  const totalExistingFiles = (step: StepData | SubStepData) => {
    return (step.existingEvidence?.length || 0) + step.evidence.length;
  };

  const handleSaveDraft = () => {
    toast.success('Progress draft saved successfully', {
      duration: 3000,
      position: 'top-right'
    });
  };

  const handleSubmitForReview = () => {
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

  // Optimized grid columns to avoid horizontal scroll - reduced accordion column
  const gridColumns = '32px 80px 200px 70px 90px 90px 110px 90px 120px 100px 150px 110px';

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      minHeight: '100vh'
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
              Update Progress — HVAC Installation – L2 – Zone B
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
            <span>Version {nextVersion}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '24px 32px',
        maxWidth: '1400px',
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

          <div style={{ overflowX: 'auto' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: gridColumns,
              gap: '0px',
              padding: '12px 24px',
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721'
            }}>
              <div style={{ paddingRight: '4px' }}></div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>Step #</div>
              <div style={{ paddingRight: '4px' }}>Step Name</div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>Wt %</div>
              <div style={{ paddingRight: '4px' }}>Type</div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>Total</div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>Approved</div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>Pending</div>
              <div style={{ paddingRight: '4px' }}>New Value</div>
              <div style={{ textAlign: 'center', paddingRight: '4px' }}>% Done</div>
              <div style={{ paddingRight: '4px' }}>Evidence</div>
              <div style={{ textAlign: 'center' }}>Status</div>
            </div>

            {/* Table Rows */}
            {steps.map((step, index) => {
              let status: 'Not started' | 'In progress' | 'Completed';
              if (step.hasSubSteps && step.subSteps) {
                const avgCompletion = step.subSteps.reduce((sum, sub) => sum + sub.calculatedCompletion * sub.weightage / 100, 0);
                if (avgCompletion >= 100) {
                  status = 'Completed';
                } else if (avgCompletion > 0 || step.subSteps.some(sub => parseFloat(sub.newAchievedValue) > 0 || sub.lastApprovedValue > 0)) {
                  status = 'In progress';
                } else {
                  status = 'Not started';
                }
              } else {
                status = getStepStatus(step.calculatedCompletion, step.lastApprovedValue, step.newAchievedValue);
              }

              const isCompleted = status === 'Completed';

              return (
                <div key={step.id}>
                  {/* Main Step Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    gap: '0px',
                    padding: '16px 24px',
                    borderBottom: step.hasSubSteps && step.isExpanded ? 'none' : '1px solid #C8D9EE',
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                    alignItems: 'center',
                    opacity: isCompleted ? 0.6 : 1
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '8px' }}>
                      {step.hasSubSteps && (
                        <button
                          onClick={() => toggleStepExpansion(step.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6B7280'
                          }}
                        >
                          {step.isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      )}
                    </div>

                    <div style={{ fontSize: '13px', color: '#272721', fontWeight: '600', textAlign: 'center', paddingRight: '8px' }}>
                      {step.stepNumber}
                    </div>

                    <div style={{ fontSize: '13px', color: '#272721', fontWeight: '500', paddingRight: '8px' }}>
                      {step.stepName}
                    </div>

                    <div style={{ fontSize: '13px', color: '#5F6B7A', textAlign: 'center', paddingRight: '8px' }}>
                      {step.weightage}%
                    </div>

                    <div style={{ fontSize: '13px', color: '#5F6B7A', paddingRight: '8px' }}>
                      {step.measurementType}
                    </div>

                    <div style={{ fontSize: '13px', color: '#272721', fontWeight: '500', textAlign: 'center', paddingRight: '8px' }}>
                      {step.hasSubSteps ? '—' : (step.measurementType === 'Percentage' ? '–' : `${step.totalQty} ${step.lastApprovedUnit}`)}
                    </div>

                    <div style={{ fontSize: '13px', color: '#272721', fontWeight: '500', textAlign: 'center', paddingRight: '8px' }}>
                      {step.hasSubSteps ? '—' : step.lastApprovedValue}
                    </div>

                    <div style={{ color: step.pendingValue ? '#F59E0B' : '#9CA3AF', fontWeight: '500', textAlign: 'center', paddingRight: '8px', fontSize: '13px' }}>
                      {step.hasSubSteps ? '—' : (step.pendingValue || '–')}
                    </div>

                    <div style={{ paddingRight: '8px' }}>
                      {step.hasSubSteps ? (
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                      ) : (
                        <input
                          type="number"
                          value={step.newAchievedValue}
                          onChange={(e) => handleValueChange(step.id, e.target.value)}
                          disabled={isCompleted}
                          placeholder={`0 ${step.lastApprovedUnit}`}
                          style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 8px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '4px',
                            fontSize: '13px',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            cursor: isCompleted ? 'not-allowed' : 'text',
                            opacity: isCompleted ? 0.5 : 1
                          }}
                        />
                      )}
                    </div>

                    <div style={{ paddingRight: '8px' }}>
                      {step.hasSubSteps ? (
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                      ) : (
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
                      )}
                    </div>

                    <div style={{ paddingRight: '8px' }}>
                      {step.hasSubSteps ? (
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: totalExistingFiles(step) === 0 ? 'center' : 'flex-start' }}>
                          {totalExistingFiles(step) > 0 && (
                            <button
                              onClick={() => setViewingStepFiles({ step })}
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
                                gap: '4px',
                                whiteSpace: 'nowrap'
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
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: 
                          status === 'Completed' ? '#D1FAE5' :
                          status === 'In progress' ? '#FEF3C7' : '#FEE2E2',
                        color: 
                          status === 'Completed' ? '#065F46' :
                          status === 'In progress' ? '#92400E' : '#991B1B',
                        fontSize: '11px',
                        fontWeight: '500',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap'
                      }}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Preview for Main Step */}
                  {!step.hasSubSteps && step.evidence.length > 0 && (
                    <div style={{
                      padding: '12px 24px',
                      backgroundColor: '#F9FAFB',
                      borderBottom: '1px solid #C8D9EE'
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

                  {/* Sub-Steps */}
                  {step.hasSubSteps && step.isExpanded && step.subSteps && step.subSteps.map((subStep, subIndex) => {
                    const subStatus = getStepStatus(subStep.calculatedCompletion, subStep.lastApprovedValue, subStep.newAchievedValue);
                    const isSubCompleted = subStatus === 'Completed';

                    return (
                      <div key={subStep.id}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: gridColumns,
                            gap: '0px',
                            padding: '16px 24px',
                            borderBottom: subIndex === step.subSteps!.length - 1 && subStep.evidence.length === 0 ? '1px solid #C8D9EE' : 'none',
                            backgroundColor: '#F9FAFB',
                            alignItems: 'center',
                            opacity: isSubCompleted ? 0.6 : 1
                          }}
                        >
                          <div style={{ paddingRight: '8px' }}></div>

                          <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500', textAlign: 'center', paddingRight: '8px' }}>
                            {step.stepNumber}.{subStep.id}
                          </div>

                          <div style={{ fontSize: '13px', color: '#272721', paddingRight: '8px' }}>
                            {subStep.subStepName}
                          </div>

                          <div style={{ fontSize: '13px', color: '#272721', textAlign: 'center', paddingRight: '8px' }}>
                            {subStep.weightage}%
                          </div>

                          <div style={{ fontSize: '13px', color: '#9CA3AF', paddingRight: '8px' }}>
                            —
                          </div>

                          <div style={{ fontSize: '13px', color: '#272721', textAlign: 'center', paddingRight: '8px' }}>
                            100 %
                          </div>

                          <div style={{ fontSize: '13px', color: '#272721', fontWeight: '500', textAlign: 'center', paddingRight: '8px' }}>
                            {subStep.lastApprovedValue} %
                          </div>

                          <div style={{ color: subStep.pendingValue ? '#F59E0B' : '#9CA3AF', fontWeight: '500', textAlign: 'center', paddingRight: '8px', fontSize: '13px' }}>
                            {subStep.pendingValue || '–'}
                          </div>

                          <div style={{ paddingRight: '8px' }}>
                            <input
                              type="number"
                              value={subStep.newAchievedValue}
                              onChange={(e) => handleSubStepValueChange(step.id, subStep.id, e.target.value)}
                              disabled={isSubCompleted}
                              placeholder="0 %"
                              max="100"
                              style={{
                                width: '100%',
                                height: '32px',
                                padding: '0 8px',
                                border: '1px solid #D8DEE8',
                                borderRadius: '4px',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF',
                                outline: 'none',
                                cursor: isSubCompleted ? 'not-allowed' : 'text',
                                opacity: isSubCompleted ? 0.5 : 1
                              }}
                            />
                          </div>

                          <div style={{ paddingRight: '8px' }}>
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
                                width: `${subStep.lastApprovedValue}%`,
                                backgroundColor: '#9CA3AF'
                              }} />
                              <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${subStep.calculatedCompletion}%`,
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
                                {subStep.calculatedCompletion.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          <div style={{ paddingRight: '8px' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: totalExistingFiles(subStep) === 0 ? 'center' : 'flex-start' }}>
                              {totalExistingFiles(subStep) > 0 && (
                                <button
                                  onClick={() => setViewingStepFiles({ step, subStep })}
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
                                    gap: '4px',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <File size={12} />
                                  {`${totalExistingFiles(subStep)} File${totalExistingFiles(subStep) > 1 ? 's' : ''}`}
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
                                cursor: isSubCompleted ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                pointerEvents: isSubCompleted ? 'none' : 'auto',
                                opacity: isSubCompleted ? 0.5 : 1
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubCompleted) {
                                  e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubCompleted) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                              >
                                <Upload size={12} />
                                Upload
                                <input
                                  type="file"
                                  multiple
                                  disabled={isSubCompleted}
                                  onChange={(e) => e.target.files && handleFileUpload(step.id, e.target.files, subStep.id)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: 
                                subStatus === 'Completed' ? '#D1FAE5' :
                                subStatus === 'In progress' ? '#FEF3C7' : '#FEE2E2',
                              color: 
                                subStatus === 'Completed' ? '#065F46' :
                                subStatus === 'In progress' ? '#92400E' : '#991B1B',
                              fontSize: '11px',
                              fontWeight: '500',
                              borderRadius: '12px',
                              whiteSpace: 'nowrap'
                            }}>
                              {subStatus}
                            </span>
                          </div>
                        </div>

                        {/* Evidence Preview for SubStep */}
                        {subStep.evidence.length > 0 && (
                          <div style={{
                            padding: '12px 24px',
                            backgroundColor: '#F3F4F6',
                            borderBottom: subIndex === step.subSteps!.length - 1 ? '1px solid #C8D9EE' : 'none'
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
                              {subStep.evidence.map((file, fileIndex) => (
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
                                    onClick={() => removeEvidence(step.id, fileIndex, subStep.id)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E6ED',
        padding: '24px 32px',
        marginTop: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
            Save Draft
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
                gridTemplateColumns: '40px 100px 100px 150px 250px 150px',
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
                        gridTemplateColumns: '40px 100px 100px 150px 250px 150px',
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
                          backgroundColor: '#E5EDF7',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #D8E3F0'
                        }}>
                          <div></div>
                          <div>Step #</div>
                          <div>Step Name</div>
                          <div>Progress Value</div>
                          <div>Unit</div>
                          <div>Evidence</div>
                        </div>

                        {/* Nested Step Rows */}
                        {version.steps.map((step, stepIdx) => {
                          const stepKey = `${version.version}-${step.stepNumber}`;
                          const isStepExpanded = expandedVersionSteps.has(stepKey);
                          const hasEvidenceOrSubSteps = (step.evidences && step.evidences.length > 0) || (step.hasSubSteps && step.subSteps && step.subSteps.length > 0);
                          
                          return (
                            <div key={stepKey}>
                              {/* Main Step Row */}
                              <div
                                onClick={() => hasEvidenceOrSubSteps && toggleVersionStepExpand(stepKey)}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '40px 80px minmax(200px, 1fr) 120px 100px 150px',
                                  gap: '12px',
                                  padding: '12px 24px 12px 80px',
                                  backgroundColor: stepIdx % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                                  fontSize: '12px',
                                  color: '#272721',
                                  alignItems: 'center',
                                  cursor: hasEvidenceOrSubSteps ? 'pointer' : 'default',
                                  borderBottom: (isStepExpanded && step.hasSubSteps) ? 'none' : '1px solid #E2E6ED'
                                }}
                                onMouseEnter={(e) => {
                                  if (hasEvidenceOrSubSteps) {
                                    e.currentTarget.style.backgroundColor = '#F3F6FA';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = stepIdx % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
                                }}
                              >
                                <div>
                                  {hasEvidenceOrSubSteps && (
                                    isStepExpanded ? (
                                      <ChevronDown size={16} style={{ color: '#6B7280' }} />
                                    ) : (
                                      <ChevronRight size={16} style={{ color: '#6B7280' }} />
                                    )
                                  )}
                                </div>
                                <div style={{ fontWeight: '500' }}>
                                  {step.stepNumber}
                                </div>
                                <div>
                                  {step.stepName}
                                </div>
                                <div style={{ fontWeight: '600', color: step.hasSubSteps ? '#9CA3AF' : '#FD4314' }}>
                                  {step.hasSubSteps ? '—' : step.progressValue}
                                </div>
                                <div style={{ color: '#5F6B7A' }}>
                                  {step.unit}
                                </div>
                                <div style={{ color: '#6B7280' }}>
                                  {step.hasSubSteps 
                                    ? `${step.subSteps?.length || 0} substep${(step.subSteps?.length || 0) > 1 ? 's' : ''}`
                                    : step.evidences.length > 0 
                                      ? `${step.evidences.length} file${step.evidences.length > 1 ? 's' : ''}` 
                                      : 'No evidence'
                                  }
                                </div>
                              </div>

                              {/* Expanded SubSteps or Evidence */}
                              {isStepExpanded && step.hasSubSteps && step.subSteps && (
                                <div>
                                  {step.subSteps.map((subStep, subStepIdx) => {
                                    const subStepKey = `${stepKey}-${subStep.subStepNumber}`;
                                    const isSubStepExpanded = expandedVersionSteps.has(subStepKey);
                                    
                                    return (
                                      <div key={subStepKey}>
                                        {/* SubStep Row */}
                                        <div
                                          onClick={() => subStep.evidences.length > 0 && toggleVersionStepExpand(subStepKey)}
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: '40px 80px minmax(200px, 1fr) 120px 100px 150px',
                                            gap: '12px',
                                            padding: '12px 24px 12px 120px',
                                            backgroundColor: '#F3F6FA',
                                            fontSize: '12px',
                                            color: '#272721',
                                            alignItems: 'center',
                                            cursor: subStep.evidences.length > 0 ? 'pointer' : 'default',
                                            borderBottom: isSubStepExpanded || subStepIdx < step.subSteps!.length - 1 ? 'none' : '1px solid #E2E6ED'
                                          }}
                                          onMouseEnter={(e) => {
                                            if (subStep.evidences.length > 0) {
                                              e.currentTarget.style.backgroundColor = '#EBF0F8';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#F3F6FA';
                                          }}
                                        >
                                          <div>
                                            {subStep.evidences.length > 0 && (
                                              isSubStepExpanded ? (
                                                <ChevronDown size={14} style={{ color: '#6B7280' }} />
                                              ) : (
                                                <ChevronRight size={14} style={{ color: '#6B7280' }} />
                                              )
                                            )}
                                          </div>
                                          <div style={{ fontWeight: '500', color: '#6B7280' }}>
                                            {subStep.subStepNumber}
                                          </div>
                                          <div>
                                            {subStep.subStepName}
                                          </div>
                                          <div style={{ fontWeight: '600', color: '#FD4314' }}>
                                            {subStep.progressValue}
                                          </div>
                                          <div style={{ color: '#5F6B7A' }}>
                                            %
                                          </div>
                                          <div style={{ color: '#6B7280' }}>
                                            {subStep.evidences.length > 0 ? `${subStep.evidences.length} file${subStep.evidences.length > 1 ? 's' : ''}` : 'No evidence'}
                                          </div>
                                        </div>

                                        {/* SubStep Evidence Files (Expanded) */}
                                        {isSubStepExpanded && subStep.evidences.length > 0 && (
                                          <div style={{
                                            padding: '12px 24px 16px 160px',
                                            backgroundColor: '#E8EDF5',
                                            borderBottom: subStepIdx === step.subSteps!.length - 1 ? '1px solid #E2E6ED' : 'none'
                                          }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                              {subStep.evidences.map((file, fileIdx) => (
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

                                        {/* Add bottom border for last substep if not expanded */}
                                        {!isSubStepExpanded && subStepIdx === step.subSteps!.length - 1 && (
                                          <div style={{ borderBottom: '1px solid #E2E6ED' }} />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Evidence Files for non-substep steps (Expanded) */}
                              {isStepExpanded && !step.hasSubSteps && step.evidences.length > 0 && (
                                <div style={{
                                  padding: '12px 24px 16px 136px',
                                  backgroundColor: '#F3F6FA',
                                  borderBottom: '1px solid #E2E6ED'
                                }}>
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
                  {viewingStepFiles.subStep 
                    ? `${viewingStepFiles.step.stepNumber}.${viewingStepFiles.subStep.id} - ${viewingStepFiles.subStep.subStepName}`
                    : `${viewingStepFiles.step.stepNumber} - ${viewingStepFiles.step.stepName}`
                  }
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
              {(() => {
                const currentItem = viewingStepFiles.subStep || viewingStepFiles.step;
                return currentItem.existingEvidence && currentItem.existingEvidence.length > 0 && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                      Approved Evidence
                    </div>
                    {currentItem.existingEvidence.map((file, idx) => (
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
                            onClick={() => {
                              if (viewingStepFiles.subStep) {
                                removeExistingEvidence(viewingStepFiles.step.id, file.name, viewingStepFiles.subStep.id);
                              } else {
                                removeExistingEvidence(viewingStepFiles.step.id, file.name);
                              }
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
                      </div>
                    ))}
                  </>
                );
              })()}

              {/* Newly Uploaded Files (Draft) */}
              {(() => {
                const currentItem = viewingStepFiles.subStep || viewingStepFiles.step;
                return currentItem.evidence.length > 0 && (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginTop: currentItem.existingEvidence && currentItem.existingEvidence.length > 0 ? '16px' : '0', marginBottom: '8px' }}>
                      Newly Uploaded (Draft)
                    </div>
                    {currentItem.evidence.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          backgroundColor: idx % 2 === 0 ? '#FFF4ED' : '#FFF9F5',
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
                            if (viewingStepFiles.subStep) {
                              removeEvidence(viewingStepFiles.step.id, idx, viewingStepFiles.subStep.id);
                            } else {
                              removeEvidence(viewingStepFiles.step.id, idx);
                            }
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
                );
              })()}

              {/* No Files Message */}
              {(() => {
                const currentItem = viewingStepFiles.subStep || viewingStepFiles.step;
                return (!currentItem.existingEvidence || currentItem.existingEvidence.length === 0) && currentItem.evidence.length === 0 && (
                  <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '13px'
                  }}>
                    No files attached yet
                  </div>
                );
              })()}
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
            zIndex: 1200,
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
              padding: '24px',
              width: '480px',
              maxWidth: '90%'
            }}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 12px 0'
            }}>
              Submit Progress for Review?
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.5'
            }}>
              This will create a new version and submit it for approval. The progress will be locked until reviewed.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowSubmitConfirmation(false)}
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
              <button
                onClick={confirmSubmitForReview}
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
                Yes, Submit
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
            zIndex: 1200,
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
              padding: '24px',
              width: '480px',
              maxWidth: '90%'
            }}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 12px 0'
            }}>
              Progress Updates are Locked
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.5'
            }}>
              Progress submissions are currently locked for this project. Your progress will be saved as draft instead.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowLockedSubmissionModal(false)}
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
              <button
                onClick={confirmLockedSubmission}
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
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lock, Unlock, TrendingUp, TrendingDown, AlertTriangle, FileText, CheckCircle, XCircle, ChevronRight, ChevronDown, ChevronUp, Info, Download, File, X } from 'lucide-react';
import { toast } from 'sonner';
import ApprovalConfirmationModal from '../components/ApprovalConfirmationModal';

interface ReviewStep {
  id: string;
  step: string;
  stepName: string;
  measurementType: 'Percentage' | 'Quantity';
  totalQty: number;
  previousQty: number;
  newQty: number;
  changeQty: number;
  previousProgress: number;
  newProgress: number;
  evidence: string[];
  hasChanged: boolean;
  hasWarning?: boolean;
  warningMessage?: string;
}

export default function ProgressReviewWorkspace() {
  const navigate = useNavigate();
  const { projectId, submissionId } = useParams();
  const [reviewComment, setReviewComment] = useState('');
  const [showLockTooltip, setShowLockTooltip] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [isProjectDetailsExpanded, setIsProjectDetailsExpanded] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedStepEvidence, setSelectedStepEvidence] = useState<string[]>([]);
  const [selectedStepName, setSelectedStepName] = useState('');
  const [selectedStepNumber, setSelectedStepNumber] = useState('');
  
  // Approval confirmation modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingApprovalAction, setPendingApprovalAction] = useState<'approve' | 'reject' | null>(null);
  
  // Get reporting cycle state from localStorage
  const isReportingCycleActive = localStorage.getItem('reportingCycleActive') === 'true';
  const currentReportingDate = localStorage.getItem('currentReportingDate') || '';

  // Determine if this is from Global Approvals or Project Approvals
  const isFromGlobalApprovals = !projectId;

  // Determine action type based on submissionId
  // In real app, this would come from API
  const getActionType = () => {
    // For demo: 
    // - 'sub-1', 'sub-2', 'sub-3' -> 'review' (In Review status)
    // - 'sub-4', 'sub-5', 'sub-6' -> 'revert' (Latest Approved/Rejected)
    // - 'sub-7', 'sub-8', 'sub-9' -> 'older' (Older version - not latest)
    if (['sub-1', 'sub-2', 'sub-3'].includes(submissionId || '')) return 'review';
    if (['sub-4', 'sub-5', 'sub-6'].includes(submissionId || '')) return 'revert';
    if (['sub-7', 'sub-8', 'sub-9'].includes(submissionId || '')) return 'older';
    return 'review'; // Default to review for testing
  };

  const actionType = getActionType();
  const isOlderVersion = actionType === 'older';

  // Mock data
  const submissionData = {
    version: 'V2.3',
    status: actionType === 'review' ? 'In Review' : actionType === 'revert' ? 'Approved' : 'Rejected',
    agingDays: 2,
    taskName: 'PCW Distribution – B1 – T1 – R1.1.1',
    taskId: 'TASK-1733-1',
    projectName: 'Marina Bay Complex',
    projectId: 'PRJ-2024-001',
    submittedBy: {
      name: 'John Smith',
      avatar: 'JS'
    },
    submittedAt: '2026-02-22 14:30',
    overallProgress: 68,
    progressDelta: 8,
    previousApprovedProgress: 60,
    // Add progress reporting date for approved/rejected submissions
    progressReportingDate: actionType === 'review' ? null : '2026-03-09',
    // Add reviewer data for approved/rejected submissions
    reviewedBy: actionType === 'review' ? null : {
      name: 'Sarah Johnson',
      avatar: 'SJ'
    },
    reviewedAt: actionType === 'review' ? null : '2026-03-09 16:45',
    reviewComment: actionType === 'review' ? null : (actionType === 'revert' ? 'All progress updates have been reviewed and verified. The work completed on Steps 2 and 3 meets the required standards. Quality inspections passed successfully. Approved for record.' : 'The submitted evidence does not clearly demonstrate the claimed progress. Please provide additional documentation and re-submit.')
  };

  const mockSteps: ReviewStep[] = [
    {
      id: '1',
      step: 'Step 1',
      stepName: 'Excavation and Site Preparation',
      measurementType: 'Quantity',
      totalQty: 500,
      previousQty: 500,
      newQty: 500,
      changeQty: 0,
      previousProgress: 100,
      newProgress: 100,
      evidence: ['excavation_report.pdf'],
      hasChanged: false
    },
    {
      id: '2',
      step: 'Step 2',
      stepName: 'Foundation Pour - Phase 1',
      measurementType: 'Quantity',
      totalQty: 680,
      previousQty: 600,
      newQty: 680,
      changeQty: 80,
      previousProgress: 75,
      newProgress: 85,
      evidence: ['concrete_test.pdf', 'pour_photos.jpg'],
      hasChanged: true
    },
    {
      id: '3',
      step: 'Step 3',
      stepName: 'Structural Steel Installation',
      measurementType: 'Percentage',
      totalQty: 0,
      previousQty: 0,
      newQty: 0,
      changeQty: 0,
      previousProgress: 30,
      newProgress: 40,
      evidence: ['steel_certs.pdf'],
      hasChanged: true
    },
    {
      id: '4',
      step: 'Step 4',
      stepName: 'Concrete Columns & Beams',
      measurementType: 'Percentage',
      totalQty: 0,
      previousQty: 0,
      newQty: 0,
      changeQty: 0,
      previousProgress: 0,
      newProgress: 0,
      evidence: [],
      hasChanged: false
    },
    {
      id: '5',
      step: 'Step 5',
      stepName: 'Floor Slab Installation',
      measurementType: 'Quantity',
      totalQty: 1200,
      previousQty: 0,
      newQty: 0,
      changeQty: 0,
      previousProgress: 0,
      newProgress: 0,
      evidence: [],
      hasChanged: false
    }
  ];

  const validationInsights = [
    { type: 'info', message: 'Overall progress increased by 8%' },
    { type: 'info', message: '2 steps updated with evidence' }
  ];

  const handleApprove = () => {
    toast.success('Progress submission approved successfully', {
      duration: 4000,
      position: 'top-right'
    });
    if (isFromGlobalApprovals) {
      navigate('/app/approvals');
    } else {
      navigate(`/app/projects/${projectId}/progress-approvals`);
    }
  };

  const handleReject = () => {
    if (!reviewComment.trim()) {
      toast.error('Review comment is required for rejection');
      return;
    }
    toast.error('Progress submission rejected', {
      duration: 4000,
      position: 'top-right'
    });
    if (isFromGlobalApprovals) {
      navigate('/app/approvals');
    } else {
      navigate(`/app/projects/${projectId}/progress-approvals`);
    }
  };

  const handleRevert = () => {
    toast.success('Progress reverted successfully', {
      duration: 4000,
      position: 'top-right'
    });
    setShowRevertModal(false);
    if (isFromGlobalApprovals) {
      navigate('/app/approvals');
    } else {
      navigate(`/app/projects/${projectId}/progress-approvals`);
    }
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
    toast.info(isLocked ? 'Task unlocked - submissions reopened' : 'Task locked - submissions stopped', {
      duration: 3000,
      position: 'top-right'
    });
  };

  const handleEvidenceClick = (evidence: string[], stepName: string, stepNumber: string) => {
    setSelectedStepEvidence(evidence);
    setSelectedStepName(stepName);
    setSelectedStepNumber(stepNumber);
    setShowEvidenceModal(true);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)',
      overflow: 'auto'
    }}>
      {/* Header (Sticky) */}
      <div style={{
        position: 'sticky',
        top: '0',
        backgroundColor: '#F7F9FC',
        paddingBottom: '16px',
        marginBottom: '24px',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            {/* Breadcrumbs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '13px',
              color: '#6B7280'
            }}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate(isFromGlobalApprovals ? '/app/approvals' : `/app/projects/${projectId}/progress-approvals`)}>
                {isFromGlobalApprovals ? 'Global Approvals' : 'Project Approvals'}
              </span>
              <span>›</span>
              <span style={{ color: '#111827', fontWeight: '500' }}>Review Approval</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Review Version {submissionData.version.replace('V', '')}
              </h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: actionType === 'review' ? '#DBEAFE' : actionType === 'revert' ? '#D1FAE5' : '#FEE2E2',
                color: actionType === 'review' ? '#1E40AF' : actionType === 'revert' ? '#065F46' : '#991B1B'
              }}>
                {submissionData.status}
              </span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: submissionData.agingDays >= 5 ? '#FEF3C7' : '#F3F4F6',
                color: submissionData.agingDays >= 5 ? '#92400E' : '#6B7280'
              }}>
                {submissionData.agingDays}d aging
              </span>
              
              {/* Lock Status Badge - Only show when locked */}
              {isLocked && (
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Lock size={12} />
                  Locked
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              {submissionData.taskName} ({submissionData.taskId})
            </div>
          </div>

          {/* Action Buttons - Conditional Based on Action Type */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {actionType === 'review' ? (
              <>
                <button
                  onClick={() => {
                    setPendingApprovalAction('reject');
                    setShowApprovalModal(true);
                  }}
                  disabled={!isReportingCycleActive}
                  title={!isReportingCycleActive ? 'Reporting Cycle must be started to enable this action' : ''}
                  style={{
                    height: '36px',
                    padding: '0 20px',
                    border: `1px solid ${!isReportingCycleActive ? '#9CA3AF' : '#DC2626'}`,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: !isReportingCycleActive ? '#9CA3AF' : '#DC2626',
                    cursor: !isReportingCycleActive ? 'not-allowed' : 'pointer',
                    opacity: !isReportingCycleActive ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (isReportingCycleActive) {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isReportingCycleActive) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setPendingApprovalAction('approve');
                    setShowApprovalModal(true);
                  }}
                  disabled={!isReportingCycleActive}
                  title={!isReportingCycleActive ? 'Reporting Cycle must be started to enable this action' : ''}
                  style={{
                    height: '36px',
                    padding: '0 20px',
                    backgroundColor: !isReportingCycleActive ? '#F3F4F6' : '#10B981',
                    border: !isReportingCycleActive ? '1px solid #D8DEE8' : 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: !isReportingCycleActive ? '#9CA3AF' : '#FFFFFF',
                    cursor: !isReportingCycleActive ? 'not-allowed' : 'pointer',
                    opacity: !isReportingCycleActive ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (isReportingCycleActive) {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isReportingCycleActive) {
                      e.currentTarget.style.backgroundColor = '#10B981';
                    }
                  }}
                >
                  Approve
                </button>
              </>
            ) : actionType === 'revert' ? (
              <button
                onClick={() => setShowRevertModal(true)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  backgroundColor: '#F59E0B',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D97706'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
              >
                Revert
              </button>
            ) : null}
          </div>
        </div>

        {/* No Action Available Message */}
        {actionType === 'none' && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '6px',
            padding: '12px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Info size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#92400E' }}>
              This is not the latest progress submission for this task. Please review the most recent version to take action.
            </div>
          </div>
        )}

        {/* Older Version Warning Message */}
        {isOlderVersion && (
          <div style={{
            backgroundColor: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: '6px',
            padding: '12px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Info size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#92400E' }}>
              This is not the latest progress submission for this task. Please review the most recent version to take action.
            </div>
          </div>
        )}

        {/* Submission Metadata Row */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E6ED',
          borderRadius: '6px',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: submissionData.reviewedBy ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Submitted By
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4A90E2',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {submissionData.submittedBy.avatar}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                {submissionData.submittedBy.name}
              </span>
            </div>
          </div>

          {submissionData.reviewedBy && (
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Reviewed By
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {submissionData.reviewedBy.avatar}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                  {submissionData.reviewedBy.name}
                </span>
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Submitted
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
              {submissionData.submittedAt}
            </div>
          </div>

          {submissionData.reviewedAt && (
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Reviewed
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                {submissionData.reviewedAt}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Overall Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#272721' }}>
                {submissionData.overallProgress}%
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Overall Progress Change
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {submissionData.progressDelta > 0 ? (
                <TrendingUp size={18} style={{ color: '#10B981' }} />
              ) : (
                <TrendingDown size={18} style={{ color: '#EF4444' }} />
              )}
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: submissionData.progressDelta > 0 ? '#10B981' : '#EF4444'
              }}>
                {submissionData.progressDelta > 0 ? '+' : ''}{submissionData.progressDelta}%
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>
                (was {submissionData.previousApprovedProgress}%)
              </span>
            </div>
          </div>
        </div>

        {/* Progress Reporting Date - Only show for Approved/Rejected versions */}
        {submissionData.progressReportingDate && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '6px',
            padding: '16px 20px',
            marginTop: '16px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Progress Reporting Date
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                {new Date(submissionData.progressReportingDate).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                }).replace(/\//g, '-')}
              </div>
            </div>
          </div>
        )}

        {/* Project Details Section - Only show when from Global Approvals */}
        {isFromGlobalApprovals && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '6px',
            marginTop: '16px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setIsProjectDetailsExpanded(!isProjectDetailsExpanded)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#F8F9FB',
                borderBottom: isProjectDetailsExpanded ? '1px solid #E2E6ED' : 'none'
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                Project Details
              </div>
              {isProjectDetailsExpanded ? (
                <ChevronUp size={18} color="#6B7280" />
              ) : (
                <ChevronDown size={18} color="#6B7280" />
              )}
            </div>
            {isProjectDetailsExpanded && (
              <div style={{ padding: '16px 20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Project Name
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                      {submissionData.projectName}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Project ID
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721', fontFamily: 'monospace' }}>
                      {submissionData.projectId}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approval Notes Section - Only show for approved/rejected submissions */}
        {submissionData.reviewComment && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: '16px'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E6ED',
              backgroundColor: '#F8F9FB',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={18} color={submissionData.status === 'Approved' ? '#10B981' : '#DC2626'} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {submissionData.status === 'Approved' ? 'Approval Notes' : 'Review Notes'}
              </h3>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: submissionData.status === 'Approved' ? '#F0FDF4' : '#FEF2F2',
              borderLeft: `4px solid ${submissionData.status === 'Approved' ? '#10B981' : '#DC2626'}`
            }}>
              <div style={{
                fontSize: '14px',
                color: '#272721',
                lineHeight: '1.6',
                marginBottom: '12px'
              }}>
                {submissionData.reviewComment}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#6B7280'
              }}>
                <span style={{ fontWeight: '500' }}>
                  {submissionData.reviewedBy?.name}
                </span>
                <span>•</span>
                <span>{submissionData.reviewedAt}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Review Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E6ED',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E6ED',
          backgroundColor: '#F8F9FB'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Step-by-Step Review
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {/* AG Grid Style Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px minmax(180px, 1fr) 120px 90px 90px 80px 110px 100px 150px',
            backgroundColor: '#E4EEF8',
            borderBottom: '1px solid #C8D9EE',
            padding: '0 20px',
            height: '44px',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721',
            gap: '10px',
            minWidth: '1200px'
          }}>
            <div>Step</div>
            <div>Step Name</div>
            <div>Measurement Type</div>
            <div>Total Qty</div>
            <div>Previous Qty</div>
            <div>New Qty</div>
            <div>Previous Progress %</div>
            <div>New Progress %</div>
            <div>Evidence</div>
          </div>

          {/* Table Rows */}
          {mockSteps.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px minmax(180px, 1fr) 120px 90px 90px 80px 110px 100px 150px',
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                borderBottom: '1px solid #E5E7EB',
                padding: '0 20px',
                minHeight: '52px',
                fontSize: '13px',
                color: '#272721',
                borderLeft: step.hasChanged ? '3px solid #FD4314' : '3px solid transparent',
                alignItems: 'center',
                gap: '10px',
                minWidth: '1200px'
              }}
            >
              <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{step.step}</div>
              <div style={{ minWidth: 0, paddingTop: '8px', paddingBottom: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflow: 'hidden'
                }}>
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {step.stepName}
                  </span>
                </div>
                {step.hasWarning && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                    fontSize: '11px',
                    color: '#92400E'
                  }}>
                    <AlertTriangle size={12} />
                    {step.warningMessage}
                  </div>
                )}
              </div>
              <div style={{ color: '#6B7280', textAlign: 'center' }}>{step.measurementType}</div>
              <div style={{ color: '#6B7280', textAlign: 'center' }}>
                {step.measurementType === 'Quantity' ? step.totalQty : '-'}
              </div>
              <div style={{ color: '#6B7280', textAlign: 'center' }}>
                {step.measurementType === 'Quantity' ? step.previousQty : '-'}
              </div>
              <div style={{ 
                backgroundColor: step.hasChanged ? 'rgba(253, 67, 20, 0.1)' : 'transparent',
                padding: step.hasChanged ? '4px 8px' : '0',
                borderRadius: step.hasChanged ? '4px' : '0',
                color: '#272721',
                textAlign: 'center',
                fontWeight: step.hasChanged ? '600' : '400'
              }}>
                {step.measurementType === 'Quantity' ? step.newQty : '-'}
              </div>
              <div style={{ color: '#6B7280', textAlign: 'center' }}>{step.previousProgress}%</div>
              <div style={{ 
                backgroundColor: step.hasChanged ? 'rgba(253, 67, 20, 0.1)' : 'transparent',
                padding: step.hasChanged ? '4px 8px' : '0',
                borderRadius: step.hasChanged ? '4px' : '0',
                color: '#272721',
                textAlign: 'center',
                fontWeight: step.hasChanged ? '600' : '400'
              }}>{step.newProgress}%</div>
              <div>
                {step.evidence.length > 0 ? (
                  <button
                    onClick={() => handleEvidenceClick(step.evidence, step.stepName, step.step)}
                    style={{
                      width: '100px',
                      height: '32px',
                      padding: '0 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <File size={14} />
                    {step.evidence.length} {step.evidence.length === 1 ? 'File' : 'Files'}
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No evidence</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section Layout (Two Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* LEFT - Earned Value Calculation */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E6ED',
          borderRadius: '6px',
          padding: '20px'
        }}>
          <h4 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 16px 0'
          }}>
            Earned Value Calculation
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Earned Quantity:</span>
              <span style={{ fontWeight: '600', color: '#272721' }}>1,800 units</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Earned Hours:</span>
              <span style={{ fontWeight: '600', color: '#272721' }}>450 hrs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Earned Cost:</span>
              <span style={{ fontWeight: '600', color: '#272721' }}>$136,000</span>
            </div>
            <div style={{
              borderTop: '1px solid #E5E7EB',
              paddingTop: '12px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#6B7280' }}>Total Progress to Claim %:</span>
              <span style={{ fontWeight: '700', color: '#10B981', fontSize: '16px' }}>{submissionData.overallProgress}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT - Review Comment */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E6ED',
          borderRadius: '6px',
          padding: '20px'
        }}>
          <h4 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 8px 0'
          }}>
            Review Comment
          </h4>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
            Add your review comments...
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Provide detailed feedback on the submission..."
            style={{
              width: '100%',
              height: '160px',
              padding: '12px',
              border: '1px solid #D8DEE8',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* Revert Confirmation Modal */}
      {showRevertModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 16px 0'
            }}>
              Confirm Revert
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.6'
            }}>
              Are you sure you want to revert this progress submission? This action will restore the previous approved version and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRevertModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={handleRevert}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  backgroundColor: '#F59E0B',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D97706'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
              >
                Confirm Revert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
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
          onClick={() => setShowEvidenceModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: '0 0 4px 0'
                }}>
                  Attached Files
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  {selectedStepNumber} - {selectedStepName}
                </p>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1F2937'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Approved Evidence
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedStepEvidence.map((file, idx) => {
                  // Determine file type icon
                  const getFileIcon = (filename: string) => {
                    const ext = filename.split('.').pop()?.toLowerCase();
                    if (ext === 'pdf') return { icon: FileText, color: '#DC2626' };
                    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return { icon: FileText, color: '#F59E0B' };
                    if (['xlsx', 'xls'].includes(ext || '')) return { icon: FileText, color: '#10B981' };
                    return { icon: FileText, color: '#6B7280' };
                  };

                  const { icon: Icon, color } = getFileIcon(file);

                  return (
                    <div 
                      key={idx} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '6px',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <Icon size={20} color={color} style={{ flexShrink: 0 }} />
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#272721',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {file}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          toast.success(`Downloading ${file}...`, {
                            duration: 3000,
                            position: 'top-right'
                          });
                        }}
                        style={{
                          height: '32px',
                          padding: '0 16px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexShrink: 0,
                          marginLeft: '12px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowEvidenceModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {showApprovalModal && (
        <ApprovalConfirmationModal
          action={pendingApprovalAction}
          onConfirm={() => {
            if (pendingApprovalAction === 'approve') {
              handleApprove();
            } else if (pendingApprovalAction === 'reject') {
              handleReject();
            }
            setShowApprovalModal(false);
          }}
          onCancel={() => setShowApprovalModal(false)}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
        />
      )}
    </div>
  );
}
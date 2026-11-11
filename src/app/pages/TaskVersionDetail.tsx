import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  CheckCircle,
  FileText,
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Paperclip,
  Upload,
  File,
  Download,
  X,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface VersionStep {
  id: string;
  step: string;
  description: string;
  weight: number;
  totalQuantity: number;
  installedQuantity: number;
  progress: number;
  evidence: string[];
  hasChanged?: boolean;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export default function TaskVersionDetail() {
  const navigate = useNavigate();
  const { projectId, taskId, versionId } = useParams();

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedStepEvidence, setSelectedStepEvidence] = useState<string[]>([]);
  const [selectedStepName, setSelectedStepName] = useState('');
  const [selectedStepNumber, setSelectedStepNumber] = useState('');

  // Map versionId to status based on MOCK_VERSION_HISTORY in TaskDetails
  // id: 1 -> v5 -> In Review
  // id: 2 -> v4 -> Approved (after Revert)
  // id: 3 -> v3 -> Rejected
  // id: 4 -> v2 -> Approved
  // id: 5 -> v1 -> Superseded
  const getVersionStatus = (id: string | undefined): 'In Review' | 'Approved' | 'Superseded' | 'Rejected' => {
    if (id === '1') return 'In Review';
    if (id === '2') return 'Approved'; // v4 - Reverted and Re-approved
    if (id === '3') return 'Rejected'; // v3 - Rejected
    if (id === '4') return 'Approved'; // v2 - Approved
    return 'Superseded';
  };

  const versionStatus = getVersionStatus(versionId);
  
  // Map versionId to version number
  const getVersionNumber = (id: string | undefined): string => {
    const versionMap: { [key: string]: string } = {
      '1': 'v5',
      '2': 'v4',
      '3': 'v3',
      '4': 'v2',
      '5': 'v1'
    };
    return versionMap[id || '1'] || 'v1';
  };

  // Define review history based on versionId
  interface ReviewNote {
    status: 'Approved' | 'Rejected' | 'Reverted' | 'Superseded';
    comment: string;
    reviewedBy: {
      name: string;
      avatar: string;
    };
    reviewedDate: string;
  }

  const getReviewHistory = (id: string | undefined): ReviewNote[] => {
    // v2 (id: 4) - Scenario 1: In Review to Approved
    if (id === '4') {
      return [
        {
          status: 'Approved',
          comment: 'All progress updates have been reviewed and verified. The work completed on Steps 2 and 3 meets the required standards. Quality inspections passed successfully. Approved for record.',
          reviewedBy: { name: 'David Martinez', avatar: 'DM' },
          reviewedDate: '11/02/2024'
        }
      ];
    }

    // v3 (id: 3) - Scenario 2: In Review to Rejected
    if (id === '3') {
      return [
        {
          status: 'Rejected',
          comment: 'The welding schedule adjustments do not align with the approved work sequence. Material delivery delays should not impact the planned installation order. Please revise and resubmit with corrected schedule.',
          reviewedBy: { name: 'David Martinez', avatar: 'DM' },
          reviewedDate: '16/02/2024'
        }
      ];
    }

    // v4 (id: 2) - Scenario 3: In Review -> Approved -> Reverted -> Approved
    if (id === '2') {
      return [
        {
          status: 'Approved',
          comment: 'Initial review complete. Insulation quantities verified against field measurements. All documentation is in order. Approved.',
          reviewedBy: { name: 'David Martinez', avatar: 'DM' },
          reviewedDate: '21/02/2024'
        },
        {
          status: 'Reverted',
          comment: 'Reverting for additional verification. Discrepancy found in insulation R-value specifications that requires clarification before final approval.',
          reviewedBy: { name: 'Sarah Johnson', avatar: 'SJ' },
          reviewedDate: '23/02/2024'
        },
        {
          status: 'Approved',
          comment: 'R-value specifications have been clarified and verified. All insulation quantities and specifications now meet requirements. Re-approved for record.',
          reviewedBy: { name: 'David Martinez', avatar: 'DM' },
          reviewedDate: '25/02/2024'
        }
      ];
    }

    return [];
  };

  // Get timeline-only status transitions (for versions that show timeline but no review comments)
  const getTimelineOnlyHistory = (id: string | undefined): ReviewNote[] => {
    // v1 (id: 5) - In Review to Superseded (timeline only, no review comment)
    if (id === '5') {
      return [
        {
          status: 'Superseded',
          comment: '',
          reviewedBy: { name: 'System', avatar: 'SYS' },
          reviewedDate: '05/02/2024'
        }
      ];
    }
    return [];
  };

  const reviewHistory = getReviewHistory(versionId);
  const timelineOnlyHistory = getTimelineOnlyHistory(versionId);

  // Combine both for timeline display, but only use reviewHistory for comments section
  const timelineHistory = reviewHistory.length > 0 ? reviewHistory : timelineOnlyHistory;

  // Get submission details based on versionId
  const getSubmissionData = (id: string | undefined) => {
    if (id === '4') { // v2
      return { name: 'John Smith', avatar: 'JS', date: '10/02/2024' };
    }
    if (id === '3') { // v3
      return { name: 'Sarah Johnson', avatar: 'SJ', date: '15/02/2024' };
    }
    if (id === '2') { // v4
      return { name: 'John Smith', avatar: 'JS', date: '20/02/2024' };
    }
    if (id === '5') { // v1
      return { name: 'System', avatar: 'SYS', date: '05/02/2024' };
    }
    return { name: 'John Smith', avatar: 'JS', date: '08/03/2026' };
  };

  const submissionData = getSubmissionData(versionId);

  // Mock version data
  const versionData = {
    versionNumber: getVersionNumber(versionId),
    taskTitle: 'Foundation & Structural Frame – Building A',
    status: versionStatus,
    submittedBy: {
      name: submissionData.name,
      avatar: submissionData.avatar
    },
    reviewedBy: {
      name: timelineHistory.length > 0 ? timelineHistory[timelineHistory.length - 1].reviewedBy.name : '',
      avatar: timelineHistory.length > 0 ? timelineHistory[timelineHistory.length - 1].reviewedBy.avatar : ''
    },
    submittedDate: submissionData.date,
    reviewedDate: timelineHistory.length > 0 ? timelineHistory[timelineHistory.length - 1].reviewedDate : '—',
    overallProgress: versionId === '4' ? 45 : versionId === '3' ? 65 : versionId === '2' ? 75 : versionId === '5' ? 0 : 82,
    changesSummary: {
      stepsUpdated: 3,
      progressDelta: +7.0,
      quantityChange: +150
    },
    reviewHistory: reviewHistory,
    timelineHistory: timelineHistory
  };

  const mockSteps: VersionStep[] = [
    {
      id: '1',
      step: 'Step 1',
      description: 'Excavation and Site Preparation',
      weight: 15,
      totalQuantity: 500,
      installedQuantity: 500,
      progress: 100,
      evidence: ['excavation_report.pdf', 'site_photos.jpg'],
      hasChanged: false,
      status: 'Completed'
    },
    {
      id: '2',
      step: 'Step 2',
      description: 'Foundation Pour - Phase 1',
      weight: 25,
      totalQuantity: 800,
      installedQuantity: 680,
      progress: 85,
      evidence: ['concrete_test.pdf', 'pour_photos.jpg'],
      hasChanged: true,
      status: 'In Progress'
    },
    {
      id: '3',
      step: 'Step 3',
      description: 'Structural Steel Installation',
      weight: 30,
      totalQuantity: 1200,
      installedQuantity: 480,
      progress: 40,
      evidence: ['steel_certs.pdf'],
      hasChanged: true,
      status: 'In Progress'
    },
    {
      id: '4',
      step: 'Step 4',
      description: 'Concrete Columns & Beams',
      weight: 20,
      totalQuantity: 600,
      installedQuantity: 0,
      progress: 0,
      evidence: [],
      hasChanged: false,
      status: 'Not Started'
    },
    {
      id: '5',
      step: 'Step 5',
      description: 'Floor Slab Installation',
      weight: 10,
      totalQuantity: 400,
      installedQuantity: 0,
      progress: 0,
      evidence: [],
      hasChanged: false,
      status: 'Not Started'
    }
  ];

  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);

  const formatProgressDelta = (delta: number) => {
    if (delta > 0) return `+${delta.toFixed(1)}%`;
    if (delta < 0) return `${delta.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: '#5F6B7A',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${projectId}/tasks`)}>
          Task Listing
        </span>
        <span>›</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${projectId}/tasks/${taskId}?tab=versions`)}>
          Task Details
        </span>
        <span>›</span>
        <span style={{ fontWeight: '500', color: '#272721' }}>{versionData.versionNumber}</span>
      </div>

      {/* Task Title with Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1F2937',
          margin: 0
        }}>
          {versionData.taskTitle}
        </h1>
        <span style={{
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          backgroundColor:
            versionData.status === 'In Review' ? '#FEF3C7' :
            versionData.status === 'Rejected' ? '#FEE2E2' :
            '#DEF7EC',
          color:
            versionData.status === 'In Review' ? '#92400E' :
            versionData.status === 'Rejected' ? '#991B1B' :
            '#03543F',
          fontWeight: '500'
        }}>
          {versionData.status}
        </span>
      </div>

      {/* Read-Only Banner */}
      {versionData.status !== 'In Review' && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#FFF3E0',
          border: '1px solid #FFE0B2',
          borderRadius: '6px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Clock size={16} style={{ color: '#F57C00' }} />
          <span style={{
            fontSize: '13px',
            color: '#E65100',
            fontWeight: '500'
          }}>
            Viewing Historical Version — Read Only
          </span>
        </div>
      )}

      {/* SECTION 1: Version Summary Bar (Sticky) */}
      <div style={{
        position: 'sticky',
        top: '0',
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '6px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Submitted By */}
          <div>
            <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Submitted By
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {versionData.submittedBy.avatar}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                {versionData.submittedBy.name}
              </span>
            </div>
          </div>

          {/* Reviewed By */}
          {versionStatus !== 'In Review' && (
          <div>
            <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                {versionData.reviewedBy.avatar}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
                {versionData.reviewedBy.name}
              </span>
            </div>
          </div>
          )}

          {/* Submitted Date */}
          <div>
            <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Submitted
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
              {versionData.submittedDate}
            </div>
          </div>

          {/* Reviewed Date - Only show if not In Review */}
          {versionStatus !== 'In Review' && (
          <div>
            <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Reviewed
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#272721' }}>
              {versionData.reviewedDate}
            </div>
          </div>
          )}

          {/* Overall Progress */}
          <div>
            <div style={{ fontSize: '11px', color: '#5F6B7A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Overall Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                flex: 1,
                height: '8px',
                backgroundColor: '#E5E7EB',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${versionData.overallProgress}%`,
                  height: '100%',
                  backgroundColor: '#FD4314',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#272721', minWidth: '40px' }}>
                {versionData.overallProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Status Timeline */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '6px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#272721',
          marginTop: 0,
          marginBottom: '20px'
        }}>
          Status Timeline
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* In Review */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={20} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#272721' }}>In Review</div>
            </div>
          </div>

          {/* Render timeline based on review history */}
          {versionData.timelineHistory.map((review, index) => {
            const getStatusIcon = (status: string) => {
              if (status === 'Approved') return <CheckCircle size={20} style={{ color: '#10B981' }} />;
              if (status === 'Rejected') return <X size={20} style={{ color: '#DC2626' }} />;
              if (status === 'Reverted') return <RefreshCw size={20} style={{ color: '#F59E0B' }} />;
              if (status === 'Superseded') return <Minus size={20} style={{ color: '#6B7280' }} />;
              return null;
            };

            const getStatusColor = (status: string) => {
              if (status === 'Approved') return { bg: '#DEF7EC', color: '#10B981' };
              if (status === 'Rejected') return { bg: '#FEE2E2', color: '#DC2626' };
              if (status === 'Reverted') return { bg: '#FEF3C7', color: '#F59E0B' };
              if (status === 'Superseded') return { bg: '#F3F4F6', color: '#6B7280' };
              return { bg: '#F3F4F6', color: '#6B7280' };
            };

            const colors = getStatusColor(review.status);

            return (
              <React.Fragment key={index}>
                {/* Arrow */}
                <div style={{ width: '40px', height: '2px', backgroundColor: colors.color }} />

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: colors.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getStatusIcon(review.status)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                      {review.status}
                    </div>
                    <div style={{ fontSize: '12px', color: '#5F6B7A' }}>{review.reviewedDate}</div>
                    <div style={{ fontSize: '12px', color: '#5F6B7A' }}>{review.reviewedBy.name}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* SECTION 2.5: Review Comments (Only shown if there are review notes) */}
      {versionData.reviewHistory.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {versionData.reviewHistory.map((review, index) => {
              const getStatusColor = (status: string) => {
                if (status === 'Approved') return { bg: '#F0FDF4', border: '#BBF7D0', borderLeft: '#10B981', icon: '#10B981' };
                if (status === 'Rejected') return { bg: '#FEF2F2', border: '#FECACA', borderLeft: '#DC2626', icon: '#DC2626' };
                if (status === 'Reverted') return { bg: '#FEF3C7', border: '#FDE68A', borderLeft: '#F59E0B', icon: '#F59E0B' };
                return { bg: '#F9FAFB', border: '#E5E7EB', borderLeft: '#6B7280', icon: '#6B7280' };
              };

              const colors = getStatusColor(review.status);

              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#272721',
                      margin: 0
                    }}>
                      Review Comment
                    </h4>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: colors.bg,
                      color: colors.icon
                    }}>
                      {review.status}
                    </span>
                  </div>

                  <div style={{
                    padding: '14px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    borderLeft: `4px solid ${colors.borderLeft}`
                  }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {review.comment}
                    </div>

                    <div style={{
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: '#6B7280'
                    }}>
                      <User size={12} />
                      <span style={{ fontWeight: '500' }}>{review.reviewedBy.name}</span>
                      <span>•</span>
                      <span>{review.reviewedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: Version Snapshot Table - AG Grid Style */}
      <div style={{ 
        border: '1px solid #C8D9EE', 
        borderRadius: '4px',
        overflow: 'auto',
        overflowX: 'auto'
      }}>
        <table className="ag-grid-table" style={{ width: '100%', minWidth: '1200px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', minWidth: '180px' }}>Steps</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Steps Weightage</th>
              <th style={{ textAlign: 'center', width: '140px' }}>Measurement Type</th>
              <th style={{ textAlign: 'center', width: '130px' }}>Total Quantity</th>
              <th style={{ textAlign: 'center', width: '140px' }}>Installed Quantity</th>
              <th style={{ textAlign: 'left', width: '200px' }}>% Work Complete</th>
              <th style={{ textAlign: 'left', width: versionData.status === 'In Review' ? '240px' : '180px' }}>Evidence</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockSteps.map((step) => {
              const getStepStatusBadge = (status: string) => {
                const statusStyles: { [key: string]: { bg: string; color: string } } = {
                  'Completed': { bg: '#D1FAE5', color: '#065F46' },
                  'In Progress': { bg: '#DBEAFE', color: '#1E40AF' },
                  'Not Started': { bg: '#F3F4F6', color: '#6B7280' }
                };
                const style = statusStyles[status] || statusStyles['Not Started'];
                return (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: style.bg,
                    color: style.color,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {status}
                  </span>
                );
              };

              return (
                <tr key={step.id} style={{
                  backgroundColor: versionData.status === 'Approved' && step.hasChanged 
                    ? 'rgba(253, 67, 20, 0.05)' 
                    : undefined
                }}>
                  <td style={{ textAlign: 'left' }}>
                    <span style={{ fontWeight: '500' }}>{step.description}</span>
                  </td>
                  <td style={{ textAlign: 'center', color: '#6B7280' }}>{step.weight}%</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#DBEAFE',
                      color: '#1E40AF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Quantity
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'monospace' }}>
                    {step.totalQuantity}
                  </td>
                  <td style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'monospace' }}>
                    {step.installedQuantity}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${step.progress}%`,
                          height: '100%',
                          backgroundColor: '#FD4314',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#111827',
                        minWidth: '45px'
                      }}>
                        {step.progress}%
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {step.evidence && step.evidence.length > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedStepEvidence(step.evidence);
                            setSelectedStepName(step.description);
                            setSelectedStepNumber(step.step);
                            setShowEvidenceModal(true);
                          }}
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
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          <File size={14} />
                          {step.evidence.length} {step.evidence.length === 1 ? 'File' : 'Files'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9CA3AF', width: '100px' }}>—</span>
                      )}
                      
                      {versionData.status === 'In Review' && (
                        <button
                          onClick={() => {
                            toast.success('Upload functionality would open here', {
                              duration: 3000,
                              position: 'top-right'
                            });
                          }}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #FD4314',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#FD4314',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          <Upload size={14} />
                          Upload
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getStepStatusBadge(step.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
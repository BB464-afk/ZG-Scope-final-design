import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Search,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  PlayCircle,
  StopCircle,
  LayoutGrid,
  Table2
} from 'lucide-react';
import { toast } from 'sonner';
import LockConfirmationModal from '../components/LockConfirmationModal';
import ApprovalConfirmationModal from '../components/ApprovalConfirmationModal';
import { formatDate } from '../components/EnterpriseTable';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { UnlockSubmissionsModal } from '../components/SubmissionControlModals';
import StartReportingCycleModal from '../components/StartReportingCycleModal';
import EndReportingCycleModal from '../components/EndReportingCycleModal';

interface ProgressSubmission {
  id: string;
  taskId: string;
  taskName: string;
  version: string;
  status: 'In Review' | 'Locked';
  approvalStatus: 'In Review' | 'Approved' | 'Rejected';
  isLatestApprovedOrRejected: boolean;
  progress: number;
  submittedBy: {
    name: string;
    avatar: string;
  };
  submittedDate: string;
  agingDays: number;
  subContractor: string;
  area: string;
  discipline: string;
  tradePackage: string;
  activity: string;
  scope: string;
  spa: string;
  workPackage: string;
  costType: string;
}

const MOCK_SUBMISSIONS: ProgressSubmission[] = [
  {
    id: 'sub-1',
    taskId: 'TASK-1733-1',
    taskName: 'PCW Distribution – B1 – T1 – R1.1.1',
    version: 'V2',
    status: 'In Review',
    approvalStatus: 'In Review',
    isLatestApprovedOrRejected: false,
    progress: 68,
    submittedBy: { name: 'John Smith', avatar: 'JS' },
    submittedDate: '2026-02-22',
    agingDays: 2,
    subContractor: 'ABC MEP Contractors',
    area: 'Tower A',
    discipline: 'MEP',
    tradePackage: 'TP-001',
    activity: 'Installation',
    scope: 'Primary Works',
    spa: 'SPA-A',
    workPackage: 'WP-100',
    costType: 'Direct'
  },
  {
    id: 'sub-2',
    taskId: 'TASK-1800-5',
    taskName: 'Electrical Conduit Installation',
    version: 'V4',
    status: 'In Review',
    approvalStatus: 'In Review',
    isLatestApprovedOrRejected: false,
    progress: 55,
    submittedBy: { name: 'David Wong', avatar: 'DW' },
    submittedDate: '2026-02-20',
    agingDays: 4,
    subContractor: 'XYZ Electrical Services',
    area: 'Basement',
    discipline: 'Electrical',
    tradePackage: 'TP-002',
    activity: 'Installation',
    scope: 'Secondary Works',
    spa: 'SPA-B',
    workPackage: 'WP-200',
    costType: 'Direct'
  },
  {
    id: 'sub-3',
    taskId: 'TASK-1800-6',
    taskName: 'Cable Tray System – Level 2',
    version: 'V5',
    status: 'In Review',
    approvalStatus: 'In Review',
    isLatestApprovedOrRejected: false,
    progress: 30,
    submittedBy: { name: 'Emma Johnson', avatar: 'EJ' },
    submittedDate: '2026-02-16',
    agingDays: 8,
    subContractor: 'XYZ Electrical Services',
    area: 'Level 2',
    discipline: 'Electrical',
    tradePackage: 'TP-002',
    activity: 'Testing',
    scope: 'Secondary Works',
    spa: 'SPA-B',
    workPackage: 'WP-200',
    costType: 'Indirect'
  },
  {
    id: 'sub-4',
    taskId: 'TASK-1900-1',
    taskName: 'Foundation & Structural Frame – Building A',
    version: 'V1',
    status: 'In Review',
    approvalStatus: 'Approved',
    isLatestApprovedOrRejected: true,
    progress: 85,
    submittedBy: { name: 'Mike Chen', avatar: 'MC' },
    submittedDate: '2026-02-18',
    agingDays: 6,
    subContractor: 'ABC MEP Contractors',
    area: 'Building A',
    discipline: 'Structural',
    tradePackage: 'TP-001',
    activity: 'Construction',
    scope: 'Primary Works',
    spa: 'SPA-A',
    workPackage: 'WP-100',
    costType: 'Direct'
  },
  {
    id: 'sub-5',
    taskId: 'TASK-2100-3',
    taskName: 'HVAC Installation – Zone B',
    version: 'V1',
    status: 'In Review',
    approvalStatus: 'Rejected',
    isLatestApprovedOrRejected: true,
    progress: 45,
    submittedBy: { name: 'Sarah Lee', avatar: 'SL' },
    submittedDate: '2026-02-15',
    agingDays: 9,
    subContractor: 'ABC MEP Contractors',
    area: 'Zone B',
    discipline: 'HVAC',
    tradePackage: 'TP-003',
    activity: 'Installation',
    scope: 'Primary Works',
    spa: 'SPA-C',
    workPackage: 'WP-300',
    costType: 'Direct'
  },
  {
    id: 'sub-6',
    taskId: 'TASK-2200-7',
    taskName: 'Drywall Partition – Office Wing',
    version: 'V7',
    status: 'In Review',
    approvalStatus: 'Approved',
    isLatestApprovedOrRejected: true,
    progress: 92,
    submittedBy: { name: 'Tom Harris', avatar: 'TH' },
    submittedDate: '2026-02-23',
    agingDays: 1,
    subContractor: 'BuildPro Interiors',
    area: 'Office Wing',
    discipline: 'Interior',
    tradePackage: 'TP-004',
    activity: 'Finishing',
    scope: 'Secondary Works',
    spa: 'SPA-D',
    workPackage: 'WP-400',
    costType: 'Indirect'
  },
  {
    id: 'sub-7',
    taskId: 'TASK-1900-1',
    taskName: 'Foundation & Structural Frame – Building A',
    version: 'V2',
    status: 'In Review',
    approvalStatus: 'Approved',
    isLatestApprovedOrRejected: false,
    progress: 75,
    submittedBy: { name: 'Mike Chen', avatar: 'MC' },
    submittedDate: '2026-02-10',
    agingDays: 14,
    subContractor: 'ABC MEP Contractors',
    area: 'Building A',
    discipline: 'Structural',
    tradePackage: 'TP-001',
    activity: 'Construction',
    scope: 'Primary Works',
    spa: 'SPA-A',
    workPackage: 'WP-100',
    costType: 'Direct'
  },
  {
    id: 'sub-8',
    taskId: 'TASK-2100-3',
    taskName: 'HVAC Installation – Zone B',
    version: 'V2',
    status: 'In Review',
    approvalStatus: 'Rejected',
    isLatestApprovedOrRejected: false,
    progress: 42,
    submittedBy: { name: 'Sarah Lee', avatar: 'SL' },
    submittedDate: '2026-02-12',
    agingDays: 12,
    subContractor: 'ABC MEP Contractors',
    area: 'Zone B',
    discipline: 'HVAC',
    tradePackage: 'TP-003',
    activity: 'Installation',
    scope: 'Primary Works',
    spa: 'SPA-C',
    workPackage: 'WP-300',
    costType: 'Direct'
  },
  {
    id: 'sub-9',
    taskId: 'TASK-2200-7',
    taskName: 'Drywall Partition – Office Wing',
    version: 'V5',
    status: 'In Review',
    approvalStatus: 'Approved',
    isLatestApprovedOrRejected: false,
    progress: 78,
    submittedBy: { name: 'Tom Harris', avatar: 'TH' },
    submittedDate: '2026-02-14',
    agingDays: 10,
    subContractor: 'BuildPro Interiors',
    area: 'Office Wing',
    discipline: 'Interior',
    tradePackage: 'TP-004',
    activity: 'Finishing',
    scope: 'Secondary Works',
    spa: 'SPA-D',
    workPackage: 'WP-400',
    costType: 'Indirect'
  }
];

export default function ProgressApprovalQueue() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';
  
  // Submission Control state
  const [isProgressLocked, setIsProgressLocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  
  // Reporting Cycle state
  const [isReportingCycleActive, setIsReportingCycleActive] = useState(() => {
    const stored = localStorage.getItem('reportingCycleActive');
    return stored === 'true';
  });
  const [currentReportingDate, setCurrentReportingDate] = useState<string>(() => {
    return localStorage.getItem('currentReportingDate') || '';
  });
  const [lastReportingDate, setLastReportingDate] = useState<string>('2026-01-12'); // Mock last cycle date
  const [showStartCycleModal, setShowStartCycleModal] = useState(false);
  const [showEndCycleModal, setShowEndCycleModal] = useState(false);
  
  // Approval Confirmation Modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: 'approve' | 'reject';
    count: number;
    groupName?: string;
    callback: () => void;
  } | null>(null);
  
  // Table state
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(isProjectReadOnly ? 'All' : 'In Review');
  const [sortBy, setSortBy] = useState('Recent');
  const [groupBy, setGroupBy] = useState('Activity');
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('flat');
  
  // Group expand/collapse state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Hover state for tooltips
  const [showLockTooltip, setShowLockTooltip] = useState(false);
  const [showUnlockTooltip, setShowUnlockTooltip] = useState(false);
  const [showApproveTooltip, setShowApproveTooltip] = useState(false);
  const [showRejectTooltip, setShowRejectTooltip] = useState(false);

  // Revert confirmation modal state
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [revertSubmissionId, setRevertSubmissionId] = useState<string | null>(null);
  const [revertSubmissionName, setRevertSubmissionName] = useState('');

  // Grid layout for table columns  
  const gridTemplateColumns = '40px 2fr 100px 140px 180px 140px 120px 120px 100px';
  
  // Grid layout for grouped table columns - optimized to eliminate whitespace
  const groupedGridTemplateColumns = '40px 2fr 100px 130px 150px 180px 130px 140px';

  // Filter and sort submissions
  const getFilteredAndSortedSubmissions = () => {
    let filtered = [...MOCK_SUBMISSIONS];
    
    // For read-only projects (On Hold, Completed, Archived), exclude "In Review" submissions
    // as they would have been auto-rejected when the project status changed
    if (isProjectReadOnly) {
      filtered = filtered.filter(s => s.approvalStatus !== 'In Review');
    }
    
    // Apply status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(s => s.approvalStatus === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.taskName.toLowerCase().includes(query) ||
        s.taskId.toLowerCase().includes(query) ||
        s.submittedBy.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortBy === 'Recent') {
      filtered.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
    } else if (sortBy === 'Oldest') {
      filtered.sort((a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
    } else if (sortBy === 'Progress') {
      filtered.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === 'Aging') {
      filtered.sort((a, b) => b.agingDays - a.agingDays);
    }
    
    return filtered;
  };
  
  const filteredSubmissions = getFilteredAndSortedSubmissions();
  const pendingCount = filteredSubmissions.filter(s => s.approvalStatus === 'In Review').length;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubmissions(new Set());
    } else {
      // Only select "In Review" submissions
      const reviewableSubmissions = filteredSubmissions.filter(s => s.approvalStatus === 'In Review');
      setSelectedSubmissions(new Set(reviewableSubmissions.map(s => s.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
    // Check if all "In Review" submissions are selected
    const reviewableSubmissions = filteredSubmissions.filter(s => s.approvalStatus === 'In Review');
    setSelectAll(newSelected.size === reviewableSubmissions.length && reviewableSubmissions.length > 0);
  };

  const confirmLockToggle = () => {
    setIsProgressLocked(!isProgressLocked);
    toast.success(isProgressLocked 
      ? 'Progress submissions unlocked successfully' 
      : 'Progress submissions locked successfully');
    setShowLockModal(false);
  };

  const handleStartReportingCycle = (date: string) => {
    setCurrentReportingDate(date);
    setIsReportingCycleActive(true);
    localStorage.setItem('reportingCycleActive', 'true');
    localStorage.setItem('currentReportingDate', date);
    setShowStartCycleModal(false);
    toast.success('Reporting cycle started successfully');
  };

  const handleEndReportingCycle = () => {
    setLastReportingDate(currentReportingDate); // Save current as last
    setCurrentReportingDate('');
    setIsReportingCycleActive(false);
    localStorage.setItem('reportingCycleActive', 'false');
    localStorage.removeItem('currentReportingDate');
    setShowEndCycleModal(false);
    toast.success('Reporting cycle ended successfully');
  };

  const handleApproveAll = () => {
    const selectedCount = selectedSubmissions.size;
    if (selectedCount === 0) {
      toast.error('Please select at least one submission to approve');
      return;
    }
    // Show confirmation modal
    setPendingAction({
      action: 'approve',
      count: selectedCount,
      callback: () => {
        toast.success(`${selectedCount} progress submission${selectedCount > 1 ? 's' : ''} approved successfully`);
        // Clear selection after approval
        setSelectedSubmissions(new Set());
        setSelectAll(false);
      }
    });
    setShowApprovalModal(true);
  };

  const handleRejectAll = () => {
    const selectedCount = selectedSubmissions.size;
    if (selectedCount === 0) {
      toast.error('Please select at least one submission to reject');
      return;
    }
    // Show confirmation modal
    setPendingAction({
      action: 'reject',
      count: selectedCount,
      callback: () => {
        toast.error(`${selectedCount} progress submission${selectedCount > 1 ? 's' : ''} rejected successfully`);
        // Clear selection after rejection
        setSelectedSubmissions(new Set());
        setSelectAll(false);
      }
    });
    setShowApprovalModal(true);
  };
  
  const handleRevert = (submissionId: string, taskName: string) => {
    setRevertSubmissionId(submissionId);
    setRevertSubmissionName(taskName);
    setShowRevertModal(true);
  };

  const confirmRevert = () => {
    if (revertSubmissionId) {
      toast.success(`Progress submission reverted successfully`);
      setShowRevertModal(false);
      setRevertSubmissionId(null);
      setRevertSubmissionName('');
    }
  };

  const handleRowClick = (submission: ProgressSubmission) => {
    // Navigate to detail page based on context
    if (projectId) {
      navigate(`/app/projects/${projectId}/progress-approvals/${submission.id}/review`);
    } else {
      navigate(`/app/approvals/progress/${submission.id}/review`);
    }
  };
  
  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };
  
  // Group submissions based on groupBy selection
  const groupSubmissions = () => {
    if (groupBy === 'None') {
      return { 'All': filteredSubmissions };
    }
    
    const grouped: { [key: string]: ProgressSubmission[] } = {};
    let field: keyof ProgressSubmission = 'subContractor';
    
    if (groupBy === 'Sub-Contractors') field = 'subContractor';
    else if (groupBy === 'Area') field = 'area';
    else if (groupBy === 'Discipline') field = 'discipline';
    else if (groupBy === 'Trade Package') field = 'tradePackage';
    else if (groupBy === 'Activity') field = 'activity';
    else if (groupBy === 'Scope') field = 'scope';
    else if (groupBy === 'SPA') field = 'spa';
    else if (groupBy === 'Work Package') field = 'workPackage';
    else if (groupBy === 'Cost Type') field = 'costType';
    
    filteredSubmissions.forEach(submission => {
      const key = String(submission[field]);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(submission);
    });
    
    return grouped;
  };
  
  const groupedData = groupSubmissions();

  // Auto-expand all groups when groupBy changes
  useEffect(() => {
    if (groupBy !== 'None') {
      setExpandedGroups(new Set(Object.keys(groupedData)));
    }
  }, [groupBy]);

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Header with Lock/Unlock Button */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '4px'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0'
            }}>
              Progress Approvals
            </h1>
            <SubmissionStatusBadge isLocked={isProgressLocked} />
          </div>
          <p style={{
            fontSize: '14px',
            color: '#5F6B7A',
            margin: '0'
          }}>
            Review and approve progress submissions
          </p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Reporting Cycle Button */}
          {!isReportingCycleActive ? (
            <button
              onClick={() => !isProjectReadOnly && setShowStartCycleModal(true)}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Actions disabled - Project is On Hold" : ""}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid #D8DEE8',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '4px',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: isProjectReadOnly ? '#9CA3AF' : '#374151',
                opacity: isProjectReadOnly ? 0.6 : 1
              }}
              onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <PlayCircle size={14} />
              Start Reporting Cycle
            </button>
          ) : (
            <button
              onClick={() => !isProjectReadOnly && setShowEndCycleModal(true)}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Actions disabled - Project is On Hold" : ""}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid #D8DEE8',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '4px',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: isProjectReadOnly ? '#9CA3AF' : '#374151',
                opacity: isProjectReadOnly ? 0.6 : 1
              }}
              onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <StopCircle size={14} />
              End Reporting Cycle
            </button>
          )}

          {/* Lock/Unlock Button */}
          {!isProgressLocked ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => !isProjectReadOnly && setShowLockModal(true)}
                disabled={isProjectReadOnly}
                onMouseEnter={() => setShowLockTooltip(true)}
                onMouseLeave={() => setShowLockTooltip(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                  borderRadius: '4px',
                  cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isProjectReadOnly ? '#9CA3AF' : '#374151',
                  opacity: isProjectReadOnly ? 0.6 : 1
                }}
              >
                <Lock size={14} />
                Lock Submissions
              </button>
              {showLockTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  right: '0',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {isProjectReadOnly ? 'Actions disabled - Project is On Hold' : 'Prevent users from submitting new progress updates'}
                </div>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => !isProjectReadOnly && setShowUnlockModal(true)}
                disabled={isProjectReadOnly}
                onMouseEnter={() => setShowUnlockTooltip(true)}
                onMouseLeave={() => setShowUnlockTooltip(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                  borderRadius: '4px',
                  cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isProjectReadOnly ? '#9CA3AF' : '#374151',
                  opacity: isProjectReadOnly ? 0.6 : 1
                }}
              >
                <Unlock size={14} />
                Unlock Submissions
              </button>
              {showUnlockTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  right: '0',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {isProjectReadOnly ? 'Actions disabled - Project is On Hold' : 'Allow users to submit new progress updates'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reporting Cycle Indicator */}
      {isReportingCycleActive && currentReportingDate && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#E4EEFE',
          border: '1px solid #D8DEE8',
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Calendar size={16} style={{ color: '#3B82F6', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: '13px',
              color: '#5F6B7A',
              marginRight: '8px'
            }}>
              Reporting Cycle Active:
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1F2937'
            }}>
              {new Date(currentReportingDate).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'inline-flex',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          backgroundColor: '#F9FAFB',
          padding: '2px'
        }}>
          <button
            onClick={() => setViewMode('flat')}
            style={{
              height: '34px',
              padding: '0 14px',
              border: 'none',
              backgroundColor: viewMode === 'flat' ? '#FFFFFF' : 'transparent',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: viewMode === 'flat' ? '#1F2937' : '#6B7280',
              boxShadow: viewMode === 'flat' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <Table2 size={14} />
            Flat View
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            style={{
              height: '34px',
              padding: '0 14px',
              border: 'none',
              backgroundColor: viewMode === 'grouped' ? '#FFFFFF' : 'transparent',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: viewMode === 'grouped' ? '#1F2937' : '#6B7280',
              boxShadow: viewMode === 'grouped' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <LayoutGrid size={14} />
            Grouped View
          </button>
        </div>
      </div>

      {/* Flat View */}
      {viewMode === 'flat' && (
        <>
          {/* Toolbar - Only Approve/Reject Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Action Buttons */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleRejectAll}
                disabled={selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DC2626',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#9CA3AF' : '#DC2626',
                  cursor: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                  opacity: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (selectedSubmissions.size > 0 && isReportingCycleActive && !isProjectReadOnly) {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                  }
                  if (!isReportingCycleActive || isProjectReadOnly) {
                    setShowRejectTooltip(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSubmissions.size > 0 && isReportingCycleActive && !isProjectReadOnly) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                  setShowRejectTooltip(false);
                }}
              >
                Reject {selectedSubmissions.size > 0 ? `(${selectedSubmissions.size})` : ''}
              </button>
              {showRejectTooltip && (!isReportingCycleActive || isProjectReadOnly) && (
                <div style={{
                  position: 'absolute',
                  bottom: '-48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {isProjectReadOnly ? 'Actions disabled - Project is On Hold' : 'Reporting Cycle must be started to enable this action'}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={handleApproveAll}
                disabled={selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#F3F4F6' : '#FD4314',
                  border: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? '1px solid #D8DEE8' : 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#9CA3AF' : '#FFFFFF',
                  cursor: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                  opacity: (selectedSubmissions.size === 0 || !isReportingCycleActive || isProjectReadOnly) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (selectedSubmissions.size > 0 && isReportingCycleActive && !isProjectReadOnly) {
                    e.currentTarget.style.backgroundColor = '#E63910';
                  }
                  if (!isReportingCycleActive || isProjectReadOnly) {
                    setShowApproveTooltip(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSubmissions.size > 0 && isReportingCycleActive && !isProjectReadOnly) {
                    e.currentTarget.style.backgroundColor = '#FD4314';
                  }
                  setShowApproveTooltip(false);
                }}
              >
                Approve {selectedSubmissions.size > 0 ? `(${selectedSubmissions.size})` : ''}
              </button>
              {showApproveTooltip && (!isReportingCycleActive || isProjectReadOnly) && (
                <div style={{
                  position: 'absolute',
                  bottom: '-48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {isProjectReadOnly ? 'Actions disabled - Project is On Hold' : 'Reporting Cycle must be started to enable this action'}
                </div>
              )}
            </div>
          </div>

          {/* Flat View Table - Always ungrouped */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns,
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE',
              height: '40px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Task Details
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Version
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Progress
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Submitted By
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Submitted At
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Aging
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Status
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Action
              </div>
            </div>

            {/* Table Rows */}
            {filteredSubmissions.map((submission, index) => (
              <div
                key={submission.id}
                onClick={() => handleRowClick(submission)}
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                  borderBottom: index < filteredSubmissions.length - 1 ? '1px solid #E5E7EB' : 'none',
                  minHeight: '60px',
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.has(submission.id)}
                    onChange={() => handleSelectRow(submission.id)}
                    disabled={submission.approvalStatus !== 'In Review'}
                    style={{ cursor: submission.approvalStatus === 'In Review' ? 'pointer' : 'not-allowed', opacity: submission.approvalStatus === 'In Review' ? 1 : 0.5 }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  gap: '2px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1F2937'
                  }}>
                    {submission.taskName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    {submission.taskId}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {submission.version}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  gap: '8px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${submission.progress}%`,
                      height: '100%',
                      backgroundColor: '#FD4314',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1F2937',
                    minWidth: '35px'
                  }}>
                    {submission.progress}%
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#E4EEFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    {submission.submittedBy.avatar}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: '#374151'
                  }}>
                    {submission.submittedBy.name}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {formatDate(submission.submittedDate)}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {submission.agingDays}d
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px'
                }}>
                  <span style={{
                    backgroundColor: submission.approvalStatus === 'Approved' ? '#D1FAE5' : submission.approvalStatus === 'Rejected' ? '#FEE2E2' : '#E4EEFE',
                    color: submission.approvalStatus === 'Approved' ? '#059669' : submission.approvalStatus === 'Rejected' ? '#DC2626' : '#4169E1',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {submission.approvalStatus}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 16px'
                }}>
                  {submission.approvalStatus === 'In Review' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(submission);
                      }}
                      style={{
                        height: '32px',
                        padding: '0 16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #FD4314',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#FD4314',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF5F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      Review
                    </button>
                  ) : submission.isLatestApprovedOrRejected ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        !isProjectReadOnly && handleRevert(submission.id, submission.taskName);
                      }}
                      disabled={isProjectReadOnly}
                      title={isProjectReadOnly ? "Actions disabled - Project is On Hold" : ""}
                      style={{
                        height: '32px',
                        padding: '0 16px',
                        backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                        border: '1px solid #DC2626',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isProjectReadOnly ? '#9CA3AF' : '#DC2626',
                        cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                        opacity: isProjectReadOnly ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FEE2E2');
                      }}
                      onMouseLeave={(e) => {
                        !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FFFFFF');
                      }}
                    >
                      Revert
                    </button>
                  ) : (
                    <span style={{
                      fontSize: '12px',
                      color: '#9CA3AF',
                      fontStyle: 'italic'
                    }}>
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Grouped View */}
      {viewMode === 'grouped' && (
        <>
          {/* Toolbar with Search, Filters, and Group By */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280'
                }}
              />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '36px',
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 32px 0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="All">All Status</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 32px 0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Recent">Recent First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Progress">By Progress</option>
                <option value="Aging">By Aging</option>
              </select>

              {/* Group By */}
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 32px 0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Activity">Group by Activity</option>
                <option value="Sub-Contractors">Group by Sub-Contractors</option>
                <option value="Area">Group by Area</option>
                <option value="Discipline">Group by Discipline</option>
                <option value="Trade Package">Group by Trade Package</option>
                <option value="Scope">Group by Scope</option>
                <option value="SPA">Group by SPA</option>
                <option value="Work Package">Group by Work Package</option>
                <option value="Cost Type">Group by Cost Type</option>
              </select>
            </div>
          </div>

          {/* Grouped Tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries(groupedData).map(([groupName, submissions]) => {
              const isExpanded = expandedGroups.has(groupName);
              const groupPendingCount = submissions.filter(s => s.approvalStatus === 'In Review').length;
              const groupSelectedCount = submissions.filter(s => selectedSubmissions.has(s.id)).length;
              const groupReviewableSubmissions = submissions.filter(s => s.approvalStatus === 'In Review');
              const allGroupReviewableSelected = groupReviewableSubmissions.length > 0 &&
                groupReviewableSubmissions.every(s => selectedSubmissions.has(s.id));

              const handleSelectAllInGroup = () => {
                const newSelected = new Set(selectedSubmissions);
                if (allGroupReviewableSelected) {
                  groupReviewableSubmissions.forEach(s => newSelected.delete(s.id));
                } else {
                  groupReviewableSubmissions.forEach(s => newSelected.add(s.id));
                }
                setSelectedSubmissions(newSelected);
                const allReviewableSubmissions = filteredSubmissions.filter(s => s.approvalStatus === 'In Review');
                setSelectAll(allReviewableSubmissions.every(s => newSelected.has(s.id)) && allReviewableSubmissions.length > 0);
              };

              return (
                <div key={groupName}>
                  {/* Group Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      marginBottom: isExpanded ? '12px' : '0'
                    }}
                  >
                    <div
                      onClick={() => toggleGroup(groupName)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1F2937'
                      }}>
                        {groupName}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        marginLeft: '4px'
                      }}>
                        ({submissions.length})
                      </span>
                    </div>

                    {/* Approve/Reject buttons in group header */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (groupSelectedCount === 0) {
                            toast.error('Please select at least one submission to reject');
                            return;
                          }
                          setPendingAction({
                            action: 'reject',
                            count: groupSelectedCount,
                            groupName: groupName,
                            callback: () => {
                              toast.error(`${groupSelectedCount} submission${groupSelectedCount > 1 ? 's' : ''} rejected in ${groupName}`);
                              const newSelected = new Set(selectedSubmissions);
                              submissions.forEach(s => newSelected.delete(s.id));
                              setSelectedSubmissions(newSelected);
                              setSelectAll(false);
                            }
                          });
                          setShowApprovalModal(true);
                        }}
                        disabled={groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly}
                        title={isProjectReadOnly ? 'Actions disabled - Project is On Hold' : (!isReportingCycleActive ? 'Reporting Cycle must be started to enable this action' : '')}
                        style={{
                          height: '32px',
                          padding: '0 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #DC2626',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#9CA3AF' : '#DC2626',
                          cursor: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                          opacity: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (groupSelectedCount > 0 && isReportingCycleActive && !isProjectReadOnly) {
                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (groupSelectedCount > 0 && isReportingCycleActive && !isProjectReadOnly) {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }
                        }}
                      >
                        Reject {groupSelectedCount > 0 ? `(${groupSelectedCount})` : ''}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (groupSelectedCount === 0) {
                            toast.error('Please select at least one submission to approve');
                            return;
                          }
                          setPendingAction({
                            action: 'approve',
                            count: groupSelectedCount,
                            groupName: groupName,
                            callback: () => {
                              toast.success(`${groupSelectedCount} submission${groupSelectedCount > 1 ? 's' : ''} approved in ${groupName}`);
                              const newSelected = new Set(selectedSubmissions);
                              submissions.forEach(s => newSelected.delete(s.id));
                              setSelectedSubmissions(newSelected);
                              setSelectAll(false);
                            }
                          });
                          setShowApprovalModal(true);
                        }}
                        disabled={groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly}
                        title={isProjectReadOnly ? 'Actions disabled - Project is On Hold' : (!isReportingCycleActive ? 'Reporting Cycle must be started to enable this action' : '')}
                        style={{
                          height: '32px',
                          padding: '0 14px',
                          backgroundColor: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#F3F4F6' : '#FD4314',
                          border: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? '1px solid #D8DEE8' : 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? '#9CA3AF' : '#FFFFFF',
                          cursor: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                          opacity: (groupSelectedCount === 0 || !isReportingCycleActive || isProjectReadOnly) ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (groupSelectedCount > 0 && isReportingCycleActive && !isProjectReadOnly) {
                            e.currentTarget.style.backgroundColor = '#E63910';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (groupSelectedCount > 0 && isReportingCycleActive && !isProjectReadOnly) {
                            e.currentTarget.style.backgroundColor = '#FD4314';
                          }
                        }}
                      >
                        Approve {groupSelectedCount > 0 ? `(${groupSelectedCount})` : ''}
                      </button>
                    </div>
                  </div>

                  {/* Group Table */}
                  {isExpanded && (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      {/* Table Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: groupedGridTemplateColumns,
                        backgroundColor: '#E4EEF8',
                        borderBottom: '1px solid #C8D9EE',
                        height: '40px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <input
                            type="checkbox"
                            checked={allGroupReviewableSelected}
                            onChange={handleSelectAllInGroup}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Task Details
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Version
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Status
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Progress
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Submitted By
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Date
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Action
                        </div>
                      </div>

                      {/* Table Rows */}
                      {submissions.map((submission, index) => (
                        <div
                          key={submission.id}
                          onClick={() => handleRowClick(submission)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: groupedGridTemplateColumns,
                            borderBottom: index < submissions.length - 1 ? '1px solid #E5E7EB' : 'none',
                            minHeight: '52px',
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                            cursor: 'pointer'
                          }}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.has(submission.id)}
                              onChange={() => handleSelectRow(submission.id)}
                              disabled={submission.approvalStatus !== 'In Review'}
                              style={{ cursor: submission.approvalStatus === 'In Review' ? 'pointer' : 'not-allowed', opacity: submission.approvalStatus === 'In Review' ? 1 : 0.5 }}
                            />
                          </div>

                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '8px 16px',
                            gap: '2px'
                          }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#1F2937'
                            }}>
                              {submission.taskName}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6B7280'
                            }}>
                              {submission.taskId}
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151'
                          }}>
                            {submission.version}
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px'
                          }}>
                            <span style={{
                              backgroundColor: submission.approvalStatus === 'Approved' ? '#D1FAE5' : submission.approvalStatus === 'Rejected' ? '#FEE2E2' : '#E4EEFE',
                              color: submission.approvalStatus === 'Approved' ? '#059669' : submission.approvalStatus === 'Rejected' ? '#DC2626' : '#4169E1',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {submission.approvalStatus}
                            </span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            gap: '8px'
                          }}>
                            <div style={{
                              flex: 1,
                              height: '6px',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${submission.progress}%`,
                                height: '100%',
                                backgroundColor: '#FD4314',
                                borderRadius: '3px'
                              }} />
                            </div>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#1F2937',
                              minWidth: '35px'
                            }}>
                              {submission.progress}%
                            </span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#E4EEFE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: '#1F2937'
                            }}>
                              {submission.submittedBy.avatar}
                            </div>
                            <span style={{
                              fontSize: '13px',
                              color: '#374151'
                            }}>
                              {submission.submittedBy.name}
                            </span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151'
                          }}>
                            {formatDate(submission.submittedDate)}
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            fontSize: '13px',
                            color: '#374151'
                          }}>
                            {submission.approvalStatus === 'In Review' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(submission);
                                }}
                                style={{
                                  height: '32px',
                                  padding: '0 16px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #FD4314',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#FD4314',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFF5F2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                }}
                              >
                                Review
                              </button>
                            ) : submission.isLatestApprovedOrRejected ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  !isProjectReadOnly && handleRevert(submission.id, submission.taskName);
                                }}
                                disabled={isProjectReadOnly}
                                title={isProjectReadOnly ? "Actions disabled - Project is On Hold" : ""}
                                style={{
                                  height: '32px',
                                  padding: '0 16px',
                                  backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                                  border: '1px solid #DC2626',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: isProjectReadOnly ? '#9CA3AF' : '#DC2626',
                                  cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                                  opacity: isProjectReadOnly ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                  !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FEE2E2');
                                }}
                                onMouseLeave={(e) => {
                                  !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FFFFFF');
                                }}
                              >
                                Revert
                              </button>
                            ) : (
                              <span style={{
                                fontSize: '12px',
                                color: '#9CA3AF',
                                fontStyle: 'italic'
                              }}>
                                —
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Lock Confirmation Modal */}
      {showLockModal && (
        <LockConfirmationModal
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
          onConfirm={confirmLockToggle}
          isLocking={!isProgressLocked}
          type="progress"
          projectId={projectId}
        />
      )}

      {/* Unlock Modal */}
      <UnlockSubmissionsModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={() => {
          setIsProgressLocked(false);
          setShowUnlockModal(false);
          toast.success('Progress submissions unlocked successfully');
        }}
        type="progress"
      />

      {/* Start Reporting Cycle Modal */}
      <StartReportingCycleModal
        isOpen={showStartCycleModal}
        onClose={() => setShowStartCycleModal(false)}
        onConfirm={handleStartReportingCycle}
        lastReportingDate={lastReportingDate}
      />

      {/* End Reporting Cycle Modal */}
      <EndReportingCycleModal
        isOpen={showEndCycleModal}
        onClose={() => setShowEndCycleModal(false)}
        onConfirm={handleEndReportingCycle}
        currentReportingDate={currentReportingDate}
      />

      {/* Approval Confirmation Modal */}
      {showApprovalModal && pendingAction && (
        <ApprovalConfirmationModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setPendingAction(null);
          }}
          onConfirm={() => {
            if (pendingAction) {
              pendingAction.callback();
            }
          }}
          action={pendingAction.action}
          count={pendingAction.count}
          groupName={pendingAction.groupName}
          reportingDate={currentReportingDate}
        />
      )}

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
            borderRadius: '4px',
            width: '480px',
            border: '1px solid #E5E7EB'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={20} color="#DC2626" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: '0 0 2px 0'
                }}>
                  Confirm Revert Action
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: '0'
                }}>
                  This action will restore the previous approved progress
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{
              padding: '24px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                margin: '0 0 16px 0',
                lineHeight: '1.6'
              }}>
                Are you sure you want to revert the progress for <strong>{revertSubmissionName}</strong>? This will change the status to "Pending" and restore the previously approved progress value.
              </p>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#FFF7ED',
                border: '1px solid #FED7AA',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#92400E',
                lineHeight: '1.6'
              }}>
                <strong>Note:</strong> The reverted version will need to be reviewed again before any further revert actions can be taken.
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowRevertModal(false);
                  setRevertSubmissionId(null);
                  setRevertSubmissionName('');
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRevert}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
              >
                Confirm Revert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
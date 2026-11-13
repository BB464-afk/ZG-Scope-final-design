import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import StandardDropdown from '../components/StandardDropdown';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  Upload,
  X,
  RotateCcw,
  User,
  AlertCircle,
  Calendar,
  DollarSign,
  Package,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Clock,
  Activity,
  Edit,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  File,
  Paperclip,
  Eye,
  Filter,
  ArrowRight,
  FileCheck,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';
import '../styles/ag-grid-theme.css';
// CLIENT VIEW MODE: Import placeholder component for hidden tabs
import DesignInProgress from '../components/DesignInProgress';
import { hiddenPages } from '../config/clientViewConfig';
import { AttachmentsTabContent } from '../components/AttachmentsTabContent';
import { DiscussionTabContent } from '../components/DiscussionTabContent';

type ViewType = 'overview' | 'evidence' | 'discussion' | 'versions' | 'audit';

interface ROCStep {
  id: number;
  stepNumber?: string;
  stepName: string;
  stepWeightage: number;
  measurementType: 'Percentage' | 'Quantity';
  totalQuantity: number | null;
  installedQuantity: number | null;
  percentComplete: number;
  expanded: boolean;
  evidenceCount?: number;
  status: 'completed' | 'in-progress' | 'behind' | 'not-started';
  hasSubSteps?: boolean;
  subSteps?: ROCSubStep[];
  drawingLink?: string;
}

interface ROCSubStep {
  id: number;
  subStepNumber: string;
  subStepName: string;
  weightage: number;
  totalQuantity: number;
  installedQuantity: number;
  percentComplete: number;
  evidenceCount?: number;
  status: 'completed' | 'in-progress' | 'behind' | 'not-started';
}

interface Comment {
  id: number;
  username: string;
  avatar: string;
  role: string;
  timestamp: string;
  text: string;
  replies: Array<{
    id: number;
    username: string;
    avatar: string;
    role: string;
    timestamp: string;
    text: string;
  }>;
}

interface Attachment {
  id: number;
  fileName: string;
  fileType: 'url' | 'file' | 'image';
  fileExtension?: string; // e.g., 'pdf', 'xlsx', 'doc'
  fileSize?: string; // e.g., '2.4 MB'
  url?: string;
  uploadedBy: string;
  uploadDate: string;
  relatedStep?: string;
  isEvidence?: boolean; // Flag for evidence files that cannot be deleted
  version?: string; // e.g., 'V1', 'V2', 'V3' - only for evidence files
}

interface VersionHistoryItem {
  id: number;
  version: string;
  status: 'Approved' | 'Submitted' | 'Superseded' | 'Rejected' | 'Draft Saved' | 'In Review';
  description: string;
  submittedBy: string;
  reviewedBy: string;
  submittedDate: string;
  approvedDate: string;
  progressPercent: number;
}

interface AuditLogItem {
  id: number;
  actionTitle: string;
  actionType: 'TASK_CREATE' | 'TASK_UPDATE' | 'TASK_STATUS_CHANGE' | 'VERSION_CREATE' | 'VERSION_STATUS_CHANGE';
  module: 'Task Management' | 'Progress Tracking';
  taskId: string;
  projectId: string;
  performedBy: string;
  timestamp: string;
  expanded?: boolean;
  // Different payload types based on action
  taskCreateData?: {
    taskName: string;
    activityName: string;
    status: string;
    phase: string;
    discipline: string;
    tradePackage: string;
    subcontractor: string;
    startDate: string;
    endDate: string;
  };
  taskUpdateData?: {
    changes: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }>;
  };
  taskStatusChangeData?: {
    oldStatus: string;
    newStatus: string;
  };
  versionCreateData?: {
    version: string;
    basedOnVersion: string;
    latestApprovedVersion: string;
    initialProgress: number;
  };
  versionStatusChangeData?: {
    version: string;
    oldStatus: string;
    newStatus: string;
    previousApprovedProgress: number;
    submittedProgress: number;
    approvedProgress: number;
    comments?: string;
  };
}

// Mock Data
const MOCK_TASK_DATA = {
  taskId: 'MYD-PH1-S19-005-02124',
  taskName: 'MYD Power Distribution - S19 - MYD Modular MV Switchgear - Lift and Place (2)',
  status: 'In Progress',
  phase: '004 - Construction',
  discipline: '005 - Electrical',
  tradePackage: 'S19-A5000 - MYD Secondary Substation Electrical Assembly',
  subContractor: '000-021 - HF Industrie',
  deliveryPackage: 'CON03 - Fitout',
  area: 'MYD - Mechanical Yard',
  building: 'MYD - Mechanical Yard',
  tranche: 'T1 - Tranche 1',
  spa: 'S19 - MYD Secondary Substation',
  costType: '50 - Assembly',
  costCode: 'MYD.PH1.CON03.S19.50',
  completionPercent: 65,
  progressChange: 12,
  lastUpdatedBy: 'Bogdan-Constantin Pana',
  lastUpdatedDays: 1,
  scheduleStatus: 'On Track',
  costStatus: 'Under Budget',
  productivityTrend: 8,
  earnedCost: 10067,
  installedQuantity: 0.07,
  earnedHours: 39,
  budgetedCost: 15488.71,
  totalQuantity: 0.10,
  budgetedManHours: 60,
  reporter: 'Bogdan-Constantin Pana',
  role: 'Contributor',
  estimatedBudgetHours: 60,
  estimatedBudgetCost: 15488.71,
  approvedChanges: 0,
  approvedChangesCost: 0,
  currentBudgetHours: 60,
  currentBudgetCost: 15488.71,
  remainingHours: 21,
  remainingValue: 5421.71,
  baselineStart: '01/10/2026',
  baselineFinish: '30/11/2026',
  totalQuantityToInstall: 0.10,
  actualStart: '03/11/2026',
  actualFinish: '—',
  quantityInstalled: 0.07
};

const MOCK_ROC_STEPS: ROCStep[] = [
  {
    id: 1,
    stepNumber: '1.1',
    stepName: 'Site Preparation',
    stepWeightage: 15,
    measurementType: 'Quantity',
    totalQuantity: 2000,
    installedQuantity: 1500,
    percentComplete: 75,
    expanded: false,
    evidenceCount: 2,
    status: 'in-progress',
    hasSubSteps: false,
    drawingLink: 'https://drive.google.com/folders/S02-ROC002-STEP1'
  },
  {
    id: 2,
    stepNumber: '1.2',
    stepName: 'Foundation Work',
    stepWeightage: 25,
    measurementType: 'Percentage',
    totalQuantity: null,
    installedQuantity: null,
    percentComplete: 42,
    expanded: false,
    evidenceCount: 5,
    status: 'in-progress',
    hasSubSteps: true,
    drawingLink: 'https://drive.google.com/folders/S02-ROC002-STEP2',
    subSteps: [
      {
        id: 1,
        subStepNumber: '1.2.1',
        subStepName: 'Excavation & Earthwork',
        weightage: 40,
        totalQuantity: 100,
        installedQuantity: 50,
        percentComplete: 50,
        evidenceCount: 2,
        status: 'in-progress'
      },
      {
        id: 2,
        subStepNumber: '1.2.2',
        subStepName: 'Reinforcement Installation',
        weightage: 35,
        totalQuantity: 100,
        installedQuantity: 45,
        percentComplete: 45,
        evidenceCount: 1,
        status: 'in-progress'
      },
      {
        id: 3,
        subStepNumber: '1.2.3',
        subStepName: 'Formwork Setup',
        weightage: 25,
        totalQuantity: 100,
        installedQuantity: 30,
        percentComplete: 30,
        evidenceCount: 2,
        status: 'in-progress'
      }
    ]
  },
  {
    id: 3,
    stepNumber: '1.3',
    stepName: 'Structural Steel Erection',
    stepWeightage: 30,
    measurementType: 'Quantity',
    totalQuantity: 1500,
    installedQuantity: 1500,
    percentComplete: 100,
    expanded: false,
    evidenceCount: 3,
    status: 'completed',
    hasSubSteps: false,
    drawingLink: 'https://drive.google.com/folders/S02-ROC002-STEP3'
  },
  {
    id: 4,
    stepNumber: '1.4',
    stepName: 'Concrete Pouring',
    stepWeightage: 20,
    measurementType: 'Quantity',
    totalQuantity: 500,
    installedQuantity: 400,
    percentComplete: 80,
    expanded: false,
    evidenceCount: 4,
    status: 'in-progress',
    hasSubSteps: false
  },
  {
    id: 5,
    stepNumber: '1.5',
    stepName: 'Finishing Works',
    stepWeightage: 10,
    measurementType: 'Percentage',
    totalQuantity: null,
    installedQuantity: null,
    percentComplete: 35,
    expanded: false,
    evidenceCount: 1,
    status: 'in-progress',
    hasSubSteps: false
  }
];

const MOCK_ATTACHMENTS: Attachment[] = [
  { id: 1, fileName: 'Drawing_Rev3.pdf', fileType: 'file', fileExtension: 'pdf', fileSize: '2.4 MB', uploadedBy: 'John Smith', uploadDate: '10/02/2024', relatedStep: 'Mobilization & Site Preparation', isEvidence: true, version: 'V3' },
  { id: 2, fileName: 'Quality_Check_Report.pdf', fileType: 'file', fileExtension: 'pdf', fileSize: '1.8 MB', uploadedBy: 'Anna Kumar', uploadDate: '20/02/2024', relatedStep: 'Welding & Joint Testing', isEvidence: true, version: 'V2' },
  { id: 3, fileName: 'Material_Specifications.xlsx', fileType: 'file', fileExtension: 'xlsx', fileSize: '156 KB', uploadedBy: 'Mike Chen', uploadDate: '15/02/2024', relatedStep: 'Pipe Installation & Routing' },
  { id: 4, fileName: 'Progress_Report.docx', fileType: 'file', fileExtension: 'docx', fileSize: '892 KB', uploadedBy: 'Sarah Johnson', uploadDate: '22/02/2024', relatedStep: 'Pipe Installation & Routing', isEvidence: true, version: 'V1' },
  { id: 5, fileName: 'BIM Model Viewer', fileType: 'url', url: 'https://autodesk.com/viewer/abc123', uploadedBy: 'Sarah Johnson', uploadDate: '12/02/2024' },
  { id: 6, fileName: 'Navisworks Collaboration Link', fileType: 'url', url: 'https://navisworks.autodesk.com/project/xyz789', uploadedBy: 'Mike Chen', uploadDate: '18/02/2024' },
  { id: 7, fileName: 'Revit Cloud Model', fileType: 'url', url: 'https://acc.autodesk.com/docs/files/model123', uploadedBy: 'John Smith', uploadDate: '25/02/2024' }
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    username: 'Sarah Johnson',
    avatar: 'SJ',
    role: 'QA Manager',
    timestamp: '24/02/2024 14:30',
    text: 'Progress is looking good. Please ensure all welding inspection reports are uploaded before marking this step complete.',
    replies: [
      {
        id: 11,
        username: 'Mike Chen',
        avatar: 'MC',
        role: 'Site Engineer',
        timestamp: '24/02/2024 15:45',
        text: 'Noted. Will upload the reports by EOD today.'
      }
    ]
  },
  {
    id: 2,
    username: 'David Martinez',
    avatar: 'DM',
    role: 'Project Manager',
    timestamp: '23/02/2024 10:15',
    text: 'Great progress on pipe installation. Team is doing an excellent job staying on schedule.',
    replies: []
  }
];

const MOCK_VERSION_HISTORY: VersionHistoryItem[] = [
  {
    id: 1,
    version: 'v5',
    status: 'In Review',
    description: 'Progress update with additional structural work completed',
    submittedBy: 'John Smith',
    reviewedBy: 'David Martinez',
    submittedDate: '08/03/2026',
    approvedDate: '—',
    progressPercent: 82
  },
  {
    id: 2,
    version: 'v4',
    status: 'Approved',
    description: 'Updated insulation quantities based on field measurements (Reverted and Re-approved)',
    submittedBy: 'John Smith',
    reviewedBy: 'David Martinez',
    submittedDate: '20/02/2024',
    approvedDate: '25/02/2024',
    progressPercent: 75
  },
  {
    id: 3,
    version: 'v3',
    status: 'Rejected',
    description: 'Adjusted welding schedule due to material delivery delay',
    submittedBy: 'Sarah Johnson',
    reviewedBy: 'David Martinez',
    submittedDate: '15/02/2024',
    approvedDate: '16/02/2024',
    progressPercent: 65
  },
  {
    id: 4,
    version: 'v2',
    status: 'Approved',
    description: 'Initial baseline progress update',
    submittedBy: 'John Smith',
    reviewedBy: 'David Martinez',
    submittedDate: '10/02/2024',
    approvedDate: '11/02/2024',
    progressPercent: 45
  },
  {
    id: 5,
    version: 'v1',
    status: 'Superseded',
    description: 'Task creation and initial setup',
    submittedBy: 'System',
    reviewedBy: 'David Martinez',
    submittedDate: '05/02/2024',
    approvedDate: '05/02/2024',
    progressPercent: 0
  }
];

const MOCK_AUDIT_LOG: AuditLogItem[] = [
  {
    id: 1,
    actionTitle: 'Version Status Changed',
    actionType: 'VERSION_STATUS_CHANGE',
    module: 'Progress Tracking',
    taskId: 'TSK-000123',
    projectId: 'PRJ-00045',
    performedBy: 'David Martinez',
    timestamp: '25 Feb 2026 10:32 AM',
    expanded: false,
    versionStatusChangeData: {
      version: 'V3',
      oldStatus: 'In Review',
      newStatus: 'Approved',
      previousApprovedProgress: 38,
      submittedProgress: 65,
      approvedProgress: 65,
      comments: 'Abnormal progress reviewed and validated.'
    }
  },
  {
    id: 2,
    actionTitle: 'Version Created',
    actionType: 'VERSION_CREATE',
    module: 'Progress Tracking',
    taskId: 'TSK-000123',
    projectId: 'PRJ-00045',
    performedBy: 'John Smith',
    timestamp: '24 Feb 2026 02:15 PM',
    expanded: false,
    versionCreateData: {
      version: 'V3',
      basedOnVersion: 'V2',
      latestApprovedVersion: 'V1',
      initialProgress: 65
    }
  },
  {
    id: 3,
    actionTitle: 'Task Status Changed',
    actionType: 'TASK_STATUS_CHANGE',
    module: 'Task Management',
    taskId: 'TSK-000123',
    projectId: 'PRJ-00045',
    performedBy: 'Sarah Chen',
    timestamp: '20 Feb 2026 09:10 AM',
    expanded: false,
    taskStatusChangeData: {
      oldStatus: 'Not Started',
      newStatus: 'In Progress'
    }
  },
  {
    id: 4,
    actionTitle: 'Task Updated',
    actionType: 'TASK_UPDATE',
    module: 'Task Management',
    taskId: 'TSK-000123',
    projectId: 'PRJ-00045',
    performedBy: 'John Smith',
    timestamp: '18 Feb 2026 11:45 AM',
    expanded: false,
    taskUpdateData: {
      changes: [
        { field: 'Task Name', oldValue: 'Whitewall Room 1', newValue: 'Whitewall Room 2' },
        { field: 'Estimated End Date', oldValue: '15 Mar 2026', newValue: '22 Mar 2026' },
        { field: 'Sub-Contractor', oldValue: 'None', newValue: 'ClimateControl Corp' }
      ]
    }
  },
  {
    id: 5,
    actionTitle: 'Task Created',
    actionType: 'TASK_CREATE',
    module: 'Task Management',
    taskId: 'TSK-000123',
    projectId: 'PRJ-00045',
    performedBy: 'Sarah Chen',
    timestamp: '15 Feb 2026 08:00 AM',
    expanded: false,
    taskCreateData: {
      taskName: 'PCW Distribution – B1 – T1 – R1.1.1',
      activityName: 'Pipe Installation',
      status: 'Not Started',
      phase: 'Fit-Out',
      discipline: 'Architectural',
      tradePackage: 'TP-MEP-001',
      subcontractor: 'ABC Contractors',
      startDate: '15 Feb 2026',
      endDate: '15 Mar 2026'
    }
  }
];

const TaskDetails: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ViewType>('overview');

  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';

  // CLIENT VIEW MODE: Check if tabs should be hidden
  const isTabHidden = (tab: ViewType) => {
    if (tab === 'evidence') return hiddenPages.taskAttachments;
    if (tab === 'discussion') return hiddenPages.taskDiscussion;
    if (tab === 'versions') return hiddenPages.taskVersions;
    if (tab === 'audit') return hiddenPages.taskAuditLog;
    return false;
  };

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as ViewType;
    if (tabParam && ['overview', 'evidence', 'discussion', 'versions', 'audit'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [rocSteps, setRocSteps] = useState<ROCStep[]>(MOCK_ROC_STEPS);
  const [attachments, setAttachments] = useState<Attachment[]>(MOCK_ATTACHMENTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [expandedSidebarSections, setExpandedSidebarSections] = useState<Set<'context' | 'budget' | 'planning'>>(new Set([]));
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [showReplyBox, setShowReplyBox] = useState<{ [key: number]: boolean }>({});
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [selectedStepForAttachment, setSelectedStepForAttachment] = useState('');

  // Version History filter states
  const [versionSearch, setVersionSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [submittedBySearch, setSubmittedBySearch] = useState('');
  const [submittedDateSearch, setSubmittedDateSearch] = useState('');

  // Audit Log filter states
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOG);
  const [auditModuleFilter, setAuditModuleFilter] = useState('All Modules');
  const [auditActionTypeFilter, setAuditActionTypeFilter] = useState('All Actions');
  const [auditPerformedByFilter, setAuditPerformedByFilter] = useState('');
  const [auditRecordIdFilter, setAuditRecordIdFilter] = useState('');
  const [auditDateRangeFilter, setAuditDateRangeFilter] = useState({ start: '', end: '' });
  const [auditFiltersExpanded, setAuditFiltersExpanded] = useState(false);

  const toggleSidebarSection = (section: 'context' | 'budget' | 'planning') => {
    setExpandedSidebarSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getStatusIndicator = (status: string) => {
    const statusConfig = {
      'completed': { color: '#065F46', bg: '#D1FAE5', icon: CheckCircle2 },
      'in-progress': { color: '#92400E', bg: '#FEF3C7', icon: Clock },
      'behind': { color: '#F59E0B', bg: '#FEF3C7', icon: AlertTriangle },
      'not-started': { color: '#991B1B', bg: '#FEE2E2', icon: Minus }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['not-started'];
    const Icon = config.icon;
    return <Icon size={16} style={{ color: config.color }} />;
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        username: 'Current User',
        avatar: 'CU',
        role: 'Engineer',
        timestamp: new Date().toLocaleString('en-GB'),
        text: newComment,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    }
  };

  const handleAddReply = (commentId: number) => {
    const text = replyText[commentId];
    if (text?.trim()) {
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, {
              id: comment.replies.length + 1,
              username: 'Current User',
              avatar: 'CU',
              role: 'Engineer',
              timestamp: new Date().toLocaleString('en-GB'),
              text: text
            }]
          };
        }
        return comment;
      }));
      setReplyText({ ...replyText, [commentId]: '' });
      setShowReplyBox({ ...showReplyBox, [commentId]: false });
      toast.success('Reply added successfully');
    }
  };

  const handleDeleteAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    toast.success('Attachment deleted successfully');
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon size={16} />;
      case 'url': return <LinkIcon size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getVersionStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: { bg: string; color: string } } = {
      'Approved': { bg: '#D1FAE5', color: '#065F46' },
      'Submitted': { bg: '#DBEAFE', color: '#1E40AF' },
      'Superseded': { bg: '#F3F4F6', color: '#6B7280' },
      'Rejected': { bg: '#FEE2E2', color: '#991B1B' },
      'Draft Saved': { bg: '#FEF3C7', color: '#92400E' },
      'In Review': { bg: '#FEF3C7', color: '#92400E' }
    };
    const style = statusStyles[status] || statusStyles['Draft Saved'];
    return (
      <span style={{
        padding: '4px 10px',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {status}
      </span>
    );
  };

  const getAuditActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'TASK_CREATE': return <Plus size={18} style={{ color: '#10B981' }} />;
      case 'TASK_UPDATE': return <Edit size={18} style={{ color: '#3B82F6' }} />;
      case 'TASK_STATUS_CHANGE': return <Activity size={18} style={{ color: '#F59E0B' }} />;
      case 'VERSION_CREATE': return <GitBranch size={18} style={{ color: '#8B5CF6' }} />;
      case 'VERSION_STATUS_CHANGE': return <RefreshCw size={18} style={{ color: '#EC4899' }} />;
      default: return <FileCheck size={18} style={{ color: '#6B7280' }} />;
    }
  };

  const toggleAuditLog = (logId: number) => {
    setAuditLogs(prev => prev.map(log =>
      log.id === logId ? { ...log, expanded: !log.expanded } : log
    ));
  };

  const resetAuditFilters = () => {
    setAuditModuleFilter('All Modules');
    setAuditActionTypeFilter('All Actions');
    setAuditPerformedByFilter('');
    setAuditRecordIdFilter('');
    setAuditDateRangeFilter({ start: '', end: '' });
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditModuleFilter !== 'All Modules' && log.module !== auditModuleFilter) return false;
    if (auditActionTypeFilter !== 'All Actions' && log.actionType !== auditActionTypeFilter) return false;
    if (auditPerformedByFilter && !log.performedBy.toLowerCase().includes(auditPerformedByFilter.toLowerCase())) return false;
    if (auditRecordIdFilter && !log.taskId.toLowerCase().includes(auditRecordIdFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      minHeight: '100vh'
    }}>
      {/* STICKY TASK HEADER */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 32px'
      }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '13px',
          color: '#6B7280',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${projectId}/tasks`)}>All Tasks</span>
          <span>›</span>
          <span style={{ color: '#111827', fontWeight: '500' }}>{MOCK_TASK_DATA.taskName}</span>
        </div>

        {/* Header Content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left: Task Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                {MOCK_TASK_DATA.taskName}
              </h1>
              <span style={{
                padding: '4px 12px',
                backgroundColor: '#DBEAFE',
                color: '#1E40AF',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {MOCK_TASK_DATA.status}
              </span>
              <span style={{
                padding: '6px 14px',
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                {MOCK_TASK_DATA.completionPercent}%
              </span>
            </div>

            {/* Metadata Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              color: '#6B7280'
            }}>
              <span><strong style={{ color: '#374151' }}>Scope:</strong> {MOCK_TASK_DATA.phase}</span>
              <span>|</span>
              <span><strong style={{ color: '#374151' }}>Discipline:</strong> {MOCK_TASK_DATA.discipline}</span>
              <span>|</span>
              <span><strong style={{ color: '#374151' }}>Trade Package:</strong> {MOCK_TASK_DATA.tradePackage}</span>
              <span>|</span>
              <span><strong style={{ color: '#374151' }}>Cost Code:</strong> {MOCK_TASK_DATA.costCode}</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => !isProjectReadOnly && navigate(`/app/projects/${projectId}/tasks/edit/${taskId}`)}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Edit Task disabled - Project is On Hold" : ""}
              style={{
                height: '38px',
                padding: '0 20px',
                border: '1px solid #D1D5DB',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: isProjectReadOnly ? '#D1D5DB' : '#374151',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isProjectReadOnly ? 0.5 : 1
              }}
            >
              <Edit size={16} />
              Edit Task
            </button>
            <button
              onClick={() => {
                if (!isProjectReadOnly) {
                  // Task ID 2 uses sub-steps version
                  const route = taskId === '2'
                    ? `/app/projects/${projectId}/tasks/${taskId}/update-progress-substeps?from=details`
                    : `/app/projects/${projectId}/tasks/${taskId}/update-progress?from=details`;
                  navigate(route);
                }
              }}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Update Progress disabled - Project is On Hold" : ""}
              style={{
                height: '38px',
                padding: '0 20px',
                border: 'none',
                backgroundColor: isProjectReadOnly ? '#D1D5DB' : '#FD4314',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isProjectReadOnly ? 0.5 : 1
              }}
            >
              Update Progress
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '16px',
          borderBottom: '2px solid #F3F4F6'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'evidence', label: 'Attachments' },
            { id: 'discussion', label: 'Discussion' },
            { id: 'versions', label: 'Versions' },
            // { id: 'audit', label: 'Audit Log' } // Hidden as per requirement
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ViewType)}
              style={{
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                color: activeTab === tab.id ? '#FD4314' : '#6B7280',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #FD4314' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT - OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 280px',
          gap: '16px',
          padding: '16px 24px',
          maxWidth: '1440px',
          margin: '0 auto',
          minHeight: '800px'
        }}>
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* TWO-COLUMN LAYOUT: PROGRESS OVERVIEW & CODING DIMENSIONS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: '12px'
            }}>
              {/* PROGRESS OVERVIEW */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '14px 16px'
              }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: '650',
                  color: '#111827',
                  margin: '0 0 12px 0'
                }}>
                  Progress Overview
                </h2>

                {/* Overall Progress Bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Overall Progress</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#FD4314' }}>{MOCK_TASK_DATA.completionPercent}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${MOCK_TASK_DATA.completionPercent}%`,
                      height: '100%',
                      backgroundColor: '#FD4314',
                      borderRadius: '6px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* KPIs - 3 Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px'
                }}>
                  {/* Cost Earned */}
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#FAFBFC',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '3px' }}>Cost Earned</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                      €{MOCK_TASK_DATA.earnedCost.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>
                      of €{MOCK_TASK_DATA.budgetedCost.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Installed */}
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#FAFBFC',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '3px' }}>Quantity Installed</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                      {MOCK_TASK_DATA.installedQuantity}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>
                      of {MOCK_TASK_DATA.totalQuantity}
                    </div>
                  </div>

                  {/* Hours Earned */}
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: '#FAFBFC',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '3px' }}>Hours Earned</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                      {MOCK_TASK_DATA.earnedHours}h
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>
                      of {MOCK_TASK_DATA.budgetedManHours}h
                    </div>
                  </div>
                </div>
              </div>

              {/* CODING DIMENSIONS */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '14px 16px'
              }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: '650',
                  color: '#111827',
                  margin: '0 0 12px 0'
                }}>
                  Coding Dimensions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#FAFBFC',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#6B7280' }}>Delivery Package</span>
                    <span style={{ color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.deliveryPackage}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#FAFBFC',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#6B7280' }}>Building</span>
                    <span style={{ color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.building}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#FAFBFC',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#6B7280' }}>Tranche</span>
                    <span style={{ color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.tranche}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#FAFBFC',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#6B7280' }}>SPA</span>
                    <span style={{ color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.spa}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#FAFBFC',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#6B7280' }}>Cost Type</span>
                    <span style={{ color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.costType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROC PROGRESS TIMELINE */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '14px 16px'
            }}>
              <h2 style={{
                fontSize: '15px',
                fontWeight: '650',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                ROC Progress Timeline
              </h2>

              {/* AG Grid Style Table */}
              <div style={{
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'auto',
                overflowX: 'auto'
              }}>
                <table className="ag-grid-table" style={{ width: '100%', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', minWidth: '40px', width: '40px' }}></th>
                      <th style={{ textAlign: 'center', width: '100px' }}>Step #</th>
                      <th style={{ textAlign: 'left', minWidth: '220px' }}>Steps</th>
                      <th style={{ textAlign: 'center', width: '110px' }}>Steps Weightage</th>
                      <th style={{ textAlign: 'center', width: '140px' }}>Measurement Type</th>
                      <th style={{ textAlign: 'center', width: '130px' }}>Total Quantity</th>
                      <th style={{ textAlign: 'center', width: '140px' }}>Installed Quantity</th>
                      <th style={{ textAlign: 'left', width: '200px' }}>% Work Complete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rocSteps.flatMap((step) => [
                      // Main Step Row
                      <tr key={step.id}>
                        <td style={{ textAlign: 'center', padding: '8px 4px' }}>
                          {step.hasSubSteps && (
                            <button
                              onClick={() => {
                                setRocSteps(rocSteps.map(s =>
                                  s.id === step.id ? { ...s, expanded: !s.expanded } : s
                                ));
                              }}
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
                              {step.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          )}
                        </td>
                        <td style={{ textAlign: 'center', color: '#272721', fontWeight: '600' }}>
                          {step.stepNumber}
                        </td>
                        <td style={{ textAlign: 'left' }}>
                          <span style={{ fontWeight: '500' }}>{step.stepName}</span>
                        </td>
                        <td style={{ textAlign: 'center', color: '#6B7280' }}>{step.stepWeightage}%</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: step.measurementType === 'Percentage' ? '#FEF3C7' : '#DBEAFE',
                            color: step.measurementType === 'Percentage' ? '#92400E' : '#1E40AF',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {step.measurementType}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'monospace' }}>
                          {step.totalQuantity !== null ? step.totalQuantity : '—'}
                        </td>
                        <td style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'monospace' }}>
                          {step.installedQuantity !== null ? step.installedQuantity : '—'}
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
                                width: `${step.percentComplete}%`,
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
                              {step.percentComplete}%
                            </span>
                          </div>
                        </td>
                      </tr>,
                      // Sub-Steps
                      ...(step.hasSubSteps && step.expanded && step.subSteps
                        ? step.subSteps.map((subStep) => (
                          <tr key={`${step.id}-${subStep.id}`} style={{ backgroundColor: '#F9FAFB' }}>
                            <td></td>
                            <td style={{ textAlign: 'center', color: '#6B7280', fontWeight: '500' }}>
                              {subStep.subStepNumber}
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              <span style={{ fontWeight: '500', color: '#272721' }}>{subStep.subStepName}</span>
                            </td>
                            <td style={{ textAlign: 'center', color: '#6B7280' }}>{subStep.weightage}%</td>
                            <td style={{ textAlign: 'center', color: '#9CA3AF' }}>—</td>
                            <td style={{ textAlign: 'center', color: '#9CA3AF' }}>
                              —
                            </td>
                            <td style={{ textAlign: 'center', color: '#9CA3AF' }}>
                              —
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
                                    width: `${subStep.percentComplete}%`,
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
                                  {subStep.percentComplete}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                        : []
                      )
                    ])}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - COLLAPSIBLE CONTEXT PANEL */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            position: 'sticky',
            top: '80px',
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}>

            {/* Task Context - Collapsible */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSidebarSection('context')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#F9FAFB',
                  borderBottom: expandedSidebarSections.has('context') ? '1px solid #E5E7EB' : 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Task Context</span>
                {expandedSidebarSections.has('context') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              {expandedSidebarSections.has('context') && (
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Reporter</div>
                      <div style={{ color: '#111827', fontWeight: '500', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.reporter}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Role</div>
                      <div style={{ color: '#111827', fontWeight: '500', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.role}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Sub-Contractor</div>
                      <div style={{ color: '#111827', fontWeight: '500', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.subContractor}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Budget & Cost - Collapsible */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSidebarSection('budget')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#F9FAFB',
                  borderBottom: expandedSidebarSections.has('budget') ? '1px solid #E5E7EB' : 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Budget & Cost</span>
                {expandedSidebarSections.has('budget') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              {expandedSidebarSections.has('budget') && (
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '11px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '10px' }}>Hours</div>
                      <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '10px' }}>Cost</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Row 1: Estimated Budget */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Estimated Budget</div>
                          <div style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.estimatedBudgetHours}h</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Estimated Budget</div>
                          <div style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>€{MOCK_TASK_DATA.estimatedBudgetCost.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* Row 2: Approved Changes */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Approved Hrs Changes</div>
                          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>{MOCK_TASK_DATA.approvedChanges}h</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Approved Value Changes</div>
                          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>€{MOCK_TASK_DATA.approvedChangesCost.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* Row 3: Current Budget */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Current Budget</div>
                          <div style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>{MOCK_TASK_DATA.currentBudgetHours}h</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Current Budget</div>
                          <div style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>€{MOCK_TASK_DATA.currentBudgetCost.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* Row 4: Earned */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Earned</div>
                          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>{MOCK_TASK_DATA.earnedHours}h</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Earned</div>
                          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>€{MOCK_TASK_DATA.earnedCost.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* Row 5: Remaining */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Remaining</div>
                          <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: '600' }}>{MOCK_TASK_DATA.remainingHours}h</div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginBottom: '2px' }}>Remaining</div>
                          <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: '600' }}>€{MOCK_TASK_DATA.remainingValue.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Planning vs Actual - Collapsible */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleSidebarSection('planning')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#F9FAFB',
                  borderBottom: expandedSidebarSections.has('planning') ? '1px solid #E5E7EB' : 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Planning vs Actual</span>
                {expandedSidebarSections.has('planning') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              {expandedSidebarSections.has('planning') && (
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Baseline Start</div>
                      <div style={{ color: '#111827', fontWeight: '500', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.baselineStart}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Baseline Finish</div>
                      <div style={{ color: '#111827', fontWeight: '500', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.baselineFinish}</div>
                    </div>
                    <div style={{ paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #F3F4F6' }}>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Actual Start</div>
                      <div style={{ color: '#111827', fontWeight: '600', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.actualStart}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Actual Finish</div>
                      <div style={{ color: '#111827', fontWeight: '600', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.actualFinish}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280', marginBottom: '3px', fontSize: '10px' }}>Quantity Installed</div>
                      <div style={{ color: '#10B981', fontWeight: '600', fontSize: '13px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{MOCK_TASK_DATA.quantityInstalled}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ATTACHMENTS TAB */}
      {activeTab === 'evidence' && (
        isTabHidden('evidence') ? (
          <DesignInProgress />
        ) : (
          <AttachmentsTabContent
            attachments={attachments}
            rocSteps={rocSteps}
            handleDeleteAttachment={handleDeleteAttachment}
            showAddAttachmentModal={showAddAttachmentModal}
            setShowAddAttachmentModal={setShowAddAttachmentModal}
            showAddLinkModal={showAddLinkModal}
            setShowAddLinkModal={setShowAddLinkModal}
            selectedStepForAttachment={selectedStepForAttachment}
            setSelectedStepForAttachment={setSelectedStepForAttachment}
            isProjectReadOnly={isProjectReadOnly}
            tradePackageCode="S19-A5000"
            rocId="ROC-002"
          />
        )
      )}

      {/* DISCUSSION TAB */}
      {activeTab === 'discussion' && (
        isTabHidden('discussion') ? (
          <DesignInProgress />
        ) : (
          <DiscussionTabContent isProjectReadOnly={isProjectReadOnly} />
        )
      )}

      {/* VERSIONS TAB */}
      {activeTab === 'versions' && (() => {
        // For read-only projects (On Hold), modify the latest version to be "Rejected"
        let versionHistory = [...MOCK_VERSION_HISTORY];
        if (isProjectReadOnly && versionHistory.length > 0) {
          // Clone the first version (latest) and mark it as rejected
          versionHistory[0] = {
            ...versionHistory[0],
            status: 'Rejected',
            reviewedBy: 'System',
            approvedDate: '—',
            rejectionNote: 'This version was auto-rejected by the system due to change in project status'
          };
        }

        // Apply filters
        const filteredVersions = versionHistory
          .filter(v => v.version.toLowerCase().includes(versionSearch.toLowerCase()))
          .filter(v => v.status.toLowerCase().includes(statusSearch.toLowerCase()))
          .filter(v => v.submittedBy.toLowerCase().includes(submittedBySearch.toLowerCase()))
          .filter(v => v.submittedDate.includes(submittedDateSearch));

        return (
          isTabHidden('versions') ? (
            <DesignInProgress />
          ) : (
            <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                Version History
              </h2>

              {/* AG Grid Style Table */}
              <div style={{
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'auto',
                overflowX: 'auto'
              }}>
                <table className="ag-grid-table" style={{ width: '100%', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: 'auto', whiteSpace: 'nowrap' }}>Version</th>
                      <th style={{ textAlign: 'left', width: 'auto', whiteSpace: 'nowrap' }}>Status</th>
                      <th style={{ textAlign: 'left', width: '50%' }}>Progress</th>
                      <th style={{ textAlign: 'left', width: 'auto', whiteSpace: 'nowrap' }}>Submitted By</th>
                      <th style={{ textAlign: 'left', width: 'auto', whiteSpace: 'nowrap' }}>Submitted Date</th>
                    </tr>
                  </thead>

                  {/* Filter Row */}
                  <tbody>
                    <tr style={{ backgroundColor: '#FAFBFC' }}>
                      <td style={{ height: '40px', padding: '6px 8px', width: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={versionSearch}
                            onChange={(e) => setVersionSearch(e.target.value)}
                            style={{
                              width: '60px',
                              height: '28px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '3px',
                              padding: '0 8px',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                        </div>
                      </td>
                      <td style={{ height: '40px', padding: '6px 8px', width: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={statusSearch}
                            onChange={(e) => setStatusSearch(e.target.value)}
                            style={{
                              width: '80px',
                              height: '28px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '3px',
                              padding: '0 8px',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                        </div>
                      </td>
                      <td style={{ height: '40px', padding: '6px 8px' }}>
                        {/* No filter for Progress column */}
                      </td>
                      <td style={{ height: '40px', padding: '6px 8px', width: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={submittedBySearch}
                            onChange={(e) => setSubmittedBySearch(e.target.value)}
                            style={{
                              width: '100px',
                              height: '28px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '3px',
                              padding: '0 8px',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                        </div>
                      </td>
                      <td style={{ height: '40px', padding: '6px 8px', width: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={submittedDateSearch}
                            onChange={(e) => setSubmittedDateSearch(e.target.value)}
                            style={{
                              width: '100px',
                              height: '28px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '3px',
                              padding: '0 8px',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                        </div>
                      </td>
                    </tr>

                    {/* Data Rows */}
                    {filteredVersions.map((version) => (
                      <tr
                        key={version.id}
                        onClick={() => navigate(`/app/projects/${projectId}/tasks/${taskId}/versions/${version.id}`)}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                        }}
                      >
                        <td style={{ textAlign: 'left' }}>
                          <span style={{ fontWeight: '600' }}>{version.version}</span>
                        </td>
                        <td style={{ textAlign: 'left' }}>
                          {getVersionStatusBadge(version.status)}
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
                                width: `${version.progressPercent}%`,
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
                              {version.progressPercent}%
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'left', color: '#6B7280' }}>
                          {version.submittedBy}
                        </td>
                        <td style={{ textAlign: 'left', color: '#6B7280' }}>
                          {version.submittedDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        );
      })()}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        isTabHidden('audit') ? (
          <DesignInProgress />
        ) : (
          <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Filter Panel - Collapsible */}
            <div style={{ position: 'relative', marginBottom: '24px', minHeight: auditFiltersExpanded ? 'auto' : '0' }}>
              {/* Collapsed State - Icon Button on Right */}
              {!auditFiltersExpanded && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button
                    onClick={() => setAuditFiltersExpanded(true)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 150ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#D1D5DB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                    title="Show Filters"
                  >
                    <Filter size={18} color="#6B7280" />
                  </button>
                </div>
              )}

              {/* Expanded State - Full Filter Panel */}
              {auditFiltersExpanded && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '20px',
                  transition: 'all 300ms ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#272721', letterSpacing: '0.5px' }}>
                      FILTER LOGS
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={resetAuditFilters}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RotateCcw size={14} />
                        Reset All Filters
                      </button>
                      <button
                        onClick={() => setAuditFiltersExpanded(false)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#6B7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Collapse filters"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {/* Module Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        Module Name
                      </label>
                      <StandardDropdown
                        options={[
                          { value: 'All Modules', label: 'All Modules' },
                          { value: 'Task Management', label: 'Task Management' },
                          { value: 'Progress Tracking', label: 'Progress Tracking' }
                        ]}
                        value={auditModuleFilter}
                        onChange={(value) => setAuditModuleFilter(value as string)}
                        placeholder="Select module"
                        mode="single"
                        style={{ width: '100%' }}
                      />
                    </div>

                    {/* Action Type */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        Action Type
                      </label>
                      <StandardDropdown
                        options={[
                          { value: 'All Actions', label: 'All Actions' },
                          { value: 'TASK_CREATE', label: 'TASK_CREATE' },
                          { value: 'TASK_UPDATE', label: 'TASK_UPDATE' },
                          { value: 'TASK_STATUS_CHANGE', label: 'TASK_STATUS_CHANGE' },
                          { value: 'VERSION_CREATE', label: 'VERSION_CREATE' },
                          { value: 'VERSION_STATUS_CHANGE', label: 'VERSION_STATUS_CHANGE' }
                        ]}
                        value={auditActionTypeFilter}
                        onChange={(value) => setAuditActionTypeFilter(value as string)}
                        placeholder="Select action type"
                        mode="single"
                        style={{ width: '100%' }}
                      />
                    </div>

                    {/* Performed By */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        Performed By
                      </label>
                      <input
                        type="text"
                        placeholder="Search user..."
                        value={auditPerformedByFilter}
                        onChange={(e) => setAuditPerformedByFilter(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                      />
                    </div>

                    {/* Record ID */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        Record ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Task ID..."
                        value={auditRecordIdFilter}
                        onChange={(e) => setAuditRecordIdFilter(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                      />
                    </div>

                    {/* Date Range - Start */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={auditDateRangeFilter.start}
                        onChange={(e) => setAuditDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                      />
                    </div>

                    {/* Date Range - End */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '6px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={auditDateRangeFilter.end}
                        onChange={(e) => setAuditDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Timeline Section */}
            {filteredAuditLogs.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <AlertCircle size={48} style={{ color: '#9CA3AF', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500' }}>
                  No audit logs found for the selected filters.
                </p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Vertical Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: '19px',
                  top: '40px',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#E5E7EB'
                }} />

                {/* Log Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {filteredAuditLogs.map((log) => (
                    <div key={log.id} style={{ position: 'relative', paddingLeft: '56px' }}>
                      {/* Timeline Icon */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '8px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1
                      }}>
                        {getAuditActionIcon(log.actionType)}
                      </div>

                      {/* Log Card */}
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {/* Header Row */}
                        <div
                          onClick={() => toggleAuditLog(log.id)}
                          style={{
                            padding: '16px 20px',
                            cursor: 'pointer',
                            backgroundColor: log.expanded ? '#F9FAFB' : '#FFFFFF',
                            borderBottom: log.expanded ? '1px solid #E5E7EB' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                              {log.actionTitle} – {log.module}
                            </h4>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info('Raw log data would be displayed here');
                              }}
                              style={{
                                fontSize: '12px',
                                color: '#6B7280',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              View Detail
                            </button>
                            {log.expanded ? <ChevronDown size={20} color="#6B7280" /> : <ChevronRight size={20} color="#6B7280" />}
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div style={{
                          padding: '12px 20px',
                          backgroundColor: '#F9FAFB',
                          borderBottom: log.expanded ? '1px solid #E5E7EB' : 'none',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '16px',
                          fontSize: '12px'
                        }}>
                          <div>
                            <span style={{ color: '#6B7280' }}>Action Type: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.actionType}</span>
                          </div>
                          <div>
                            <span style={{ color: '#6B7280' }}>Module: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.module}</span>
                          </div>
                          <div>
                            <span style={{ color: '#6B7280' }}>Task ID: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.taskId}</span>
                          </div>
                          <div>
                            <span style={{ color: '#6B7280' }}>Project ID: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.projectId}</span>
                          </div>
                          <div>
                            <span style={{ color: '#6B7280' }}>Performed By: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.performedBy}</span>
                          </div>
                          <div>
                            <span style={{ color: '#6B7280' }}>Date / Time: </span>
                            <span style={{ color: '#111827', fontWeight: '600' }}>{log.timestamp}</span>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {log.expanded && (
                          <div style={{ padding: '20px' }}>
                            {/* TASK_CREATE Content */}
                            {log.actionType === 'TASK_CREATE' && log.taskCreateData && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                  Initial Values
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                                  <div><span style={{ color: '#6B7280' }}>Task Name:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.taskName}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Activity Name:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.activityName}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Status:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.status}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Scope:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.phase}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Discipline:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.discipline}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Trade Package:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.tradePackage}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Subcontractor:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.subcontractor}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Start Date:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.startDate}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>End Date:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.taskCreateData.endDate}</span></div>
                                </div>
                              </div>
                            )}

                            {/* TASK_UPDATE Content */}
                            {log.actionType === 'TASK_UPDATE' && log.taskUpdateData && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                  Field Changes
                                </h5>
                                <div style={{
                                  border: '1px solid #E5E7EB',
                                  borderRadius: '6px',
                                  overflow: 'hidden'
                                }}>
                                  <table style={{ width: '100%', fontSize: '13px' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#F9FAFB' }}>
                                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '600', color: '#374151' }}>Field</th>
                                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '600', color: '#374151' }}>Old Value</th>
                                        <th style={{ textAlign: 'center', padding: '10px 12px', width: '40px' }}></th>
                                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '600', color: '#374151' }}>New Value</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {log.taskUpdateData.changes.map((change, idx) => (
                                        <tr key={idx} style={{ borderTop: '1px solid #E5E7EB' }}>
                                          <td style={{ padding: '10px 12px', color: '#111827', fontWeight: '500' }}>{change.field}</td>
                                          <td style={{ padding: '10px 12px', color: '#6B7280' }}>{change.oldValue}</td>
                                          <td style={{ padding: '10px 12px', textAlign: 'center' }}><ArrowRight size={16} color="#9CA3AF" /></td>
                                          <td style={{ padding: '10px 12px', color: '#111827', fontWeight: '500' }}>{change.newValue}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* TASK_STATUS_CHANGE Content */}
                            {log.actionType === 'TASK_STATUS_CHANGE' && log.taskStatusChangeData && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                  Status Transition
                                </h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <span style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: '1px solid #D1D5DB'
                                  }}>
                                    {log.taskStatusChangeData.oldStatus}
                                  </span>
                                  <ArrowRight size={20} color="#6B7280" />
                                  <span style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#10B98126',
                                    color: '#10B981',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: '1px solid #10B98140'
                                  }}>
                                    {log.taskStatusChangeData.newStatus}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* VERSION_CREATE Content */}
                            {log.actionType === 'VERSION_CREATE' && log.versionCreateData && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                  Version Details
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                                  <div><span style={{ color: '#6B7280' }}>Version:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionCreateData.version}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Based On:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionCreateData.basedOnVersion}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Latest Approved:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionCreateData.latestApprovedVersion}</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Initial Progress:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionCreateData.initialProgress}%</span></div>
                                </div>
                              </div>
                            )}

                            {/* VERSION_STATUS_CHANGE Content */}
                            {log.actionType === 'VERSION_STATUS_CHANGE' && log.versionStatusChangeData && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                  Version Status Transition
                                </h5>
                                <div style={{ marginBottom: '20px' }}>
                                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                                    Version {log.versionStatusChangeData.version}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{
                                      padding: '6px 14px',
                                      backgroundColor: '#F3F4F6',
                                      color: '#374151',
                                      borderRadius: '16px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      border: '1px solid #D1D5DB'
                                    }}>
                                      {log.versionStatusChangeData.oldStatus}
                                    </span>
                                    <ArrowRight size={18} color="#6B7280" />
                                    <span style={{
                                      padding: '6px 14px',
                                      backgroundColor: '#10B98120',
                                      color: '#10B981',
                                      borderRadius: '16px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      border: '1px solid #10B98140'
                                    }}>
                                      {log.versionStatusChangeData.newStatus}
                                    </span>
                                  </div>
                                </div>

                                <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                  Progress Details
                                </h6>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px', marginBottom: '20px' }}>
                                  <div><span style={{ color: '#6B7280' }}>Previous Approved:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionStatusChangeData.previousApprovedProgress}%</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Submitted:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionStatusChangeData.submittedProgress}%</span></div>
                                  <div><span style={{ color: '#6B7280' }}>Approved:</span> <span style={{ color: '#111827', fontWeight: '500' }}>{log.versionStatusChangeData.approvedProgress}%</span></div>
                                </div>

                                {log.versionStatusChangeData.comments && (
                                  <div>
                                    <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                      Comments / Reason
                                    </h6>
                                    <div style={{
                                      padding: '12px',
                                      backgroundColor: '#F9FAFB',
                                      borderRadius: '6px',
                                      border: '1px solid #E5E7EB',
                                      fontSize: '13px',
                                      color: '#374151',
                                      fontStyle: 'italic'
                                    }}>
                                      {log.versionStatusChangeData.comments}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default TaskDetails;
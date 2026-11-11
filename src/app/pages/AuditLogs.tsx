import React, { useState } from 'react';
import { FileSpreadsheet, X, ChevronDown, ChevronUp, Filter, RotateCcw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';
import ExportConfirmationModal from '../components/ExportConfirmationModal';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  module: string;
  entityType: string;
  recordId: string;
  action: string;
  user: string;
  summary: string;
  projectId?: string;
  taskId?: string;
}

type SortField = 'timestamp' | 'module' | 'entityType' | 'recordId' | 'action' | 'user';
type SortDirection = 'asc' | 'desc' | null;

export default function AuditLogs() {
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-09');
  const [selectedModule, setSelectedModule] = useState('');
  const [masterType, setMasterType] = useState('');
  const [actionType, setActionType] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Column search states
  const [timestampSearch, setTimestampSearch] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  const [entityTypeSearch, setEntityTypeSearch] = useState('');
  const [recordIdSearch, setRecordIdSearch] = useState('');
  const [actionSearch, setActionSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [summarySearch, setSummarySearch] = useState('');

  // Sort states
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Comprehensive Mock Data covering all filter combinations
  const allMockAuditLogs: AuditLogEntry[] = [
    // Global Masters - Discipline
    {
      id: '1',
      timestamp: '09 Mar 2026 14:32',
      module: 'Global Masters',
      entityType: 'Discipline',
      recordId: 'DSC-00123',
      action: 'CREATE',
      user: 'John Smith',
      summary: 'Record Created – Discipline'
    },
    {
      id: '2',
      timestamp: '09 Mar 2026 13:15',
      module: 'Global Masters',
      entityType: 'Discipline',
      recordId: 'DSC-00124',
      action: 'UPDATE',
      user: 'Sarah Johnson',
      summary: 'Discipline Details Updated'
    },
    {
      id: '3',
      timestamp: '08 Mar 2026 16:45',
      module: 'Global Masters',
      entityType: 'Discipline',
      recordId: 'DSC-00125',
      action: 'STATUS_CHANGE',
      user: 'Michael Chen',
      summary: 'Discipline Status Changed to Inactive'
    },
    // Global Masters - ROC
    {
      id: '4',
      timestamp: '08 Mar 2026 15:10',
      module: 'Global Masters',
      entityType: 'ROC',
      recordId: 'ROC-789',
      action: 'CREATE',
      user: 'Emma Wilson',
      summary: 'ROC Record Created'
    },
    {
      id: '5',
      timestamp: '08 Mar 2026 14:30',
      module: 'Global Masters',
      entityType: 'ROC',
      recordId: 'ROC-790',
      action: 'UPDATE',
      user: 'John Smith',
      summary: 'ROC Record Updated'
    },
    {
      id: '6',
      timestamp: '07 Mar 2026 11:20',
      module: 'Global Masters',
      entityType: 'ROC',
      recordId: 'ROC-791',
      action: 'IMPORT',
      user: 'Sarah Johnson',
      summary: 'Bulk Import – 25 ROC records'
    },
    // Global Masters - Trade Package
    {
      id: '7',
      timestamp: '08 Mar 2026 12:05',
      module: 'Global Masters',
      entityType: 'TP',
      recordId: 'TP-MEP-001',
      action: 'CREATE',
      user: 'Michael Chen',
      summary: 'Trade Package Created'
    },
    {
      id: '8',
      timestamp: '07 Mar 2026 16:15',
      module: 'Global Masters',
      entityType: 'TP',
      recordId: 'TP-MEP-002',
      action: 'STATUS_CHANGE',
      user: 'Emma Wilson',
      summary: 'Status Changed to Active'
    },
    // Global Masters - Currency
    {
      id: '9',
      timestamp: '07 Mar 2026 10:30',
      module: 'Global Masters',
      entityType: 'Currency',
      recordId: 'CUR-USD',
      action: 'CREATE',
      user: 'John Smith',
      summary: 'Currency Record Created'
    },
    {
      id: '10',
      timestamp: '06 Mar 2026 14:20',
      module: 'Global Masters',
      entityType: 'Currency',
      recordId: 'CUR-EUR',
      action: 'IMPORT',
      user: 'Sarah Johnson',
      summary: 'Bulk Import – 15 Currency records'
    },
    // Global Masters - Location
    {
      id: '11',
      timestamp: '06 Mar 2026 11:45',
      module: 'Global Masters',
      entityType: 'Location',
      recordId: 'LOC-001',
      action: 'CREATE',
      user: 'Michael Chen',
      summary: 'Location Created'
    },
    {
      id: '12',
      timestamp: '05 Mar 2026 15:30',
      module: 'Global Masters',
      entityType: 'Location',
      recordId: 'LOC-002',
      action: 'UPDATE',
      user: 'Emma Wilson',
      summary: 'Location Details Updated'
    },
    // Global Masters - UOM
    {
      id: '13',
      timestamp: '05 Mar 2026 13:20',
      module: 'Global Masters',
      entityType: 'UOM',
      recordId: 'UOM-KG',
      action: 'CREATE',
      user: 'John Smith',
      summary: 'UOM Created'
    },
    {
      id: '14',
      timestamp: '04 Mar 2026 16:10',
      module: 'Global Masters',
      entityType: 'UOM',
      recordId: 'UOM-LITER',
      action: 'EXPORT',
      user: 'Sarah Johnson',
      summary: 'UOM Data Exported'
    },
    // Global Masters - Client
    {
      id: '15',
      timestamp: '04 Mar 2026 14:50',
      module: 'Global Masters',
      entityType: 'Client',
      recordId: 'CLI-001',
      action: 'CREATE',
      user: 'Michael Chen',
      summary: 'Client Record Created'
    },
    {
      id: '16',
      timestamp: '03 Mar 2026 12:30',
      module: 'Global Masters',
      entityType: 'Client',
      recordId: 'CLI-002',
      action: 'TEMPLATE_DOWNLOAD',
      user: 'Emma Wilson',
      summary: 'Client Import Template Downloaded'
    },
    // Project Management
    {
      id: '17',
      timestamp: '09 Mar 2026 11:48',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-001',
      action: 'PROJECT_CREATE',
      user: 'John Smith',
      summary: 'Project Created',
      projectId: 'prj1'
    },
    {
      id: '18',
      timestamp: '08 Mar 2026 10:20',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-001',
      action: 'PROJECT_UPDATE',
      user: 'Sarah Johnson',
      summary: 'Project Details Updated',
      projectId: 'prj1'
    },
    {
      id: '19',
      timestamp: '07 Mar 2026 14:15',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-001',
      action: 'PROJECT_STATUS_CHANGE',
      user: 'Michael Chen',
      summary: 'Project Status Changed to Active',
      projectId: 'prj1'
    },
    {
      id: '20',
      timestamp: '06 Mar 2026 16:30',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-001',
      action: 'ASSIGN_USER_TO_PROJECT',
      user: 'Emma Wilson',
      summary: 'User Assigned to Project',
      projectId: 'prj1'
    },
    {
      id: '21',
      timestamp: '06 Mar 2026 14:55',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-002',
      action: 'PROJECT_CREATE',
      user: 'John Smith',
      summary: 'Project Created',
      projectId: 'prj2'
    },
    {
      id: '22',
      timestamp: '05 Mar 2026 11:10',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-002',
      action: 'ASSIGN_USER_TO_PROJECT',
      user: 'Sarah Johnson',
      summary: 'User Assigned to Project',
      projectId: 'prj2'
    },
    {
      id: '23',
      timestamp: '04 Mar 2026 15:40',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-003',
      action: 'PROJECT_CREATE',
      user: 'Michael Chen',
      summary: 'Project Created',
      projectId: 'prj3'
    },
    {
      id: '24',
      timestamp: '03 Mar 2026 13:25',
      module: 'Project Management',
      entityType: 'Project',
      recordId: 'PRJ-2024-003',
      action: 'UNASSIGN_USER_FROM_PROJECT',
      user: 'Emma Wilson',
      summary: 'User Unassigned from Project',
      projectId: 'prj3'
    },
    // Task Management
    {
      id: '25',
      timestamp: '09 Mar 2026 10:15',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-1',
      action: 'TASK_CREATE',
      user: 'John Smith',
      summary: 'Task Created',
      projectId: 'prj1',
      taskId: 'task1'
    },
    {
      id: '26',
      timestamp: '08 Mar 2026 14:30',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-1',
      action: 'TASK_UPDATE',
      user: 'Sarah Johnson',
      summary: 'Task Details Updated',
      projectId: 'prj1',
      taskId: 'task1'
    },
    {
      id: '27',
      timestamp: '07 Mar 2026 16:45',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-1',
      action: 'TASK_STATUS_CHANGE',
      user: 'Michael Chen',
      summary: 'Task Status Changed to Complete',
      projectId: 'prj1',
      taskId: 'task1'
    },
    {
      id: '28',
      timestamp: '06 Mar 2026 12:20',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-1',
      action: 'VERSION_CREATE',
      user: 'Emma Wilson',
      summary: 'New Version Created',
      projectId: 'prj1',
      taskId: 'task1'
    },
    {
      id: '29',
      timestamp: '05 Mar 2026 10:50',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-2',
      action: 'TASK_CREATE',
      user: 'John Smith',
      summary: 'Task Created',
      projectId: 'prj1',
      taskId: 'task2'
    },
    {
      id: '30',
      timestamp: '04 Mar 2026 14:15',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-2',
      action: 'VERSION_STATUS_CHANGE',
      user: 'Sarah Johnson',
      summary: 'Version Status Changed',
      projectId: 'prj1',
      taskId: 'task2'
    },
    {
      id: '31',
      timestamp: '03 Mar 2026 11:30',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-3',
      action: 'TASK_CREATE',
      user: 'Michael Chen',
      summary: 'Task Created',
      projectId: 'prj2',
      taskId: 'task3'
    },
    {
      id: '32',
      timestamp: '02 Mar 2026 15:20',
      module: 'Task Management',
      entityType: 'Task',
      recordId: 'TASK-1733-3',
      action: 'TASK_UPDATE',
      user: 'Emma Wilson',
      summary: 'Task Details Updated',
      projectId: 'prj2',
      taskId: 'task3'
    },
    // User Management
    {
      id: '33',
      timestamp: '08 Mar 2026 16:22',
      module: 'User Management',
      entityType: 'User',
      recordId: 'USR-456',
      action: 'USER_CREATE',
      user: 'Admin User',
      summary: 'New User Created'
    },
    {
      id: '34',
      timestamp: '07 Mar 2026 13:40',
      module: 'User Management',
      entityType: 'User',
      recordId: 'USR-457',
      action: 'USER_UPDATE',
      user: 'Admin User',
      summary: 'User Profile Updated'
    },
    {
      id: '35',
      timestamp: '06 Mar 2026 10:15',
      module: 'User Management',
      entityType: 'User',
      recordId: 'USR-458',
      action: 'USER_STATUS_CHANGE',
      user: 'Admin User',
      summary: 'User Status Changed to Active'
    },
    {
      id: '36',
      timestamp: '05 Mar 2026 14:50',
      module: 'User Management',
      entityType: 'User',
      recordId: 'USR-459',
      action: 'PROJECT_ASSIGNMENT',
      user: 'Admin User',
      summary: 'User Assigned to Project'
    },
    {
      id: '37',
      timestamp: '04 Mar 2026 11:35',
      module: 'User Management',
      entityType: 'User',
      recordId: 'USR-460',
      action: 'PROJECT_UNASSIGNMENT',
      user: 'Admin User',
      summary: 'User Unassigned from Project'
    },
    // System Actions
    {
      id: '38',
      timestamp: '07 Mar 2026 09:20',
      module: 'System Actions',
      entityType: 'System',
      recordId: 'SYS-IMPORT-001',
      action: 'IMPORT',
      user: 'System',
      summary: 'Bulk Data Import Completed'
    },
    {
      id: '39',
      timestamp: '06 Mar 2026 15:45',
      module: 'System Actions',
      entityType: 'System',
      recordId: 'SYS-EXPORT-001',
      action: 'EXPORT',
      user: 'System',
      summary: 'Data Export Completed'
    },
    {
      id: '40',
      timestamp: '05 Mar 2026 12:10',
      module: 'System Actions',
      entityType: 'System',
      recordId: 'SYS-TEMPLATE-001',
      action: 'TEMPLATE_DOWNLOAD',
      user: 'System',
      summary: 'Import Template Downloaded'
    }
  ];

  const moduleOptions = [
    { value: 'global_masters', label: 'Global Masters' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'task_management', label: 'Task Management' },
    { value: 'user_management', label: 'User Management' }
  ];

  const masterTypeOptions = [
    { value: 'discipline', label: 'Discipline' },
    { value: 'roc', label: 'ROC' },
    { value: 'tp', label: 'TP' },
    { value: 'currency', label: 'Currency' },
    { value: 'location', label: 'Location' },
    { value: 'uom', label: 'UOM' },
    { value: 'client', label: 'Client' }
  ];

  const globalMastersActionTypes = [
    { value: 'CREATE', label: 'CREATE' },
    { value: 'UPDATE', label: 'UPDATE' },
    { value: 'STATUS_CHANGE', label: 'STATUS_CHANGE' },
    { value: 'IMPORT', label: 'IMPORT' },
    { value: 'EXPORT', label: 'EXPORT' },
    { value: 'TEMPLATE_DOWNLOAD', label: 'TEMPLATE_DOWNLOAD' }
  ];

  const projectManagementActionTypes = [
    { value: 'PROJECT_CREATE', label: 'PROJECT_CREATE' },
    { value: 'PROJECT_UPDATE', label: 'PROJECT_UPDATE' },
    { value: 'PROJECT_STATUS_CHANGE', label: 'PROJECT_STATUS_CHANGE' },
    { value: 'ASSIGN_USER_TO_PROJECT', label: 'ASSIGN_USER_TO_PROJECT' },
    { value: 'UNASSIGN_USER_FROM_PROJECT', label: 'UNASSIGN_USER_FROM_PROJECT' }
  ];

  const taskManagementActionTypes = [
    { value: 'TASK_CREATE', label: 'TASK_CREATE' },
    { value: 'TASK_UPDATE', label: 'TASK_UPDATE' },
    { value: 'TASK_STATUS_CHANGE', label: 'TASK_STATUS_CHANGE' },
    { value: 'VERSION_CREATE', label: 'VERSION_CREATE' },
    { value: 'VERSION_STATUS_CHANGE', label: 'VERSION_STATUS_CHANGE' }
  ];

  const userManagementActionTypes = [
    { value: 'USER_CREATE', label: 'USER_CREATE' },
    { value: 'USER_UPDATE', label: 'USER_UPDATE' },
    { value: 'USER_STATUS_CHANGE', label: 'USER_STATUS_CHANGE' },
    { value: 'PROJECT_ASSIGNMENT', label: 'PROJECT_ASSIGNMENT' },
    { value: 'PROJECT_UNASSIGNMENT', label: 'PROJECT_UNASSIGNMENT' }
  ];

  const systemActionTypes = [
    { value: 'IMPORT', label: 'IMPORT' },
    { value: 'EXPORT', label: 'EXPORT' },
    { value: 'TEMPLATE_DOWNLOAD', label: 'TEMPLATE_DOWNLOAD' }
  ];

  const projectOptions = [
    { value: 'prj1', label: 'PRJ-2024-001 - Alpha Construction' },
    { value: 'prj2', label: 'PRJ-2024-002 - Beta Renovation' },
    { value: 'prj3', label: 'PRJ-2024-003 - Gamma Infrastructure' }
  ];

  const taskOptions = [
    { value: 'task1', label: 'TASK-1733-1 - PCW Distribution' },
    { value: 'task2', label: 'TASK-1733-2 - HVAC Installation' },
    { value: 'task3', label: 'TASK-1733-3 - Electrical Conduit' }
  ];

  const userOptions = [
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Chen', label: 'Michael Chen' },
    { value: 'Emma Wilson', label: 'Emma Wilson' },
    { value: 'Admin User', label: 'Admin User' },
    { value: 'System', label: 'System' }
  ];

  // Filter logic
  const filteredLogs = allMockAuditLogs.filter(log => {
    // Module filter
    if (selectedModule) {
      const moduleMap: { [key: string]: string } = {
        'global_masters': 'Global Masters',
        'project_management': 'Project Management',
        'task_management': 'Task Management',
        'user_management': 'User Management',
        'system_actions': 'System Actions'
      };
      if (log.module !== moduleMap[selectedModule]) return false;
    }

    // Master Type filter (for Global Masters)
    if (selectedModule === 'global_masters' && masterType) {
      const masterTypeMap: { [key: string]: string } = {
        'discipline': 'Discipline',
        'roc': 'ROC',
        'tp': 'TP',
        'currency': 'Currency',
        'location': 'Location',
        'uom': 'UOM',
        'client': 'Client'
      };
      if (log.entityType !== masterTypeMap[masterType]) return false;
    }

    // Action Type filter
    if (actionType && log.action !== actionType) return false;

    // Project filter
    if (selectedProject && log.projectId !== selectedProject) return false;

    // Task filter
    if (selectedTask && log.taskId !== selectedTask) return false;

    // User filter (from table controls)
    if (selectedUser && log.user !== selectedUser) return false;

    // Column search filters
    if (timestampSearch && !log.timestamp.toLowerCase().includes(timestampSearch.toLowerCase())) return false;
    if (moduleSearch && !log.module.toLowerCase().includes(moduleSearch.toLowerCase())) return false;
    if (entityTypeSearch && !log.entityType.toLowerCase().includes(entityTypeSearch.toLowerCase())) return false;
    if (recordIdSearch && !log.recordId.toLowerCase().includes(recordIdSearch.toLowerCase())) return false;
    if (actionSearch && !log.action.toLowerCase().includes(actionSearch.toLowerCase())) return false;
    if (userSearch && !log.user.toLowerCase().includes(userSearch.toLowerCase())) return false;
    if (summarySearch && !log.summary.toLowerCase().includes(summarySearch.toLowerCase())) return false;

    return true;
  });

  // Sort logic
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ color: '#9CA3AF' }} />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp size={14} style={{ color: '#272721' }} />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown size={14} style={{ color: '#272721' }} />;
    }
    return <ArrowUpDown size={14} style={{ color: '#9CA3AF' }} />;
  };

  const handleGenerate = () => {
    toast.success(`Generated ${sortedLogs.length} audit log entries`);
  };

  const handleResetFilters = () => {
    setStartDate('2026-03-01');
    setEndDate('2026-03-09');
    setSelectedModule('');
    setMasterType('');
    setActionType('');
    setSelectedProject('');
    setSelectedTask('');
    setSelectedUser('');
    setTimestampSearch('');
    setModuleSearch('');
    setEntityTypeSearch('');
    setRecordIdSearch('');
    setActionSearch('');
    setUserSearch('');
    setSummarySearch('');
    toast.info('Filters reset');
  };

  const handleDownloadExcel = () => {
    toast.success('Excel file downloaded');
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetailDrawer(true);
  };

  const getActionTypeOptions = () => {
    switch (selectedModule) {
      case 'global_masters':
        return globalMastersActionTypes;
      case 'project_management':
        return projectManagementActionTypes;
      case 'task_management':
        return taskManagementActionTypes;
      case 'user_management':
        return userManagementActionTypes;
      default:
        return [];
    }
  };

  const gridTemplateColumns = '160px 140px 130px 120px 110px 130px 1fr';

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 4px 0'
          }}>
            Audit Logs
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Generate and download activity history across system modules
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowExportModal(true)}
            title="Export to Excel"
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
            <FileSpreadsheet size={16} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '24px',
        backgroundColor: '#FFFFFF'
      }}>
        {/* Collapsible Header */}
        <div
          onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: isFilterCollapsed ? '0' : '20px'
          }}
        >
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#272721',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={16} style={{ color: '#6B7280' }} />
            Filter Audit Logs
          </h3>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            transition: 'background-color 150ms'
          }}>
            {isFilterCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
        </div>

        {/* Collapsible Content */}
        {!isFilterCollapsed && (
          <>
            {/* Row 1 - Basic Filters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Start Date <span style={{ color: '#FD4314' }}>*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  End Date <span style={{ color: '#FD4314' }}>*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Module <span style={{ color: '#FD4314' }}>*</span>
                </label>
                <StandardDropdown
                  value={selectedModule}
                  onChange={setSelectedModule}
                  options={moduleOptions}
                  placeholder="Select Module"
                />
              </div>
            </div>

            {/* Row 2 - Dynamic Filters Based on Module Selection */}
            {selectedModule && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: selectedModule === 'global_masters' || selectedModule === 'project_management' || selectedModule === 'task_management' || selectedModule === 'user_management' ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {/* Global Masters */}
                {selectedModule === 'global_masters' && (
                  <>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Master Type <span style={{ color: '#FD4314' }}>*</span>
                      </label>
                      <StandardDropdown
                        value={masterType}
                        onChange={setMasterType}
                        options={masterTypeOptions}
                        placeholder="Select Master Type"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Action Type
                      </label>
                      <StandardDropdown
                        value={actionType}
                        onChange={setActionType}
                        options={getActionTypeOptions()}
                        placeholder="Select Action Type"
                      />
                    </div>
                  </>
                )}

                {/* Project Management */}
                {selectedModule === 'project_management' && (
                  <>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Project
                      </label>
                      <StandardDropdown
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={projectOptions}
                        placeholder="Select Project"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Action Type
                      </label>
                      <StandardDropdown
                        value={actionType}
                        onChange={setActionType}
                        options={getActionTypeOptions()}
                        placeholder="Select Action Type"
                      />
                    </div>
                  </>
                )}

                {/* Task Management */}
                {selectedModule === 'task_management' && (
                  <>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Project
                      </label>
                      <StandardDropdown
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={projectOptions}
                        placeholder="Select Project"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Task
                      </label>
                      <StandardDropdown
                        value={selectedTask}
                        onChange={setSelectedTask}
                        options={taskOptions}
                        placeholder="Search Task"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Action Type
                      </label>
                      <StandardDropdown
                        value={actionType}
                        onChange={setActionType}
                        options={getActionTypeOptions()}
                        placeholder="Select Action Type"
                      />
                    </div>
                  </>
                )}

                {/* User Management */}
                {selectedModule === 'user_management' && (
                  <>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        User
                      </label>
                      <StandardDropdown
                        value={selectedUser}
                        onChange={setSelectedUser}
                        options={userOptions}
                        placeholder="Select User"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Action Type
                      </label>
                      <StandardDropdown
                        value={actionType}
                        onChange={setActionType}
                        options={getActionTypeOptions()}
                        placeholder="Select Action Type"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleResetFilters}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={handleGenerate}
                style={{
                  height: '40px',
                  padding: '0 32px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Generate Audit Logs
              </button>
            </div>
          </>
        )}
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        position: 'relative',
        overflowX: 'auto'
      }}>
        {/* Table Header with Sort */}
        <div style={{
          backgroundColor: '#E4EEF8',
          display: 'grid',
          gridTemplateColumns,
          borderBottom: '1px solid #C8D9EE',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div 
            onClick={() => handleSort('timestamp')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Timestamp</span>
            {getSortIcon('timestamp')}
          </div>

          <div 
            onClick={() => handleSort('module')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Module</span>
            {getSortIcon('module')}
          </div>

          <div 
            onClick={() => handleSort('entityType')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Entity Type</span>
            {getSortIcon('entityType')}
          </div>

          <div 
            onClick={() => handleSort('recordId')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Record ID</span>
            {getSortIcon('recordId')}
          </div>

          <div 
            onClick={() => handleSort('action')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>Action</span>
            {getSortIcon('action')}
          </div>

          <div 
            onClick={() => handleSort('user')}
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              cursor: 'pointer'
            }}
          >
            <span>User</span>
            {getSortIcon('user')}
          </div>

          <div 
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721'
            }}
          >
            <span>Summary</span>
          </div>
        </div>

        {/* Column Search Row with Filter Icons */}
        <div style={{
          backgroundColor: '#FAFBFC',
          display: 'grid',
          gridTemplateColumns,
          borderBottom: '1px solid #C8D9EE'
        }}>
          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={timestampSearch}
              onChange={(e) => setTimestampSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={entityTypeSearch}
              onChange={(e) => setEntityTypeSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={recordIdSearch}
              onChange={(e) => setRecordIdSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={actionSearch}
              onChange={(e) => setActionSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>

          <div style={{
            height: '40px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <input
              type="text"
              placeholder="Filter..."
              value={summarySearch}
              onChange={(e) => setSummarySearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                height: '28px',
                border: '1px solid #D1D5DB',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          </div>
        </div>

        {/* Table Rows */}
        {sortedLogs.map((log, index) => (
          <div
            key={log.id}
            style={{
              display: 'grid',
              gridTemplateColumns,
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
              borderBottom: '1px solid #E2E6ED',
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
            onClick={() => handleViewDetails(log)}
          >
              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {log.timestamp}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#272721',
                fontWeight: '500'
              }}>
                {log.module}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {log.entityType}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: 'monospace'
              }}>
                {log.recordId}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px'
              }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: log.action.includes('CREATE') ? '#DEF7EC' : 
                                 log.action.includes('UPDATE') ? '#E4EEFE' : 
                                 log.action.includes('STATUS') ? '#FEF3C7' : '#F3F4F6',
                  color: log.action.includes('CREATE') ? '#03543F' : 
                         log.action.includes('UPDATE') ? '#1E40AF' : 
                         log.action.includes('STATUS') ? '#92400E' : '#374151'
                }}>
                  {log.action}
                </span>
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#272721'
              }}>
                {log.user}
              </div>

              <div style={{
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {log.summary}
              </div>
            </div>
          ))}

        {/* Footer with Record Count */}
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
            Total Records: {sortedLogs.length}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button style={{
              padding: '4px 12px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Previous
            </button>
            <span>Page 1 of 1</span>
            <button style={{
              padding: '4px 12px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      {showDetailDrawer && selectedLog && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowDetailDrawer(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
          />

          {/* Drawer Panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '500px',
            backgroundColor: '#FFFFFF',
            boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Audit Log Details
              </h3>
              <button
                onClick={() => setShowDetailDrawer(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px'
            }}>
              {/* Basic Info */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Action Type
                  </label>
                  <div style={{
                    fontSize: '14px',
                    color: '#272721',
                    fontWeight: '500'
                  }}>
                    {selectedLog.action}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Module
                  </label>
                  <div style={{
                    fontSize: '14px',
                    color: '#272721'
                  }}>
                    {selectedLog.module}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Record ID
                  </label>
                  <div style={{
                    fontSize: '14px',
                    color: '#272721',
                    fontFamily: 'monospace'
                  }}>
                    {selectedLog.recordId}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Performed By
                  </label>
                  <div style={{
                    fontSize: '14px',
                    color: '#272721'
                  }}>
                    {selectedLog.user}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Date & Time
                  </label>
                  <div style={{
                    fontSize: '14px',
                    color: '#272721'
                  }}>
                    {selectedLog.timestamp}
                  </div>
                </div>
              </div>

              {/* Field Changes Table */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '12px'
                }}>
                  Field Changes
                </h4>
                <div style={{
                  border: '1px solid #E2E6ED',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{
                        backgroundColor: '#F9FAFB',
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }}>
                          Field Name
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }}>
                          Old Value
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }}>
                          New Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          Name
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#6B7280'
                        }}>
                          Old Value
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#10B981',
                          fontWeight: '500'
                        }}>
                          New Value
                        </td>
                      </tr>
                      <tr style={{
                        borderBottom: '1px solid #E2E6ED'
                      }}>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          Status
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#6B7280'
                        }}>
                          Inactive
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#10B981',
                          fontWeight: '500'
                        }}>
                          Active
                        </td>
                      </tr>
                      <tr>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          Description
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#6B7280'
                        }}>
                          Old description text
                        </td>
                        <td style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#10B981',
                          fontWeight: '500'
                        }}>
                          Updated description text
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleDownloadExcel}
      />
    </div>
  );
}
